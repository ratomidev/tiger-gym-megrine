"use client";

import Navbar from "@/components/landing/navbar";
import BackgroundCarousel from "@/components/landing/background-carousel";
import {
  MapPin,
  User,
  Dumbbell,
  Heart,
  Star,
  Users,
  Clock,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with overlay */}
      <BackgroundCarousel />
      <div className="absolute inset-0 bg-black/60 z-5"></div>

      {/* Navigation */}
      <div className="relative z-100">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-32 h-32 mb-8 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 backdrop-blur-md rounded-full border border-white/20 shadow-2xl">
            <span className="text-6xl">🐯</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Tiger Gym
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light max-w-3xl mx-auto leading-relaxed">
            Centre de Remise en Forme & Musculation
          </p>
          <div className="mt-8 w-24 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 mx-auto rounded-full"></div>
        </div>

        {/* Mission Statement */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 shadow-2xl">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                Notre Mission
              </h2>
              <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed">
                Rejoignez votre salle de musculation pour atteindre vos
                objectifs
              </p>
              <div className="mt-8 flex justify-center">
                <div className="flex space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-6 h-6 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 max-w-6xl mx-auto">
          {/* Cardio Service */}
          <div className="group">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-400/30">
                    <Heart className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Cardio Mixte
                  </h3>
                  <p className="text-white/80 text-lg leading-relaxed mb-4">
                    Entraînement cardiovasculaire complet pour améliorer votre
                    endurance et votre condition physique générale.
                  </p>
                  <div className="flex items-center space-x-4 text-white/60">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Sessions flexibles</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Cours collectifs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Musculation Service */}
          <div className="group">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-orange-500/20 rounded-xl flex items-center justify-center border border-orange-400/30">
                    <Dumbbell className="w-8 h-8 text-orange-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Musculation Professionnelle
                  </h3>
                  <p className="text-white/80 text-lg leading-relaxed mb-4">
                    Équipements de pointe et programmes personnalisés pour
                    développer votre force et votre masse musculaire.
                  </p>
                  <div className="flex items-center space-x-4 text-white/60">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">Équipements haut de gamme</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span className="text-sm">Coaching personnalisé</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Founder & Location Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {/* Founder */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-400/30">
                <User className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Fondateur</h3>
              <p className="text-xl text-white/90 font-medium mb-4">
                @amirlajmi
              </p>
              <p className="text-white/70 leading-relaxed">
                Passionné de fitness et expert en musculation, dédié à vous
                accompagner dans votre transformation physique.
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-400/30">
                <MapPin className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Localisation
              </h3>
              <p className="text-xl text-white/90 font-medium mb-4">Megrine</p>
              <p className="text-white/70 leading-relaxed">
                Située à côté du padel Megrine, dans un environnement sportif
                dynamique et facilement accessible.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Rejoignez Tiger Gym
            </h3>
            <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
              Transformez votre corps, dépassez vos limites et atteignez vos
              objectifs avec notre équipe d&apos;experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="/register"
                className="group relative bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold px-10 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="relative z-10">Commencer maintenant</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              <a
                href="/landing"
                className="group bg-white/10 hover:bg-white/20 text-white font-semibold px-10 py-4 rounded-xl transition-all duration-300 border border-white/30 hover:border-white/50"
              >
                Retour à l&apos;accueil
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
