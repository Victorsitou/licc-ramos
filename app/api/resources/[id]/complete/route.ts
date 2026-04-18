import { NextResponse } from "next/server";
import { completeResource } from "./completed.service";
import { unCompleteResource } from "./completed.service";

import { withVerified } from "../../../wrappers/withVerified";

export const POST = withVerified<{ id: string }>(
  async (_, user, { params }) => {
    const { id } = await params;
    try {
      await completeResource(user.id, id);
      return NextResponse.json({ message: "Resource marked as completed" });
    } catch {
      return NextResponse.json(
        { error: "Failed to mark resource as completed" },
        { status: 500 },
      );
    }
  },
);

export const DELETE = withVerified<{ id: string }>(
  async (_, user, { params }) => {
    const { id } = await params;
    try {
      await unCompleteResource(user.id, id);
      return NextResponse.json({ message: "Resource marked as incomplete" });
    } catch {
      return NextResponse.json(
        { error: "Failed to mark resource as incomplete" },
        { status: 500 },
      );
    }
  },
);
