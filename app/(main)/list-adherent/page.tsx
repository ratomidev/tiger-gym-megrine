"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MemberTable } from "@/components/member/table/AdherentTable";
import { Toaster } from "sonner";
import Loading from "./loading";
import { Adherent } from "@/types";

export default function MemberListPage() {
  const [adherents, setAdherents] = useState<Adherent[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Set page title
  useEffect(() => {
    document.title = "Liste des Adhérents - Tiger Gym";
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/adherents");
        if (!response.ok) {
          throw new Error("Failed to fetch members");
        }
        const data = await response.json();
        if (data.success && data.adherents) {
          setAdherents(data.adherents);
          console.log("Fetched members:", data.adherents);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleDataUpdate = (updatedData: Adherent[]) => {
    setAdherents(updatedData);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full max-w-6xl px-4 mx-auto py-6">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Liste des Adhérents</h1>
        <Button
          onClick={() => router.push("/add-adherent")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Ajouter un adhérent
        </Button>
      </div>

      {adherents.length > 0 ? (
        <MemberTable data={adherents} onDataUpdate={handleDataUpdate} />
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">Aucun adhérent trouvé</p>
        </div>
      )}
    </div>
  );
}
