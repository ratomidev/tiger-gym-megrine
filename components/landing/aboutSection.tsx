"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Users,
  Award,
  Target,
  Heart,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MessageCircle
} from "lucide-react";

export default function AboutSection() {
  const stats = [
    { icon: Users, label: "Membres actifs", value: "500+" },
    { icon: Award, label: "Années d'expérience", value: "15+" },
    { icon: Target, label: "Programmes disponibles", value: "25+" },
    { icon: Heart, label: "Objectifs atteints", value: "1000+" }
  ];

  const socialLinks = [
    { 
      name: "Facebook", 
      icon: Facebook, 
      url: "https://facebook.com/tigergym", 
      color: "hover:text-blue-600" 
    },
    { 
      name: "Instagram", 
      icon: Instagram, 
      url: "https://instagram.com/tigergym", 
      color: "hover:text-pink-600" 
    },
    { 
      name: "Twitter", 
      icon: Twitter, 
      url: "https://twitter.com/tigergym", 
      color: "hover:text-blue-400" 
    },
    { 
      name: "YouTube", 
      icon: Youtube, 
      url: "https://youtube.com/tigergym", 
      color: "hover:text-red-600" 
    },
    { 
      name: "WhatsApp", 
      icon: MessageCircle, 
      url: "https://wa.me/21671234567", 
      color: "hover:text-green-600" 
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-900" id="about">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">À Propos de Nous</Badge>
          <h2 className="text-4xl font-bold mb-6">Tiger Gym Megrine</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Votre destination fitness de référence depuis plus de 15 ans. 
            Nous vous accompagnons dans votre transformation physique et mentale 
            avec passion et expertise.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - About Content */}
          <div className="space-y-8">
            {/* Mission Statement */}
            <div>
              <h3 className="text-2xl font-semibold mb-4">Notre Mission</h3>
              <p className="text-muted-foreground mb-6">
                Chez Tiger Gym Megrine, nous croyons que chaque personne mérite d'atteindre 
                ses objectifs de fitness dans un environnement accueillant et motivant. 
                Notre équipe d'experts vous accompagne à chaque étape de votre parcours.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="text-sm">Équipements de pointe et installations modernes</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="text-sm">Entraîneurs certifiés et expérimentés</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="text-sm">Programmes personnalisés pour tous niveaux</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="text-sm">Communauté bienveillante et motivante</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center p-4">
                  <CardContent className="p-0">
                    <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Suivez-nous</h4>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <Button
                    key={social.name}
                    variant="outline"
                    size="icon"
                    className={`transition-colors ${social.color}`}
                    onClick={() => window.open(social.url, '_blank')}
                  >
                    <social.icon className="h-5 w-5" />
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Location & Contact */}
          <div className="space-y-6">
            {/* Map Card */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video w-full bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3194.0!2d10.2255!3d36.8065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDQ4JzIzLjQiTiAxMMKwMTMnMzEuOCJF!5e0!3m2!1sen!2stn!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Tiger Gym Megrine Location"
                  ></iframe>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold mb-4">Informations de Contact</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Adresse</p>
                      <p className="text-sm text-muted-foreground">
                        123 Avenue Habib Bourguiba<br />
                        Megrine, Ben Arous 2033<br />
                        Tunisie
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Téléphone</p>
                      <p className="text-sm text-muted-foreground">+216 71 234 567</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">contact@tigergym.tn</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Horaires d'ouverture</p>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Lun - Ven: 06:00 - 22:00</p>
                        <p>Sam - Dim: 08:00 - 20:00</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-6">
                  <Phone className="h-4 w-4 mr-2" />
                  Nous Contacter
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}