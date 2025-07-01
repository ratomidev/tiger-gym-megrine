import React, { useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import { Adherent } from "@/types";

interface DeleteAdherentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adherent: Adherent | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export default function DeleteAdherentDialog({
  open,
  onOpenChange,
  adherent,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteAdherentDialogProps) {
  // More aggressive cleanup when dialog closes
  useEffect(() => {
    // Only run cleanup when dialog closes
    if (!open) {
      // Function to thoroughly clean up all dialog artifacts
      const cleanupDialogArtifacts = () => {
        // Reset body styles
        document.body.style.pointerEvents = "";
        document.body.style.overflow = "";

        // Remove any lingering focus trap elements
        const focusTraps = document.querySelectorAll('[data-radix-focus-guard]');
        focusTraps.forEach(el => el.remove());

        // Remove any dialog backdrops
        const backdrops = document.querySelectorAll('[data-radix-popper-content-wrapper]');
        backdrops.forEach(el => el.remove());

        // Remove closed dialogs
        const dialogs = document.querySelectorAll('[role="dialog"]');
        dialogs.forEach(el => {
          if (!el.hasAttribute('data-state') || el.getAttribute('data-state') === 'closed') {
            el.remove();
          }
        });

        // Make sure no elements have pointer-events: none
        document.querySelectorAll('*').forEach(el => {
          if (window.getComputedStyle(el).pointerEvents === 'none') {
            (el as HTMLElement).style.pointerEvents = 'auto';
          }
        });
      };

      // Run cleanup immediately
      cleanupDialogArtifacts();

      // Run again after a delay to catch any elements that might appear during animation
      setTimeout(cleanupDialogArtifacts, 100);
      setTimeout(cleanupDialogArtifacts, 500);
    }
  }, [open]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open && !isDeleting) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, isDeleting, onOpenChange]);

  // If dialog is not open and no adherent, don't render anything
  if (!open && !adherent) return null;

  return (
    <AlertDialog
      open={open}
      onOpenChange={(newOpen) => {
        if (isDeleting && !newOpen) return; // Prevent closing while deleting
        onOpenChange(newOpen);
      }}
    >
      <AlertDialogContent
        // Force pointer events to be auto
        style={{ pointerEvents: 'auto' }}
        className="z-50"
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer l&apos;adhérent{" "}
            <span className="font-semibold">
              {adherent ? `${adherent.firstName} ${adherent.lastName}` : ""}
            </span>
            ? Cette action ne peut pas être annulée.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            disabled={isDeleting}
            className="focus:ring-0"
          >
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600 focus:ring-0"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suppression...
              </>
            ) : (
              "Supprimer"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
