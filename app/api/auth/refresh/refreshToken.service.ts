import crypto from "crypto";
import { prisma } from "@/src/lib/prisma";

const REFRESH_TOKEN_DAYS = 30;

// A revoked token reused within this window is treated as a benign race
// (e.g. two browser tabs rotating at once) rather than a theft signal.
const REUSE_GRACE_MS = 30 * 1000;

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function newTokenData() {
  const plainToken = crypto.randomBytes(32).toString("hex");
  return { plainToken, tokenHash: hashToken(plainToken) };
}

export async function generateRefreshToken(userId: string) {
  // Best-effort cleanup of rows that can no longer authenticate. Expired
  // rows are safe to drop (reuse detection only cares about revoked,
  // still-unexpired tokens).
  await prisma.refreshToken.deleteMany({
    where: { userId, expiresAt: { lt: new Date() } },
  });

  const { plainToken, tokenHash } = newTokenData();

  const created = await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
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

  if (stored.expiresAt < new Date()) {
    throw new Error("Refresh token expired");
  }

  if (stored.revoked) {
    // Reuse of an already-rotated token is normally a theft signal:
    // revoke every session the user has. Within the grace window it is
    // more likely two tabs raced on the same rotation, so we only fail
    // this request without nuking the account.
    const rotatedAgo = stored.lastUsedAt
      ? Date.now() - stored.lastUsedAt.getTime()
      : Number.POSITIVE_INFINITY;

    if (rotatedAgo > REUSE_GRACE_MS) {
      await revokeAllRefreshTokens(stored.userId);
    }

    throw new Error("Refresh token already used");
  }

  const { plainToken: newPlain, tokenHash: newHash } = newTokenData();
  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
  );

  // Atomic rotation: the replacement is created and the old token revoked in
  // one transaction so both can never be valid at the same time. The revoke
  // is conditional on the token still being active so that two requests
  // presenting the same token can't both win (the loser's replacement is
  // rolled back).
  const created = await prisma.$transaction(async (tx) => {
    const replacement = await tx.refreshToken.create({
      data: { userId: stored.userId, tokenHash: newHash, expiresAt },
    });

    const claimed = await tx.refreshToken.updateMany({
      where: { id: stored.id, revoked: false },
      data: { revoked: true, replacedById: replacement.id, lastUsedAt: new Date() },
    });

    if (claimed.count === 0) {
      throw new Error("Refresh token already used");
    }

    return replacement;
  });

  return { userId: stored.userId, refreshToken: newPlain, tokenId: created.id };
}

export async function getUserIdFromRefreshToken(plainToken: string) {
  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashToken(plainToken) },
    select: { userId: true },
  });

  return stored?.userId ?? null;
}

export async function revokeAllRefreshTokens(userId: string) {
  await prisma.refreshToken.updateMany({
    where: { userId },
    data: { revoked: true },
  });
}
