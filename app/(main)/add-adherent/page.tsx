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
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);

  // References to form methods
  const adherentFormRef = useRef<{
    validateAndGetValues: () => Promise<AdherentFormValues | null>;
    getUploadingState?: () => boolean;
  }>(null);

  const subscriptionFormRef = useRef<{
    validateAndGetValues: () => Promise<SubscriptionFormValues | null>;
  }>(null);

  const handleSubmit = async () => {
    // Check if photo is still uploading
    if (isPhotoUploading) {
      toast.error("Veuillez attendre que la photo soit téléchargée");
      return;
    }

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
      toast.error("Une erreur s'est produite lors de l'enregistrement.", {
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
            className:
              "bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200 border-green-500",
            descriptionClassName: "text-green-700 dark:text-green-300",
          },
          error: {
            className:
              "bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200 border-red-500",
            descriptionClassName: "text-red-700 dark:text-red-300",
          },
        }}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground dark:text-white">
          Ajouter un Adhérent
        </h1>
      </div>

      {/* Forms Container */}
      <div className="space-y-12 mb-24">
        {/* Member Information Section */}
        <div className="bg-card dark:bg-gray-900 rounded-lg p-6 border border-border dark:border-gray-800 shadow-sm dark:shadow-lg">
          <h2 className="text-lg font-medium mb-1 text-foreground dark:text-white">
            Informations Personnelles
          </h2>
          <p className="text-sm text-muted-foreground dark:text-gray-400 mb-4">
            Détails de l&apos;adhérent
          </p>
          <div className="mt-6">
            <AdherentRegistrationForm
              ref={adherentFormRef}
              onUploadStateChange={setIsPhotoUploading}
            />
          </div>
        </div>

        {/* Subscription Section */}
        <div className="bg-card dark:bg-gray-900 rounded-lg p-6 relative border border-border dark:border-gray-800 shadow-sm dark:shadow-lg">
          <h2 className="text-lg font-medium mb-1 text-foreground dark:text-white">
            Détails de l&apos;Abonnement
          </h2>
          <p className="text-sm text-muted-foreground dark:text-gray-400 mb-4">
            Plan, durée et options
          </p>
          <div className="mt-6">
            <SubscriptionRegistrationForm ref={subscriptionFormRef} />
          </div>
          {(isLoading || isPhotoUploading) && (
            <div className="absolute inset-0 bg-background/70 dark:bg-black/70 flex items-center justify-center rounded-md">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 rounded-full border-2 border-primary dark:border-white border-t-transparent animate-spin"></div>
                <p className="text-sm font-medium text-foreground dark:text-gray-200">
                  {isPhotoUploading
                    ? "Téléchargement de la photo..."
                    : "Chargement..."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Save Button */}
      <Button
        size="lg"
        onClick={handleSubmit}
        disabled={isLoading || isPhotoUploading}
        className="fixed bottom-8 right-8 px-8 py-6 bg-primary hover:bg-primary/90 dark:bg-blue-600 dark:hover:bg-blue-700 text-primary-foreground flex items-center gap-2 shadow-xl rounded-full z-50"
      >
        {isLoading || isPhotoUploading ? (
          <>
            <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin mr-2"></div>
            {isPhotoUploading ? "Téléchargement..." : "Enregistrement..."}
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Enregistrer l&apos;adhérent
          </>
        )}
      </Button>
    </div>
  );
}
