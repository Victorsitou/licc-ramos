import { prisma } from "@/src/lib/prisma";

export async function getProblemSets() {
  return await prisma.problemSet.findMany({
    include: {
      problems: true,
    },
  });
}
