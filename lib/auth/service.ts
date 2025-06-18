import { compare } from 'bcryptjs';
import { findUserByEmail, findUserById, excludePassword } from '../db/user';
import { AuthResult, User } from './types';

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  try {
    // Find user by email
    const user = await findUserByEmail(email);

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

    return { 
      user: excludePassword(user), 
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

export async function getCurrentUser(userId: string): Promise<User | null> {
  try {
    const user = await findUserById(userId);
    return excludePassword(user);
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

export async function signOut(): Promise<{ error: { message: string } | null }> {
  // Client-side only operation in this implementation
  return { error: null };
}