"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, XIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { fr } from "date-fns/locale";
import { DateRange } from "react-day-picker";

type DateRangeFilterDropdownProps<TData> = {
  table: Table<TData>;
  columnId: string;
};

export function DateRangeFilterDropdown<TData>({
  table,
  columnId,
}: DateRangeFilterDropdownProps<TData>) {
  const column = table.getColumn(columnId);
  const [date, setDate] = React.useState<DateRange | undefined>();

  // Predefined date ranges
  const predefinedRanges = {
    "this-week": {
      from: new Date(),
      to: addDays(new Date(), 7),
    },
    "this-month": {
      from: new Date(),
      to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    },
    "next-30-days": {
      from: new Date(),
      to: addDays(new Date(), 30),
    },
  };

  // Apply the filter
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDate(range);
    column?.setFilterValue(range ? [range.from, range.to] : undefined);
  };

  // Handle predefined range selection
  const handlePredefinedRange = (value: string) => {
    if (value === "clear") {
      handleDateRangeChange(undefined);
      return;
    }
    
    const range = predefinedRanges[value as keyof typeof predefinedRanges];
    if (range) {
      handleDateRangeChange(range);
    }
  };

  // Format the date range for display
  const formatDateRange = () => {
    if (!date?.from) return "";
    if (!date.to) return format(date.from, "P", { locale: fr });
    return `${format(date.from, "P", { locale: fr })} - ${format(date.to, "P", { locale: fr })}`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 mr-1" />
          Expiration
          {date && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
              <span className="max-w-[100px] truncate">{formatDateRange()}</span>
              <XIcon 
                className="h-3 w-3" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDateRangeChange(undefined);
                }} 
              />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b">
          <Select onValueChange={handlePredefinedRange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner une période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">Cette semaine</SelectItem>
              <SelectItem value="this-month">Ce mois</SelectItem>
              <SelectItem value="next-30-days">30 prochains jours</SelectItem>
              <SelectItem value="clear">Effacer la sélection</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={handleDateRangeChange}
          numberOfMonths={2}
          locale={fr}
        />
      </PopoverContent>
    </Popover>
  );
}
