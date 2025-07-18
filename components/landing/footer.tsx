"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black py-12 border-t border-red-900/20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div>
                <div className="flex items-center space-x-0">
                  <div className="rounded-lg justify-center">
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
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Transformez votre corps et votre esprit dans la meilleure salle de
              sport de Megrine.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Liens Rapides</h4>
            <div className="space-y-2 text-sm">
              <Link
                href="/"
                onClick={(e) => {
                  // Vérifier si nous sommes déjà sur la page d'accueil
                  if (window.location.pathname === "/") {
                    e.preventDefault();
                    // Nous sommes sur la page d'accueil, donc juste défiler
                    const heroSection = document.getElementById("home");
                    heroSection?.scrollIntoView({ behavior: "smooth" });
                  }
                  // Si nous ne sommes pas sur la page d'accueil, laisser le comportement par défaut
                }}
                className="text-gray-400 hover:text-red-400 block"
              >
                Accueil
              </Link>
              <Link
                href="/#plans"
                className="text-gray-400 hover:text-red-400 block"
              >
                Formules d&apos;Abonnement
              </Link>
              <Link
                href="/#about"
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
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-red-500 flex-shrink-0" />
                <p>123 Avenue Habib Bourguiba, Megrine 2033, Tunisie</p>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-red-500 flex-shrink-0" />
                <p>+216 20 834 450</p>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-red-500 flex-shrink-0" />
                <p>info@tigergymmegrine.tn</p>
              </div>

              <div className="flex space-x-4 items-center mt-4 pt-2">
                <Link
                  href="https://www.facebook.com/profile.php?id=61573911387157"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="h-4 w-4 text-white" />
                </Link>
                <Link
                  href="https://www.instagram.com/tiger.gym.megrine/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
                >
                  <Instagram className="h-4 w-4 text-white" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-red-900/20 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm mb-2">
            © {new Date().getFullYear()} Tiger Gym Megrine. Tous droits
            réservés.
          </p>
          <p className="text-gray-500 text-xs flex items-center justify-center">
            Conçu et développé par
            <Link
              href="https://.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center ml-1 text-gray-400 hover:text-red-400 transition-colors"
            >
              {/* Ryxplore Logo */}
              <span className="text-red-500 font-semibold">Ryx</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
