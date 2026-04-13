import { getCurrentUser } from "@/src/lib/auth";
import { NextResponse } from "next/dist/server/web/spec-extension/response";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(user);
}
