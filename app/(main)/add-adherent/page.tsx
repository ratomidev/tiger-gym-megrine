"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { AdherentFormValues, SubscriptionFormValues } from "@/types";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import AdherentRegistrationForm from "@/components/member/form/MemberRegistrationForm";
import SubscriptionRegistrationForm from "@/components/subscription/subscriptionRegistrationForm";
import Link from "next/link";

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
        toast.error("Please fill in all required member information");
        setIsLoading(false);
        return;
      }

      // Get subscription data - always required now
      const subscriptionData =
        await subscriptionFormRef.current?.validateAndGetValues();
      if (!subscriptionData) {
        toast.error("Please fill in all required subscription information");
        setIsLoading(false);
        return;
      }

      // Submit with subscription
      await submitAdherentWithSubscription(adherentData, subscriptionData);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while saving", {
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
    const formData = new FormData();

    // Add adherent data
    formData.append("firstName", adherentData.firstName);
    formData.append("lastName", adherentData.lastName);
    formData.append("email", adherentData.email);
    formData.append("phone", adherentData.phone);
    formData.append(
      "birthDate",
      new Date(adherentData.birthDate).toISOString()
    );
    formData.append("Address", adherentData.Address);
    formData.append("sexe", adherentData.sexe);
    formData.append("hasSubscription", "true"); // Always true now

    // Add subscription data
    formData.append("plan", subscriptionData.plan);
    formData.append("price", subscriptionData.price.toString());
    formData.append(
      "startDate",
      new Date(subscriptionData.startDate).toISOString()
    );
    formData.append(
      "endDate",
      new Date(subscriptionData.endDate).toISOString()
    );
    formData.append("status", subscriptionData.status);
    formData.append(
      "hasCardioMusculation",
      subscriptionData.hasCardioMusculation.toString()
    );
    formData.append("hasCours", subscriptionData.hasCours.toString());

    // Add photo if present
    if ("photoFile" in adherentData && adherentData.photoFile) {
      formData.append("photo", adherentData.photoFile as File);
    }

    const response = await fetch("/api/adherents", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.success) {
      toast.success("Member registered successfully", {
        description: `${adherentData.firstName} ${adherentData.lastName} has been registered with a subscription.`,
      });

      setTimeout(() => {
        router.push("/list-adherent");
      }, 1500);
    } else {
      throw new Error(
        result.error || "Failed to register member with subscription"
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

      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/list-adherent">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Retour</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Ajouter un Adhérent</h1>
        </div>
      </div>

      {/* Forms Container */}
      <div className="space-y-6">
        {/* Member Information Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Informations Personnelles
            </CardTitle>
            <CardDescription>Détails de l&apos;adhérent</CardDescription>
          </CardHeader>
          <CardContent>
            <AdherentRegistrationForm ref={adherentFormRef} />
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Détails de l&apos;Abonnement
            </CardTitle>
            <CardDescription>Plan, durée et options</CardDescription>
          </CardHeader>
          <CardContent>
            <SubscriptionRegistrationForm ref={subscriptionFormRef} />
          </CardContent>
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
        </Card>
      </div>

      {/* Save Button - Sticky at Bottom */}
      <div className="sticky bottom-4 mt-8 pt-4 bg-white flex justify-end">
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-6 bg-black hover:bg-gray-800 text-white flex items-center gap-2"
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
