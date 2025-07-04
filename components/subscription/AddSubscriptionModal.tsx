"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { format, addMonths, addYears } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Save, X } from "lucide-react";

interface SubscriptionFormData {
  plan: string;
  price: number;
  remaining: number;
  startDate: Date;
  endDate: Date;
  status: "actif" | "expiré";
  hasCardioMusculation: boolean;
  hasCours: boolean;
}

interface AddSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adherentId: string;
  adherentName: string;
  onSuccess: () => void;
}

export default function AddSubscriptionModal({
  open,
  onOpenChange,
  adherentId,
  adherentName,
  onSuccess,
}: AddSubscriptionModalProps) {
  const today = React.useMemo(() => new Date(), []);
  const nextMonth = addMonths(today, 1);

  const [formattedStartDate, setFormattedStartDate] = useState(
    format(today, "yyyy-MM-dd")
  );
  const [formattedEndDate, setFormattedEndDate] = useState(
    format(nextMonth, "yyyy-MM-dd")
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SubscriptionFormData>({
    defaultValues: {
      plan: "personnalisé",
      price: 50,
      remaining: 0,
      startDate: today,
      endDate: nextMonth,
      status: "actif",
      hasCardioMusculation: true,
      hasCours: false,
    },
  });

  // Watch price and remaining to validate
  const watchedPrice = watch("price");
  const watchedRemaining = watch("remaining");

  // Calculate end date based on plan
  const calculateEndDate = (plan: string, start: Date) => {
    switch (plan) {
      case "1 mois":
        return addMonths(start, 1);
      case "3 mois":
        return addMonths(start, 3);
      case "6 mois":
        return addMonths(start, 6);
      case "1 an":
        return addYears(start, 1);
      case "personnalisé":
        return start;
      default:
        return addMonths(start, 1);
    }
  };

  const updateEndDate = (plan: string, start: Date) => {
    if (plan === "personnalisé") return;
    const endDate = calculateEndDate(plan, start);
    setFormattedEndDate(format(endDate, "yyyy-MM-dd"));
    setValue("endDate", endDate);
  };

  // Handlers
  const handlePlanChange = (value: string) => {
    setValue("plan", value);
    updateEndDate(value, new Date(formattedStartDate));
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = e.target.value;
    setFormattedStartDate(dateStr);
    const date = new Date(dateStr);
    setValue("startDate", date);
    updateEndDate(watch("plan"), date);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = e.target.value;
    setFormattedEndDate(dateStr);
    setValue("endDate", new Date(dateStr));
  };

  // Initialize end date on mount
  useEffect(() => {
    const initialEndDate = calculateEndDate("personnalisé", today);
    setFormattedEndDate(format(initialEndDate, "yyyy-MM-dd"));
    setValue("endDate", initialEndDate);
  }, [setValue, today]);

  // Effect to validate remaining amount when price changes
  useEffect(() => {
    const remainingVal =
      watchedRemaining === undefined || watchedRemaining === null
        ? 0
        : Number(watchedRemaining);
    const priceVal = Number(watchedPrice);

    if (remainingVal > priceVal) {
      setValue("remaining", priceVal);
    }
  }, [watchedPrice, watchedRemaining, setValue]);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      const today = new Date();
      const nextMonth = addMonths(today, 1);

      reset({
        plan: "personnalisé",
        price: 50,
        remaining: 0,
        startDate: today,
        endDate: nextMonth,
        status: "actif",
        hasCardioMusculation: true,
        hasCours: false,
      });

      setFormattedStartDate(format(today, "yyyy-MM-dd"));
      setFormattedEndDate(format(nextMonth, "yyyy-MM-dd"));
    }
  }, [open, reset]);

  const onSubmit = async (data: SubscriptionFormData) => {
    setIsSubmitting(true);

    try {
      const payload = {
        plan: data.plan,
        price: data.price,
        remaining: data.remaining || 0,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        status: data.status,
        hasCardioMusculation: data.hasCardioMusculation,
        hasCours: data.hasCours,
      };

      const response = await fetch(
        `/api/adherents/${adherentId}/subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
          "Server error: Expected JSON response but received HTML"
        );
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Erreur lors de l'ajout de l'abonnement"
        );
      }

      if (result.success) {
        toast.success("Abonnement ajouté avec succès", {
          description: `L'abonnement ${data.plan} a été ajouté pour ${adherentName}`,
        });
        onOpenChange(false);
        onSuccess();
      }
    } catch (error) {
      console.error("Error adding subscription:", error);
      toast.error("Erreur lors de l'ajout de l'abonnement", {
        description: (error as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un abonnement</DialogTitle>
          <p className="text-sm text-gray-500">
            Créer un nouvel abonnement pour {adherentName}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Plan */}
          <div className="space-y-2">
            <Label htmlFor="plan">Type d&apos;abonnement</Label>
            <Select
              defaultValue="personnalisé"
              onValueChange={handlePlanChange}
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
            {errors.plan && (
              <p className="text-red-500 text-sm">{errors.plan.message}</p>
            )}
          </div>

          {/* Price and Remaining Amount */}
          <div className="space-y-2">
            <div className="flex gap-4">
              {/* Price */}
              <div className="flex-1 space-y-2">
                <Label htmlFor="price">Prix</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price", {
                    required: "Le prix est requis",
                    min: { value: 0, message: "Le prix doit être positif" },
                  })}
                  placeholder="0.00"
                  className="border-gray-200 focus:border-gray-400 transition-colors"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price.message}</p>
                )}
              </div>

              {/* Remaining Amount */}
              <div className="flex-1 space-y-2">
                <Label htmlFor="remaining">Montant Restant</Label>
                <Input
                  id="remaining"
                  type="number"
                  step="0.01"
                  {...register("remaining", {
                    min: {
                      value: 0,
                      message: "Le montant restant ne peut pas être négatif",
                    },
                    validate: (value) => {
                      const numValue =
                        value === undefined || value === null
                          ? 0
                          : Number(value);
                      return (
                        numValue <= watchedPrice ||
                        "Le montant restant ne peut pas dépasser le prix total"
                      );
                    },
                  })}
                  placeholder="0.00"
                  className="border-gray-200 focus:border-gray-400 transition-colors"
                  max={watchedPrice}
                />
                {errors.remaining && (
                  <p className="text-red-500 text-sm">
                    {errors.remaining.message}
                  </p>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Montant restant à payer (0 = payé intégralement). Ne peut pas
              dépasser {watchedPrice} DT.
            </p>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate">Date de début</Label>
            <Input
              id="startDate"
              type="date"
              value={formattedStartDate}
              onChange={handleStartDateChange}
              className="border-gray-200 focus:border-gray-400 transition-colors"
            />
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label htmlFor="endDate">Date de fin</Label>
            <Input
              id="endDate"
              type="date"
              value={formattedEndDate}
              onChange={handleEndDateChange}
              disabled={watch("plan") !== "personnalisé"}
              className="border-gray-200 focus:border-gray-400 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500">
              {watch("plan") === "personnalisé"
                ? "Sélectionnez manuellement la date de fin d'abonnement."
                : "Calculée automatiquement selon le type d'abonnement et la date de début."}
            </p>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              defaultValue="actif"
              onValueChange={(value) =>
                setValue("status", value as "actif" | "expiré")
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
            <Label>Services Inclus</Label>
            <div className="flex flex-row items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasCardioMusculation"
                  defaultChecked
                  onCheckedChange={(checked) =>
                    setValue("hasCardioMusculation", checked === true)
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
                  defaultChecked={false}
                  onCheckedChange={(checked) =>
                    setValue("hasCours", checked === true)
                  }
                  className="border-gray-300"
                />
                <Label
                  htmlFor="hasCours"
                  className="text-sm font-medium leading-none"
                >
                  Cours Collectifs
                </Label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Ajout...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Ajouter l&apos;abonnement
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
