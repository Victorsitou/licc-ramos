import { getCurrentUser } from "@/src/lib/auth";
import { NextResponse } from "next/server";
import { completeResource } from "./completed.service";
import { unCompleteResource } from "./completed.service";

export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const user = await getCurrentUser();

    if (!user?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await completeResource(user.sub, id);

    return NextResponse.json({ message: "Resource marked as completed" });
  } catch {
    return NextResponse.json(
      { error: "Failed to mark resource as completed" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const user = await getCurrentUser();

    if (!user?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await unCompleteResource(user.sub, id);

    return NextResponse.json({ message: "Resource marked as incomplete" });
  } catch {
    return NextResponse.json(
      { error: "Failed to mark resource as incomplete" },
      { status: 500 },
    );
  }
}
