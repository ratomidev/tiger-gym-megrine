"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Helper functions for date formatting
function formatDateForDisplay(date: Date | undefined) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatDateForInput(date: Date | undefined) {
  if (!date) {
    return "";
  }
  // Use timezone-safe formatting to avoid date shifting
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

interface DatePickerProps {
  id?: string;
  label?: string;
  value?: string; // Expected in YYYY-MM-DD format
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
  required?: boolean;
  width?: "sm" | "md" | "lg" | "full" | string;
}

export function DatePicker({
  id,
  label,
  value,
  onChange,
  placeholder = "Sélectionner une date",
  disabled = false,
  className,
  error = false,
  required = false,
  width = "full",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(() => {
    if (!value) return undefined;
    if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = value.split('-').map(Number);
      return new Date(year, month - 1, day); // month is 0-indexed
    }
    return new Date(value);
  });

  // Convert string value to Date for display and calendar - timezone safe
  const selectedDate = React.useMemo(() => {
    if (!value) return undefined;
    if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = value.split('-').map(Number);
      return new Date(year, month - 1, day); // month is 0-indexed
    }
    return new Date(value);
  }, [value]);
  const displayValue = formatDateForDisplay(selectedDate);

  const handleDateSelect = (date: Date | undefined) => {
    if (date && onChange) {
      const formattedDate = formatDateForInput(date);
      onChange(formattedDate);
      setMonth(date);
    }
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // For YYYY-MM-DD format, create date without timezone issues
    if (inputValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = inputValue.split('-').map(Number);
      const date = new Date(year, month - 1, day); // month is 0-indexed
      
      if (isValidDate(date) && onChange) {
        const formattedDate = formatDateForInput(date);
        onChange(formattedDate);
        setMonth(date);
      }
    } else {
      // Fallback for other formats
      const date = new Date(inputValue);
      if (isValidDate(date) && onChange) {
        const formattedDate = formatDateForInput(date);
        onChange(formattedDate);
        setMonth(date);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" && !disabled) {
      e.preventDefault();
      setOpen(true);
    }
  };

  // Handle width classes
  const getWidthClass = () => {
    switch (width) {
      case "sm":
        return "w-32"; // ~128px
      case "md":
        return "w-48"; // ~192px
      case "lg":
        return "w-64"; // ~256px
      case "full":
        return "w-full";
      default:
        return width.startsWith("w-") ? width : `w-[${width}]`;
    }
  };

  return (
    <div className={cn("space-y-2", getWidthClass())}>
      {label && (
        <Label htmlFor={id} className="px-1">
          {label} {required && "*"}
        </Label>
      )}
      <div className="relative flex gap-2">
        <Input
          id={id}
          value={displayValue}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "bg-background pr-10 border-gray-200 focus:border-gray-400 transition-colors",
            error && "border-red-500",
            disabled && "bg-gray-50 disabled:cursor-not-allowed",
            className
          )}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
              disabled={disabled}
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Sélectionner une date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={handleDateSelect}
              disabled={disabled}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
