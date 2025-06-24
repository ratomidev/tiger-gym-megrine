"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { CirclePlus } from "lucide-react";

type StatusFilterDropdownProps<TData> = {
  table: Table<TData>;
  columnId: string;
};

export function StatusFilterDropdown<TData>({
  table,
  columnId,
}: StatusFilterDropdownProps<TData>) {
  const column = table.getColumn(columnId);
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([]);

  const statuses = [
    { value: "actif", label: "Actif" },
    { value: "expiré", label: "Expiré" },
    { value: "suspendu", label: "Suspendu" },
  ];

  const handleStatusChange = (value: string) => {
    let newSelectedStatuses: string[];

    if (selectedStatuses.includes(value)) {
      // Remove status if already selected
      newSelectedStatuses = selectedStatuses.filter(
        (status) => status !== value
      );
    } else {
      // Add status if not already selected
      newSelectedStatuses = [...selectedStatuses, value];
    }

    setSelectedStatuses(newSelectedStatuses);

    // Apply filters to the column
    if (newSelectedStatuses.length === 0) {
      column?.setFilterValue(undefined);
    } else if (newSelectedStatuses.length === 1) {
      column?.setFilterValue(newSelectedStatuses[0]);
    } else {
      // For multiple statuses, we'll need to adjust the filterFn in the column definition
      column?.setFilterValue(newSelectedStatuses);
    }
  };

  const activeFiltersCount = selectedStatuses.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <CirclePlus className="h-4 w-4 mr-1" />
          Statut
          {activeFiltersCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        {statuses.map((status) => (
          <DropdownMenuItem
            key={status.value}
            onClick={(e) => {
              e.preventDefault();
              handleStatusChange(status.value);
            }}
            className="flex items-center space-x-2 px-2 py-1.5 cursor-default"
          >
            <Checkbox
              checked={selectedStatuses.includes(status.value)}
              id={`status-${status.value}`}
              className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <label
              htmlFor={`status-${status.value}`}
              className="flex-1 cursor-pointer"
            >
              {status.label}
            </label>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
