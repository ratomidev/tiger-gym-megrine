"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

type ColumnVisibilityToggleProps<TData> = {
  table: Table<TData>;
  defaultColumnVisibility?: Partial<Record<string, boolean>>;
};

export function ColumnVisibilityToggle<TData>({
  table,
  defaultColumnVisibility = {},
}: ColumnVisibilityToggleProps<TData>) {
  // Initialize column visibility state when component mounts
  React.useEffect(() => {
    // Default column states
    const defaultState = {
      // By default, hide most columns
      select: false,
      firstname: false,
      lastname: false,
      tel: false,
      subscriptionStatus: false,
      actions: true,
      membershipNumber: false,
      email: false,
      subscriptionType: false,
      subscriptionEndDate: false,
      // Override with props
      ...defaultColumnVisibility,
    };

    // Apply column visibility state
    const visibilityEntries = Object.entries(defaultState);
    for (const [columnId, isVisible] of visibilityEntries) {
      const column = table.getColumn(columnId);
      if (column) {
        column.toggleVisibility(isVisible);
      }
    }
  }, [table, defaultColumnVisibility]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          Colonnes <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {translateColumnName(column.id)}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Helper function to translate column IDs to readable names
function translateColumnName(columnId: string): string {
  const translations: Record<string, string> = {
    select: "Sélection",
    firstname: "Prénom",
    lastname: "Nom",
    tel: "Téléphone",
    email: "Email",
    subscriptionStatus: "Statut",
    actions: "Actions",
    membershipNumber: "N° Adhérent",
    subscriptionType: "Type d'abonnement",
    subscriptionEndDate: "Date d'expiration",
  };

  return translations[columnId] || columnId;
}
