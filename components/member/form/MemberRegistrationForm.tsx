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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card>
      <CardHeader>
        <CardTitle>Member Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...register("firstName", {
                  required: "First name is required",
                })}
                placeholder="First name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...register("lastName", { required: "Last name is required" })}
                placeholder="Last name"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid email format",
                  },
                })}
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                {...register("phone", { required: "Phone number is required" })}
                placeholder="Phone number"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            {/* Birth Date */}
            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input
                id="birthDate"
                type="date"
                {...register("birthDate", {
                  required: "Birth date is required",
                })}
              />
              {errors.birthDate && (
                <p className="text-red-500 text-sm">
                  {errors.birthDate.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="sexe">Gender</Label>
              <Select
                defaultValue="M"
                onValueChange={(value) => setValue("sexe", value as "M" | "F")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                </SelectContent>
              </Select>
              {errors.sexe && (
                <p className="text-red-500 text-sm">{errors.sexe.message}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="Address">Address</Label>
            <Input
              id="Address"
              {...register("Address", { required: "Address is required" })}
              placeholder="Full address"
            />
            {errors.Address && (
              <p className="text-red-500 text-sm">{errors.Address.message}</p>
            )}
          </div>

          {/* Photo */}
          <div className="space-y-2">
            <Label htmlFor="photo">Photo (optional)</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="cursor-pointer"
            />
            {photoPreview && (
              <div className="mt-2">
                <Image
                  src={photoPreview}
                  alt="Preview"
                  width={128}
                  height={128}
                  className="object-cover rounded-md border"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

AdherentRegistrationForm.displayName = "AdherentRegistrationForm";

export default AdherentRegistrationForm;
