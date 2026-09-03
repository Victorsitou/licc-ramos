import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/src/lib/auth";
import {
  getUserIdFromRefreshToken,
  revokeAllRefreshTokens,
} from "../refresh/refreshToken.service";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  // Revoke from the refresh token so logout also works when the access
  // token has already expired (otherwise the DB row would survive logout).
  if (refreshToken) {
    const userId = await getUserIdFromRefreshToken(refreshToken);
    if (userId) {
      await revokeAllRefreshTokens(userId);
    }
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
