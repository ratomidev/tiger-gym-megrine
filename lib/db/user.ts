import { prisma } from '../prisma';
import { User } from '../auth/types';

// Define a type that matches the Prisma User model
type UserWithPassword = {
  id: string;
  email: string;
  password: string;
  name: string | null;
  phone?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email }
  });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id }
  });
}

export function excludePassword(user: UserWithPassword | null): User | null {
  if (!user) return null;
  
  // Create a new user object with converted dates
  const userWithoutPassword: User = {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString()
  };
  
  return userWithoutPassword;
}

export function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      createdAt: true,
      updatedAt: true
    }
  });
}