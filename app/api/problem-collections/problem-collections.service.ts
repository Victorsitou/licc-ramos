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

export async function getProblemCollectionById(
  collectionId: string,
  userId: string,
) {
  const collection = await prisma.problemCollection.findUnique({
    where: {
      id: collectionId,
    },
    include: {
      problems: {
        orderBy: {
          orderIndex: "asc",
        },
        include: {
          progressRecords: {
            where: {
              userId,
            },
          },
        },
      },
    },
  });

  if (!collection) return null;

  const problems = collection.problems.map((problem) => ({
    id: problem.id,
    title: problem.title,
    description: problem.description,
    orderIndex: problem.orderIndex,

    completed: problem.progressRecords.length > 0,
  }));

  const completed = problems.filter((p) => p.completed).length;

  return {
    ...collection,
    problems,

    progress: {
      completed,
      total: problems.length,
      percentage:
        problems.length === 0
          ? 0
          : Math.round((completed / problems.length) * 100),
    },
  };
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
