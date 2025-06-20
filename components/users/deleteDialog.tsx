"use client";

import { useState, useEffect } from "react";
import { User } from "@/lib/auth/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

  useEffect(() => {
    // When dialog closes, reset document body styles
    if (!isOpen) {
      // Allow a moment for transitions to complete
      const timer = setTimeout(() => {
        document.body.style.pointerEvents = '';
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Return null when not open to fully unmount
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && !isDeleting) {
        setTimeout(() => onClose(), 0);
      }
    }}>
      <DialogContent 
        className="sm:max-w-[425px]"
        onPointerDownOutside={(e) => {
          // Prevent events from bubbling through
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-red-600">Delete User</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the user
            account for <span className="font-medium">{user?.name || user?.email || "this user"}</span>.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              if (!isDeleting) onClose();
            }}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDelete();
            }}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}