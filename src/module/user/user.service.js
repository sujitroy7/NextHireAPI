import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma.js";

export const createUser = async (data, prismaClient = prisma) => {
  const alreadyExist = await prismaClient.user.findUnique({
    where: { email: data.email },
  });

  if (alreadyExist) throw new Error("User already exists");

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prismaClient.user.create({
    data: {
      email: data.email,
      passwordHash,
      userType: data.userType,
    },
    select: {
      id: true,
      email: true,
      userType: true,
      createdAt: true,
    },
  });
  return user;
};

export const getUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      phone: true,
      userType: true,
      addressId: true,
      createdAt: true,
    },
  });
};

export const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      phone: true,
      userType: true,
      addressId: true,
      createdAt: true,
    },
  });
};
