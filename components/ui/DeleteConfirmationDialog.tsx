"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  itemName?: string;
  onConfirm: () => Promise<void>;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  title = "Confirmer la suppression",
  description = "Êtes-vous sûr de vouloir supprimer cet élément? Cette action est irréversible.",
  itemName,
  onConfirm,
}: DeleteConfirmationDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      toast.error("Erreur lors de la suppression", {
        description: (error as Error).message,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (!isDeleting) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {itemName && (
          <div className="py-3">
            <p className="text-sm font-medium">
              Vous allez supprimer l&apos;élément suivant:
            </p>
            <p className="mt-1 text-sm bg-gray-50 p-2 rounded border border-gray-100">
              {itemName}
            </p>
          </div>
        )}
        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                Suppression...
              </>
            ) : (
              "Supprimer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
