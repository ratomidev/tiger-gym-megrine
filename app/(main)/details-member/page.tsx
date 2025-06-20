"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type MemberDetails = {
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

export default function MemberDetailsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [member, setMember] = useState<MemberDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID du membre non fourni");
      setLoading(false);
      return;
    }

    const fetchMember = async () => {
      try {
        const response = await fetch(`/api/members/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Impossible de récupérer les détails du membre"
          );
        }

        const data = await response.json();
        console.log("Données du membre reçues:", data);
        setMember(data);
      } catch (err) {
        console.error("Erreur lors du chargement des détails:", err);
        setError("Erreur lors du chargement des détails du membre");
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        Chargement des informations...
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-red-500">{error || "Membre non trouvé"}</div>
        <Button onClick={() => (window.location.href = "/list-member")}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div className="w-full max-w-6xl px-4 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Détails de l&apos;adhérent</h1>
          <Button
            onClick={() => (window.location.href = "/list-member")}
            className="bg-black hover:bg-gray-800 text-white"
          >
            Retour à la liste
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations Personnelles */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Informations personnelles
              </h2>{" "}
              {member.photoUrl && (
                <div className="mb-6 flex justify-center">
                  <Image
                    src={member.photoUrl}
                    alt={`${member.firstname} ${member.lastname}`}
                    width={128}
                    height={128}
                    className="w-32 h-32 object-cover rounded-full border-2 border-gray-200"
                  />
                </div>
              )}
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    N° d&apos;adhérent
                  </p>
                  <p className="font-medium">{member.membershipNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nom complet
                  </p>
                  <p className="font-medium">
                    {member.firstname} {member.lastname}
                  </p>
                </div>
                {member.sexe && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Sexe
                    </p>
                    <p className="font-medium">
                      {member.sexe === "male" ? "Homme" : "Femme"}
                    </p>
                  </div>
                )}
                {member.birthdate && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Date de naissance
                    </p>
                    <p className="font-medium">
                      {new Date(member.birthdate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {member.email && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Email
                    </p>
                    <p className="font-medium">{member.email}</p>
                  </div>
                )}
                {member.tel && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Téléphone
                    </p>
                    <p className="font-medium">{member.tel}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Adresse */}
            {member.address && (
              <div className="bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                  Adresse
                </h2>
                <div className="space-y-3">
                  {member.address.street && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Rue
                      </p>
                      <p className="font-medium">{member.address.street}</p>
                    </div>
                  )}
                  {member.address.city && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Ville
                      </p>
                      <p className="font-medium">{member.address.city}</p>
                    </div>
                  )}
                  {member.address.postalCode && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Code postal
                      </p>
                      <p className="font-medium">{member.address.postalCode}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Pays
                    </p>
                    <p className="font-medium">{member.address.country}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Abonnement et Services */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Abonnement
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Type d&apos;abonnement
                  </p>
                  <p className="font-medium">
                    {(() => {
                      switch (member.subscriptionType) {
                        case "monthly":
                          return "Mensuel";
                        case "quarterly":
                          return "Trimestriel";
                        case "biannual":
                          return "Semestriel";
                        case "annual":
                          return "Annuel";
                        default:
                          return member.subscriptionType;
                      }
                    })()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Date d&apos;inscription
                  </p>
                  <p className="font-medium">
                    {new Date(member.inscriptionDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Début de l&apos;abonnement
                  </p>
                  <p className="font-medium">
                    {new Date(
                      member.subscriptionStartDate
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Fin de l&apos;abonnement
                  </p>
                  <p className="font-medium">
                    {new Date(member.subscriptionEndDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Statut
                  </p>
                  <p
                    className={`font-medium px-2 py-1 rounded-full text-xs inline-block ${
                      member.subscriptionStatus === "actif"
                        ? "bg-green-100 text-green-800"
                        : member.subscriptionStatus === "expiré"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {member.subscriptionStatus}
                  </p>
                </div>
              </div>
            </div>

            {/* Services */}
            {member.services && (
              <div className="bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                  Services
                </h2>
                <ul className="space-y-2">
                  {member.services.musculation && (
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Musculation
                    </li>
                  )}
                  {member.services.cardio && (
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Cardio
                    </li>
                  )}
                  {member.services.fitness && (
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Fitness
                    </li>
                  )}
                  {member.services.boxing && (
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Boxe
                    </li>
                  )}
                  {member.services.yoga && (
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Yoga
                    </li>
                  )}
                  {!member.services.musculation &&
                    !member.services.cardio &&
                    !member.services.fitness &&
                    !member.services.boxing &&
                    !member.services.yoga && <li>Aucun service sélectionné</li>}
                </ul>
              </div>
            )}
          </div>

          {/* Informations médicales et Notes */}
          <div className="lg:col-span-1">
            {member.medicalRecord && (
              <div className="bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                  Informations médicales
                </h2>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Certificat médical
                    </p>
                    <p className="font-medium">
                      {member.medicalRecord.hasMedicalCertificate
                        ? "Fourni" +
                          (member.medicalRecord.medicalCertificateDate
                            ? ` (${new Date(
                                member.medicalRecord.medicalCertificateDate
                              ).toLocaleDateString()})`
                            : "")
                        : "Non fourni"}
                    </p>
                  </div>

                  {member.medicalRecord.allergies && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Allergies
                      </p>
                      <p className="font-medium">
                        {member.medicalRecord.allergies}
                      </p>
                    </div>
                  )}

                  {member.medicalRecord.healthIssues && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Problèmes de santé
                      </p>
                      <p className="font-medium">
                        {member.medicalRecord.healthIssues}
                      </p>
                    </div>
                  )}

                  {member.medicalRecord.contraindications && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Contre-indications
                      </p>
                      <p className="font-medium">
                        {member.medicalRecord.contraindications}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {member.notes && (
              <div className="bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                  Notes
                </h2>
                <p>{member.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Actions
              </h2>
              <div className="flex flex-col space-y-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    (window.location.href = `/edit-member?id=${member.id}`)
                  }
                  className="w-full justify-start"
                >
                  Modifier les informations
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700"
                >
                  Désactiver l&apos;adhérent
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
