import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { updateResourceSchema } from "../../../dtos/patch-resource.dto";
import { updateResource } from "./update.service";
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;

    if (!user?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = updateResourceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { ...data } = parsed.data;

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      );
    }

    const resource = await updateResource(id, data);

    return NextResponse.json(resource);
  } catch (error) {
    console.error("Failed to update resource:", error);
    return NextResponse.json(
      { error: "Failed to update resource" },
      { status: 500 },
    );
  }
}
