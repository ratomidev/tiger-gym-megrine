"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { format, addMonths, addYears } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { SubscriptionFormValues } from "@/types/subscription";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

    const [, setFormattedStartDate] = useState(format(today, "yyyy-MM-dd"));
    const [, setFormattedEndDate] = useState(format(nextMonth, "yyyy-MM-dd"));

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
        startDate: today,
        endDate: nextMonth,
        status: "actif",
        hasCardioMusculation: true,
        hasCours: false,
      },
    });

    // === Utility: Calculate end date based on plan ===
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
      updateEndDate(value, new Date(watch("startDate")));
    };

    const handleStartDateChange = (date?: Date) => {
      if (!date) return;
      setFormattedStartDate(format(date, "yyyy-MM-dd"));
      setValue("startDate", date);
      updateEndDate(watch("plan"), date);
    };

    const handleEndDateChange = (date?: Date) => {
      if (!date) return;
      setFormattedEndDate(format(date, "yyyy-MM-dd"));
      setValue("endDate", date);
    };

    // === Effect: Initialize end date on mount ===
    useEffect(() => {
      const initialEndDate = calculateEndDate("personnalisé", today);
      setFormattedEndDate(format(initialEndDate, "yyyy-MM-dd"));
      setValue("endDate", initialEndDate);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // === Ref exposure ===
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
      <div className="space-y-6">
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
              <p className="text-red-500 text-sm">{errors.plan.message}</p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Prix</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("price", {
                required: "Le prix est requis",
                min: { value: 0, message: "Le prix doit être positif" },
              })}
              className="border-gray-200 focus:border-gray-400 transition-colors"
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate">Date de Début</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-gray-200 focus:border-gray-400 transition-colors",
                    !watch("startDate") && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watch("startDate")
                    ? format(watch("startDate"), "PPP", { locale: fr })
                    : "Sélectionner une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={watch("startDate")}
                  onSelect={handleStartDateChange}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
            {errors.startDate && (
              <p className="text-red-500 text-sm">{errors.startDate.message}</p>
            )}
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label htmlFor="endDate">Date de Fin</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={watch("plan") !== "personnalisé"}
                  className={cn(
                    "w-full justify-start text-left font-normal border-gray-200 focus:border-gray-400 transition-colors",
                    !watch("endDate") && "text-muted-foreground",
                    watch("plan") !== "personnalisé" &&
                      "bg-gray-50 cursor-not-allowed"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watch("endDate")
                    ? format(watch("endDate"), "PPP", { locale: fr })
                    : "Sélectionner une date"}
                </Button>
              </PopoverTrigger>
              {watch("plan") === "personnalisé" && (
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={watch("endDate")}
                    onSelect={handleEndDateChange}
                    initialFocus
                    locale={fr}
                    disabled={(date) => date < watch("startDate")}
                  />
                </PopoverContent>
              )}
            </Popover>
            {errors.endDate && (
              <p className="text-red-500 text-sm">{errors.endDate.message}</p>
            )}
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
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="expiré">Expiré</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status.message}</p>
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
      </div>
    );
  }
);

SubscriptionRegistrationForm.displayName = "SubscriptionRegistrationForm";
export default SubscriptionRegistrationForm;
