"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { Member } from "../types";

// Utility function to capitalize first letter
function capitalizeFirstLetter(text: string | null | undefined): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function getMemberColumns({
  onView,
  onEdit,
  onDelete,
}: {
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}): ColumnDef<Member>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "membershipNumber",
      header: "N° Adhérent",
      cell: ({ row }) => <div>{row.getValue("membershipNumber")}</div>,
    },
    {
      // Combined column for firstname and lastname
      id: "fullName",
      header: "Nom",
      accessorFn: (row) => `${row.firstname} ${row.lastname}`,
      cell: ({ row }) => {
        const firstName = capitalizeFirstLetter(row.original.firstname);
        const lastName = capitalizeFirstLetter(row.original.lastname);

        return (
          <div className="font-medium">
            {firstName} {lastName}
          </div>
        );
      },
      // Add this filterFn to enable case-insensitive text filtering
      filterFn: (row, id, filterValue) => {
        const fullName =
          `${row.original.firstname} ${row.original.lastname}`.toLowerCase();
        return fullName.includes(String(filterValue).toLowerCase());
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "tel",
      header: "Téléphone",
      cell: ({ row }) => <div>{row.getValue("tel")}</div>,
    },
    {
      accessorKey: "subscriptionType",
      header: "Type d'abonnement",
      cell: ({ row }) => <div>{row.getValue("subscriptionType")}</div>,
    },
    {
      accessorKey: "subscriptionStatus",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.getValue("subscriptionStatus");
        const colorClass =
          status === "actif"
            ? "bg-green-100 text-green-800"
            : status === "expiré"
            ? "bg-red-100 text-red-800"
            : "bg-yellow-100 text-yellow-800";

        return (
          <div className="capitalize">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
            >
              {status as string}
            </span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        if (Array.isArray(value)) {
          // If filtering by multiple statuses
          return value.includes(row.getValue(id));
        }
        // Single status filter (string)
        return value === row.getValue(id);
      },
    },
    {
      accessorKey: "subscriptionEndDate",
      header: "Date d'expiration",
      cell: ({ row }) => {
        const date = new Date(row.getValue("subscriptionEndDate"));
        return <div>{date.toLocaleDateString()}</div>;
      },
      filterFn: (row, id, value) => {
        // Handle date range filtering
        if (Array.isArray(value) && value.length === 2) {
          const [start, end] = value;
          const cellDate = new Date(row.getValue(id));

          // Check if the cell date is within the selected range
          const isAfterStart = start ? cellDate >= new Date(start) : true;
          const isBeforeEnd = end ? cellDate <= new Date(end) : true;

          return isAfterStart && isBeforeEnd;
        }
        return true;
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const member = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(member.id)}
              >
                Copy member ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onView(member.id)}>
                Voir les détails
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(member.id)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(member.id)}
              >
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
