import { Subscription } from './subscription';

export interface Adherent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: Date;
  Address: string; // Note: Consider renaming to lowercase 'address' for consistency
  createdAt: Date; 
  isValidated: boolean;
  photoUrl?: string | null;
  sexe: 'M' | 'F'; // Using string literals for better type safety
  subscription?: Subscription | null; // Optional relation
}

// For forms and API requests
export interface AdherentFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: Date;
  Address: string;
  photoUrl?: string;
  sexe: 'M' | 'F';
  isValidated?: boolean; // Optional, might be set on backend
}

// For API responses with subscription data
export interface AdherentWithSubscription extends Adherent {
  subscription: Subscription;
}