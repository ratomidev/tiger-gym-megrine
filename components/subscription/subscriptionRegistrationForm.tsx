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
import { DatePicker } from "@/components/ui/date-picker";
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

    const calculateEndDate = (plan: string, start: Date) => {
      switch (plan) {
        case "1 mois":
          return addMonths(start, 1);
        case "3 mois":
          return addMonths(start, 3);
        case "4 mois":
          return addMonths(start, 4);
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

    // === Effect: Initialize end date on mount ===
    useEffect(() => {
      const initialEndDate = calculateEndDate("personnalisé", today);
      setFormattedEndDate(format(initialEndDate, "yyyy-MM-dd"));
      setValue("endDate", initialEndDate);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setValue]);

    // === Expose methods to parent ===
    useImperativeHandle(ref, () => ({
      validateAndGetValues: async () => {
        return new Promise((resolve) => {
          handleSubmit(
            (data) => {
              resolve(data);
            },
            () => {
              resolve(null);
            }
          )();
        });
      },
    }));

    // === Render ===
    return (
      <div className="space-y-8">
        {/* Plan and Duration Section */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Plan & Durée
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Subscription Plan */}
            <div className="space-y-2">
              <Label htmlFor="plan" className="text-sm font-medium text-gray-700">
                Type d&apos;abonnement *
              </Label>
              <Select
                defaultValue="personnalisé"
                onValueChange={handlePlanChange}
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
              {errors.plan && (
                <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.plan.message}
                </p>
              )}
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                Date de début *
              </Label>
              <DatePicker
                id="startDate"
                value={formattedStartDate}
                onChange={(dateValue: string) => {
                  setFormattedStartDate(dateValue);
                  if (dateValue) {
                    const [year, month, day] = dateValue.split('-').map(Number);
                    const date = new Date(year, month - 1, day);
                    setValue("startDate", date);
                    updateEndDate(watch("plan"), date);
                  }
                }}
                placeholder="Sélectionner une date"
                className="h-11"
                error={!!errors.startDate}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.startDate.message}
                </p>
              )}
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                Date de fin
                {watch("plan") === "personnalisé" && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <DatePicker
                id="endDate"
                value={formattedEndDate}
                onChange={(dateValue: string) => {
                  if (watch("plan") === "personnalisé" && dateValue) {
                    setFormattedEndDate(dateValue);
                    const [year, month, day] = dateValue.split('-').map(Number);
                    const date = new Date(year, month - 1, day);
                    setValue("endDate", date);
                  }
                }}
                placeholder="Sélectionner une date"
                disabled={watch("plan") !== "personnalisé"}
                className="h-11"
                error={!!errors.endDate}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.endDate.message}
                </p>
              )}
              {watch("plan") !== "personnalisé" && (
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
              <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                Prix (DT) *
              </Label>
              <div className="relative">
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price", {
                    required: "Le prix est requis",
                    min: { value: 0, message: "Le prix doit être positif" },
                  })}
                  placeholder="0.00"
                  className={`h-11 pr-12 ${
                    errors.price 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100" 
                      : "border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  } transition-all`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 font-medium">
                  DT
                </div>
              </div>
              {errors.price && (
                <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Subscription Remaining */}
            <div className="space-y-2">
              <Label htmlFor="remaining" className="text-sm font-medium text-gray-700">
                Montant Restant (DT)
              </Label>
              <div className="relative">
                <Input
                  id="remaining"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("remaining", {
                    min: {
                      value: 0,
                      message: "Le montant restant ne peut pas être négatif",
                    },
                    validate: (value) => {
                      const numValue = value === undefined || value === null ? 0 : Number(value);
                      return (
                        numValue <= watchedPrice ||
                        "Le montant restant ne peut pas dépasser le prix total"
                      );
                    },
                  })}
                  placeholder="0.00"
                  className={`h-11 pr-12 ${
                    errors.remaining 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100" 
                      : "border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  } transition-all`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 font-medium">
                  DT
                </div>
              </div>
              {errors.remaining && (
                <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.remaining.message}
                </p>
              )}
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                0 = payé intégralement
              </p>
            </div>

            {/* Subscription Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                Statut *
              </Label>
              <Select
                defaultValue="actif"
                onValueChange={(value) =>
                  setValue("status", value as "actif" | "expiré")
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
              {errors.status && (
                <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.status.message}
                </p>
              )}
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
                defaultChecked
                onCheckedChange={(checked) =>
                  setValue("hasCardioMusculation", checked === true)
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
                defaultChecked={false}
                onCheckedChange={(checked) =>
                  setValue("hasCours", checked === true)
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
      </div>
    );
  }
);

SubscriptionRegistrationForm.displayName = "SubscriptionRegistrationForm";
export default SubscriptionRegistrationForm;
