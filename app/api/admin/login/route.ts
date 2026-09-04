import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  createAdminSessionToken,
} from "@/lib/auth/session";
import { readJsonBody, RequestBodyError } from "@/lib/security/request";
import { checkRateLimit, clientAddress } from "@/lib/security/rate-limit";

const loginSchema = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(1).max(200),
});

export async function POST(request: NextRequest) {
  try {
    const ipLimit = checkRateLimit(`admin-login:ip:${clientAddress(request)}`, 10, 15 * 60 * 1000);
    if (!ipLimit.allowed)
      return NextResponse.json(
        { message: "Too many sign-in attempts. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(ipLimit.retryAfter), "Cache-Control": "no-store" },
        }
      );
    const credentials = loginSchema.parse(await readJsonBody(request, 16 * 1024));
    const email = credentials.email.toLowerCase();
    const accountLimit = checkRateLimit(`admin-login:account:${email}`, 5, 15 * 60 * 1000);
    if (!accountLimit.allowed)
      return NextResponse.json(
        { message: "Too many sign-in attempts. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(accountLimit.retryAfter), "Cache-Control": "no-store" },
        }
      );
    const admin = await prisma.adminUser.findUnique({ where: { email } });

    if (!admin || !admin.active || !verifyPassword(credentials.password, admin.passwordHash)) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    const token = createAdminSessionToken({
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
    });
    const response = NextResponse.json({ success: true });
    response.headers.set("Cache-Control", "no-store");
    response.cookies.set(ADMIN_SESSION_COOKIE, token, adminSessionCookieOptions);

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });
    return response;
  } catch (error) {
    if (error instanceof RequestBodyError)
      return NextResponse.json(
        { message: error.kind === "too_large" ? "Request is too large." : "Invalid request body." },
        { status: 400 }
      );
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Enter a valid email and password." }, { status: 400 });
    }
    console.error("Admin login failed", error);
    return NextResponse.json({ message: "Unable to sign in right now." }, { status: 500 });
  }
}
