"use client";

import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { useForm } from "react-hook-form";
import { AdherentFormValues as BaseAdherentFormValues } from "@/types/adherent";
import Image from "next/image";

// Extend the base type to include photoFile
interface AdherentFormValues extends BaseAdherentFormValues {
  photoFile?: File | null;
}
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera, Upload, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";

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
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    validateAndGetValues: async () => {
      return new Promise((resolve) => {
        handleSubmit(
          (data) => {
            resolve({
              ...data,
              photoFile,
            });
          },
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
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Veuillez sélectionner un fichier image valide");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La taille du fichier ne doit pas dépasser 5MB");
        return;
      }

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

  const startCamera = async () => {
    try {
      setCameraError(null);
      
      // Check if we're in the browser and navigator is available
      if (typeof window === 'undefined' || !navigator.mediaDevices) {
        setCameraError("Caméra non disponible dans cet environnement");
        return;
      }
      
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setShowCamera(true);
    } catch (error) {
      console.error("Camera access error:", error);
      setCameraError(
        "Impossible d'accéder à la caméra. Vérifiez les permissions."
      );
      toast.error("Erreur d'accès à la caméra", {
        description: "Vérifiez que vous avez autorisé l'accès à la caméra",
      });
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
    setCameraError(null);
  };

  const switchCamera = async () => {
    const newFacingMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacingMode);

    if (cameraStream) {
      stopCamera();
      // Wait a bit before starting new camera to avoid conflicts
      setTimeout(() => {
        startCamera();
      }, 100);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], `photo-${Date.now()}.jpg`, {
                type: "image/jpeg",
              });

              setPhotoFile(file);
              setPhotoPreview(canvas.toDataURL("image/jpeg"));
              stopCamera();
              toast.success("Photo capturée avec succès!");
            }
          },
          "image/jpeg",
          0.8
        );
      }
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setPhotoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Camera Modal */}
      <Dialog open={showCamera} onOpenChange={setShowCamera}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Prendre une photo
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {cameraError ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{cameraError}</p>
                <Button onClick={() => setShowCamera(false)} variant="outline">
                  Fermer
                </Button>
              </div>
            ) : (
              <>
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-64 object-cover"
                    autoPlay
                    playsInline
                    muted
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                <div className="flex justify-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={switchCamera}
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Changer
                  </Button>
                  <Button
                    type="button"
                    onClick={capturePhoto}
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Camera className="h-4 w-4" />
                    Capturer
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={stopCamera}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Annuler
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

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

      {/* Photo Section */}
      <div className="space-y-4">
        <Label>Photo (optionnel)</Label>

        {/* Photo Preview */}
        {photoPreview && (
          <div className="flex justify-center">
            <div className="relative">
              <Image
                src={photoPreview}
                alt="Aperçu"
                width={150}
                height={150}
                className="object-cover rounded-full border-2 border-gray-200"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={removePhoto}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Photo Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Choisir un fichier
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={startCamera}
            className="gap-2"
            disabled={typeof window === 'undefined' || !navigator?.mediaDevices}
          >
            <Camera className="h-4 w-4" />
            Prendre une photo
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          JPG, PNG ou GIF. Maximum 5MB.
        </p>
      </div>
    </div>
  );
});

AdherentRegistrationForm.displayName = "AdherentRegistrationForm";

export default AdherentRegistrationForm;
