'use client';

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { AdherentFormValues, SubscriptionFormValues } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdherentRegistrationForm from "@/components/member/form/MemberRegistrationForm";
import SubscriptionRegistrationForm from "@/components/subscription/subscriptionRegistrationForm";

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // References to form methods
  const adherentFormRef = useRef<{
    validateAndGetValues: () => Promise<AdherentFormValues | null>;
  }>(null);

  const subscriptionFormRef = useRef<{
    validateAndGetValues: () => Promise<SubscriptionFormValues | null>;
  }>(null);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Get adherent data
      const adherentData = await adherentFormRef.current?.validateAndGetValues();
      if (!adherentData) {
        toast.error("Please fill in all required member information");
        setIsLoading(false);
        return;
      }

      // Get subscription data - always required now
      const subscriptionData = await subscriptionFormRef.current?.validateAndGetValues();
      if (!subscriptionData) {
        toast.error("Please fill in all required subscription information");
        setIsLoading(false);
        return;
      }

      // Submit with subscription
      await submitAdherentWithSubscription(adherentData, subscriptionData);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while saving", {
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const submitAdherentWithSubscription = async (
    adherentData: AdherentFormValues,
    subscriptionData: SubscriptionFormValues
  ) => {
    const formData = new FormData();

    // Add adherent data
    formData.append("firstName", adherentData.firstName);
    formData.append("lastName", adherentData.lastName);
    formData.append("email", adherentData.email);
    formData.append("phone", adherentData.phone);
    formData.append("birthDate", new Date(adherentData.birthDate).toISOString());
    formData.append("Address", adherentData.Address);
    formData.append("sexe", adherentData.sexe);
    formData.append("hasSubscription", "true"); // Always true now

    // Add subscription data
    formData.append("plan", subscriptionData.plan);
    formData.append("price", subscriptionData.price.toString());
    formData.append("startDate", new Date(subscriptionData.startDate).toISOString());
    formData.append("endDate", new Date(subscriptionData.endDate).toISOString());
    formData.append("status", subscriptionData.status);
    formData.append("hasCardioMusculation", subscriptionData.hasCardioMusculation.toString());
    formData.append("hasCours", subscriptionData.hasCours.toString());

    // Add photo if present
    if ("photoFile" in adherentData && adherentData.photoFile) {
      formData.append("photo", adherentData.photoFile as File);
    }

    const response = await fetch("/api/adherents", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.success) {
      toast.success("Member registered successfully", {
        description: `${adherentData.firstName} ${adherentData.lastName} has been registered with a subscription.`,
      });

      setTimeout(() => {
        router.push("/adherents");
      }, 1500);
    } else {
      throw new Error(result.error || "Failed to register member with subscription");
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-6">
      <Toaster
        position="top-right"
        toastOptions={{
          className: "rounded-md",
          // @ts-expect-error - sonner types are not complete
          success: {
            className: "bg-green-50 text-green-800 border-green-500",
            descriptionClassName: "text-green-700",
          },
          error: {
            className: "bg-red-50 text-red-800 border-red-500",
            descriptionClassName: "text-red-700",
          },
        }}
      />

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Add New Member</CardTitle>
          <CardDescription>Register a new member with subscription details</CardDescription>
        </CardHeader>
      </Card>

      {/* Vertical layout - Member Info first */}
      <div className="space-y-6">
        {/* Member Information Card */}
        <AdherentRegistrationForm ref={adherentFormRef} />

        {/* Subscription Card - Always shown */}
        <SubscriptionRegistrationForm ref={subscriptionFormRef} />
      </div>

      {/* Save Button at the bottom */}
      <div className="flex justify-end mt-8">
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Member"}
        </Button>
      </div>
    </div>
  );
}
