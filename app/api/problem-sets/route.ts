import { NextResponse } from "next/server";
import { getProblemSets } from "./problem-sets.service";

export async function GET() {
  const sets = await getProblemSets();
  return NextResponse.json(sets);
}
