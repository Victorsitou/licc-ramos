import { Prisma } from "@/src/generated/prisma";
import { prisma } from "@/src/lib/prisma";
import { CreateResourceDto } from "@/app/api/dtos/create-resource.dto";

export async function createResource(data: CreateResourceDto) {
  try {
    const lastOrderIndex = await prisma.resource.findFirst({
      where: { type: data.type, slug: data.slug },
      orderBy: { orderIndex: "desc" },
      select: { orderIndex: true },
    });
    return await prisma.resource.create({
      data: {
        title: data.title,
        key: data.key,
        url: data.key,
        type: data.type,
        slug: data.slug,
        orderIndex:
          lastOrderIndex && lastOrderIndex.orderIndex !== null
            ? lastOrderIndex.orderIndex + 1
            : data.orderIndex || 0,
      },
    });
  } catch {
    throw new Error("Slug already exists");
  }
}

type Filters = {
  slug?: string | null;
  type?: "CLASS" | "WORKSHOP" | "AYUDANTIA" | null;
  orderIndex?: number | null;
};

function buildResourceWhere(
  filters: Filters,
  forceType?: "CLASS" | "WORKSHOP" | "AYUDANTIA",
) {
  return {
    ...(forceType && { type: forceType }),

    ...(!forceType && filters.type && { type: filters.type }),

    ...(filters.slug && {
      slug: { equals: filters.slug, mode: Prisma.QueryMode.insensitive },
    }),

    ...(filters.orderIndex !== undefined &&
      filters.orderIndex !== null && {
        orderIndex: filters.orderIndex,
      }),
  };
}

export async function getClassesResources(filters: Filters = {}) {
  const where = buildResourceWhere(filters, "CLASS");

  return await prisma.resource.findMany({
    where,
    orderBy: { orderIndex: "asc" },
  });
}

export async function getUserResources(userId: string, filters: Filters = {}) {
  const where = buildResourceWhere(filters);
  const resources = await prisma.resource.findMany({
    where,
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
