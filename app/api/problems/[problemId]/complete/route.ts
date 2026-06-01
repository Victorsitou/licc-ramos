import { NextResponse } from "next/server";
import {
  completeProblem,
  deleteProblemCompletion,
} from "./complete.problems.service";
import { withVerified } from "@/app/api/wrappers/withVerified";

export const POST = withVerified<{ problemId: string }>(
  async (_, user, { params }) => {
    try {
      const problemId = (await params).problemId;

      await completeProblem(user.id, problemId);
      return NextResponse.json({
        message: "Problem marked as complete",
        status: 201,
      });
    } catch {
      return NextResponse.json(
        { error: "Error creating problem" },
        { status: 500 },
      );
    }
  },
);

export const DELETE = withVerified<{ problemId: string }>(
  async (_, user, { params }) => {
    try {
      const problemId = (await params).problemId;

      await deleteProblemCompletion(user.id, problemId);
      return NextResponse.json({
        message: "Problem marked as incomplete",
        status: 200,
      });
    } catch {
      return NextResponse.json(
        { error: "Error uncompleting problem" },
        { status: 500 },
      );
    }
  },
);
