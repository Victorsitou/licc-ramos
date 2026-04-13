import { NextResponse } from "next/server";
import { createUserSchema } from "../../users/user.dto";
import { createUser } from "../../users/users.service";

export async function POST(request: Request) {
  const body = await request.json();

  const parsed = createUserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const user = await createUser(parsed.data);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 409 },
    );
  }
}
