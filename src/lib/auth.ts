import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import { signAccessToken } from "./jwt";
import { rotateRefreshToken } from "@/app/api/auth/refresh/refreshToken.service";
import { NextResponse } from "next/server";

export const ACCESS_TOKEN_COOKIE = "token";
export const REFRESH_TOKEN_COOKIE = "refreshToken";

export const ACCESS_TOKEN_MAX_AGE = 60 * 15; // 15 minutes
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: REFRESH_TOKEN_MAX_AGE,
    path: "/",
  });
}

export function attachRotatedCookies(
  response: Response,
  accessToken: string,
  refreshToken: string,
) {
  const secure = process.env.NODE_ENV === "production" ? "Secure; " : "";

  const accessCookie = `${ACCESS_TOKEN_COOKIE}=${accessToken}; HttpOnly; SameSite=Strict; ${secure}Max-Age=${ACCESS_TOKEN_MAX_AGE}; Path=/`;
  const refreshCookie = `${REFRESH_TOKEN_COOKIE}=${refreshToken}; HttpOnly; SameSite=Strict; ${secure}Max-Age=${REFRESH_TOKEN_MAX_AGE}; Path=/`;

  response.headers.append("Set-Cookie", accessCookie);
  response.headers.append("Set-Cookie", refreshCookie);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token) return null;

  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}

export type CurrentUserWithRefresh = {
  payload: Awaited<ReturnType<typeof verifyToken>> | null;
  rotated?: { accessToken: string; refreshToken: string };
};

export async function getCurrentUserWithRefresh(): Promise<CurrentUserWithRefresh> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (accessToken) {
    try {
      return { payload: await verifyToken(accessToken) };
    } catch {
      // expired or invalid access token, fall through to refresh
    }
  }

  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refreshToken) return { payload: null };

  try {
    const { userId, refreshToken: newRefreshToken } =
      await rotateRefreshToken(refreshToken);
    const newAccessToken = await signAccessToken({ sub: userId });
    return {
      payload: { sub: userId },
      rotated: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    };
  } catch {
    return { payload: null };
  }
}

export async function getUserFromToken(token: string) {
  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}
