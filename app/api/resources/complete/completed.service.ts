import { prisma } from "@/src/lib/prisma";

export async function completeResource(userId: string, resourceId: string) {
  return await prisma.userResourceProgress.upsert({
    where: {
      userId_resourceId: {
        userId,
        resourceId,
      },
    },
    update: {
      completedAt: new Date(),
    },
    create: {
      userId,
      resourceId,
    },
  });
}

export async function unCompleteResource(userId: string, resourceId: string) {
  return await prisma.userResourceProgress.delete({
    where: {
      userId_resourceId: {
        userId,
        resourceId,
      },
    },
  });
}
