import { prisma } from "@/src/lib/prisma";
import { CreateResourceDto } from "@/app/api/dtos/create-resource.dto";

export async function createResource(data: CreateResourceDto) {
  try {
    return await prisma.resource.create({
      data: {
        title: data.title,
        url: data.url,
        type: data.type,
        slug: data.slug,
        orderIndex: data.orderIndex,
      },
    });
  } catch {
    throw new Error("Slug already exists");
  }
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

  return resources.map((r) => ({
    id: r.id,
    title: r.title,
    url: r.url,
    type: r.type,
    slug: r.slug,
    orderIndex: r.orderIndex,
    createdAt: r.createdAt,
    completed: r.progressRecords.length > 0,
  }));
}
