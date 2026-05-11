import { getCurrentUser } from "@/src/lib/auth";
import { NextResponse } from "next/server";
import { getProblemCollectionById } from "../problem-collections.service";

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

    return NextResponse.json(await getProblemCollectionById(collectionId), {
      status: 201,
    });
  } catch {
    return NextResponse.json(
      { error: "Error fetching problem collection" },
      { status: 500 },
    );
  }
}
