import { prisma } from "@/src/lib/prisma";
import { CreateResourceDto } from "@/app/api/dtos/create-resource.dto";

export async function createResource(data: CreateResourceDto) {
  try {
    return await prisma.resource.create({
      data: {
        title: data.title,
        key: data.key,
        url: data.key,
        type: data.type,
        slug: data.slug,
        orderIndex: data.orderIndex,
      },
    });
  } catch {
    throw new Error("Slug already exists");
  }
}

export async function getClassesResources() {
  return await prisma.resource.findMany({
    where: { type: "CLASS" },
    orderBy: { orderIndex: "asc" },
  });
}

export async function getUserResources(userId: string) {
  const resources = await prisma.resource.findMany({
    orderBy: { orderIndex: "asc" },
    include: {
      progressRecords: {
        where: { userId },
        select: { completedAt: true },
      },
    },
  });

  return resources.map((r) => {
    const { progressRecords, ...rest } = r;

    return {
      ...rest,
      completed: progressRecords.length > 0,
      completedAt: progressRecords[0]?.completedAt || null,
    };
  });
}
