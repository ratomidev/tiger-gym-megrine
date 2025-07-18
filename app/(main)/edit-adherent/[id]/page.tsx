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
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                {/* Birth Date */}
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Date de naissance *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) =>
                      handleInputChange("birthDate", e.target.value)
                    }
                    className={errors.birthDate ? "border-red-500" : ""}
                  />
                  {errors.birthDate && (
                    <p className="text-sm text-red-500">{errors.birthDate}</p>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label htmlFor="sexe">Sexe *</Label>
                  <Select
                    value={formData.sexe}
                    onValueChange={(value) => handleInputChange("sexe", value)}
                  >
                    <SelectTrigger
                      className={errors.sexe ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Sélectionner le sexe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Homme</SelectItem>
                      <SelectItem value="F">Femme</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.sexe && (
                    <p className="text-sm text-red-500">{errors.sexe}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="Address">Adresse *</Label>
                <Input
                  id="Address"
                  value={formData.Address}
                  onChange={(e) => handleInputChange("Address", e.target.value)}
                  className={errors.Address ? "border-red-500" : ""}
                />
                {errors.Address && (
                  <p className="text-sm text-red-500">{errors.Address}</p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Subscription Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Détails de l&apos;Abonnement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subscription Plan */}
                <div className="space-y-2">
                  <Label htmlFor="subscriptionPlan">
                    Type d&apos;abonnement
                  </Label>
                  <Select
                    value={formData.subscriptionPlan}
                    onValueChange={(value) =>
                      handleInputChange("subscriptionPlan", value)
                    }
                  >
                    <SelectTrigger className="border-gray-200 focus:border-gray-400 transition-colors">
                      <SelectValue placeholder="Sélectionner le type d'abonnement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personnalisé">Personnalisé</SelectItem>
                      <SelectItem value="1 mois">1 mois</SelectItem>
                      <SelectItem value="3 mois">3 mois</SelectItem>
                      <SelectItem value="6 mois">6 mois</SelectItem>
                      <SelectItem value="1 an">1 an</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Subscription Price and Remaining Amount - combined in one cell */}
                <div className="space-y-2 col-span-1">
                  <div className="flex gap-4">
                    {/* Subscription Price */}
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="subscriptionPrice">Prix (DT)</Label>
                      <Input
                        id="subscriptionPrice"
                        type="number"
                        value={formData.subscriptionPrice}
                        onChange={(e) =>
                          handleInputChange("subscriptionPrice", e.target.value)
                        }
                        placeholder="0"
                        className={
                          errors.subscriptionPrice ? "border-red-500" : ""
                        }
                      />
                      {errors.subscriptionPrice && (
                        <p className="text-sm text-red-500">
                          {errors.subscriptionPrice}
                        </p>
                      )}
                    </div>

                    {/* Subscription Remaining */}
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="subscriptionRemaining">
                        Montant Restant
                      </Label>
                      <Input
                        id="subscriptionRemaining"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.subscriptionRemaining}
                        onChange={(e) =>
                          handleInputChange(
                            "subscriptionRemaining",
                            e.target.value
                          )
                        }
                        placeholder="0"
                        className={
                          errors.subscriptionRemaining ? "border-red-500" : ""
                        }
                      />
                      {errors.subscriptionRemaining && (
                        <p className="text-sm text-red-500">
                          {errors.subscriptionRemaining}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Montant restant à payer (0 = payé intégralement)
                  </p>
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <Label htmlFor="subscriptionStartDate">Date de début</Label>
                  <Input
                    id="subscriptionStartDate"
                    type="date"
                    value={formData.subscriptionStartDate}
                    onChange={(e) =>
                      handleInputChange("subscriptionStartDate", e.target.value)
                    }
                    className="border-gray-200 focus:border-gray-400 transition-colors"
                  />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <Label htmlFor="subscriptionEndDate">
                    Date de fin
                    {formData.subscriptionPlan !== "personnalisé" &&
                      " (Calculée automatiquement)"}
                  </Label>
                  <Input
                    id="subscriptionEndDate"
                    type="date"
                    value={formData.subscriptionEndDate}
                    onChange={(e) =>
                      handleInputChange("subscriptionEndDate", e.target.value)
                    }
                    disabled={formData.subscriptionPlan !== "personnalisé"}
                    className={`border-gray-200 focus:border-gray-400 transition-colors ${
                      formData.subscriptionPlan !== "personnalisé"
                        ? "bg-gray-50 disabled:cursor-not-allowed"
                        : ""
                    }`}
                  />
                  {formData.subscriptionPlan !== "personnalisé" && (
                    <p className="text-xs text-gray-500">
                      Calculée automatiquement selon le type d&apos;abonnement
                      et la date de début.
                    </p>
                  )}
                </div>
              </div>

              {/* Subscription Status */}
              <div className="space-y-2">
                <Label htmlFor="subscriptionStatus">Statut</Label>
                <Select
                  value={formData.subscriptionStatus}
                  onValueChange={(value) =>
                    handleInputChange("subscriptionStatus", value)
                  }
                >
                  <SelectTrigger className="border-gray-200 focus:border-gray-400 transition-colors">
                    <SelectValue placeholder="Sélectionner le statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="expiré">Expiré</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Options */}
              <div className="space-y-4">
                <Label>Options incluses</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasCardioMusculation"
                      checked={formData.hasCardioMusculation}
                      onCheckedChange={(checked) =>
                        handleInputChange(
                          "hasCardioMusculation",
                          checked as boolean
                        )
                      }
                      className="border-gray-300"
                    />
                    <Label
                      htmlFor="hasCardioMusculation"
                      className="text-sm font-medium leading-none"
                    >
                      Cardio & Musculation
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasCours"
                      checked={formData.hasCours}
                      onCheckedChange={(checked) =>
                        handleInputChange("hasCours", checked as boolean)
                      }
                      className="border-gray-300"
                    />
                    <Label
                      htmlFor="hasCours"
                      className="text-sm font-medium leading-none"
                    >
                      Cours collectifs
                    </Label>
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
