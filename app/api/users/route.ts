import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { getUsers } from "./users.service";

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}
