"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import {
  Users,
  Clock,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Check,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TigerGymLanding() {
  const router = useRouter();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselImages = [
    "/images/photo3v3.png",
    "/images/photo1.jpg",
    "/images/photo2v3.png",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const handleRegisterClick = () => {
    router.push("/register");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
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

      {/* Hero Section with Carousel */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          {carouselImages.map((src, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-1500 ${
                carouselIndex === i ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={src}
                alt={`Fond de Gym ${i + 1}`}
                fill
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-red-900/40"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 -mt-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            LIBÉREZ VOTRE
            <span className="block text-red-500">TIGRE INTÉRIEUR</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Transformez votre corps et votre esprit dans l&apos;installation de
            fitness la plus avancée de Megrine. Là où les champions sont
            façonnés.
          </p>
        </div>

        <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
          <div className="grid grid-cols-3 gap-5 text-center">
            <div>
              <div className="text-3xl font-bold text-red-500">100+</div>
              <div className="text-sm text-gray-400">Membres Actifs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-500">5+</div>
              <div className="text-sm text-gray-400">
                Entraineurs professionels
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-500">24/7</div>
              <div className="text-sm text-gray-400">Accès Disponible</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Pourquoi Choisir Tiger Gym?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Découvrez la différence avec nos installations de classe mondiale
              et nos entraîneurs experts
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-black border-red-900/20 text-white">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Équipement Premium</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-center">
                  Équipement de fitness à la pointe de la technologie des
                  meilleures marques pour des résultats d&apos;entraînement
                  optimaux
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black border-red-900/20 text-white">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Entraîneurs Experts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-center">
                  Entraîneurs personnels certifiés dédiés à vous aider à
                  atteindre vos objectifs de fitness
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black border-red-900/20 text-white">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Accès 24/7</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-center">
                  Entraînez-vous selon votre emploi du temps avec un accès à la
                  salle 24h/24 pour les membres premium
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Formules d&apos;Abonnement
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Choisissez la formule parfaite qui correspond à votre parcours
              fitness et à votre budget
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* 2+1 Mois Plan */}
            <Card className="bg-gray-900 border-gray-700 text-white relative">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">3 Mois</CardTitle>
                <CardDescription className="text-gray-400">
                  (1 mois gratuit)
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">200</span>
                  <span className="text-gray-400"> TND</span>
                  <div className="text-sm mt-1 text-gray-400">
                    (3 mois d&apos;accès)
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Accès à la salle (7h - 22h)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Accès aux équipements de musculation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Accès aux cours collectifs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>1 mois offert (valeur 100 TND)</span>
                </div>
              </CardContent>
            </Card>

            {/* 3+1 Mois Plan */}
            <Card className="bg-red-600 border-red-500 text-white relative transform scale-105 z-10">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-yellow-500 text-black px-4 py-1">
                  <Star className="h-4 w-4 mr-1" />
                  Le Plus Populaire
                </Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">4 Mois</CardTitle>
                <CardDescription className="text-red-100">
                  (1 mois gratuit)
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">250</span>
                  <span className="text-red-100"> TND</span>
                  <div className="text-sm mt-1 text-red-200">
                    (4 mois d&apos;accès)
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-white" />
                  <span>Accès à la salle (7h - 22h)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-white" />
                  <span>Accès aux équipements premium</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-white" />
                  <span>Cours collectifs illimités</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-white" />
                  <span>1 mois offert (valeur 100 TND)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-white" />
                  <span>Économisez 150 TND</span>
                </div>
              </CardContent>
            </Card>

            {/* Promo Matinale */}
            <Card className="bg-gray-900 border-gray-700 text-white relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-500 text-white px-4 py-1">
                  <Clock className="h-4 w-4 mr-1" />
                  Promo Matinale
                </Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">3 Mois Matinale</CardTitle>
                <CardDescription className="text-gray-400">
                  Coaching privé inclus
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">200</span>
                  <span className="text-gray-400"> TND</span>
                  <div className="text-sm mt-1 text-gray-400">
                    (Accès de 7h à 12h)
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Accès à la salle (7h - 12h)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Tous les équipements disponibles</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>8 séances de coaching privé</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Valeur du coaching: 200 TND</span>
                </div>
              </CardContent>
            </Card>

            {/* 6 Mois Plan */}
            <Card className="bg-gray-900 border-gray-700 text-white relative md:col-span-1 lg:col-span-1 md:transform md:scale-100 lg:scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white px-4 py-1">
                  <span className="font-bold mr-1">-50%</span> Réduction
                </Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">6 Mois</CardTitle>
                <CardDescription className="text-gray-400">
                  Prix exceptionnel
                </CardDescription>
                <div className="mt-4">
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-bold">360</span>
                    <span className="text-gray-400"> TND</span>
                  </div>
                  <div className="text-sm line-through text-gray-500 mt-1">
                    720 TND
                  </div>
                  <div className="text-sm mt-1 text-green-500">
                    Économisez 360 TND
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Accès illimité à la salle</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Tous les équipements inclus</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Cours collectifs illimités</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Accès prioritaire aux nouveautés</span>
                </div>
              </CardContent>
            </Card>

            {/* Annuel Plan */}
            <Card className="bg-gradient-to-br from-red-900 to-black border-red-700 text-white relative md:col-span-2 lg:col-span-1">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-yellow-500 to-red-500 text-white px-4 py-1">
                  <span className="font-bold mr-1">OFFRE SPÉCIALE</span>
                </Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">12 Mois</CardTitle>
                <CardDescription className="text-red-300">
                  Notre meilleure offre
                </CardDescription>
                <div className="mt-4">
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-bold">600</span>
                    <span className="text-red-300"> TND</span>
                  </div>
                  <div className="text-sm line-through text-gray-500 mt-1">
                    1200 TND
                  </div>
                  <div className="text-sm mt-1 text-green-400">
                    Économisez 600 TND
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-400" />
                  <span>Accès illimité 24h/24, 7j/7</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-400" />
                  <span>1 mois supplémentaire gratuit</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-400" />
                  <span>12 séances de coaching privé</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-400" />
                  <span>Valeur coaching: 300 TND</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-400" />
                  <span>Accès VIP à tous les services</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              À Propos de Tiger Gym Megrine
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Situé au cœur de Megrine, Tiger Gym est la destination fitness de
              référence depuis plus de 5 ans, aidant des milliers de personnes à
              transformer leur vie grâce au fitness.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Map Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-4">Nous Trouver</h3>
              <div className="bg-black rounded-lg p-6 border border-red-900/20">
                <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d815.3051845379553!2d10.221998754812208!3d36.775068186080915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDQ2JzMwLjIiTiAxMMKwMTMnMTkuMiJF!5e0!3m2!1sfr!2stn!4v1626432971783!5m2!1sfr!2stn"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Tiger Gym Megrine"
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-3 mt-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-red-500" />
                    <span>123 Avenue Habib Bourguiba, Megrine 2033</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-red-500" />
                    <span>+216 20 834 450</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-red-500" />
                    <span>info@tigergymmegrine.tn</span>
                  </div>
                </div>
              </div>
            </div>

            {/* About Content & Social Media */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Notre Histoire</h3>
                <p className="text-gray-400 mb-4">
                  Tiger Gym Megrine a été fondé avec une mission simple : créer
                  une communauté fitness où chacun se sent accueilli et
                  encouragé à atteindre ses objectifs. Notre installation à la
                  pointe combine équipements dernier cri et accompagnement
                  expert.
                </p>
                <p className="text-gray-400">
                  Que vous soyez débutant faisant vos premiers pas dans le
                  fitness ou un athlète aguerri repoussant vos limites, notre
                  équipe d&apos;entraîneurs certifiés est là pour soutenir votre
                  parcours à chaque étape.
                </p>
              </div>

              {/* Social Media Links */}
              <div>
                <h3 className="text-2xl font-bold mb-4">Suivez-Nous</h3>
                <p className="text-gray-400 mb-6">
                  Restez connecté et recevez quotidiennement motivation,
                  conseils d&apos;entraînement et actualités de Tiger Gym
                  Megrine.
                </p>
                <div className="flex space-x-4 items-center justify-center">
                  <Link
                    href="https://www.facebook.com/profile.php?id=61573911387157"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="h-6 w-6 text-white" />
                  </Link>
                  <Link
                    href="https://www.instagram.com/tiger.gym.megrine/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
                  >
                    <Instagram className="h-6 w-6 text-white" />
                  </Link>
                </div>
              </div>

              {/* Operating Hours */}
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  Horaires d&apos;Ouverture
                </h3>
                <div className="space-y-2 text-gray-400">
                  <div className="flex justify-between">
                    <span>Lundi - Vendredi</span>
                    <span>7h00 - 22h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samedi - Dimanche</span>
                    <span>7h00 - 17h00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Prêt à Commencer Votre Transformation?
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Rejoignez Tiger Gym Megrine aujourd&apos;hui et devenez membre de
            notre famille fitness. Votre meilleure version vous attend.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 text-lg"
            >
              Essai Gratuit
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-red-600 px-8 py-4 text-lg bg-transparent"
            >
              Visiter la Salle
            </Button>
          </div>
        </div>
      </section>

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
    </div>
  );
}
