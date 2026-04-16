import { getCurrentUser } from "@/src/lib/auth";
import { NextResponse } from "next/server";
import { completeResource } from "./completed.service";
import { completeResourceSchema } from "../../dtos/complete-resource.dto";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = completeResourceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await completeResource(user.sub, parsed.data.resourceId);

    return NextResponse.json({ message: "Resource marked as completed" });
  } catch {
    return NextResponse.json(
      { error: "Failed to mark resource as completed" },
      { status: 500 },
    );
  }
}
