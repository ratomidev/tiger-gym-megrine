"use client";
import { useRef, useState, useEffect } from "react";
import MemberRegistrationForm from "@/components/landing/register-form";
import RegistrationSuccess from "@/components/landing/RegistrationSuccess";
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

import { AdherentFormValues } from "@/types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import Footer from "@/components/landing/footer";
import Navbar from "@/components/landing/navbar";

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
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Inscription - Tiger Gym";
  }, []);
  // Scroll to top when success component is rendered
  useEffect(() => {
    if (isSuccess) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isSuccess]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        isMobileMenuOpen
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

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
    <>
      <div className="relative min-h-screen overflow-hidden">
        <BackgroundCarousel />
        <div className="absolute inset-0 bg-black/50 z-5"></div>

        <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-sm border-b border-red-900/20">
          <Navbar />
        </header>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col items-center justify-center">
            {/* Conditionally render either the registration form or success message */}
            {isSuccess ? (
              <RegistrationSuccess onReset={handleReset} />
            ) : (
              <Card className="w-full max-w-3xl shadow-2xl border-white/10 bg-transparent ">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-3xl font-bold text-white mt-20">
                    Inscription Adhérent
                  </CardTitle>
                  <CardDescription className="text-white text-lg">
                    Remplissez le formulaire ci-dessous pour vous inscrire
                  </CardDescription>
                </CardHeader>

                <CardContent className="">
                  <MemberRegistrationForm
                    ref={adherentFormRef}
                    onUploadStateChange={setIsImageUploading}
                  />
                </CardContent>

                <CardFooter className="flex justify-end space-x-4 pt-6 pb-6">
                  <Button
                    className="bg-white hover:bg-gray-100 text-black px-8 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    onClick={handleSubmit}
                    disabled={isSubmitting || isImageUploading}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Envoi...
                      </>
                    ) : isImageUploading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Image en cours...
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
      <Footer />
    </>
  );
}
