"use client";

import { useState, useEffect } from "react";
import { User } from "@/lib/auth/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface DeleteDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUserDeleted?: () => void;
}

export function DeleteDialog({ 
  user, 
  isOpen, 
  onClose, 
  onUserDeleted 
}: DeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!user) return;
    
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete user");
      }

      toast.success("User deleted successfully");

      if (onUserDeleted) {
        onUserDeleted();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete user"
      );
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  // Important: Reset document styles when dialog closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        document.body.style.pointerEvents = '';
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Return null when not open to fully unmount
  if (!isOpen) return null;

  return (
    <AlertDialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open && !isDeleting) {
          setTimeout(() => onClose(), 0);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user
            account for <span className="font-medium">{user?.name || user?.email || "this user"}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-4 flex flex-col sm:flex-row items-stretch sm:items-center">
          <AlertDialogCancel 
            onClick={(e) => {
              e.stopPropagation();
              if (!isDeleting) onClose();
            }}
            disabled={isDeleting}
            className="mb-2 sm:mb-0"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? "Deleting..." : "Delete User"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}