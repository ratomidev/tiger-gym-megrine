"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { format, addMonths, addYears } from "date-fns";

import { SubscriptionFormValues } from "@/types/subscription";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// === Ref interface ===
export interface SubscriptionFormRef {
  validateAndGetValues: () => Promise<SubscriptionFormValues | null>;
}

// === Component ===
const SubscriptionRegistrationForm = forwardRef<SubscriptionFormRef>(
  (_props, ref) => {
    const today = new Date();
    const nextMonth = addMonths(today, 1);

    const [formattedStartDate, setFormattedStartDate] = useState(
      format(today, "yyyy-MM-dd")
    );
    const [formattedEndDate, setFormattedEndDate] = useState(
      format(nextMonth, "yyyy-MM-dd")
    );

    const {
      register,
      handleSubmit,
      setValue,
      watch,
      formState: { errors },
    } = useForm<SubscriptionFormValues>({
      defaultValues: {
        plan: "personnalisé",
        price: 50,
        remaining: 0, // Default value for remaining amount
        startDate: today,
        endDate: nextMonth,
        status: "actif",
        hasCardioMusculation: true,
        hasCours: false,
      },
    });

    // Watch price to calculate remaining
    const watchedPrice = watch("price");
    const watchedRemaining = watch("remaining");

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

    // === Handlers ===
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

    // === Effect: Initialize end date on mount ===
    useEffect(() => {
      const initialEndDate = calculateEndDate("personnalisé", today);
      setFormattedEndDate(format(initialEndDate, "yyyy-MM-dd"));
      setValue("endDate", initialEndDate);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Effect to validate remaining amount when price changes
    useEffect(() => {
      // Ensure both values are treated as numbers
      const remainingVal =
        watchedRemaining === undefined || watchedRemaining === null
          ? 0
          : Number(watchedRemaining);
      const priceVal = Number(watchedPrice);

      if (remainingVal > priceVal) {
        setValue("remaining", priceVal);
      }
    }, [watchedPrice, watchedRemaining, setValue]);

    useImperativeHandle(ref, () => ({
      validateAndGetValues: async () => {
        return new Promise((resolve) => {
          handleSubmit(
            (data) => resolve(data),
            () => resolve(null)
          )();
        });
      },
    }));

    // === Render ===
    return (
      <div className="space-y-6 bg-card dark:bg-gray-900 text-card-foreground dark:text-white p-6 rounded-lg shadow-md dark:shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plan */}
          <div className="space-y-2">
            <Label htmlFor="plan">Type d&apos;Abonnement</Label>
            <Select
              defaultValue="personnalisé"
              onValueChange={handlePlanChange}
            >
              <SelectTrigger className="border-gray-200 focus:border-gray-400 transition-colors">
                <SelectValue placeholder="Sélectionner une durée" />
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
              <p className="text-destructive dark:text-red-400 text-sm">
                {errors.plan.message}
              </p>
            )}
          </div>

          {/* Prix and Montant Restant combined in one column */}
          <div className="space-y-2">
            <div className="flex gap-4">
              {/* Prix */}
              <div className="flex-1 space-y-2">
                <Label htmlFor="price">
                  Prix
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price", {
                    required: "Le prix est requis",
                    min: { value: 0, message: "Le prix doit être positif" },
                  })}
                  placeholder="0.00"
                  className="border-input dark:border-gray-700 bg-background dark:bg-gray-900 text-foreground dark:text-white focus:border-primary dark:focus:border-gray-500 transition-colors"
                />
                {errors.price && (
                  <p className="text-destructive dark:text-red-400 text-sm">
                    {errors.price.message}
                  </p>
                )}
              </div>

              {/* Montant Restant */}
              <div className="flex-1 space-y-2">
                <Label htmlFor="remaining">
                  Montant Restant
                </Label>
                <Input
                  id="remaining"
                  type="number"
                  step="0.01"
                  {...register("remaining", {
                    min: {
                      value: 0,
                      message:
                        "Le montant restant ne peut pas être négatif",
                    },
                    validate: (value) => {
                      // Convert to number and handle undefined/null
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
                  className="border-input dark:border-gray-700 bg-background dark:bg-gray-900 text-foreground dark:text-white focus:border-primary dark:focus:border-gray-500 transition-colors"
                  max={watchedPrice}
                />
                {errors.remaining && (
                  <p className="text-destructive dark:text-red-400 text-sm">
                    {errors.remaining.message}
                  </p>
                )}
              </div>
            </div>
            <p className="text-muted-foreground dark:text-gray-400 text-xs">
              Montant restant à payer (0 = payé intégralement). Ne peut pas
              dépasser {watchedPrice} DT.
            </p>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate">
              Date de Début
            </Label>
            <Input
              id="startDate"
              type="date"
              value={formattedStartDate}
              onChange={handleStartDateChange}
              className="border-input dark:border-gray-700 bg-background dark:bg-gray-900 text-foreground dark:text-white focus:border-primary dark:focus:border-gray-500 transition-colors"
            />
            {errors.startDate && (
              <p className="text-destructive dark:text-red-400 text-sm">
                {errors.startDate.message}
              </p>
            )}
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label htmlFor="endDate">
              Date de Fin
            </Label>
            <Input
              id="endDate"
              type="date"
              value={formattedEndDate}
              onChange={handleEndDateChange}
              disabled={watch("plan") !== "personnalisé"}
              className="border-gray-200 focus:border-gray-400 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            {errors.endDate && (
              <p className="text-destructive dark:text-red-400 text-sm">
                {errors.endDate.message}
              </p>
            )}
            <p className="text-xs text-gray-500">
              {watch("plan") === "personnalisé"
                ? "Sélectionnez manuellement la date de fin d'abonnement."
                : "Calculée automatiquement selon le type d'abonnement et la date de début."}
            </p>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">
              Statut
            </Label>
            <Select
              defaultValue="actif"
              onValueChange={(value) =>
                setValue("status", value as "actif" | "expiré")
              }
            >
              <SelectTrigger className="border-input dark:border-gray-700 bg-background dark:bg-gray-900 text-foreground dark:text-white focus:border-primary dark:focus:border-gray-500 transition-colors">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent className="bg-popover dark:bg-gray-900 text-popover-foreground dark:text-white border-border dark:border-gray-700">
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="expiré">Expiré</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-destructive dark:text-red-400 text-sm">
                {errors.status.message}
              </p>
            )}
          </div>
        </div>

        {/* Services */}
        <div className="space-y-4 pt-2">
          <Label>Services Inclus</Label>
          <div className="flex flex-row items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasCardioMusculation"
                defaultChecked
                onCheckedChange={(checked) =>
                  setValue("hasCardioMusculation", checked === true)
                }
                className="border-input dark:border-gray-600 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-blue-600"
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
                className="border-input dark:border-gray-600 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-blue-600"
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
      </div>
    );
  }
);

SubscriptionRegistrationForm.displayName = "SubscriptionRegistrationForm";
export default SubscriptionRegistrationForm;
