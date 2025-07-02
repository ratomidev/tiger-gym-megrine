import { prisma } from "@/lib/prisma";
import { User } from "@/types/auth";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { nanoid } from "nanoid";
import { Role } from "@prisma/client";

/**
 * Password hashing settings
 * 12 rounds is recommended for bcrypt in 2023
 */


/**
 * Web Crypto API compatible password hashing (works in Edge Runtime)
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const hashedInput = await hashPassword(password);
  return hashedInput === hashedPassword;
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
      updatedAt: true,
    },
  });

  // No user found with that email
  if (!user) return null;

  // Verify password
  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) return null;

  // Return user without password
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Create a new user with a hashed password
 */
export async function createUser(
  email: string,
  password: string,
  name?: string,
  role: Role = Role.STAFF
) {
  const hashedPassword = await hashPassword(password);

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name || null,
      role,
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

/**
 * Secret key for signing JWTs - should be in .env
 */
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-min-32-chars-long-for-security"
);

/**
 * Session duration - 8 hours in seconds
 */
export const SESSION_DURATION = 8 * 60 * 60; // 8 hours

/**
 * Create a session token for a user
 */
export async function createSessionToken(user: User): Promise<string> {
  // Create a JWT that expires after SESSION_DURATION
  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + SESSION_DURATION)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify and decode a session token
 */
export async function verifySessionToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.user as User;
  } catch {
    // Token is invalid or expired
    return null;
  }
}

/**
 * Get the current user from the session
 */
export async function getCurrentUser(): Promise<User | null> {
  // Fix: Await the cookies() function before using it
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie?.value) {
    return null;
  }

  return verifySessionToken(sessionCookie.value);
}

/**
 * Set the session cookie
 */
export async function setSessionCookie(token: string) {
  // Fix: Await the cookies() function
  const cookieStore = await cookies();
  cookieStore.set({
    name: "session",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_DURATION,
    path: "/",
  });
}

/**
 * Clear the session cookie
 */
export async function clearSessionCookie() {
  // Fix: Await the cookies() function
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
