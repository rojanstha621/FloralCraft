# WhatsApp Cloud API setup

Petal Craft sends only server-controlled WhatsApp utility templates. Order creation and status
updates remain authoritative even if Meta is unavailable; failed notification records can be
retried from the protected admin orders page.

## Meta configuration

1. Create or select a Meta app with the WhatsApp product and connect the production WhatsApp
   Business phone number.
2. Create the six utility templates below in WhatsApp Manager. Each template has exactly one body
   variable, `{{1}}`, containing the public Petal Craft order reference. The configured names and
   language must exactly match the approved templates.
3. Configure the callback URL as
   `https://YOUR-PRODUCTION-DOMAIN/api/webhooks/whatsapp`, use the same private verify token as
   `WHATSAPP_WEBHOOK_VERIFY_TOKEN`, and subscribe the WhatsApp Business Account to the `messages`
   webhook field.
4. Use a production system-user access token with the least WhatsApp messaging permissions needed.
   Never expose it in browser variables or commit it.
5. Set an active Graph API version explicitly in `WHATSAPP_API_VERSION` (for example, the version
   enabled for your Meta app). Review it before Meta retires that version.

## Required utility templates

All templates use `en_US` unless `WHATSAPP_TEMPLATE_LANGUAGE` is changed. Suggested body copy:

- `petalcraft_order_received`: “🌸 Petal Craft — We’ve received your order request {{1}}. We’ll
  review it and get back to you shortly.”
- `petalcraft_order_contacted`: “🌿 Petal Craft Order Update — Our studio has reviewed order {{1}}
  and is getting in touch.”
- `petalcraft_order_confirmed`: “🌿 Petal Craft Order Update — Order {{1}} has been confirmed. We’re
  preparing your piece with care.”
- `petalcraft_order_in_progress`: “✨ Petal Craft Order Update — Order {{1}} is now being
  handcrafted.”
- `petalcraft_order_completed`: “🤍 Petal Craft — Order {{1}} has been completed. Thank you for
  choosing Petal Craft.”
- `petalcraft_order_cancelled`: “Petal Craft Order Update — Order {{1}} has been cancelled. Please
  contact the studio if you have any questions.”

Template-name environment variables can override these defaults. Templates must be approved and
enabled by Meta before automatic business-initiated notifications can be accepted.

## Delivery semantics

The Graph API response marks a notification as `SENT` (accepted by Meta). Signed webhook events can
advance it to `DELIVERED` or `READ`, or mark it `FAILED`. The webhook never changes an order. No
customer email, SMS, push notification, account, or customer session is used.
