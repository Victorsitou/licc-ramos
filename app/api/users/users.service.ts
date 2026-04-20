import { prisma } from "@/src/lib/prisma";
import { CreateUserDto } from "../dtos/user.dto";
import bcrypt from "bcryptjs";

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id: id },
    omit: { passwordHash: true },
  });
}

export async function getUserByEmail(email: string) {
  email = email.toLowerCase().trim();
  return await prisma.user.findUnique({
    where: { email: email },
    omit: { passwordHash: true },
  });
}

export async function getUserByEmailUser(emailUser: string) {
  emailUser = emailUser.toLowerCase().trim();

  return await prisma.user.findFirst({
    where: { email: emailUser },
    omit: { passwordHash: true },
  });
}

export async function createUser(data: CreateUserDto) {
  data.email = data.email.toLowerCase().trim();
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const username = data.email.split("@")[0];
  return prisma.user.create({
    data: {
      name: data.name,
      email: username,
      passwordHash: hashedPassword,
    },
    omit: {
      passwordHash: true,
    },
  });
}

export async function verifyUser(userId: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: { verified: true },
    omit: { passwordHash: true },
  });
}
