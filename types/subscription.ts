import { Adherent } from "@prisma/client";

export interface Subscription {
  id: string;
  adherentId: string;
  startDate: Date;
  endDate: Date;
  plan: string;
  price: number; 
  remaining: number; // New field
  status: string;
  hasCardioMusculation: boolean;
  hasCours: boolean;
  adherent?: Adherent;
}

// For forms and API requests
export interface SubscriptionFormValues {
  adherentId?: string;
  startDate: Date;
  endDate: Date;
  plan: string;
  price: number;
  remaining?: number; // Optional with default value of 0
  status: 'actif' | 'expiré';
  hasCardioMusculation: boolean;
  hasCours: boolean;
}

// For API responses with adherent data
export interface SubscriptionWithAdherent extends Subscription {
  adherent: Adherent;
}