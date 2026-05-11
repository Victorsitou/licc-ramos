import { NextResponse } from "next/server";
import {
  createProblemCollection,
  getProblemCollections,
} from "./problem-collections.service";
import { CreateProblemCollectionDto } from "../dtos/problem-sets/create-problem-collection.dto";
import { getCurrentUser } from "@/src/lib/auth";

export async function GET() {
  const user = await getCurrentUser();

  if (!user?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const collections = await getProblemCollections();
  return NextResponse.json(collections);
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = CreateProblemCollectionDto.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const newCollection = await createProblemCollection(parsed.data);
    return NextResponse.json(newCollection, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error creating problem collection" },
      { status: 500 },
    );
  }
}
