export type Member = {
  id: string;
  membershipNumber: string;
  firstname: string;
  lastname: string;
  email: string | null;
  tel: string | null;
  sexe: string | null;
  birthdate: string | null;
  photoUrl: string | null;

  // Address
  address: {
    street: string | null;
    city: string | null;
    postalCode: string | null;
    country: string;
  } | null;

  // Subscription
  inscriptionDate: string;
  subscriptionType: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  subscriptionStatus: string;

  // Services
  services: {
    musculation: boolean;
    cardio: boolean;
    fitness: boolean;
    boxing: boolean;
    yoga: boolean;
  } | null;

  // Medical
  medicalRecord: {
    medicalCertificateDate: string | null;
    hasMedicalCertificate: boolean;
    medicalCertificateUrl: string | null;
    allergies: string | null;
    healthIssues: string | null;
    specialPermissions: string | null;
    contraindications: string | null;
  } | null;

  // Notes
  notes: string | null;

  // Timestamps
  createdAt: string;
  updatedAt: string;
};
