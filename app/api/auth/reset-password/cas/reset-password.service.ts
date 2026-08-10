import { signPasswordResetToken } from "@/src/lib/jwt";

export async function generateToken(userId: string) {
  const token = await signPasswordResetToken({ sub: userId });
  return token;
}
