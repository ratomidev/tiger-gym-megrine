"use client";

import { Adherent } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash, Eye } from "lucide-react";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { InputSearch } from "@/components/member/table/InputSearch";
import { isSameDay } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface MemberTableProps {
  data: Adherent[];
  onDataUpdate?: (updatedData: Adherent[]) => void;
}

export function MemberTable({ data, onDataUpdate }: MemberTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [adherentToDelete, setAdherentToDelete] = useState<Adherent | null>(
    null
  );
  const [showEmailColumn, setShowEmailColumn] = useState(true);
  const [showAbonnementColumn, setShowAbonnementColumn] = useState(true);
  const [showPhoneColumn, setShowPhoneColumn] = useState(true);
  const [showActionsColumn, setShowActionsColumn] = useState(true);
  const [showEndDateColumn, setShowEndDateColumn] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setShowEmailColumn(window.innerWidth >= 825);
      setShowAbonnementColumn(window.innerWidth >= 650);
      setShowPhoneColumn(window.innerWidth >= 550);
      setShowActionsColumn(window.innerWidth >= 480);
      setShowEndDateColumn(window.innerWidth >= 410);
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((adherent) => {
      // Filter by search term
      const fullName =
        `${adherent.firstName} ${adherent.lastName}`.toLowerCase();
      const matchesSearchTerm = fullName.includes(searchTerm.toLowerCase());

      // Filter by status
      let matchesStatus = true;
      if (statusFilter) {
        if (statusFilter === "none") {
          // Filter for adherents without subscription
          matchesStatus = !adherent.subscription;
        } else if (adherent.subscription) {
          // Filter for specific status if subscription exists
          matchesStatus =
            adherent.subscription.status.toLowerCase() === statusFilter;
        } else {
          // If looking for a specific status but no subscription exists, don't include
          matchesStatus = false;
        }
      }

      // Filter by expiration date
      let matchesDate = true;
      if (dateFilter && adherent.subscription?.endDate) {
        const endDate = new Date(adherent.subscription.endDate);
        matchesDate = isSameDay(endDate, dateFilter);
      } else if (dateFilter) {
        // If filtering by date but no subscription/endDate exists
        matchesDate = false;
      }

      return matchesSearchTerm && matchesStatus && matchesDate;
    });
  }, [data, searchTerm, statusFilter, dateFilter]);

  const handleRowClick = (id: string) => {
    router.push(`/details-adherent/${id}`);
  };

  const handleDeleteClick = (adherent: Adherent, e: React.MouseEvent) => {
    e.stopPropagation();
    setAdherentToDelete(adherent);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!adherentToDelete) return;

    try {
      const response = await fetch(`/api/adherents/${adherentToDelete.id}`, {
        method: "DELETE",
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to delete adherent");
      }

      if (responseData.success) {
        toast.success("Adhérent supprimé avec succès", {
          description: `${adherentToDelete.firstName} ${adherentToDelete.lastName} a été supprimé définitivement.`,
          duration: 3000,
        });

        // Update the local data immediately to reflect the change
        const updatedData = data.filter(
          (adherent) => adherent.id !== adherentToDelete.id
        );
        if (onDataUpdate) {
          onDataUpdate(updatedData);
        }

        setAdherentToDelete(null);
        setShowDeleteDialog(false);
      } else {
        throw new Error("Deletion failed - no success response");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Erreur lors de la suppression", {
        description: (error as Error).message,
        duration: 4000,
      });
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: fr });
    } catch (error) {
      return "Date invalide" + error;
    }
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-500 border-gray-200";
    switch (status.toLowerCase()) {
      case "actif":
        return "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100";
      case "suspendu":
        return "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100";
      case "expired":
        return "bg-red-50 text-red-600 border-red-200 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Confirmer la suppression"
        description="Êtes-vous sûr de vouloir supprimer cet adhérent? Cette action est irréversible."
        itemName={
          adherentToDelete
            ? `${adherentToDelete.firstName} ${adherentToDelete.lastName}`
            : undefined
        }
        onConfirm={handleDeleteConfirm}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <InputSearch
          onSearch={setSearchTerm}
          onStatusFilter={setStatusFilter}
          onDateFilter={setDateFilter}
          selectedStatus={statusFilter}
          selectedDate={dateFilter}
          placeholder="Rechercher par nom ou prénom..."
        />
        <div className="text-sm text-gray-500">
          {filteredData.length} adhérent
          {filteredData.length !== 1 ? "s" : ""} trouvé
          {filteredData.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="rounded-md border">
        <div className="overflow-auto max-h-[500px]">
          <Table>
            <TableHeader className="bg-white sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-[250px]">Nom et Prénom</TableHead>
                {showPhoneColumn && (
                  <TableHead className="w-[100px]">Tél</TableHead>
                )}
                {showEmailColumn && (
                  <TableHead className="w-[180px]">Mail</TableHead>
                )}
                {showAbonnementColumn && (
                  <TableHead className="w-[150px]">Abonnement</TableHead>
                )}
                <TableHead className="w-[100px]">Status</TableHead>
                {showEndDateColumn && (
                  <TableHead className="w-[130px]">
                    Fin d&apos;abonnement
                  </TableHead>
                )}
                {showActionsColumn && (
                  <TableHead className="text-right w-[80px]">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((adherent) => (
                  <TableRow
                    key={adherent.id}
                    onClick={() => handleRowClick(adherent.id)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {adherent.photoUrl ? (
                            <AvatarImage
                              src={adherent.photoUrl}
                              alt={`${adherent.firstName} ${adherent.lastName}`}
                            />
                          ) : (
                            <AvatarFallback>
                              {getInitials(
                                adherent.firstName,
                                adherent.lastName
                              )}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium">{`${adherent.firstName} ${adherent.lastName}`}</p>
                          <p className="text-xs text-gray-500">
                            {adherent.sexe === "M" ? "Homme" : "Femme"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    {showPhoneColumn && (
                      <TableCell>
                        <p className="text-sm">{adherent.phone}</p>
                      </TableCell>
                    )}
                    {showEmailColumn && (
                      <TableCell>
                        <p className="text-sm">{adherent.email}</p>
                      </TableCell>
                    )}
                    {showAbonnementColumn && (
                      <TableCell>
                        {adherent.subscription ? (
                          <div>
                            <p className="font-medium">
                              {adherent.subscription.plan}
                            </p>
                            <p className="text-xs text-gray-500">{`${adherent.subscription.price} DT`}</p>
                          </div>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100">
                            Sans abonnement
                          </Badge>
                        )}
                      </TableCell>
                    )}
                    <TableCell>
                      {adherent.subscription ? (
                        <Badge
                          variant="outline"
                          className={`px-2.5 py-0.5 text-xs font-medium border ${getStatusColor(
                            adherent.subscription.status
                          )}`}
                        >
                          <span className="flex items-center">
                            <span
                              className={`mr-1.5 h-2 w-2 rounded-full ${
                                adherent.subscription.status.toLowerCase() ===
                                "actif"
                                  ? "bg-emerald-500"
                                  : adherent.subscription.status.toLowerCase() ===
                                    "suspendu"
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                              }`}
                            ></span>
                            {adherent.subscription.status}
                          </span>
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-gray-50 text-gray-500 border-gray-200 px-2.5 py-0.5"
                        >
                          <span className="flex items-center">
                            <span className="mr-1.5 h-2 w-2 rounded-full bg-gray-400"></span>
                            N/A
                          </span>
                        </Badge>
                      )}
                    </TableCell>
                    {showEndDateColumn && (
                      <TableCell>
                        {adherent.subscription
                          ? formatDate(adherent.subscription.endDate.toString())
                          : "N/A"}
                      </TableCell>
                    )}
                    {showActionsColumn && (
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className="sr-only">Ouvrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link
                              href={`/details-adherent/${adherent.id}`}
                              passHref
                            >
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir détails
                              </DropdownMenuItem>
                            </Link>
                            <Link
                              href={`/edit-adherent/${adherent.id}`}
                              passHref
                            >
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={(e) => handleDeleteClick(adherent, e)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={
                      [
                        showEmailColumn,
                        showAbonnementColumn,
                        showPhoneColumn,
                        showActionsColumn,
                        showEndDateColumn,
                      ].filter(Boolean).length + 2
                    }
                    className="text-center py-6 text-gray-500"
                  >
                    Aucun adhérent trouvé pour cette recherche
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
