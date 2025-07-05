"use client";
import { useRef, useState } from "react";
import MemberRegistrationForm from "@/components/landing/register-form";
import RegistrationSuccess from "@/components/member/RegistrationSuccess";
import BackgroundCarousel from "@/components/landing/background-carousel";
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
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with overlay */}
      <BackgroundCarousel />
      <div className="absolute inset-0 bg-black/50 z-5"></div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col items-center justify-center">
          {/* Logo/Branding Area */}
          <div className="mb-6 text-center">
            <Image
              src="/images/logo.jpg"
              alt="Tiger Gym Megrine"
              width={120}
              height={120}
              className="mx-auto rounded-full border-4 border-white/20 shadow-2xl"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          {/* Conditionally render either the registration form or success message */}
          {isSuccess ? (
            <RegistrationSuccess onReset={handleReset} />
          ) : (
            <Card className="w-full max-w-3xl shadow-2xl border-white/10 bg-white/95 backdrop-blur-lg">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
                  Inscription Adhérent
                </CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  Remplissez le formulaire ci-dessous pour vous inscrire
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4">
                <MemberRegistrationForm ref={adherentFormRef} />
              </CardContent>

              <CardFooter className="flex justify-end space-x-4 pt-6 pb-6">
                <Button
                  className="bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white px-8 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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
    </div>
  );
}
