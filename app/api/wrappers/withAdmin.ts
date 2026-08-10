import { NextResponse } from "next/server";
import { attachRotatedCookies, getCurrentUserWithRefresh } from "@/src/lib/auth";
import { getUserById } from "../users/users.service";
import { User } from "@/src/generated/prisma";

interface SafeUser extends Omit<User, "passwordHash"> {}

export function withAdmin<TParams = any>(
  handler: (
    req: Request,
    user: SafeUser,
    ctx: { params: Promise<TParams> },
  ) => Promise<Response>,
) {
  return async (req: Request, ctx: { params: Promise<TParams> }) => {
    const { payload: userJWT, rotated } = await getCurrentUserWithRefresh();

    if (!userJWT?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(String(userJWT.sub));

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "¿Qué estás haciendo llamando a esta ruta....?" },
        { status: 403 },
      );
    }

    const response = await handler(req, user, ctx);

    if (rotated) {
      attachRotatedCookies(response, rotated.accessToken, rotated.refreshToken);
    }

    return response;
  };
}
