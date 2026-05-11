import { NextRequest, NextResponse } from "next/server";

import { getUserFromToken } from "@/src/lib/auth";
import { resetPasswordSchema } from "@/app/api/dtos/reset-password.dto";

import { getUserById, updateUserPassword } from "../../users/users.service";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const parsedData = resetPasswordSchema.safeParse(data);

  if (!parsedData.success) {
    return new NextResponse("Invalid data", { status: 400 });
  }

  const userJWT = await getUserFromToken(parsedData.data.token);

  if (!userJWT || !userJWT.sub) {
    return new NextResponse("Invalid token or expired", { status: 400 });
  }

  const user = await getUserById(userJWT.sub);

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const updatedUser = await updateUserPassword(
    user.id,
    parsedData.data.newPassword,
  );
  return NextResponse.json(updatedUser);
}
