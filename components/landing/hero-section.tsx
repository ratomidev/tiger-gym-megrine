import Link from "next/link";
import SocialContacts from "./social-contacts";

export default function HeroSection() {
  return (
    <main
      className="relative z-10 flex flex-col items-center justify-center text-center text-white px-6"
      style={{ minHeight: "80vh" }}
    >
      <h1 className="text-5xl md:text-7xl font-bold mb-4">
        LIBÉREZ VOTRE <span className="text-red-500">TIGRE</span> INTÉRIEUR
      </h1>
      <p className="text-lg md:text-2xl mb-8 max-w-3xl">
        Transformez votre corps et votre esprit au Tiger Gym Megrine.
        Équipements de pointe, entraîneurs experts et une communauté qui vous
        pousse à vos limites.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/register"
          className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition-colors duration-200"
        >
          Rejoignez-nous
        </Link>
        {/* <Link
          href="/programs"
          className="px-8 py-3 border-2 border-white hover:bg-white hover:text-black text-white rounded-full font-semibold transition-all duration-200"
        >
          Voir les Programmes
        </Link> */}
      </div>

      {/* Stats Section */}
      <div className="mt-16 grid grid-cols-3 gap-8 text-center">
        <div>
          <div className="text-3xl md:text-4xl font-bold text-red-500">
            500+
          </div>
          <div className="text-sm md:text-base text-gray-300">
            Membres Actifs
          </div>
        </div>
        <div>
          <div className="text-3xl md:text-4xl font-bold text-red-500">10+</div>
          <div className="text-sm md:text-base text-gray-300">
            Entraîneurs Experts
          </div>
        </div>
        <div>
          <div className="text-3xl md:text-4xl font-bold text-red-500">
            24/7
          </div>
          <div className="text-sm md:text-base text-gray-300">Accès</div>
        </div>
      </div>

      {/* Centered Social Contacts */}
      <div className="mt-12 flex justify-center">
        <SocialContacts
          className="justify-center"
          iconSize="w-8 h-8"
          showLabels={false}
        />
      </div>
    </main>
  );
}
