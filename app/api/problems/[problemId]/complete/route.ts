import { getCurrentUser } from "@/src/lib/auth";
import { NextResponse } from "next/server";
import {
  completeProblem,
  deleteProblemCompletion,
} from "./complete.problems.service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ problemId: string }> },
) {
  try {
    const problemId = (await params).problemId;
    const user = await getCurrentUser();

    if (!user?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await completeProblem(user.sub, problemId);
    return NextResponse.json({
      message: `Problem marked as complete`,
      status: 201,
    });
  } catch {
    return NextResponse.json(
      { error: "Error creating problem" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ problemId: string }> },
) {
  try {
    const problemId = (await params).problemId;
    const user = await getCurrentUser();

    if (!user?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await deleteProblemCompletion(user.sub, problemId);
    return NextResponse.json({
      message: `Problem marked as incomplete`,
      status: 200,
    });
  } catch {
    return NextResponse.json(
      { error: "Error uncompleting problem" },
      { status: 500 },
    );
  }
}
