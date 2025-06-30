"use client";

import { useState, useEffect } from "react";
import { User } from "@/types/auth"; // Import updated User type
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
import { Loader2 } from "lucide-react";

interface DeleteDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUserDeleted: () => void;
}

export function DeleteDialog({
  user,
  isOpen,
  onClose,
  onUserDeleted,
}: DeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Add cleanup effect
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleDelete = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete user");
      }

      toast.success("User deleted successfully");
      onUserDeleted();
      onClose();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete user"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Return null when not open to fully unmount the component
  if (!isOpen || !user) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isDeleting) {
          setTimeout(() => onClose(), 0);
        }
      }}
    >
      <DialogContent
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">User details:</p>
            <p className="text-sm">
              <span className="font-semibold">Name:</span> {user.name || "N/A"}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Role:</span> {user.role}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}