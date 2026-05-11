import { CreateProblemDtoType } from "@/app/api/dtos/problem-sets/create-problem.dto";
import { prisma } from "@/src/lib/prisma";

export async function createProblem(
  data: CreateProblemDtoType,
  collectionId: string,
) {
  const orderIndex =
    (await prisma.problem.count({
      where: {
        collectionId: collectionId,
      },
    })) + 1;
  const collection = await prisma.problemCollection.findUnique({
    where: {
      id: collectionId,
    },
  });
  if (!collection) {
    throw new Error("Collection not found");
  }
  return await prisma.problem.create({
    data: {
      title: data.title,
      description: data.description,
      orderIndex: orderIndex,
      collectionId: collectionId,
    },
  });
}
