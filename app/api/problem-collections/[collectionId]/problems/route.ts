import { CreateProblemDto } from "@/app/api/dtos/problem-sets/create-problem.dto";
import { getCurrentUser } from "@/src/lib/auth";
import { NextResponse } from "next/server";
import { createProblem } from "./problems.service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ collectionId: string }> },
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
    const parsed = CreateProblemDto.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }
    return NextResponse.json(await createProblem(parsed.data, collectionId), {
      status: 201,
    });
  } catch {
    return NextResponse.json(
      { error: "Error creating problem" },
      { status: 500 },
    );
  }
}
