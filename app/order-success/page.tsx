import { redirect } from "next/navigation";
export default function OrderSuccessRedirect() {
  redirect("/collections");
}
