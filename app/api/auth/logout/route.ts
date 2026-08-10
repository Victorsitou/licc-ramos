import { NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  getCurrentUser,
} from "@/src/lib/auth";
import { revokeAllRefreshTokens } from "../refresh/refreshToken.service";

export async function POST() {
  const userJWT = await getCurrentUser();

  if (userJWT?.sub) {
    await revokeAllRefreshTokens(String(userJWT.sub));
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set(ACCESS_TOKEN_COOKIE, "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  response.cookies.set(REFRESH_TOKEN_COOKIE, "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}
