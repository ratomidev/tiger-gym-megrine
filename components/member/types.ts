export type Member = {
  id: string;
  membershipNumber: string;
  firstname: string;
  lastname: string;
  email: string | null;
  tel: string | null;
  sexe: string | null;
  subscriptionType: string;
  subscriptionStatus: string;
  subscriptionEndDate: string;
};
