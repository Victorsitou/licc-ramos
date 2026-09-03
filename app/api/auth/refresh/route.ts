import { NextRequest, NextResponse } from "next/server";
import { rotateRefreshToken } from "./refreshToken.service";
import { signAccessToken } from "@/src/lib/jwt";

// Defense-in-depth on top of SameSite=Strict: the refresh cookie must only
// be spent by same-origin requests. Non-browser clients send no Origin.
function isSameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return true;

  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId, refreshToken: newRefreshToken } =
      await rotateRefreshToken(refreshToken);

    const accessToken = await signAccessToken({ sub: userId });

    const response = NextResponse.json({ ok: true });

    response.cookies.set("token", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 15,
    });

    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/api/auth",
    });

    return response;
  } catch {
    // Generic error: don't leak whether the token was missing, invalid,
    // expired, or a reused/revoked one.
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
