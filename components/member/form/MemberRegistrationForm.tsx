"use client";

import React, { useState, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { AdherentFormValues as BaseAdherentFormValues } from "@/types/adherent";
import Image from "next/image";

// Extend the base type to include photoFile
interface AdherentFormValues extends BaseAdherentFormValues {
  photoFile?: File | null;
}
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface AdherentFormRef {
  validateAndGetValues: () => Promise<AdherentFormValues | null>;
}

const AdherentRegistrationForm = forwardRef<AdherentFormRef>((props, ref) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AdherentFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      birthDate: new Date(),
      Address: "",
      sexe: "M",
    },
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    validateAndGetValues: async () => {
      // Return a promise that resolves with form data or null if invalid
      return new Promise((resolve) => {
        handleSubmit(
          (data) => {
            resolve({
              ...data,
              photoFile,
            });
          },
          // On validation error
          () => {
            resolve(null);
          }
        )();
      });
    },
  }));

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
      setPhotoFile(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            {...register("firstName", {
              required: "Le prénom est requis",
            })}
            placeholder="Prénom"
            className="border-gray-200 focus:border-gray-400 transition-colors"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            {...register("lastName", { required: "Le nom est requis" })}
            placeholder="Nom"
            className="border-gray-200 focus:border-gray-400 transition-colors"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email", {
              required: "L'email est requis",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Format d'email invalide",
              },
            })}
            placeholder="email@example.com"
            className="border-gray-200 focus:border-gray-400 transition-colors"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            {...register("phone", {
              required: "Le numéro de téléphone est requis",
            })}
            placeholder="Numéro de téléphone"
            className="border-gray-200 focus:border-gray-400 transition-colors"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        {/* Birth Date */}
        <div className="space-y-2">
          <Label htmlFor="birthDate">Date de Naissance</Label>
          <Input
            id="birthDate"
            type="date"
            {...register("birthDate", {
              required: "La date de naissance est requise",
            })}
            className="border-gray-200 focus:border-gray-400 transition-colors"
          />
          {errors.birthDate && (
            <p className="text-red-500 text-sm">{errors.birthDate.message}</p>
          )}
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="sexe">Sexe</Label>
          <Select
            defaultValue="M"
            onValueChange={(value) => setValue("sexe", value as "M" | "F")}
          >
            <SelectTrigger className="border-gray-200 focus:border-gray-400 transition-colors">
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Homme</SelectItem>
              <SelectItem value="F">Femme</SelectItem>
            </SelectContent>
          </Select>
          {errors.sexe && (
            <p className="text-red-500 text-sm">{errors.sexe.message}</p>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="Address">Adresse</Label>
        <Input
          id="Address"
          {...register("Address", { required: "L'adresse est requise" })}
          placeholder="Adresse complète"
          className="border-gray-200 focus:border-gray-400 transition-colors"
        />
        {errors.Address && (
          <p className="text-red-500 text-sm">{errors.Address.message}</p>
        )}
      </div>

      {/* Photo */}
      <div className="space-y-2">
        <Label htmlFor="photo">Photo (optionnel)</Label>
        <Input
          id="photo"
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="border-gray-200 focus:border-gray-400 transition-colors cursor-pointer"
        />
        {photoPreview && (
          <div className="mt-4 flex justify-center">
            <Image
              src={photoPreview}
              alt="Aperçu"
              width={150}
              height={150}
              className="object-cover rounded-full border-2 border-gray-200"
            />
          </div>
        )}
      </div>
    </div>
  );
});

AdherentRegistrationForm.displayName = "AdherentRegistrationForm";

export default AdherentRegistrationForm;
