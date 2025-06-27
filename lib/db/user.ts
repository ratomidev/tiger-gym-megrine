import { prisma } from '../prisma';
import { User } from '../auth/types';

// Define a type that extends User to include password
type UserWithPassword = User & {
  password: string;
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
  
  // Create a shallow copy of the user object
  const userCopy = { ...user };
  
  // Remove the password property
  delete userCopy.password;
  
  // Return the modified copy
  return userCopy;
}

export function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true
    }
  });
}