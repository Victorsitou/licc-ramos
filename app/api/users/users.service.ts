import { prisma } from "@/src/lib/prisma";
import { CreateUserDto } from "../dtos/user.dto";
import bcrypt from "bcryptjs";

export async function getUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id: id },
  });
}

export async function createUser(data: CreateUserDto) {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: hashedPassword,
    },
  });
}
