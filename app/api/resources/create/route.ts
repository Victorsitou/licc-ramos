import { getCurrentUser } from "@/src/lib/auth";
import { NextResponse } from "next/server";
import { createResourceSchema } from "../../dtos/create-resource.dto";
import { createResource } from "./resources.service";
import { isAdmin } from "@/src/lib/admin";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!isAdmin(user.sub)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const parsed = createResourceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const resource = await createResource(parsed.data);
    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
