import { hash, compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

/**
 * Password hashing settings
 * 12 rounds is recommended for bcrypt in 2023
 */
const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}

/**
 * Verify if a plain text password matches a hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

/**
 * Authenticate a user with email and password
 * Returns the user without password if successful, null otherwise
 */
export async function authenticateUser(email: string, password: string) {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      name: true,
      createdAt: true,
      updatedAt: true
    }
  });

  // No user found with that email
  if (!user) return null;

  // Verify password
  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) return null;

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Create a new user with a hashed password
 */
export async function createUser(email: string, password: string, name?: string) {
  const hashedPassword = await hashPassword(password);
  
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name || null,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true
    }
  });
}