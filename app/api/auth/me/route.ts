import { getCurrentUser } from "@/src/lib/auth";
import { getUserById } from "../../users/users.service";
import { NextResponse } from "next/dist/server/web/spec-extension/response";

export async function GET() {
  const JWTData = await getCurrentUser();

  if (!JWTData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserById(JWTData.sub!);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
