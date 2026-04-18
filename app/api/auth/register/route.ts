import { NextResponse } from "next/server";
import { createUserSchema } from "../../dtos/user.dto";
import { createUser } from "../../users/users.service";
import { createToken, sendVerificationEmail } from "../verify/verify.service";
import { signToken } from "@/src/lib/jwt";

export async function POST(request: Request) {
  const body = await request.json();

  const parsed = createUserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const user = await createUser(parsed.data);
    const verificationToken = await createToken(
      parsed.data.email,
      new Date(Date.now() + 1000 * 60 * 60 * 24),
    );

    await sendVerificationEmail(parsed.data.email, verificationToken);

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
