import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { updateUser } from "./users.service";
import { updateUserSchema, UpdateUserDto } from "../dtos/update.user.dto";

import { getZodErrorMessage } from "@/src/lib/errors";

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = updateUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: getZodErrorMessage(parsed.error) },
        { status: 400 },
      );
    }

    const { name, email, courses } = parsed.data;

    const dataToUpdate: UpdateUserDto = {};

    if (name !== undefined) dataToUpdate.name = name;
    if (email !== undefined) dataToUpdate.email = email;
    if (courses !== undefined) dataToUpdate.courses = courses;

    if (
      Object.keys(dataToUpdate).length === 0 ||
      (name === undefined && email === undefined && courses === undefined)
    ) {
      return NextResponse.json(
        { error: "No se enviaron datos válidos para actualizar" },
        { status: 400 },
      );
    }

    const updatedUser = await updateUser(user.sub, dataToUpdate);

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return new NextResponse("Error al actualizar el usuario", { status: 500 });
  }
}
