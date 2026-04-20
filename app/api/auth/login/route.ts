import { NextResponse } from "next/server";
import { loginUserSchema } from "@/app/api/dtos/auth.dto";
import { signToken } from "@/src/lib/jwt";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcryptjs";

import { getZodErrorMessage } from "@/src/lib/errors";

export async function POST(request: Request) {
  const body = await request.json();

  const parsed = loginUserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: getZodErrorMessage(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const email = parsed.data.email.toLowerCase().trim();
    const emailUsername = email.split("@")[0];
    const user = await prisma.user.findUnique({
      where: { email: emailUsername },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }
    const token = await signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(user, { status: 201 });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 2 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 409 },
    );
  }
}
