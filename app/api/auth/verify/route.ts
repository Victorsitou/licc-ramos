import { getUserByEmail } from "../../users/users.service";
import { getToken } from "./verify.service";
import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/dist/server/web/spec-extension/response";

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const tokenHash = searchParams.get("token");

  if (!tokenHash) {
    return new Response("Token is required", { status: 400 });
  }

  try {
    const token = await getToken(tokenHash);

    if (!token || token.expiresAt < new Date()) {
      return new Response("Invalid or expired token", { status: 400 });
    }

    const user = await getUserByEmail(token.email);

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    await prisma.user.update({
      where: { email: token.email },
      data: { verified: true },
      omit: { passwordHash: true },
    });
    await prisma.verificationToken.delete({
      where: { tokenHash },
    });

    return NextResponse.redirect(new URL("/", request.url));
  } catch {
    return new Response("Invalid or expired token", { status: 400 });
  }
}
