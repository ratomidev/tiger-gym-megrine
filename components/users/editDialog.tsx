"use client";

import { useState, useEffect } from "react";
import { User } from "@/types/auth"; // Updated import path
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

// Form validation schema (no password required for edit)
const formSchema = z.object({
  name: z.string().optional(),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{8}$/.test(val),
      "Phone number should be 8 digits (e.g., 54806948)"
    ),
  role: z.enum(["OWNER", "STAFF"]),
});

type EditUserFormValues = z.infer<typeof formSchema>;

interface EditDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated?: () => void;
}

export function EditDialog({ user, isOpen, onClose, onUserUpdated }: EditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(formSchema),
    values: {
      name: user?.name || "",
      phone: user?.phone || "",
      role: user?.role || "STAFF",
    },
  });

  // Reset form when user changes - fixed with useEffect
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        phone: user.phone || "",
        role: user.role || "STAFF",
      });
    }
  }, [user, form]);

  // Add to both EditDialog and DeleteDialog
  useEffect(() => {
    // When dialog closes, reset document body styles
    if (!isOpen) {
      // Allow a moment for transitions to complete
      const timer = setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = async (values: EditUserFormValues) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user");
      }

      toast.success("User updated successfully");
      if (onUserUpdated) {
        onUserUpdated();
      }

      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update user"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Return null when not open to fully unmount the component
  if (!isOpen || !user) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isSubmitting) {
          // Add delay before calling onClose to allow cleanup
          setTimeout(() => onClose(), 0);
        }
      }}
    >
      <DialogContent
        onPointerDownOutside={(e) => {
          // Prevent events from bubbling through
          e.preventDefault();
        }}
        className="sm:max-w-[500px]"
      >
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information. Email cannot be changed.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="bg-gray-100"
            />
            <p className="text-sm text-gray-500">Email cannot be changed</p>
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
              placeholder="54806948"
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
              defaultValue={user.role}
              onValueChange={(value) =>
                form.setValue("role", value as "OWNER" | "STAFF")
              }
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
              <p className="text-red-500 text-sm">
                {form.formState.errors.role.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}