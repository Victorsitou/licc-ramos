import {
  attachRotatedCookies,
  getCurrentUserWithRefresh,
} from "@/src/lib/auth";
import { getUserById } from "../../users/users.service";
import { NextResponse } from "next/dist/server/web/spec-extension/response";

export async function GET() {
  const { payload: JWTData, rotated } = await getCurrentUserWithRefresh();

  if (!JWTData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserById(String(JWTData.sub!));

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const response = NextResponse.json(user);

  if (rotated) {
    attachRotatedCookies(response, rotated.accessToken, rotated.refreshToken);
  }

  return response;
}
