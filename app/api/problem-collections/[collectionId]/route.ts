import { getCurrentUser } from "@/src/lib/auth";
import { NextResponse } from "next/server";
import {
  deleteProblemCollection,
  getProblemCollectionById,
  updateProblemCollection,
} from "../problem-collections.service";
import { updateProblemCollectionDto } from "../../dtos/problem-sets/update-problem-collection.dto";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ collectionId: string }>;
  },
) {
  try {
    const collectionId = (await params).collectionId;
    const user = await getCurrentUser();

    if (!user?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(
      await getProblemCollectionById(collectionId, user.sub),
      {
        status: 201,
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Error fetching problem collection" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ collectionId: string }>;
  },
) {
  try {
    const collectionId = (await params).collectionId;
    const user = await getCurrentUser();

    if (!user?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = updateProblemCollectionDto.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    await updateProblemCollection(collectionId, parsed.data);

    return NextResponse.json(
      await getProblemCollectionById(collectionId, user.sub),
      {
        status: 200,
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Error updating problem collection" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ collectionId: string }>;
  },
) {
  try {
    const collectionId = (await params).collectionId;
    const user = await getCurrentUser();

    if (!user?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await deleteProblemCollection(collectionId);

    return NextResponse.json(
      { message: "Problem collection deleted" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Error deleting problem collection" },
      { status: 500 },
    );
  }
}
