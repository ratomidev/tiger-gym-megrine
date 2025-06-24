// This file will contain the filter input component
"use client";

import { Input } from "@/components/ui/input";
import React from "react";
import { Table } from "@tanstack/react-table";

type FilterInputProps<TData> = {
  table: Table<TData>;
  columnId: string;
  placeholder?: string;
};

export function FilterInput<TData>({
  table,
  columnId,
  placeholder = "Filtrer...",
}: FilterInputProps<TData>) {
  const column = table.getColumn(columnId);
  const [value, setValue] = React.useState("");

  // Update the table filter when input value changes
  const onFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    column?.setFilterValue(newValue);
  };

  // Reset the UI input value when column filter value is cleared externally
  React.useEffect(() => {
    const currentFilterValue = column?.getFilterValue() as string;
    if (currentFilterValue === undefined || currentFilterValue === null) {
      setValue("");
    }
  }, [column?.getFilterValue()]);

  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={onFilterChange}
      className="max-w-sm"
    />
  );
}
