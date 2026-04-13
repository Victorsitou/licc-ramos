import { getCurrentUser } from "@/src/lib/auth";
import { NextResponse } from "next/server";
import { createResourceSchema } from "../../dtos/create-resource.dto";
import { prisma } from "@/src/lib/prisma";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const parsed = createResourceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      user.sub !== "cmnxgj4cd0000oc9k9va4ut5e" &&
      user.sub !== "cmnxdw9rc0000qwpkciodqzw1"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.resource.create({
      data: {
        title: parsed.data.title,
        url: parsed.data.url,
        type: parsed.data.type,
        slug: parsed.data.slug,
        orderIndex: parsed.data.orderIndex,
      },
    });
    return NextResponse.json(
      { message: "Resource created successfully" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
