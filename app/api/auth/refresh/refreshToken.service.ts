import crypto from "crypto";
import { prisma } from "@/src/lib/prisma";

const REFRESH_TOKEN_DAYS = 30;

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function generateRefreshToken(userId: string) {
  const plainToken = crypto.randomBytes(32).toString("hex");

  const created = await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashToken(plainToken),
      expiresAt: new Date(
        Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
      ),
    },
  });

  return { plainToken, id: created.id };
}

export async function rotateRefreshToken(plainToken: string) {
  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashToken(plainToken) },
  });

  if (!stored) {
    throw new Error("Invalid refresh token");
  }
  if (stored.revoked) {
    throw new Error("Refresh token already used");
  }
  if (stored.expiresAt < new Date()) {
    throw new Error("Refresh token expired");
  }

  const newToken = await generateRefreshToken(stored.userId);

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revoked: true, replacedById: newToken.id, lastUsedAt: new Date() },
  });

  return { userId: stored.userId, refreshToken: newToken.plainToken };
}

export async function revokeAllRefreshTokens(userId: string) {
  await prisma.refreshToken.updateMany({
    where: { userId },
    data: { revoked: true },
  });
}