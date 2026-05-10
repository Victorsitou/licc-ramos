import { prisma } from "@/src/lib/prisma";
import { CreateProblemSetDtoType } from "../dtos/problem-sets/create-problem-set.dto";

export async function getProblemSets() {
  return await prisma.problemSet.findMany({
    include: {
      problems: true,
    },
  });
}

export async function createProblemSet(data: CreateProblemSetDtoType) {
  const orderIndex = (await prisma.problemSet.count()) + 1;
  return await prisma.problemSet.create({
    data: {
      title: data.title,
      description: data.description,
      orderIndex: orderIndex,
      problems: {},
    },
  });
}
