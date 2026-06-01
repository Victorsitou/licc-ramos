import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import { withVerified } from "@/app/api/wrappers/withVerified";

const VALID_TYPES = ["SET", "COMPILADO", "INTERROGACION", "ACTIVIDAD"] as const;

export const GET = withVerified<{ type: string }>(async (_, __, { params }) => {
  try {
    const type = (await params).type.toUpperCase();

    if (!VALID_TYPES.includes(type as never)) {
      return NextResponse.json(
        { error: "Invalid collection type" },
        { status: 400 },
      );
    }

    const collections = await prisma.problemCollection.findMany({
      where: {
        type: type as "SET" | "COMPILADO" | "INTERROGACION" | "ACTIVIDAD",
      },
      include: {
        problems: true,
      },
      orderBy: {
        orderIndex: "asc",
      },
    });

    return NextResponse.json(collections);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 },
    );
  }
});
