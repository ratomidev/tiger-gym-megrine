"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { AdherentFormValues, SubscriptionFormValues } from "@/types";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import AdherentRegistrationForm from "@/components/member/form/MemberRegistrationForm";
import SubscriptionRegistrationForm from "@/components/subscription/subscriptionRegistrationForm";

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // References to form methods
  const adherentFormRef = useRef<{
    validateAndGetValues: () => Promise<AdherentFormValues | null>;
  }>(null);

  const subscriptionFormRef = useRef<{
    validateAndGetValues: () => Promise<SubscriptionFormValues | null>;
  }>(null);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Get adherent data
      const adherentData =
        await adherentFormRef.current?.validateAndGetValues();
      if (!adherentData) {
        toast.error(
          "Veuillez remplir toutes les informations requises du membre"
        );
        setIsLoading(false);
        return;
      }

      // Get subscription data - always required now
      const subscriptionData =
        await subscriptionFormRef.current?.validateAndGetValues();
      if (!subscriptionData) {
        toast.error(
          "Veuillez remplir toutes les informations requises de l'abonnement"
        );
        setIsLoading(false);
        return;
      }

      // Submit with subscription
      await submitAdherentWithSubscription(adherentData, subscriptionData);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Une erreur s'est produite lors de l'enregistrement", {
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const submitAdherentWithSubscription = async (
    adherentData: AdherentFormValues,
    subscriptionData: SubscriptionFormValues
  ) => {
    // Prepare the request payload
    const payload = {
      ...adherentData,
      hasSubscription: true,
      ...subscriptionData,
    };

    const response = await fetch("/api/adherents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (result.success) {
      toast.success("Membre enregistré avec succès", {
        description: `${adherentData.firstName} ${adherentData.lastName} a été enregistré avec un abonnement.`,
      });

      setTimeout(() => {
        router.push("/list-adherent");
      }, 1500);
    } else {
      throw new Error(
        result.error || "Échec de l'enregistrement du membre avec abonnement"
      );
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <Toaster
        position="top-right"
        toastOptions={{
          className: "rounded-md",
          // @ts-expect-error - sonner types are not complete
          success: {
            className: "bg-green-50 text-green-800 border-green-500",
            descriptionClassName: "text-green-700",
          },
          error: {
            className: "bg-red-50 text-red-800 border-red-500",
            descriptionClassName: "text-red-700",
          },
        }}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ajouter un Adhérent</h1>
      </div>

      {/* Forms Container */}
      <div className="space-y-12">
        {/* Member Information Section */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-medium mb-1">
            Informations Personnelles
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Détails de l&apos;adhérent
          </p>
          <div className="mt-6">
            <AdherentRegistrationForm ref={adherentFormRef} />
          </div>
        </div>

        {/* Subscription Section */}
        <div className="bg-white rounded-lg p-6 relative border border-gray-200">
          <h2 className="text-lg font-medium mb-1">
            Détails de l&apos;Abonnement
          </h2>
          <p className="text-sm text-gray-500 mb-4">Plan, durée et options</p>
          <div className="mt-6">
            <SubscriptionRegistrationForm ref={subscriptionFormRef} />
          </div>
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-md">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 rounded-full border-2 border-black border-t-transparent animate-spin"></div>
                <p className="text-sm font-medium text-gray-600">
                  Chargement...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button - Sticky at Bottom */}
      <div className="sticky bottom-4 mt-10 pt-4 bg-white flex justify-end">
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-8 py-6 bg-black hover:bg-gray-800 text-white flex items-center gap-2 shadow-md"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Enregistrer l&apos;adhérent
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
