import { Adherent } from "@prisma/client";

export interface Subscription {
  id: string;
  adherentId: string;
  startDate: Date;
  endDate: Date;
  plan: string;
  price: number; // Using number instead of Decimal for TypeScript
  status: string;
  hasCardioMusculation: boolean;
  hasCours: boolean;
  adherent?: Adherent; // Optional relation
}

// For forms and API requests
export interface SubscriptionFormValues {
  adherentId?: string; // Optional when creating via adherent relation
  startDate: Date;
  endDate: Date;
  plan: string;
  price: number;
  status: 'actif' | 'inactif' | 'suspendu' | 'expiré'; // Using string literals for better type safety
  hasCardioMusculation: boolean;
  hasCours: boolean;
}

// For API responses with adherent data
export interface SubscriptionWithAdherent extends Subscription {
  adherent: Adherent;
}