import { NextResponse } from "next/server";
import {
  createProblemSet,
  getProblemSets,
} from "./problem-collections.service";
import { CreateProblemSetDto } from "../dtos/problem-sets/create-problem-set.dto";
import { getCurrentUser } from "@/src/lib/auth";

export async function GET() {
  const sets = await getProblemSets();
  return NextResponse.json(sets);
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
    const parsed = CreateProblemSetDto.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const newSet = await createProblemSet(parsed.data);
    return NextResponse.json(newSet, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error creating problem set" },
      { status: 500 },
    );
  }
}
