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

  // TODO: use a better approach instead of creating a safeUser everytime
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };

  return NextResponse.json(safeUser);
}
