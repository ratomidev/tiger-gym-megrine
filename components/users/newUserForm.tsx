"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// Form validation schema with simplified password requirements
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"), // Simplified password validation
  name: z.string().optional(),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{8}$/.test(val),
      "Phone number should be 8 digits "
    ),
  role: z.enum(['OWNER', 'STAFF'])
});

export type NewUserFormValues = z.infer<typeof formSchema>;

interface NewUserFormProps {
  onSubmit: (values: NewUserFormValues) => Promise<void>;
  onCancel: () => void;
}

export function NewUserForm({ onSubmit, onCancel }: NewUserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewUserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      phone: "",
      role: "STAFF"
    },
  });

  const handleSubmit = async (values: NewUserFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      form.reset();
    } catch {
      // Error is handled by parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...form.register("email")}
          placeholder="user@example.com"
          disabled={isSubmitting}
        />
        {form.formState.errors.email && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...form.register("password")}
          placeholder="••••••••"
          disabled={isSubmitting}
        />
        {form.formState.errors.password && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name (Optional)</Label>
        <Input
          id="name"
          type="text"
          {...form.register("name")}
          placeholder="John Doe"
          disabled={isSubmitting}
        />
        {form.formState.errors.name && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone (Optional)</Label>
        <Input
          id="phone"
          type="text"
          {...form.register("phone")}
          placeholder="XX XXX XXX"
          disabled={isSubmitting}
        />
        {form.formState.errors.phone && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.phone.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          defaultValue="STAFF"
          onValueChange={(value) => form.setValue('role', value as 'OWNER' | 'STAFF')}
          disabled={isSubmitting}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="OWNER">Owner</SelectItem>
            <SelectItem value="STAFF">Staff</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.role && (
          <p className="text-red-500 text-sm">{form.formState.errors.role.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create User"
          )}
        </Button>
      </div>
    </form>
  );
}