export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}