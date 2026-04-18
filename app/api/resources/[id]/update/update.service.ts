import { prisma } from "@/src/lib/prisma";
import { CreateResourceDto } from "@/app/api/dtos/create-resource.dto";

export async function updateResource(
  id: string,
  data: Partial<CreateResourceDto>,
) {
  return prisma.resource.update({
    where: { id },
    data,
  });
}
