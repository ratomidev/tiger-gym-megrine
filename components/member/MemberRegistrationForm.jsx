'use client';

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

function RegistrationForm() {
  const { control, handleSubmit, register, formState: { errors } } = useForm({
    defaultValues: {
      // Informations personnelles
      firstname: "",
      lastname: "",
      email: "",
      tel: "",
      sexe: "",
      birthdate: "",
      address: {
        street: "",
        city: "",
        postalCode: "",
        country: "France"
      },
      
      // Informations d'abonnement
      membershipNumber: `ADH-${Math.floor(Math.random() * 10000)}`,
      inscriptionDate: new Date().toISOString().split("T")[0],
      subscriptionType: "",
      subscriptionStartDate: new Date().toISOString().split("T")[0],
      subscriptionEndDate: "",
      subscriptionStatus: "actif",
      
      // Services
      services: {
        musculation: false,
        cardio: false,
        fitness: false,
        boxing: false,
        yoga: false
      },
      
      // Dossier médical
      medicalCertificateDate: "",
      hasMedicalCertificate: false,
      allergies: "",
      healthIssues: "",
      specialPermissions: "",
      contraindications: "",
      
      // Notes
      notes: ""
    }
  });
  
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [medicalCertificateFile, setMedicalCertificateFile] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      
      // Add basic member data
      formData.append("membershipNumber", data.membershipNumber);
      formData.append("firstname", data.firstname);
      formData.append("lastname", data.lastname);
      formData.append("email", data.email);
      formData.append("tel", data.tel);
      formData.append("sexe", data.sexe);
      formData.append("birthdate", data.birthdate);
      
      // Add address data
      formData.append("address.street", data.address.street);
      formData.append("address.city", data.address.city);
      formData.append("address.postalCode", data.address.postalCode);
      formData.append("address.country", data.address.country);
      
      // Add subscription data
      formData.append("inscriptionDate", data.inscriptionDate);
      formData.append("subscriptionType", data.subscriptionType);
      formData.append("subscriptionStartDate", data.subscriptionStartDate);
      formData.append("subscriptionEndDate", data.subscriptionEndDate);
      formData.append("subscriptionStatus", data.subscriptionStatus);
      
      // Add services data
      formData.append("services.musculation", data.services.musculation);
      formData.append("services.cardio", data.services.cardio);
      formData.append("services.fitness", data.services.fitness);
      formData.append("services.boxing", data.services.boxing);
      formData.append("services.yoga", data.services.yoga);
      
      // Add medical data
      formData.append("medicalCertificateDate", data.medicalCertificateDate);
      formData.append("hasMedicalCertificate", data.hasMedicalCertificate);
      formData.append("allergies", data.allergies);
      formData.append("healthIssues", data.healthIssues);
      formData.append("specialPermissions", data.specialPermissions);
      formData.append("contraindications", data.contraindications);
      
      // Add notes
      formData.append("notes", data.notes);
      
      // Add files
      if (photo) {
        formData.append("photo", photo);
      }
      
      if (medicalCertificateFile) {
        formData.append("medicalCertificateFile", medicalCertificateFile);
      }
      
      console.log("Submitting form...");
      
      const response = await fetch('/api/members', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log("Member registered successfully:", result.member);
        toast.success("Adhérent enregistré avec succès!", {
          description: `${result.member.firstname} ${result.member.lastname} a été enregistré.`,
          style: { backgroundColor: "#f0fdf4", borderLeft: "4px solid #22c55e" },
        });
        // Reset form or redirect as needed
      } else {
        console.error("Failed to register member:", result.error);
        toast.error("Erreur lors de l'enregistrement de l'adhérent", {
          description: result.error,
          style: { backgroundColor: "#fef2f2", borderLeft: "4px solid #ef4444" },
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Une erreur s'est produite lors de l'envoi du formulaire", {
        description: "Problème de connexion au serveur.",
        style: { backgroundColor: "#fef2f2", borderLeft: "4px solid #ef4444" },
      });
    }
  };

  return (
    <div className="relative h-full w-full">
      <div className="w-full max-w-6xl px-4 mx-auto">
        
          <h1 className="text-3xl font-bold mb-6 text-center">Ajouter un adherent</h1>
          
          <div className="w-full bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="p-5">
              
              {/* Section: Informations personnelles */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Informations personnelles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 
                  
                  {/* Nom */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="lastname">
                      Nom
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="lastname"
                      {...register("lastname", { required: "Le nom est requis" })}
                    />
                    {errors.lastname && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastname.message}</p>
                    )}
                  </div>
                  
                  {/* Prénom */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="firstname">
                      Prénom
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="firstname"
                      {...register("firstname", { required: "Le prénom est requis" })}
                    />
                    {errors.firstname && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstname.message}</p>
                    )}
                  </div>
                  
                  {/* Sexe */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="sexe">
                      Sexe
                    </label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="sexe"
                      {...register("sexe", { required: "Le sexe est requis" })}
                    >
                      <option value="">Sélectionner</option>
                      <option value="male">Homme</option>
                      <option value="female">Femme</option>
                    </select>
                    {errors.sexe && (
                      <p className="text-red-500 text-sm mt-1">{errors.sexe.message}</p>
                    )}
                  </div>
                  
                 
                  
                  {/* Email */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="email"
                      type="email"
                      {...register("email", { 
                        required: "L'email est requis",
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "Format d'email invalide"
                        }
                      })}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  
                  {/* Téléphone */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="tel">
                      Téléphone
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="tel"
                      type="tel"
                      {...register("tel", { required: "Le téléphone est requis" })}
                    />
                    {errors.tel && (
                      <p className="text-red-500 text-sm mt-1">{errors.tel.message}</p>
                    )}
                  </div>
                </div>
                 {/* Date de naissance */}
                 <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="birthdate">
                      Date de naissance
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="birthdate"
                      type="date"
                      {...register("birthdate", { required: "La date de naissance est requise" })}
                    />
                    {errors.birthdate && (
                      <p className="text-red-500 text-sm mt-1">{errors.birthdate.message}</p>
                    )}
                  </div>
                
                {/* Adresse */}
                <h3 className="text-lg font-medium mt-4 mb-3">Adresse</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mb-4 md:col-span-2">
                    <label className="block text-sm font-medium mb-2" htmlFor="address.street">
                      Rue
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="address.street"
                      {...register("address.street", { required: "L'adresse est requise" })}
                    />
                    {errors.address?.street && (
                      <p className="text-red-500 text-sm mt-1">{errors.address.street.message}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="address.city">
                      Ville
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="address.city"
                      {...register("address.city", { required: "La ville est requise" })}
                    />
                    {errors.address?.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.address.city.message}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="address.country">
                      Pays
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="address.country"
                      {...register("address.country")}
                    />
                  </div>
                  {/* Photo */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="photo">
                      Photo
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="photo"
                      name="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                    {photoPreview && (
                      <div className="mt-2">
                        <img 
                          src={photoPreview} 
                          alt="Aperçu" 
                          className="w-32 h-32 object-cover rounded-md border"
                        />
                      </div>
                    )}
                  </div>
                
                </div>
              </div>
               
              {/* Section: Dossier médical */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Dossier médical (optionnel)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 
                    
                    
                  
                  {/* Allergies */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="allergies">
                      Allergies connues
                    </label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="allergies"
                      placeholder="Aucune allergie connue"
                      {...register("allergies")}
                    ></textarea>
                  </div>
                  
                  {/* Problèmes de santé */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="healthIssues">
                      Problèmes de santé connus
                    </label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="healthIssues"
                      placeholder="Aucun problème de santé connu"
                      {...register("healthIssues")}
                    ></textarea>
                  </div>
                  
      
                </div>
              </div>
              
              
              {/* Section: Informations d'abonnement */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Informations d'abonnement</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date d'inscription */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="inscriptionDate">
                      Date d'inscription
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="inscriptionDate"
                      type="date"
                      {...register("inscriptionDate", { required: "La date d'inscription est requise" })}
                    />
                    {errors.inscriptionDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.inscriptionDate.message}</p>
                    )}
                  </div>
                  
                  {/* Type d'abonnement */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="subscriptionType">
                      Type d'abonnement
                    </label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="subscriptionType"
                      {...register("subscriptionType", { required: "Le type d'abonnement est requis" })}
                    >
                      <option value="">Sélectionner</option>
                      <option value="monthly">Mensuel</option>
                      <option value="quarterly">Trimestriel</option>
                      <option value="biannual">Semestriel</option>
                      <option value="annual">Annuel</option>
                    </select>
                    {errors.subscriptionType && (
                      <p className="text-red-500 text-sm mt-1">{errors.subscriptionType.message}</p>
                    )}
                  </div>
                  
                  {/* Date de début */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="subscriptionStartDate">
                      Date de début d'abonnement
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="subscriptionStartDate"
                      type="date"
                      {...register("subscriptionStartDate", { required: "La date de début est requise" })}
                    />
                    {errors.subscriptionStartDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.subscriptionStartDate.message}</p>
                    )}
                  </div>
                  
                  {/* Date de fin */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="subscriptionEndDate">
                      Date de fin d'abonnement
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="subscriptionEndDate"
                      type="date"
                      {...register("subscriptionEndDate", { required: "La date de fin est requise" })}
                    />
                    {errors.subscriptionEndDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.subscriptionEndDate.message}</p>
                    )}
                  </div>
                  
                  {/* Statut */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="subscriptionStatus">
                      Statut de l'abonnement
                    </label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="subscriptionStatus"
                      {...register("subscriptionStatus")}
                    >
                      <option value="actif">Actif</option>
                      <option value="expiré">Expiré</option>
                      <option value="suspendu">Suspendu</option>
                    </select>
                  </div>
                </div>
                
                {/* Services */}
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">
                    Services
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="services.musculation"
                        control={control}
                        render={({ field }) => (
                          <input
                            id="musculation"
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        )}
                      />
                      <label htmlFor="musculation" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Musculation
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="services.cardio"
                        control={control}
                        render={({ field }) => (
                          <input
                            id="cardio"
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        )}
                      />
                      <label htmlFor="cardio" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Cardio
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="services.fitness"
                        control={control}
                        render={({ field }) => (
                          <input
                            id="fitness"
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        )}
                      />
                      <label htmlFor="fitness" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Fitness
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="services.boxing"
                        control={control}
                        render={({ field }) => (
                          <input
                            id="boxing"
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        )}
                      />
                      <label htmlFor="boxing" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Boxe
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="services.yoga"
                        control={control}
                        render={({ field }) => (
                          <input
                            id="yoga"
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        )}
                      />
                      <label htmlFor="yoga" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Yoga
                      </label>
                    </div>
                  </div>
                </div>
              </div>
             
              {/* Remarques */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" htmlFor="notes">
                  Remarques/Notes personnelles (optionnel)
                </label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  id="notes"
                  rows="4"
                  placeholder="Informations supplémentaires (facultatif)"
                  {...register("notes")}
                ></textarea>
              </div>
              
              {/* Submit button */}
              <div className="flex items-center justify-end">
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6"
                  type="submit"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        
      </div>
    </div>
  );
}

export default RegistrationForm;
