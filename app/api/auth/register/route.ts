import { NextResponse } from "next/server";
import { createUserSchema } from "../../dtos/user.dto";
import { createUser } from "../../users/users.service";
import { signAccessToken } from "@/src/lib/jwt";
import { setAuthCookies } from "@/src/lib/auth";
import { generateRefreshToken } from "../refresh/refreshToken.service";

import { getZodErrorMessage } from "@/src/lib/errors";

export async function POST(request: Request) {
  const body = await request.json();

  const parsed = createUserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: getZodErrorMessage(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const user = await createUser(parsed.data);

    const accessToken = await signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const { plainToken: refreshToken } = await generateRefreshToken(user.id);

    const response = NextResponse.json(user, { status: 201 });

    setAuthCookies(response, accessToken, refreshToken);

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 409 },
    );
  }
}
