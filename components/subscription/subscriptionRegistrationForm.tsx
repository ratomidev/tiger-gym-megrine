'use client';

import React, { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { SubscriptionFormValues } from "@/types/subscription";
import { format } from "date-fns";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface SubscriptionFormRef {
  validateAndGetValues: () => Promise<SubscriptionFormValues | null>;
}

const SubscriptionRegistrationForm = forwardRef<SubscriptionFormRef>((props, ref) => {
  // Calculate default dates - today and 1 month from today
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(today.getMonth() + 1);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<SubscriptionFormValues>({
    defaultValues: {
      plan: "Basic",
      price: 50,
      startDate: today,
      endDate: nextMonth,
      status: "actif",
      hasCardioMusculation: true,
      hasCours: false,
    }
  });

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    validateAndGetValues: async () => {
      // Return a promise that resolves with form data or null if invalid
      return new Promise((resolve) => {
        handleSubmit(
          (data) => {
            resolve(data);
          }, 
          // On validation error
          () => {
            resolve(null);
          }
        )();
      });
    }
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plan */}
            <div className="space-y-2">
              <Label htmlFor="plan">Subscription Plan</Label>
              <Select
                defaultValue="Basic"
                onValueChange={(value) => setValue("plan", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                </SelectContent>
              </Select>
              {errors.plan && (
                <p className="text-red-500 text-sm">{errors.plan.message}</p>
              )}
            </div>
            
            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { 
                  required: "Price is required",
                  min: { value: 0, message: "Price must be positive" }
                })}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>
            
            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate", { required: "Start date is required" })}
                defaultValue={format(today, "yyyy-MM-dd")}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm">{errors.startDate.message}</p>
              )}
            </div>
            
            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                {...register("endDate", { required: "End date is required" })}
                defaultValue={format(nextMonth, "yyyy-MM-dd")}
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm">{errors.endDate.message}</p>
              )}
            </div>
            
            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                defaultValue="actif"
                onValueChange={(value) => setValue("status", value as "actif" | "inactif" | "suspendu" | "expiré")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actif">Active</SelectItem>
                  <SelectItem value="inactif">Inactive</SelectItem>
                  <SelectItem value="suspendu">Suspended</SelectItem>
                  <SelectItem value="expiré">Expired</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div>
          </div>
          
          {/* Services */}
          <div className="space-y-4">
            <Label>Included Services</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasCardioMusculation" 
                  defaultChecked={true}
                  onCheckedChange={(checked) => 
                    setValue("hasCardioMusculation", checked === true)
                  }
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
                />
                <Label 
                  htmlFor="hasCours" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Fitness Classes
                </Label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

SubscriptionRegistrationForm.displayName = "SubscriptionRegistrationForm";

export default SubscriptionRegistrationForm;