import { NextRequest, NextResponse } from "next/server";
import { rotateRefreshToken } from "./refreshToken.service";
import { signAccessToken } from "@/src/lib/jwt";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { error: "Missing refresh token" },
      { status: 401 },
    );
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
      maxAge: 60 * 15, // 15 minutes
    });

    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid session" },
      { status: 401 },
    );
  }
}