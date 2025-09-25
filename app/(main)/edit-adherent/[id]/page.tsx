"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import Link from "next/link";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  Address: string;
  birthDate: string;
  sexe: string;
  // Subscription fields
  subscriptionPlan: string;
  subscriptionPrice: string;
  subscriptionRemaining: string; // Add this new field
  subscriptionStatus: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  hasCardioMusculation: boolean;
  hasCours: boolean;
}

export default function EditAdherentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    Address: "",
    birthDate: "",
    sexe: "",
    subscriptionPlan: "",
    subscriptionPrice: "",
    subscriptionRemaining: "0", // Initialize with "0"
    subscriptionStatus: "",
    subscriptionStartDate: "",
    subscriptionEndDate: "",
    hasCardioMusculation: false,
    hasCours: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    document.title = "Modifier Adhérent-Tiger Gym";
  }, []);

  useEffect(() => {
    const fetchAdherent = async () => {
      try {
        const response = await fetch(`/api/adherents/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch adherent details");
        }

        if (data.success && data.adherent) {
          const adherent = data.adherent;

          setFormData({
            firstName: adherent.firstName || "",
            lastName: adherent.lastName || "",
            email: adherent.email || "",
            phone: adherent.phone || "",
            Address: adherent.Address || "",
            birthDate: adherent.birthDate
              ? format(new Date(adherent.birthDate), "yyyy-MM-dd")
              : "",
            sexe: adherent.sexe || "",
            subscriptionPlan: adherent.subscription?.plan || "",
            subscriptionPrice: adherent.subscription?.price?.toString() || "",
            subscriptionRemaining:
              adherent.subscription?.remaining?.toString() || "0",
            subscriptionStatus: adherent.subscription?.status || "",
            subscriptionStartDate: adherent.subscription?.startDate
              ? format(new Date(adherent.subscription.startDate), "yyyy-MM-dd")
              : "",
            subscriptionEndDate: adherent.subscription?.endDate
              ? format(new Date(adherent.subscription.endDate), "yyyy-MM-dd")
              : "",
            hasCardioMusculation:
              adherent.subscription?.hasCardioMusculation || false,
            hasCours: adherent.subscription?.hasCours || false,
          });
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

  const calculateEndDate = (plan: string, startDate: string) => {
    if (!startDate || !plan) return "";

    const start = new Date(startDate);
    const endDate = new Date(start);

    switch (plan) {
      case "1 mois":
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case "3 mois":
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case "4 mois":
        endDate.setMonth(endDate.getMonth() + 4);
        break;
      case "6 mois":
        endDate.setMonth(endDate.getMonth() + 6);
        break;
      case "1 an":
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      default:
        return startDate;
    }

    return endDate.toISOString().split("T")[0];
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => {
      const newForm = { ...prev, [field]: value };

      // Auto-calculate end date based on start date and plan
      if (
        (field === "subscriptionStartDate" || field === "subscriptionPlan") &&
        newForm.subscriptionStartDate &&
        newForm.subscriptionPlan &&
        newForm.subscriptionPlan !== "personnalisé"
      ) {
        newForm.subscriptionEndDate = calculateEndDate(
          newForm.subscriptionPlan,
          newForm.subscriptionStartDate
        );
      }

      return newForm;
    });

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Personal info validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Le téléphone est requis";
    }

    if (!formData.Address.trim()) {
      newErrors.Address = "L'adresse est requise";
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "La date de naissance est requise";
    }

    if (!formData.sexe) {
      newErrors.sexe = "Le sexe est requis";
    }

    // Subscription validation (optional fields)
    if (formData.subscriptionPlan && !formData.subscriptionPrice) {
      newErrors.subscriptionPrice =
        "Le prix est requis si un plan est sélectionné";
    }

    if (
      formData.subscriptionPrice &&
      isNaN(Number(formData.subscriptionPrice))
    ) {
      newErrors.subscriptionPrice = "Le prix doit être un nombre valide";
    }

    if (formData.subscriptionStartDate && formData.subscriptionEndDate) {
      const startDate = new Date(formData.subscriptionStartDate);
      const endDate = new Date(formData.subscriptionEndDate);
      if (startDate >= endDate) {
        newErrors.subscriptionEndDate =
          "La date de fin doit être après la date de début";
      }
    }

    if (
      formData.subscriptionPrice &&
      formData.subscriptionRemaining &&
      Number(formData.subscriptionRemaining) >
        Number(formData.subscriptionPrice)
    ) {
      newErrors.subscriptionRemaining =
        "Le montant restant ne peut pas dépasser le prix";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    try {
      setSaving(true);

      // Prepare the data with proper field names for the API
      const submitData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        Address: formData.Address,
        birthDate: formData.birthDate,
        sexe: formData.sexe,
        subscriptionPlan: formData.subscriptionPlan,
        subscriptionPrice: formData.subscriptionPrice,
        subscriptionRemaining: formData.subscriptionRemaining,
        subscriptionStatus: formData.subscriptionStatus,
        subscriptionStartDate: formData.subscriptionStartDate,
        subscriptionEndDate: formData.subscriptionEndDate,
        hasCardioMusculation: formData.hasCardioMusculation,
        hasCours: formData.hasCours,
      };

      const response = await fetch(`/api/adherents/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update adherent");
      }

      if (data.success) {
        toast.success("Adhérent modifié avec succès");
        setTimeout(() => {
          router.push(`/details-adherent/${id}`);
        }, 1500);
      }
    } catch (err) {
      toast.error("Erreur lors de la modification", {
        description: (err as Error).message,
      });
    } finally {
      setSaving(false);
    }
  };

  // 4. Add a new useEffect to validate the remaining amount
  useEffect(() => {
    // Ensure remaining amount doesn't exceed price when price changes
    const price = Number(formData.subscriptionPrice);
    const remaining = Number(formData.subscriptionRemaining);

    if (!isNaN(price) && !isNaN(remaining) && remaining > price) {
      setFormData((prev) => ({
        ...prev,
        subscriptionRemaining: formData.subscriptionPrice,
      }));
    }
  }, [formData.subscriptionPrice, formData.subscriptionRemaining]);

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto py-6 px-4 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full border-2 border-black border-t-transparent animate-spin"></div>
          <p className="text-sm font-medium text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto py-6 px-4">
        <Card className="text-center py-8">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <p className="text-red-600 font-medium">{error}</p>
              <Button
                onClick={() => router.push("/list-adherent")}
                variant="outline"
              >
                Retour à la liste
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      <Toaster position="top-right" className="rounded-md" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Modifier l&apos;Adhérent</h1>
          <p className="text-gray-600 mt-1">ID: {id}</p>
        </div>
        <Link href={`/details-adherent/${id}`}>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Personal Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Identité
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      Prénom *
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className={`h-11 ${
                        errors.firstName 
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100" 
                          : "border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                      } transition-all`}
                      placeholder="Entrer le prénom"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Nom *
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className={`h-11 ${
                        errors.lastName 
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100" 
                          : "border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                      } transition-all`}
                      placeholder="Entrer le nom"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  {/* Birth Date */}
                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-sm font-medium text-gray-700">
                      Date de naissance *
                    </Label>
                    <DatePicker
                      id="birthDate"
                      value={formData.birthDate}
                      onChange={(value) => handleInputChange("birthDate", value)}
                      placeholder="Sélectionner une date"
                      error={!!errors.birthDate}
                      className="h-11"
                    />
                    {errors.birthDate && (
                      <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.birthDate}
                      </p>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <Label htmlFor="sexe" className="text-sm font-medium text-gray-700">
                      Sexe *
                    </Label>
                    <Select
                      value={formData.sexe}
                      onValueChange={(value) => handleInputChange("sexe", value)}
                    >
                      <SelectTrigger
                        className={`h-11 ${
                          errors.sexe 
                            ? "border-red-500 focus:border-red-500 focus:ring-red-100" 
                            : "border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                        } transition-all`}
                      >
                        <SelectValue placeholder="Sélectionner le sexe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">
                          <div className="flex items-center gap-2">
                            <span>👨</span>
                            Homme
                          </div>
                        </SelectItem>
                        <SelectItem value="F">
                          <div className="flex items-center gap-2">
                            <span>👩</span>
                            Femme
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.sexe && (
                      <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.sexe}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Coordonnées
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`h-11 ${
                        errors.email 
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100" 
                          : "border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                      } transition-all`}
                      placeholder="exemple@email.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Téléphone *
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={`h-11 ${
                        errors.phone 
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100" 
                          : "border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                      } transition-all`}
                      placeholder="+216 XX XXX XXX"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address - Full Width */}
                <div className="space-y-2">
                  <Label htmlFor="Address" className="text-sm font-medium text-gray-700">
                    Adresse complète *
                  </Label>
                  <Input
                    id="Address"
                    value={formData.Address}
                    onChange={(e) => handleInputChange("Address", e.target.value)}
                    className={`h-11 ${
                      errors.Address 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100" 
                        : "border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                    } transition-all`}
                    placeholder="Rue, ville, code postal..."
                  />
                  {errors.Address && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.Address}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Subscription Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Détails de l&apos;Abonnement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Plan and Duration Section */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Plan & Durée
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Subscription Plan */}
                <div className="space-y-2">
                  <Label htmlFor="subscriptionPlan" className="text-sm font-medium text-gray-700">
                    Type d&apos;abonnement *
                  </Label>
                  <Select
                    value={formData.subscriptionPlan}
                    onValueChange={(value) =>
                      handleInputChange("subscriptionPlan", value)
                    }
                  >
                    <SelectTrigger className="h-11 border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all">
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personnalisé">Personnalisé</SelectItem>
                      <SelectItem value="1 mois">1 mois</SelectItem>
                      <SelectItem value="3 mois">3 mois</SelectItem>
                      <SelectItem value="4 mois">4 mois</SelectItem>
                      <SelectItem value="6 mois">6 mois</SelectItem>
                      <SelectItem value="1 an">1 an</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <Label htmlFor="subscriptionStartDate" className="text-sm font-medium text-gray-700">
                    Date de début *
                  </Label>
                  <DatePicker
                    id="subscriptionStartDate"
                    value={formData.subscriptionStartDate}
                    onChange={(value) => handleInputChange("subscriptionStartDate", value)}
                    placeholder="Sélectionner une date"
                    className="h-11"
                  />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <Label htmlFor="subscriptionEndDate" className="text-sm font-medium text-gray-700">
                    Date de fin
                    {formData.subscriptionPlan === "personnalisé" && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <DatePicker
                    id="subscriptionEndDate"
                    value={formData.subscriptionEndDate}
                    onChange={(value) => handleInputChange("subscriptionEndDate", value)}
                    placeholder="Sélectionner une date"
                    disabled={formData.subscriptionPlan !== "personnalisé"}
                    className="h-11"
                  />
                  {formData.subscriptionPlan !== "personnalisé" && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      Calculée automatiquement
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Information Section */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Informations Financières
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Subscription Price */}
                <div className="space-y-2">
                  <Label htmlFor="subscriptionPrice" className="text-sm font-medium text-gray-700">
                    Prix (DT) *
                  </Label>
                  <div className="relative">
                    <Input
                      id="subscriptionPrice"
                      type="number"
                      step="0.01"
                      value={formData.subscriptionPrice}
                      onChange={(e) =>
                        handleInputChange("subscriptionPrice", e.target.value)
                      }
                      placeholder="0.00"
                      className={`h-11 pr-12 ${
                        errors.subscriptionPrice 
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100" 
                          : "border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                      } transition-all`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 font-medium">
                      DT
                    </div>
                  </div>
                  {errors.subscriptionPrice && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.subscriptionPrice}
                    </p>
                  )}
                </div>

                {/* Subscription Remaining */}
                <div className="space-y-2">
                  <Label htmlFor="subscriptionRemaining" className="text-sm font-medium text-gray-700">
                    Montant Restant (DT)
                  </Label>
                  <div className="relative">
                    <Input
                      id="subscriptionRemaining"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.subscriptionRemaining}
                      onChange={(e) =>
                        handleInputChange("subscriptionRemaining", e.target.value)
                      }
                      placeholder="0.00"
                      className={`h-11 pr-12 ${
                        errors.subscriptionRemaining 
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100" 
                          : "border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                      } transition-all`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 font-medium">
                      DT
                    </div>
                  </div>
                  {errors.subscriptionRemaining && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.subscriptionRemaining}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    0 = payé intégralement
                  </p>
                </div>

                {/* Subscription Status */}
                <div className="space-y-2">
                  <Label htmlFor="subscriptionStatus" className="text-sm font-medium text-gray-700">
                    Statut *
                  </Label>
                  <Select
                    value={formData.subscriptionStatus}
                    onValueChange={(value) =>
                      handleInputChange("subscriptionStatus", value)
                    }
                  >
                    <SelectTrigger className="h-11 border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all">
                      <SelectValue placeholder="Sélectionner le statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="actif">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Actif
                        </div>
                      </SelectItem>
                      <SelectItem value="expiré">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          Expiré
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Services & Options Section */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Services & Options
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <Checkbox
                    id="hasCardioMusculation"
                    checked={formData.hasCardioMusculation}
                    onCheckedChange={(checked) =>
                      handleInputChange("hasCardioMusculation", checked as boolean)
                    }
                    className="border-gray-300 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="hasCardioMusculation"
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      Cardio & Musculation
                    </Label>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Accès aux équipements de fitness
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <Checkbox
                    id="hasCours"
                    checked={formData.hasCours}
                    onCheckedChange={(checked) =>
                      handleInputChange("hasCours", checked as boolean)
                    }
                    className="border-gray-300 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="hasCours"
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      Cours collectifs
                    </Label>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Participation aux cours de groupe
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Link href={`/details-adherent/${id}`}>
            <Button type="button" variant="outline" disabled={saving}>
              Annuler
            </Button>
          </Link>
          <Button onClick={handleSubmit} disabled={saving} className="gap-2">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
