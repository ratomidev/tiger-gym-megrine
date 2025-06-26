// MemberDetailsPage.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Loading from "./loading";
import { MemberInfoCard } from "@/components/member/details/MemberInfoCard";
import AddressCard from "@/components/member/details/AddressCard";
import SubscriptionCard from "@/components/member/details/SubscriptionCard";
import ServicesCard from "@/components/member/details/ServicesCard";
import MedicalInfoCard from "@/components/member/details/MedicalInfoCard";
import NotesCard from "@/components/member/details/NotesCard";
import ActionsCard from "@/components/member/details/ActionsCard";
import { Member } from "@/types/Member";

export default function MemberDetailsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [member, setMember] = useState<Member | null>(null);
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
          throw new Error(errorData.error || "Erreur de récupération");
        }
        const data = await response.json();
        setMember(data);
      } catch (err) {
        console.log(err);
        setError("Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  if (loading) return <Loading />;
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
    <div className="w-full max-w-6xl px-4 mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Détails de l&apos;adhérent</h1>
        <Button onClick={() => (window.location.href = "/list-member")}>
          Retour à la liste
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <MemberInfoCard member={member} />
          <AddressCard member={member} />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <SubscriptionCard member={member} />
          <ServicesCard member={member} />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <MedicalInfoCard member={member} />
          <NotesCard member={member} />
          <ActionsCard member={member} />
        </div>
      </div>
    </div>
  );
}
