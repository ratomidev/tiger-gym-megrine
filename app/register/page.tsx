"use client";
import { useRef, useState } from "react";
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
import Image from "next/image";

import Router from "next/router";
import Link from "next/link";
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
  const handleRegisterClick = () => {
    Router.push("/register");
  };

  return (
    <>
      <div className="relative min-h-screen overflow-hidden">
        {/* Background with overlay */}
        <BackgroundCarousel />
        <div className="absolute inset-0 bg-black/50 z-5"></div>

        <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-sm border-b border-red-900/20">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-0">
              <div className="rounded-lg  justify-center ">
                <Image
                  src="/images/logo.png"
                  alt="Tiger Gym Logo"
                  width={400}
                  height={400}
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div className="">
                <h1 className="text-xl font-bold text-white">TIGER GYM</h1>
                <p className="text-xs text-red-400">MEGRINE</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link
                href="#home"
                className="text-white hover:text-red-400 transition-colors"
              >
                Accueil
              </Link>
              <Link
                href="#plans"
                className="text-white hover:text-red-400 transition-colors"
              >
                Abonnements
              </Link>
              <Link
                href="#about"
                className="text-white hover:text-red-400 transition-colors"
              >
                À Propos
              </Link>
            </nav>
            <Button
              onClick={handleRegisterClick}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Rejoindre
            </Button>
          </div>
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
      {/* Footer */}
      <footer className="bg-black py-12 border-t border-red-900/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div>
                  <div className="flex items-center space-x-0">
                    <div className="rounded-lg  justify-center ">
                      <Image
                        src="/images/logo.png"
                        alt="Tiger Gym Logo"
                        width={400}
                        height={400}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div className="">
                      <h1 className="text-xl font-bold text-white">
                        TIGER GYM
                      </h1>
                      <p className="text-xs text-red-400">MEGRINE</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Transformez votre corps et votre esprit dans la meilleure salle
                de sport de Megrine.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Liens Rapides</h4>
              <div className="space-y-2 text-sm">
                <Link
                  href="#home"
                  className="text-gray-400 hover:text-red-400 block"
                >
                  Accueil
                </Link>
                <Link
                  href="#plans"
                  className="text-gray-400 hover:text-red-400 block"
                >
                  Formules d&apos;Abonnement
                </Link>
                <Link
                  href="#about"
                  className="text-gray-400 hover:text-red-400 block"
                >
                  À Propos
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-400">Coaching Personnel</p>
                <p className="text-gray-400">Cours Collectifs</p>
                <p className="text-gray-400">Conseils Nutrition</p>
                <p className="text-gray-400">Services de Récupération</p>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">
                Informations de Contact
              </h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>123 Avenue Habib Bourguiba</p>
                <p>Megrine 2033, Tunisie</p>
                <p>+216 71 234 567</p>
                <p>info@tigergymmegrine.tn</p>
              </div>
            </div>
          </div>

          <div className="border-t border-red-900/20 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Tiger Gym Megrine. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
