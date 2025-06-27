"use client";

import { useState, ChangeEvent } from "react";
import {
  Search,
  X,
  CirclePlus,
  Check,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface InputSearchProps {
  onSearch: (searchTerm: string) => void;
  onStatusFilter: (status: string | null) => void;
  onDateFilter: (date: Date | null) => void;
  placeholder?: string;
  selectedStatus: string | null;
  selectedDate: Date | null;
}

export function InputSearch({
  onSearch,
  onStatusFilter,
  onDateFilter,
  placeholder = "Rechercher un adhérent...",
  selectedStatus,
  selectedDate,
}: InputSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    onSearch("");
  };

  const statuses = [
    { label: "Actif", value: "actif" },
    { label: "Suspendu", value: "suspendu" },
    { label: "Expiré", value: "expired" },
    { label: "Sans abonnement", value: "none" },
  ];

  const getStatusColor = (status: string | null) => {
    if (!status) return "bg-gray-100 text-gray-700";

    switch (status) {
      case "actif":
        return "bg-emerald-50 text-emerald-600";
      case "suspendu":
        return "bg-amber-50 text-amber-600";
      case "expired":
        return "bg-red-50 text-red-600";
      case "none":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleStatusClick = (status: string | null) => {
    // If the clicked status is already selected, clear the filter
    if (status === selectedStatus) {
      onStatusFilter(null);
    } else {
      onStatusFilter(status);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 w-full">
      <div className="relative flex-grow max-w-sm">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pl-10 pr-10 w-full bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
        />
        {searchTerm && (
          <Button
            onClick={clearSearch}
            variant="ghost"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            type="button"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white">
            <CirclePlus className="h-4 w-4" />
            <span className="hidden sm:inline">Statut:</span>
            {selectedStatus ? (
              <Badge className={`${getStatusColor(selectedStatus)} ml-1`}>
                {selectedStatus === "none"
                  ? "Sans abonnement"
                  : selectedStatus.charAt(0).toUpperCase() +
                    selectedStatus.slice(1)}
              </Badge>
            ) : (
              <span>Filtrer</span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {statuses.map((status) => (
            <DropdownMenuItem
              key={status.value}
              className="flex items-center justify-between cursor-pointer"
              onClick={() => handleStatusClick(status.value)}
            >
              <span>{status.label}</span>
              {selectedStatus === status.value && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Date Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`flex items-center gap-2 ${
              selectedDate ? "bg-blue-50 text-blue-600 border-blue-200" : ""
            }`}
          >
            <CalendarIcon className="h-4 w-4" />
            {selectedDate ? (
              <span>{format(selectedDate, "dd/MM/yyyy", { locale: fr })}</span>
            ) : (
              <span>Date d&apos;expiration</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={selectedDate || undefined}
            onSelect={(date) => {
              // Toggle date if same date is selected
              if (
                date &&
                selectedDate &&
                date.getTime() === selectedDate.getTime()
              ) {
                onDateFilter(null);
              } else {
                onDateFilter(date || null);
              }
            }}
            initialFocus
          />
          {selectedDate && (
            <div className="p-2 border-t flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDateFilter(null)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Effacer
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
