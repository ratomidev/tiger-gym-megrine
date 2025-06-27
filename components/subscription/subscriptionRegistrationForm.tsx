"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { SubscriptionFormValues } from "@/types/subscription";
import { format, addMonths, addYears } from "date-fns";
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

export interface SubscriptionFormRef {
  validateAndGetValues: () => Promise<SubscriptionFormValues | null>;
}

const SubscriptionRegistrationForm = forwardRef<SubscriptionFormRef>(
  (props, ref) => {
    const today = new Date();
    const nextMonth = addMonths(today, 1);

    const formattedToday = format(today, "yyyy-MM-dd");
    const [formattedEndDate, setFormattedEndDate] = useState(
      format(nextMonth, "yyyy-MM-dd")
    );
    const [formattedStartDate, setFormattedStartDate] =
      useState(formattedToday);

    const {
      register,
      handleSubmit,
      setValue,
      watch,
      formState: { errors },
    } = useForm<SubscriptionFormValues>({
      defaultValues: {
        plan: "1 mois",
        price: 50,
        startDate: today,
        endDate: nextMonth,
        status: "actif",
        hasCardioMusculation: true,
        hasCours: false,
      },
    });

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
        default:
          return addMonths(start, 1);
      }
    };

    const updateEndDate = (plan: string, startDate: Date) => {
      const endDate = calculateEndDate(plan, startDate);
      const formattedEnd = format(endDate, "yyyy-MM-dd");
      setFormattedEndDate(formattedEnd);
      setValue("endDate", endDate);
    };

    const handlePlanChange = (value: string) => {
      setValue("plan", value);
      const startDate = new Date(watch("startDate"));
      updateEndDate(value, startDate);
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputDate = e.target.value;
      const newStartDate = new Date(inputDate);
      setFormattedStartDate(inputDate); // keep input synced
      setValue("startDate", newStartDate);
      updateEndDate(watch("plan"), newStartDate);
    };

    useEffect(() => {
      updateEndDate("1 mois", today);
    }, []);

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

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plan */}
          <div className="space-y-2">
            <Label htmlFor="plan">Type d&apos;Abonnement</Label>
            <Select defaultValue="1 mois" onValueChange={handlePlanChange}>
              <SelectTrigger className="border-gray-200 focus:border-gray-400 transition-colors">
                <SelectValue placeholder="Sélectionner une durée" />
              </SelectTrigger>
              <SelectContent>
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

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate">Date de Début</Label>
            <Input
              id="startDate"
              type="date"
              value={formattedStartDate}
              onChange={handleStartDateChange}
              className="border-gray-200 focus:border-gray-400 transition-colors"
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm">{errors.startDate.message}</p>
            )}
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label htmlFor="endDate">Date de Fin</Label>
            <Input
              id="endDate"
              type="date"
              value={formattedEndDate}
              readOnly
              className="border-gray-200 focus:border-gray-400 transition-colors bg-gray-50"
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm">{errors.endDate.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Calculée automatiquement selon le type d&apos;abonnement et la
              date de début.
            </p>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              defaultValue="actif"
              onValueChange={(value) =>
                setValue(
                  "status",
                  value as "actif" | "inactif" | "suspendu" | "expiré"
                )
              }
            >
              <SelectTrigger className="border-gray-200 focus:border-gray-400 transition-colors">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="inactif">Inactif</SelectItem>
                <SelectItem value="suspendu">Suspendu</SelectItem>
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
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasCardioMusculation"
                defaultChecked={true}
                onCheckedChange={(checked) =>
                  setValue("hasCardioMusculation", checked === true)
                }
                className="border-gray-300"
              />
              <Label
                htmlFor="hasCardioMusculation"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
