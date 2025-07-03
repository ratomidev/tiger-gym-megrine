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

// Extend the base type to include photoUrl
interface AdherentFormValues extends BaseAdherentFormValues {
  photoUrl?: string;
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
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [, setShowCamera] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
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
              photoUrl: photoUrl || undefined,
            });
          },
          () => {
            resolve(null);
          }
        )();
      });
    },
  }));

  const uploadPhoto = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("photo", file);

      const response = await fetch("/api/upload/photo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error("Photo upload error:", error);
      toast.error("Erreur lors du téléchargement de la photo");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to blob storage
      const uploadedUrl = await uploadPhoto(file);
      if (uploadedUrl) {
        setPhotoUrl(uploadedUrl);
        toast.success("Photo téléchargée avec succès!");
      } else {
        setPhotoPreview(null);
      }
    } else {
      setPhotoPreview(null);
      setPhotoUrl(null);
    }
  };

  const startCamera = async () => {
    try {
      setCameraError(null);

      // Check if we're in the browser and navigator is available
      if (typeof window === "undefined" || !navigator.mediaDevices) {
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

  const capturePhoto = async () => {
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

        // Store captured photo without uploading yet
        const capturedDataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedPhoto(capturedDataUrl);
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  const finishPhoto = async () => {
    if (capturedPhoto) {
      // Convert dataURL to blob and upload
      const response = await fetch(capturedPhoto);
      const blob = await response.blob();
      const file = new File([blob], `photo-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      // Show preview immediately
      setPhotoPreview(capturedPhoto);

      // Upload to blob storage
      const uploadedUrl = await uploadPhoto(file);
      if (uploadedUrl) {
        setPhotoUrl(uploadedUrl);
        toast.success("Photo capturée et téléchargée avec succès!");
      } else {
        setPhotoPreview(null);
      }
    }

    setCapturedPhoto(null);
    setShowPhotoModal(false);
  };

  const removePhoto = async () => {
    // Delete photo from blob storage if it exists
    if (photoUrl) {
      try {
        await fetch(
          `/api/upload/photo/delete?url=${encodeURIComponent(photoUrl)}`,
          {
            method: "DELETE",
          }
        );
        console.log("Photo deleted from blob storage");
      } catch (error) {
        console.error("Error deleting photo from blob storage:", error);
        // Continue with local cleanup even if blob deletion fails
      }
    }

    setPhotoPreview(null);
    setPhotoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openPhotoModal = () => {
    setShowPhotoModal(true);
    // Auto-start camera when modal opens
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  const closePhotoModal = () => {
    setShowPhotoModal(false);
    setCapturedPhoto(null);
    stopCamera();
  };

  return (
    <div className="space-y-6">
      {/* Photo Modal */}
      <Dialog open={showPhotoModal} onOpenChange={setShowPhotoModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2 text-xl">
              <Camera className="h-6 w-6 text-blue-600" />
              Ajouter une photo
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {cameraError ? (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Camera className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Caméra indisponible
                </h3>
                <p className="text-red-600 mb-6 text-sm">{cameraError}</p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => {
                      fileInputRef.current?.click();
                    }}
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="h-4 w-4" />
                    Choisir dans la galerie
                  </Button>
                  <Button onClick={closePhotoModal} variant="outline">
                    Fermer
                  </Button>
                </div>
              </div>
            ) : capturedPhoto ? (
              <>
                {/* Captured Photo Preview */}
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Photo capturée
                  </h3>
                  <div className="relative bg-gradient-to-b from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-lg mx-auto max-w-sm">
                    <Image
                      src={capturedPhoto}
                      alt="Photo capturée"
                      width={400}
                      height={300}
                      className="w-full h-80 object-cover"
                    />
                  </div>
                </div>

                {/* Action Buttons for Captured Photo */}
                <div className="flex justify-center gap-4 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={retakePhoto}
                    className="gap-2 min-w-[120px]"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reprendre
                  </Button>

                  <Button
                    type="button"
                    onClick={finishPhoto}
                    className="gap-2 bg-green-600 hover:bg-green-700 min-w-[120px]"
                    disabled={isUploading}
                  >
                    {isUploading ? "Sauvegarde..." : "Terminer"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={closePhotoModal}
                    className="gap-2 min-w-[120px]"
                  >
                    <X className="h-4 w-4" />
                    Annuler
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Camera Preview */}
                <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-xl overflow-hidden shadow-2xl">
                  <video
                    ref={videoRef}
                    className="w-full h-80 object-cover"
                    autoPlay
                    playsInline
                    muted
                  />
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Camera overlay indicator */}
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-white text-xs font-medium">
                        En direct
                      </span>
                    </div>
                  </div>

                  {/* Switch camera button overlay */}
                  <div className="absolute top-4 right-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={switchCamera}
                      className="bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-black/70 h-10 w-10 p-0"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      fileInputRef.current?.click();
                    }}
                    className="gap-2 min-w-[120px]"
                  >
                    <Upload className="h-4 w-4" />
                    Galerie
                  </Button>

                  <Button
                    type="button"
                    onClick={capturePhoto}
                    className="gap-2 bg-blue-600 hover:bg-blue-700 min-w-[120px] relative"
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-md opacity-0 hover:opacity-100 transition-opacity"></div>
                    <Camera className="h-5 w-5" />
                    Capturer
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={closePhotoModal}
                    className="gap-2 min-w-[120px]"
                  >
                    <X className="h-4 w-4" />
                    Annuler
                  </Button>
                </div>

                {/* Instructions */}
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Positionnez votre visage dans le cadre et cliquez sur
                    &quot;Capturer&quot;
                  </p>
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
        <div className="flex justify-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              handlePhotoChange(e);
              setShowPhotoModal(false);
            }}
            className="hidden"
          />

          <Button
            type="button"
            variant="outline"
            onClick={openPhotoModal}
            className="gap-2"
            disabled={isUploading}
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
