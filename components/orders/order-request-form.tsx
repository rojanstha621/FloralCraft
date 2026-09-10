"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Flower2,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  RotateCcw,
  Send,
  ShieldCheck,
} from "lucide-react";
import { createOrderWhatsAppMessage, createWhatsAppUrl } from "@/lib/config/business";
import { createOrderTrackingPath } from "@/lib/orders/tracking-url";
import { formatCurrency } from "@/lib/utils";
import { useBusinessSettings } from "@/components/providers/business-provider";

type Option = {
  key: string;
  label: string;
  inputKind: string;
  required: boolean;
  choices: unknown;
  priceAdjustment: number;
};

type OrderProduct = {
  id: string;
  name: string;
  tagline: string | null;
  price: number;
  available: boolean;
  customizable: boolean;
  customizationSummary: string | null;
  preparationDays: number | null;
  category: string;
  productType: string;
  image: { url: string; alt: string } | null;
  customizationOptions: Option[];
};

type FieldErrors = Record<string, string>;
type Confirmation = {
  requestNumber: string;
  trackingPath: string | null;
  whatsappNotificationAccepted: boolean;
  productName: string;
  quantity: number;
  subtotal: number;
  deliveryArea: string;
  desiredDate: string;
  customization: string[];
  notes: string;
};

const inputClass =
  "order-field-control h-12 w-full border border-brand-brown/20 bg-white/70 px-4 text-base text-brand-brown outline-none transition placeholder:text-brand-brown-400/70 focus:border-brand-sage-700 focus:ring-2 focus:ring-brand-sage-700/15";
const fieldErrorId = (name: string) => `${name}-error`;

function readableDate(value: string) {
  if (!value) return "Flexible";
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-NP", { dateStyle: "long" }).format(date);
}

export function OrderRequestForm({
  products,
  initialProductId = "",
  initialIssue,
}: {
  products: OrderProduct[];
  initialProductId?: string;
  initialIssue?: string;
}) {
  const business = useBusinessSettings();
  const [productId, setProductId] = useState(initialProductId);
  const [quantity, setQuantity] = useState(1);
  const [customValues, setCustomValues] = useState<Record<string, string>>({});
  const [customRequest, setCustomRequest] = useState("");
  const [deliveryArea, setDeliveryArea] = useState("");
  const [desiredDate, setDesiredDate] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const submittingRef = useRef(false);
  const idempotencyKeyRef = useRef<string>(crypto.randomUUID());

  const selected = useMemo(
    () => products.find((product) => product.id === productId),
    [products, productId]
  );
  const subtotal = selected ? selected.price * quantity : 0;
  const customizationLines = useMemo(() => {
    const values =
      selected?.customizationOptions
        .map((option) => {
          const value = customValues[option.key]?.trim();
          return value ? `${option.label}: ${value}` : "";
        })
        .filter(Boolean) || [];
    if (customRequest.trim()) values.push(customRequest.trim());
    return values;
  }, [customRequest, customValues, selected]);

  const whatsappMessage = createOrderWhatsAppMessage({
    productName: selected?.name,
    quantity,
    customization: customizationLines,
    deliveryArea: deliveryArea.trim(),
    desiredDate,
    notes: notes.trim(),
  });

  if (!business.websiteOrderingEnabled) {
    return (
      <section className="order-empty-state" aria-labelledby="website-orders-paused">
        <Flower2 aria-hidden="true" />
        <h2 id="website-orders-paused">Website requests are paused</h2>
        <p>The studio is not accepting structured website requests right now.</p>
        {business.whatsappOrderingEnabled ? (
          <a
            href={createWhatsAppUrl(whatsappMessage, business.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle aria-hidden="true" /> Ask on WhatsApp
          </a>
        ) : (
          <Link href="/contact">View contact information</Link>
        )}
      </section>
    );
  }

  function updateProduct(nextId: string) {
    setProductId(nextId);
    setCustomValues({});
    setCustomRequest("");
    setErrors((current) => {
      const next = { ...current };
      delete next.productId;
      return next;
    });
  }

  function validate(form: FormData) {
    const next: FieldErrors = {};
    const name = String(form.get("customerName") || "").trim();
    const phone = String(form.get("customerPhone") || "").trim();
    const email = String(form.get("customerEmail") || "").trim();
    const channel = String(form.get("preferredChannel") || "");
    if (!selected) next.productId = "Choose the piece you would like us to prepare.";
    if (name.length < 2) next.customerName = "Enter your name using at least 2 characters.";
    if (phone.length < 7) next.customerPhone = "Enter a phone or WhatsApp number we can reach.";
    if (email && !/^\S+@\S+\.\S+$/.test(email)) next.customerEmail = "Enter a valid email address.";
    if (channel === "EMAIL" && !email)
      next.customerEmail = "Email is needed when it is your preferred contact method.";
    if (form.get("whatsappConsent") !== "on")
      next.whatsappConsent = "Please agree to receive order updates through WhatsApp.";
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20)
      next.quantity = "Choose a quantity between 1 and 20.";
    if (!deliveryArea.trim()) next.deliveryArea = "Tell us the delivery area or pickup preference.";
    if (desiredDate && Number.isNaN(new Date(`${desiredDate}T12:00:00`).getTime()))
      next.desiredDate = "Choose a valid date.";
    selected?.customizationOptions.forEach((option) => {
      if (option.required && !customValues[option.key]?.trim())
        next[`custom-${option.key}`] = `${option.label} is required for this piece.`;
    });
    return next;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;
    const form = new FormData(event.currentTarget);
    const nextErrors = validate(form);
    setErrors(nextErrors);
    setMessage("");
    if (Object.keys(nextErrors).length) {
      setStatus("error");
      requestAnimationFrame(() =>
        document.getElementById(fieldErrorId(Object.keys(nextErrors)[0]))?.focus()
      );
      return;
    }
    if (!selected) return;

    submittingRef.current = true;
    setStatus("sending");
    const customization = Object.fromEntries(
      selected.customizationOptions.map((option) => [option.key, customValues[option.key] || ""])
    );
    if (selected.customizable && customRequest.trim()) customization.request = customRequest.trim();
    const composedNotes = [
      `Delivery area / pickup: ${deliveryArea.trim()}`,
      notes.trim() ? `Customer note: ${notes.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKeyRef.current,
        },
        body: JSON.stringify({
          customerName: form.get("customerName"),
          customerPhone: form.get("customerPhone"),
          customerEmail: form.get("customerEmail"),
          preferredChannel: form.get("preferredChannel"),
          whatsappConsent: form.get("whatsappConsent") === "on",
          desiredDate,
          notes: composedNotes,
          productId,
          quantity,
          customization,
          website: form.get("website"),
        }),
      });
      const data = (await response.json().catch(() => null)) as {
        message?: string;
        requestNumber?: string;
        trackingToken?: string;
        whatsappNotificationAccepted?: boolean;
        errors?: Record<string, string[]>;
      } | null;
      if (!response.ok) {
        const serverErrors = Object.fromEntries(
          Object.entries(data?.errors || {}).flatMap(([key, value]) =>
            value?.[0] ? [[key, value[0]]] : []
          )
        );
        setErrors(serverErrors);
        setMessage(data?.message || "We could not send your request. Your details are still here.");
        setStatus("error");
        return;
      }
      setConfirmation({
        requestNumber: data?.requestNumber || "",
        trackingPath:
          data?.requestNumber && data.trackingToken
            ? createOrderTrackingPath(data.requestNumber, data.trackingToken)
            : null,
        whatsappNotificationAccepted: Boolean(data?.whatsappNotificationAccepted),
        productName: selected.name,
        quantity,
        subtotal,
        deliveryArea: deliveryArea.trim(),
        desiredDate,
        customization: customizationLines,
        notes: notes.trim(),
      });
      setMessage(data?.message || "Your request has been received.");
      setStatus("success");
    } catch {
      setMessage(
        "We could not reach the studio just now. Your details are still here—please retry or use WhatsApp."
      );
      setStatus("error");
    } finally {
      submittingRef.current = false;
    }
  }

  if (status === "success" && confirmation) {
    const successWhatsApp = createOrderWhatsAppMessage({
      productName: confirmation.productName,
      quantity: confirmation.quantity,
      customization: confirmation.customization,
      deliveryArea: confirmation.deliveryArea,
      desiredDate: confirmation.desiredDate,
      notes: confirmation.notes,
      requestNumber: confirmation.requestNumber,
    });
    return (
      <section className="order-confirmation" aria-labelledby="confirmation-title">
        <div className="order-confirmation-seal" aria-hidden="true">
          <CheckCircle2 />
        </div>
        <p className="order-eyebrow">Your request is safely with our studio</p>
        <h2 id="confirmation-title">Thank you. We’ll take it from here.</h2>
        <p className="order-confirmation-message" role="status" aria-live="polite">
          {message}
        </p>
        {confirmation.requestNumber && (
          <div className="order-reference">
            <span>Request reference</span>
            <strong>{confirmation.requestNumber}</strong>
          </div>
        )}
        <div className="order-confirmation-summary">
          <div>
            <span>Current status</span>
            <strong>Request received</strong>
          </div>
          <div>
            <span>Piece</span>
            <strong>
              {confirmation.quantity} × {confirmation.productName}
            </strong>
          </div>
          <div>
            <span>Base subtotal</span>
            <strong>{formatCurrency(confirmation.subtotal)}</strong>
          </div>
          <div>
            <span>Delivery</span>
            <strong>
              {confirmation.deliveryArea} · {readableDate(confirmation.desiredDate)}
            </strong>
          </div>
          {confirmation.customization.length > 0 && (
            <div>
              <span>Personal details</span>
              <strong>{confirmation.customization.join(" · ")}</strong>
            </div>
          )}
        </div>
        <p className="order-confirmation-updates">
          {confirmation.whatsappNotificationAccepted
            ? "Your WhatsApp confirmation has been accepted for delivery. We’ll keep you updated there as your order progresses."
            : "Your order is safely recorded. WhatsApp automation is not available just now, so please keep your secure tracking link and contact the studio if needed."}
        </p>
        <div className="order-next-steps">
          <h3>What happens next</h3>
          <ol>
            <li>
              <span>1</span> We review the piece, timing, and personal details.
            </li>
            <li>
              <span>2</span> We contact you to confirm availability, delivery, and final price.
            </li>
            <li>
              <span>3</span> Your piece enters the studio only after you approve everything.
            </li>
          </ol>
        </div>
        <div className="order-confirmation-actions">
          {confirmation.trackingPath && (
            <Link href={confirmation.trackingPath} className="order-confirmation-track">
              Track your order <ArrowRight aria-hidden="true" />
            </Link>
          )}
          {business.whatsappOrderingEnabled && (
            <a
              href={createWhatsAppUrl(successWhatsApp, business.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle aria-hidden="true" /> Continue on WhatsApp
            </a>
          )}
          <Link href="/collections">
            Return to the collection <ArrowRight aria-hidden="true" />
          </Link>
          <button type="button" onClick={() => setStatus("idle")}>
            <RotateCcw aria-hidden="true" /> Start another request
          </button>
        </div>
      </section>
    );
  }

  if (!products.length) {
    return (
      <section className="order-empty-state" aria-labelledby="order-empty-title">
        <Flower2 aria-hidden="true" />
        <h2 id="order-empty-title">The studio collection is being refreshed</h2>
        <p>
          There are no pieces available for a website request right now. Ask us on WhatsApp about
          upcoming work or a personal commission.
        </p>
        {business.whatsappOrderingEnabled && (
          <a
            href={createWhatsAppUrl(undefined, business.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle aria-hidden="true" /> Ask the studio
          </a>
        )}
      </section>
    );
  }

  return (
    <form
      className="order-experience"
      onSubmit={submit}
      noValidate
      aria-busy={status === "sending"}
    >
      <div className="order-form-column">
        {initialIssue && (
          <div className="order-context-alert" role="status">
            <Flower2 aria-hidden="true" />
            <p>{initialIssue}</p>
          </div>
        )}

        <OrderSection
          number="01"
          title="Choose your piece"
          note="The starting point for your request"
        >
          <Field label="Studio creation" name="productId" required error={errors.productId} wide>
            <select
              id="productId"
              name="productId"
              value={productId}
              onChange={(event) => updateProduct(event.target.value)}
              className={inputClass}
              aria-invalid={Boolean(errors.productId)}
              aria-describedby={errors.productId ? fieldErrorId("productId") : undefined}
            >
              <option value="">Choose a floral piece</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} — {formatCurrency(product.price)}
                </option>
              ))}
            </select>
          </Field>
          <div className="order-field">
            <span id="quantity-label" className="order-field-label">
              Quantity
            </span>
            <div className="order-quantity" role="group" aria-labelledby="quantity-label">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                aria-label="Decrease quantity"
              >
                <Minus aria-hidden="true" />
              </button>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                max="20"
                inputMode="numeric"
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
                aria-invalid={Boolean(errors.quantity)}
                aria-describedby={errors.quantity ? fieldErrorId("quantity") : undefined}
              />
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.min(20, value + 1))}
                aria-label="Increase quantity"
              >
                <Plus aria-hidden="true" />
              </button>
            </div>
            {errors.quantity && (
              <p id={fieldErrorId("quantity")} className="order-field-error" tabIndex={-1}>
                {errors.quantity}
              </p>
            )}
          </div>
        </OrderSection>

        {selected?.customizable && (
          <OrderSection
            number="02"
            title="Make it personal"
            note="A simple conversation, never a complicated configurator"
            sectionKey={selected.id}
          >
            {selected.customizationSummary && (
              <p className="order-section-note">{selected.customizationSummary}</p>
            )}
            {selected.customizationOptions.map((option) => {
              const name = `custom-${option.key}`;
              const choices = Array.isArray(option.choices)
                ? option.choices.filter((choice): choice is string => typeof choice === "string")
                : [];
              const common = {
                id: name,
                name,
                value: customValues[option.key] || "",
                onChange: (
                  event: React.ChangeEvent<
                    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
                  >
                ) =>
                  setCustomValues((current) => ({ ...current, [option.key]: event.target.value })),
                required: option.required,
                "aria-invalid": Boolean(errors[name]),
                "aria-describedby": errors[name] ? fieldErrorId(name) : undefined,
              };
              return (
                <Field
                  key={option.key}
                  label={option.label}
                  name={name}
                  required={option.required}
                  error={errors[name]}
                >
                  {option.inputKind === "select" && choices.length ? (
                    <select {...common} className={inputClass}>
                      <option value="">Choose an option</option>
                      {choices.map((choice) => (
                        <option key={choice} value={choice}>
                          {choice}
                        </option>
                      ))}
                    </select>
                  ) : option.inputKind === "textarea" ? (
                    <textarea
                      {...common}
                      maxLength={500}
                      className={`${inputClass} min-h-28 py-3`}
                      style={{ minHeight: "7rem" }}
                    />
                  ) : (
                    <input {...common} maxLength={500} className={inputClass} />
                  )}
                </Field>
              );
            })}
            <Field
              label="Tell us what you’d like"
              name="customRequest"
              wide
              help="We’ll confirm what is possible and any price difference before making begins."
            >
              <textarea
                id="customRequest"
                name="customRequest"
                value={customRequest}
                onChange={(event) => setCustomRequest(event.target.value)}
                maxLength={500}
                className={`${inputClass} min-h-32 py-3`}
                style={{ minHeight: "8rem" }}
                placeholder="Preferred colours, occasion, style, message, or another detail you have in mind…"
              />
            </Field>
          </OrderSection>
        )}

        <OrderSection
          number={selected?.customizable ? "03" : "02"}
          title="Delivery details"
          note="Enough information for an accurate studio reply"
        >
          <Field
            label="Delivery area or pickup"
            name="deliveryArea"
            required
            error={errors.deliveryArea}
          >
            <div className="order-field-icon-wrap">
              <MapPin aria-hidden="true" />
              <input
                id="deliveryArea"
                name="deliveryArea"
                value={deliveryArea}
                onChange={(event) => setDeliveryArea(event.target.value)}
                maxLength={180}
                className={`${inputClass} pl-11`}
                placeholder="e.g. Patan, Lalitpur"
                aria-invalid={Boolean(errors.deliveryArea)}
                aria-describedby={errors.deliveryArea ? fieldErrorId("deliveryArea") : undefined}
              />
            </div>
          </Field>
          <Field label="Preferred delivery date" name="desiredDate" error={errors.desiredDate}>
            <div className="order-field-icon-wrap">
              <CalendarDays aria-hidden="true" />
              <input
                id="desiredDate"
                name="desiredDate"
                type="date"
                value={desiredDate}
                onChange={(event) => setDesiredDate(event.target.value)}
                className={`${inputClass} pl-11`}
                aria-invalid={Boolean(errors.desiredDate)}
                aria-describedby={errors.desiredDate ? fieldErrorId("desiredDate") : undefined}
              />
            </div>
          </Field>
        </OrderSection>

        <OrderSection
          number={selected?.customizable ? "04" : "03"}
          title="How should we reach you?"
          note="Your details are used only for this request"
        >
          <Field label="Your name" name="customerName" required error={errors.customerName}>
            <input
              id="customerName"
              name="customerName"
              autoComplete="name"
              maxLength={100}
              className={inputClass}
              aria-invalid={Boolean(errors.customerName)}
              aria-describedby={errors.customerName ? fieldErrorId("customerName") : undefined}
            />
          </Field>
          <Field
            label="Phone / WhatsApp"
            name="customerPhone"
            required
            error={errors.customerPhone}
          >
            <input
              id="customerPhone"
              name="customerPhone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              maxLength={25}
              className={inputClass}
              aria-invalid={Boolean(errors.customerPhone)}
              aria-describedby={errors.customerPhone ? fieldErrorId("customerPhone") : undefined}
            />
          </Field>
          <Field label="Email" name="customerEmail" optional error={errors.customerEmail}>
            <input
              id="customerEmail"
              name="customerEmail"
              type="email"
              autoComplete="email"
              maxLength={160}
              className={inputClass}
              aria-invalid={Boolean(errors.customerEmail)}
              aria-describedby={errors.customerEmail ? fieldErrorId("customerEmail") : undefined}
            />
          </Field>
          <Field label="Preferred contact" name="preferredChannel">
            <select
              id="preferredChannel"
              name="preferredChannel"
              className={inputClass}
              defaultValue="WHATSAPP"
            >
              <option value="WHATSAPP">WhatsApp</option>
              <option value="PHONE">Phone</option>
              <option value="EMAIL">Email</option>
            </select>
          </Field>
          <div className="order-whatsapp-consent">
            <label htmlFor="whatsappConsent">
              <input
                id="whatsappConsent"
                name="whatsappConsent"
                type="checkbox"
                required
                aria-invalid={Boolean(errors.whatsappConsent)}
                aria-describedby={
                  errors.whatsappConsent ? fieldErrorId("whatsappConsent") : undefined
                }
              />
              <span>
                Send my order confirmation and status updates to this number through WhatsApp.
              </span>
            </label>
            {errors.whatsappConsent && (
              <p id={fieldErrorId("whatsappConsent")} tabIndex={-1} role="alert">
                {errors.whatsappConsent}
              </p>
            )}
          </div>
          <Field label="A note for the studio" name="notes" optional wide>
            <textarea
              id="notes"
              name="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              maxLength={1200}
              className={`${inputClass} min-h-32 py-3`}
              style={{ minHeight: "8rem" }}
              placeholder="Occasion, card message, timing context, or anything else we should know…"
            />
          </Field>
        </OrderSection>

        <input
          name="website"
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        {status === "error" && message && (
          <div className="order-submit-error" role="alert" aria-live="assertive">
            <strong>Your request has not been sent yet.</strong>
            <p>{message}</p>
          </div>
        )}
        <div className="order-desktop-submit">
          <SubmitButton sending={status === "sending"} />
          <p>
            <ShieldCheck aria-hidden="true" /> No payment is taken. We confirm every detail first.
          </p>
        </div>
      </div>

      <aside className="order-summary" aria-labelledby="order-summary-title">
        <div className="order-summary-card">
          <p className="order-eyebrow">Your request</p>
          <h2 id="order-summary-title">Order summary</h2>
          {selected ? (
            <>
              <div className="order-summary-product">
                <div className="order-summary-image">
                  {selected.image ? (
                    <Image
                      src={selected.image.url}
                      alt={selected.image.alt}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  ) : (
                    <Flower2 aria-hidden="true" />
                  )}
                </div>
                <div>
                  <span>{selected.productType}</span>
                  <strong>{selected.name}</strong>
                  <small>{selected.category}</small>
                </div>
              </div>
              <dl className="order-summary-list">
                <div>
                  <dt>Quantity</dt>
                  <dd>{quantity || "—"}</dd>
                </div>
                <div>
                  <dt>Base price</dt>
                  <dd>{formatCurrency(selected.price)}</dd>
                </div>
                {selected.customizable && (
                  <div>
                    <dt>Personalisation</dt>
                    <dd>
                      {customizationLines.length ? customizationLines.join(" · ") : "Available"}
                    </dd>
                  </div>
                )}
                <div>
                  <dt>Delivery</dt>
                  <dd>{deliveryArea.trim() || "To be shared"}</dd>
                </div>
                <div>
                  <dt>Preferred date</dt>
                  <dd>{readableDate(desiredDate)}</dd>
                </div>
              </dl>
              <div className="order-summary-total">
                <span>Base subtotal</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>
              <p className="order-pricing-note">
                This is not a payment total. Custom work and delivery may affect the final price;
                we’ll confirm it before you commit.
              </p>
              {selected.preparationDays && (
                <p className="order-preparation">
                  <Check aria-hidden="true" /> Usually prepared in {selected.preparationDays} studio
                  days
                </p>
              )}
            </>
          ) : (
            <div className="order-summary-placeholder">
              <Flower2 aria-hidden="true" />
              <p>Choose a piece to see its photograph, details, and estimated base subtotal.</p>
            </div>
          )}
          {business.whatsappOrderingEnabled && (
            <div className="order-whatsapp-option">
              <span>Prefer a quick conversation?</span>
              <a
                href={createWhatsAppUrl(whatsappMessage, business.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle aria-hidden="true" /> Continue on WhatsApp
              </a>
              <small>Your product and request details will be prepared in the message.</small>
            </div>
          )}
        </div>
      </aside>

      <div className="order-mobile-submit">
        <div>
          <span>{selected ? formatCurrency(subtotal) : "Choose a piece"}</span>
          <small>{selected ? "Base subtotal" : "to begin"}</small>
        </div>
        <SubmitButton sending={status === "sending"} compact />
      </div>
    </form>
  );
}

function OrderSection({
  number,
  title,
  note,
  children,
  sectionKey,
}: {
  number: string;
  title: string;
  note: string;
  children: React.ReactNode;
  sectionKey?: string;
}) {
  return (
    <fieldset className="order-form-section" key={sectionKey}>
      <legend>
        <span>{number}</span>
        <span>
          <strong>{title}</strong>
          <small>{note}</small>
        </span>
      </legend>
      <div className="order-fields-grid">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  name,
  required,
  optional,
  error,
  help,
  wide,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  help?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`order-field${wide ? "order-field-wide" : ""}`}>
      <label htmlFor={name}>
        {label} {required && <span aria-hidden="true">*</span>}
        {optional && <small>Optional</small>}
      </label>
      {children}
      {error && (
        <p id={fieldErrorId(name)} className="order-field-error" tabIndex={-1}>
          {error}
        </p>
      )}
      {help && <p className="order-field-help">{help}</p>}
    </div>
  );
}

function SubmitButton({ sending, compact = false }: { sending: boolean; compact?: boolean }) {
  return (
    <button type="submit" disabled={sending}>
      {sending ? (
        <>
          <span className="order-spinner" aria-hidden="true" />{" "}
          {compact ? "Sending…" : "Sending securely…"}
        </>
      ) : (
        <>
          {compact ? <Send aria-hidden="true" /> : null}
          {compact ? (
            "Send request"
          ) : (
            <>
              Send order request <Send aria-hidden="true" />
            </>
          )}
        </>
      )}
    </button>
  );
}
