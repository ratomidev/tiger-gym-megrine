"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { Adherent } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Trash,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CreditCard,
} from "lucide-react";
import Link from "next/link";

export default function DetailsAdherent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [adherent, setAdherent] = useState<Adherent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdherent = async () => {
      try {
        const response = await fetch(`/api/adherents/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch adherent details");
        }

        if (data.success && data.adherent) {
          setAdherent(data.adherent);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError((err as Error).message);
        toast.error("Erreur lors du chargement des données", {
          description: (err as Error).message,
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAdherent();
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: fr });
    } catch (error) {
      return "Date invalide" + error;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-500 border-gray-200";

    switch (status.toLowerCase()) {
      case "actif":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "suspendu":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "expired":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-gray-100 text-gray-500 border-gray-200";
    }
  };

  const handleDelete = async () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet adhérent?")) {
      try {
        const response = await fetch(`/api/adherents/${id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to delete adherent");
        }

        if (data.success) {
          toast.success("Adhérent supprimé avec succès");
          setTimeout(() => {
            router.push("/list-adherent");
          }, 1500);
        }
      } catch (err) {
        toast.error("Erreur lors de la suppression", {
          description: (err as Error).message,
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full border-2 border-black border-t-transparent animate-spin"></div>
          <p className="text-sm font-medium text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !adherent) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="text-center py-8">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <p className="text-red-600 font-medium">
                {error || "Adhérent non trouvé"}
              </p>
              <Button
                onClick={() => router.push("/list-adherent")}
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <Toaster
        position="top-right"
        toastOptions={{
          className: "rounded-md",
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

      {/* Header with Back Button and Actions */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/list-adherent">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Retour</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Détails de l&apos;Adhérent</h1>
        </div>
        <div className="flex gap-3">
          <Link href={`/edit-adherent/${adherent.id}`}>
            <Button variant="outline" size="sm" className="gap-2 h-9">
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Modifier</span>
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="gap-2 h-9"
          >
            <Trash className="h-4 w-4" />
            <span className="hidden sm:inline">Supprimer</span>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Personal Info Card */}
        <Card className="h-fit">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-gray-100">
                {adherent.photoUrl ? (
                  <AvatarImage
                    src={adherent.photoUrl}
                    alt={`${adherent.firstName} ${adherent.lastName}`}
                  />
                ) : (
                  <AvatarFallback className="bg-black text-white text-xl">
                    {getInitials(adherent.firstName, adherent.lastName)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {adherent.firstName} {adherent.lastName}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <span className="inline-flex items-center">
                    {adherent.sexe === "M" ? "Homme" : "Femme"}
                  </span>
                  <span className="mx-1">·</span>
                  <span>
                    Inscrit le {formatDate(adherent.createdAt.toString())}
                  </span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b">
              Informations personnelles
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-[24px_1fr] gap-3 items-start">
                <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">{adherent.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-[24px_1fr] gap-3 items-start">
                <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Téléphone</p>
                  <p className="text-gray-600">{adherent.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-[24px_1fr] gap-3 items-start">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Adresse</p>
                  <p className="text-gray-600">{adherent.Address}</p>
                </div>
              </div>

              <div className="grid grid-cols-[24px_1fr] gap-3 items-start">
                <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Date de naissance</p>
                  <p className="text-gray-600">
                    {formatDate(adherent.birthDate.toString())}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Abonnement</CardTitle>
              {adherent.subscription && (
                <Badge
                  variant="outline"
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                    adherent.subscription.status
                  )}`}
                >
                  <span className="flex items-center">
                    <span
                      className={`mr-1.5 h-2 w-2 rounded-full ${
                        adherent.subscription.status.toLowerCase() === "actif"
                          ? "bg-emerald-500"
                          : adherent.subscription.status.toLowerCase() ===
                            "suspendu"
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                    ></span>
                    {adherent.subscription.status}
                  </span>
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {adherent.subscription ? (
              <div className="space-y-6">
                <div className="grid grid-cols-[24px_1fr] gap-3 items-start">
                  <CreditCard className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Plan</p>
                    <p className="text-gray-600 text-lg font-medium">
                      {adherent.subscription.plan}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-[24px_1fr] gap-3 items-start">
                  <div className="h-5 w-5 flex items-center justify-center bg-gray-100 rounded-full">
                    <span className="text-xs font-bold text-gray-600">DT</span>
                  </div>
                  <div>
                    <p className="font-medium">Prix</p>
                    <p className="text-gray-600">
                      {adherent.subscription.price} DT
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-[24px_1fr] gap-3 items-start">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Période d'abonnement</p>
                    <div className="space-y-1 mt-1">
                      <div className="flex gap-2 text-gray-600">
                        <span className="font-medium min-w-[100px]">
                          Début:
                        </span>
                        {formatDate(adherent.subscription.startDate.toString())}
                      </div>
                      <div className="flex gap-2 text-gray-600">
                        <span className="font-medium min-w-[100px]">
                          Expiration:
                        </span>
                        {formatDate(adherent.subscription.endDate.toString())}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="font-medium mb-3">Options</p>
                  <div className="flex flex-wrap gap-2">
                    {adherent.subscription.hasCardioMusculation && (
                      <Badge className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100">
                        Cardio & Musculation
                      </Badge>
                    )}
                    {adherent.subscription.hasCours && (
                      <Badge className="bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100">
                        Cours collectifs
                      </Badge>
                    )}
                    {!adherent.subscription.hasCardioMusculation &&
                      !adherent.subscription.hasCours && (
                        <span className="text-gray-500 text-sm">
                          Aucune option sélectionnée
                        </span>
                      )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 px-6 bg-gray-50 rounded-md text-center">
                <p className="text-gray-500">Aucun abonnement actif</p>
                <Link
                  href={`/add-subscription/${adherent.id}`}
                  className="mt-4 inline-block"
                >
                  <Button size="sm">Ajouter un abonnement</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
