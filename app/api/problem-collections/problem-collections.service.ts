import { prisma } from "@/src/lib/prisma";
import { CreateProblemCollectionDtoType } from "../dtos/problem-sets/create-problem-collection.dto";
import { UpdateProblemCollectionDtoType } from "../dtos/problem-sets/update-problem-collection.dto";

export async function getProblemCollections() {
  return await prisma.problemCollection.findMany({
    include: {
      problems: true,
    },
  });
}

export async function getProblemCollectionById(id: string) {
  return await prisma.problemCollection.findUnique({
    where: {
      id: id,
    },
    include: {
      problems: true,
    },
  });
}

export async function createProblemCollection(
  data: CreateProblemCollectionDtoType,
) {
  const orderIndex =
    (await prisma.problemCollection.count({
      where: {
        type: data.type,
      },
    })) + 1;
  return await prisma.problemCollection.create({
    data: {
      title: data.title,
      description: data.description,
      orderIndex: orderIndex,
      type: data.type,
      problems: {},
    },
  });
}

export async function updateProblemCollection(
  id: string,
  data: UpdateProblemCollectionDtoType,
) {
  return await prisma.problemCollection.update({
    where: {
      id: id,
    },
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
    },
  });
}

export async function deleteProblemCollection(id: string) {
  return await prisma.problemCollection.delete({
    where: {
      id: id,
    },
  });
}
