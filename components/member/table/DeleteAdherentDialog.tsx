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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Confirmer la suppression
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cet adhérent? Cette action est
            irréversible et supprimera également sa photo du stockage.
          </DialogDescription>
        </DialogHeader>
        <div className="py-3">
          <p className="text-sm font-medium">
            Vous allez supprimer l&apos;adhérent suivant:
          </p>
          <p className="mt-1 text-sm bg-gray-50 p-2 rounded border border-gray-100">
            {adherent?.firstName} {adherent?.lastName}
          </p>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
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
