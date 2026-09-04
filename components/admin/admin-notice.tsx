import { CheckCircle2, Info } from "lucide-react";

export function AdminNotice({
  message,
  tone = "success",
}: {
  message?: string;
  tone?: "success" | "info";
}) {
  if (!message) return null;
  const Icon = tone === "success" ? CheckCircle2 : Info;
  return (
    <div className={`admin-notice admin-notice-${tone}`} role="status">
      <Icon aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
