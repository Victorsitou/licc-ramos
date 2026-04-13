import { prisma } from "@/src/lib/prisma";
import { CreateResourceDto } from "@/app/api/dtos/create-resource.dto";

export async function createResource(data: CreateResourceDto) {
  return await prisma.resource.create({
    data: {
      title: data.title,
      url: data.url,
      type: data.type,
      slug: data.slug,
      orderIndex: data.orderIndex,
    },
  });
}
