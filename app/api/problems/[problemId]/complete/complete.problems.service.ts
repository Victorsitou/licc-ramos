import { prisma } from "@/src/lib/prisma";

export async function completeProblem(userId: string, id: string) {
  return await prisma.userProblemProgress.upsert({
    where: {
      userId_problemId: {
        userId,
        problemId: id,
      },
    },
    update: {
      completedAt: new Date(),
    },
    create: {
      userId,
      problemId: id,
    },
  });
}

export async function deleteProblemCompletion(userId: string, id: string) {
  return await prisma.userProblemProgress.delete({
    where: {
      userId_problemId: {
        userId,
        problemId: id,
      },
    },
  });
}
