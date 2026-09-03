import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db/prisma";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
  type AdminSession,
} from "@/lib/auth/session";

export async function getCurrentAdmin(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const session = verifyAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) return null;

  const admin = await prisma.adminUser.findFirst({
    where: { id: session.adminId, email: session.email, active: true },
    select: { id: true },
  });
  return admin ? session : null;
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getCurrentAdmin();
  if (!session) redirect("/admin/login");
  return session;
}
