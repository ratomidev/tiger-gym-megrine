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

import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash, Eye } from "lucide-react";
import Link from "next/link";
import { useState, useMemo, useEffect, JSX } from "react";
import { InputSearch } from "@/components/member/table/InputSearch";
import { isSameDay } from "date-fns";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import DeleteAdherentDialog from "./DeleteAdherentDialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface MemberTableProps {
  data: Adherent[];
  onDataUpdate?: (updatedData: Adherent[]) => void;
}

export function MemberTable({ data, onDataUpdate }: MemberTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState<string | null>(searchParams.get("status") || null);
  const [dateFilter, setDateFilter] = useState<Date | null>(() => {
    const d = searchParams.get("date");
    return d ? new Date(d) : null;
  });

  const [showEmailColumn, setShowEmailColumn] = useState(true);
  const [showAbonnementColumn, setShowAbonnementColumn] = useState(true);
  const [showPhoneColumn, setShowPhoneColumn] = useState(true);
  const [showActionsColumn, setShowActionsColumn] = useState(true);
  const [showEndDateColumn, setShowEndDateColumn] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const itemsPerPage = 10;

  // State for delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adherentToDelete, setAdherentToDelete] = useState<Adherent | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const updateUrl = (updates: Record<string, string | null | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    let hasChanges = false;

    Object.entries(updates).forEach(([key, value]) => {
      const currentValue = params.get(key);
      if (value === null || value === undefined || value === "") {
        if (params.has(key)) {
          params.delete(key);
          hasChanges = true;
        }
      } else {
        if (currentValue !== value) {
          params.set(key, value);
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
    updateUrl({ search: val, page: "1" });
  };

  const handleStatusChange = (val: string | null) => {
    setStatusFilter(val);
    setCurrentPage(1);
    updateUrl({ status: val, page: "1" });
  };

  const handleDateChange = (val: Date | null) => {
    setDateFilter(val);
    setCurrentPage(1);
    updateUrl({ date: val ? val.toISOString() : null, page: "1" });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrl({ page: page <= 1 ? null : page.toString() });
  };

  // Sync state from URL on changes (e.g. Back/Forward navigation)
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlStatus = searchParams.get("status") || null;
    const urlDateString = searchParams.get("date");
    const urlDate = urlDateString ? new Date(urlDateString) : null;
    const urlPage = Number(searchParams.get("page")) || 1;

    setSearchTerm(prev => prev !== urlSearch ? urlSearch : prev);
    setStatusFilter(prev => prev !== urlStatus ? urlStatus : prev);
    
    setDateFilter(prev => {
      const prevStr = prev?.toISOString() || "";
      const newStr = urlDate?.toISOString() || "";
      return prevStr !== newStr ? urlDate : prev;
    });
    
    setCurrentPage(prev => prev !== urlPage ? urlPage : prev);
  }, [searchParams]);

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

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Adjust currentPage if it exceeds totalPages after filtering
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      handlePageChange(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      handlePageChange(1);
    }
  }, [totalPages, currentPage]);

  const handleRowClick = (id: string) => {
    router.push(`/details-adherent/${id}`);
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
    if (!status) return "bg-muted text-muted-foreground border-border";
    switch (status.toLowerCase()) {
      case "actif":
        return "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-900";
      case "suspendu":
        return "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800 dark:hover:bg-amber-900";
      case "expired":
        return "bg-red-50 text-red-600 border-red-200 hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900";
      default:
        return "bg-muted text-muted-foreground border-border hover:bg-muted/80";
    }
  };

  // Delete handler
  const handleDeleteClick = (adherent: Adherent) => {
    // First ensure any lingering dialog elements are cleaned up
    document.querySelectorAll('[role="dialog"]').forEach((el) => el.remove());
    document
      .querySelectorAll("[data-radix-focus-guard]")
      .forEach((el) => el.remove());
    document.body.style.pointerEvents = "";
    document.body.style.overflow = "";

    // Then set the adherent and open the dialog
    setAdherentToDelete(adherent);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!adherentToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/adherents/${adherentToDelete.id}`, {
        method: "DELETE",
      });
      const dataRes = await response.json();
      if (!response.ok || !dataRes.success) {
        throw new Error(dataRes.error || "Erreur lors de la suppression");
      }

      // Update the UI
      if (onDataUpdate) {
        onDataUpdate(data.filter((a) => a.id !== adherentToDelete.id));
      }

      // Close dialog and reset state
      setDeleteDialogOpen(false);

      // Clean up with a delay to ensure animations complete
      setTimeout(() => {
        setAdherentToDelete(null);
        // Forcefully clean up any lingering dialog elements
        document
          .querySelectorAll('[role="dialog"]')
          .forEach((el) => el.remove());
        document
          .querySelectorAll("[data-radix-focus-guard]")
          .forEach((el) => el.remove());
        document.body.style.pointerEvents = "";
        document.body.style.overflow = "";
      }, 300);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    // Close the dialog
    setDeleteDialogOpen(false);

    // Clean up with multiple delayed attempts to catch all artifacts
    const cleanup = () => {
      document.body.style.pointerEvents = "";
      document.body.style.overflow = "";
      document.querySelectorAll('[role="dialog"]').forEach((el) => el.remove());
      document
        .querySelectorAll("[data-radix-focus-guard]")
        .forEach((el) => el.remove());
      document
        .querySelectorAll("[data-radix-popper-content-wrapper]")
        .forEach((el) => el.remove());
    };

    // Execute cleanup multiple times with increasing delays
    cleanup();
    setTimeout(cleanup, 100);
    setTimeout(() => {
      cleanup();
      setAdherentToDelete(null);
    }, 300);
  };

  return (
    <div className="flex flex-col h-full flex-1 w-full ">
      {/* Delete Confirmation Dialog */}
      <DeleteAdherentDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        adherent={adherentToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDeleting={isDeleting}
      />

      <div className="flex flex-row flex-wrap justify-between items-start md:items-center gap-4 shrink-0 mb-4 w-full">
        <div className="w-full md:w-auto flex-1 min-w-[280px]">
          <InputSearch
            searchTerm={searchTerm}
            onSearch={handleSearchChange}
            onStatusFilter={handleStatusChange}
            onDateFilter={handleDateChange}
            selectedStatus={statusFilter}
            selectedDate={dateFilter}
            placeholder="Rechercher par nom ou prénom..."
          />
        </div>
        <div className="text-sm text-gray-500 shrink-0">
          {paginatedData.length > 0
            ? `${startIndex + 1}-${Math.min(endIndex, filteredData.length)} sur ${filteredData.length} adhérent${filteredData.length !== 1 ? "s" : ""}`
            : `${filteredData.length} adhérent${filteredData.length !== 1 ? "s" : ""} trouvé${filteredData.length !== 1 ? "s" : ""}`}
        </div>
      </div>

      <div className="rounded-md border w-full flex-1 flex flex-col min-h-0 bg-background">
        <div className="overflow-auto flex-1 scrollbar-hide">
          <Table>
            <TableHeader className="sticky top-0 z-10">
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
              {paginatedData.length > 0 ? (
                paginatedData.map((adherent) => (
                  <TableRow
                    key={adherent.id}
                    onClick={() => handleRowClick(adherent.id)}
                    className="cursor-pointer hover:bg-muted/50"
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
                          <p className="text-xs text-muted-foreground">
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
                            <div>{adherent.subscription.plan}</div>
                            <div className="text-sm text-muted-foreground">
                              {`${adherent.subscription.price} DT`}
                              {adherent.subscription.remaining > 0 && (
                                <span className="text-amber-600 dark:text-amber-400 ml-1">
                                  (Reste: {adherent.subscription.remaining} DT)
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          "N/A"
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
                          className="bg-muted text-muted-foreground border-border px-2.5 py-0.5"
                        >
                          <span className="flex items-center">
                            <span className="mr-1.5 h-2 w-2 rounded-full bg-muted-foreground"></span>
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
                              className="text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(adherent);
                              }}
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
                    className="text-center py-6 text-muted-foreground"
                  >
                    Aucun adhérent trouvé pour cette recherche
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {/* Pagination - outside the border */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-auto pt-4 shrink-0">
          <Pagination>
            <PaginationContent>
              {(() => {
                const items: JSX.Element[] = [];

                // Previous button
                items.push(
                  <PaginationItem key="prev">
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(Math.max(currentPage - 1, 1));
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                );

                // First page (always shown)
                items.push(
                  <PaginationItem key={1}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === 1}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(1);
                      }}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                );

                let lastShownPage = 1;

                // Current page (if not first and not last)
                if (currentPage !== 1 && currentPage !== totalPages) {
                  items.push(
                    <PaginationItem key={currentPage}>
                      <PaginationLink
                        href="#"
                        isActive
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage);
                        }}
                      >
                        {currentPage}
                      </PaginationLink>
                    </PaginationItem>
                  );
                  lastShownPage = currentPage;
                }

                // Ellipsis after last shown page if gap to totalPages > 1
                if (totalPages - lastShownPage > 1) {
                  items.push(
                    <PaginationItem key="ellipsis">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                // Last page (if different from first and not already shown as current)
                if (totalPages !== lastShownPage && totalPages > 1) {
                  items.push(
                    <PaginationItem key={totalPages}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === totalPages}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(totalPages);
                        }}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                // Next button
                items.push(
                  <PaginationItem key="next">
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(Math.min(currentPage + 1, totalPages));
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                );

                return items;
              })()}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
