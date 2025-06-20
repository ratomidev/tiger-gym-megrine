export type AuthError = {
  message: string;
}

export type User = {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AuthResult = {
  user: User | null;
  error: AuthError | null;
}