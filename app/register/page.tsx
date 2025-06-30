"use client";
import { useRef, useState } from "react";
import MemberRegistrationForm from "@/components/member/form/MemberRegistrationForm";
import RegistrationSuccess from "@/components/member/RegistrationSuccess";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { AdherentFormValues } from "@/types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

/**
 * Public registration page for new gym members
 * Submits member data to the API without creating a subscription
 */
export default function RegisterPage() {
  // Use the same ref structure as in add-adherent page
  const adherentFormRef = useRef<{
    validateAndGetValues: () => Promise<AdherentFormValues | null>;
  }>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  /**
   * Handle form submission
   * - Validates form data
   * - Creates FormData object
   * - Submits to adherents API endpoint
   */
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Get adherent data using the correct method
      const adherentData =
        await adherentFormRef.current?.validateAndGetValues();

      if (!adherentData) {
        toast.error("Veuillez remplir toutes les informations requises");
        setIsSubmitting(false);
        return;
      }

      // Create request payload
      const payload = {
        ...adherentData,
        hasSubscription: false, // No subscription in public registration
      };

      // Send to API
      const response = await fetch("/api/adherents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Inscription réussie ! Votre demande a été envoyée.");
        setIsSuccess(true); // Show success component
      } else {
        throw new Error(
          result.error || "Une erreur s'est produite lors de l'inscription"
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Échec de l'inscription", {
        description:
          error instanceof Error
            ? error.message
            : "Veuillez réessayer plus tard",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset the form and show registration form again
  const handleReset = () => {
    setIsSuccess(false);
    // Force reload to reset all form fields
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col items-center justify-center">
        {/* Logo/Branding Area */}
        <div className="mb-3 text-center">
          <Image
            src="/images/logo.jpg"
            alt="Tiger Gym Megrine"
            width={120}
            height={120}
            className="mx-auto"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        {/* Conditionally render either the registration form or success message */}
        {isSuccess ? (
          <RegistrationSuccess onReset={handleReset} />
        ) : (
          <Card className="w-full max-w-3xl shadow-lg border-gray-200">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Inscription Adhérent
              </CardTitle>
              <CardDescription className="text-gray-600">
                Remplissez le formulaire ci-dessous pour vous inscrire
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
              <MemberRegistrationForm ref={adherentFormRef} />
            </CardContent>

            <CardFooter className="flex justify-end space-x-4 pt-2 pb-6">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  "S'inscrire"
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
