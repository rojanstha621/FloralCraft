import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  createAdminSessionToken,
} from "@/lib/auth/session";

const loginSchema = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(1).max(200),
});

export async function POST(request: NextRequest) {
  try {
    const credentials = loginSchema.parse(await request.json());
    const email = credentials.email.toLowerCase();
    const admin = await prisma.adminUser.findUnique({ where: { email } });

    if (!admin || !admin.active || !verifyPassword(credentials.password, admin.passwordHash)) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    const token = createAdminSessionToken({
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
    });
    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, token, adminSessionCookieOptions);

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Enter a valid email and password." }, { status: 400 });
    }
    console.error("Admin login failed", error);
    return NextResponse.json({ message: "Unable to sign in right now." }, { status: 500 });
  }
}
