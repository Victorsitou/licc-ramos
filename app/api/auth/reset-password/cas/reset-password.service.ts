import { signToken } from "@/src/lib/jwt";

export async function generateToken(userId: string) {
  const token = await signToken({ sub: userId });
  return token;
}
