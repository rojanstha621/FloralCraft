import "server-only";

export function normalizeWhatsAppRecipient(value: string): string | null {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  const countryCode = (process.env.WHATSAPP_DEFAULT_COUNTRY_CODE || "977").replace(/\D/g, "");
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length <= 10 && countryCode && !digits.startsWith(countryCode)) {
    digits = `${countryCode}${digits}`;
  }
  return /^\d{8,15}$/.test(digits) ? digits : null;
}
