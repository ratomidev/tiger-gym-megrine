import { prisma } from './prisma';
import { compare } from 'bcryptjs';

// Types
export type AuthError = {
  message: string;
}

export type User = {
  id: string;
  email: string;
  name?: string | null;
}

export type AuthResult = {
  user: User | null;
  error: AuthError | null;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return { 
        user: null, 
        error: { message: 'Invalid email or password.' } 
      };
    }

    // Verify password
    const passwordValid = await compare(password, user.password);
    
    if (!passwordValid) {
      return { 
        user: null, 
        error: { message: 'Invalid email or password.' } 
      };
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return { 
      user: userWithoutPassword as User, 
      error: null 
    };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      user: null, 
      error: { message: 'An unexpected error occurred during login.' } 
    };
  }
}

/**
 * Sign out current user
 * Note: With a custom implementation, you would handle this on the client
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  try {
    // In a custom implementation, you'd typically just clear cookies/storage
    // This is now just a placeholder function for API consistency
    return { error: null };
  } catch (error) {
    console.error('Signout error:', error);
    return { error: { message: 'An unexpected error occurred during sign out.' } };
  }
}

/**
 * Get current user from session
 * Note: You would need to implement session management
 */
export async function getCurrentUser(userId: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) return null;
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}