"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

import { getMemberColumns } from "./MemberTableColumns";
import { FilterInput } from "./FilterInput";
import { ColumnVisibilityToggle } from "./ColumnVisibilityToggle";
import { TablePagination } from "./TablePagination";
import { StatusFilterDropdown } from "./StatusFilterDropdown";
import { DateRangeFilterDropdown } from "./DateRangeFilterDropdown";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Member } from "./types";

type MemberTableProps = {
  members: Member[];
  defaultColumnVisibility?: Partial<Record<string, boolean>>;
};

export function MemberTable({
  members,
  defaultColumnVisibility = {},
}: MemberTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = getMemberColumns({
    onView: (id) => (window.location.href = `/details-member?id=${id}`),
    onEdit: (id) => (window.location.href = `/edit-member?id=${id}`),
    onDelete: (id) => {
      console.log("Delete member:", id);
    },
  });

  const table = useReactTable({
    data: members,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
      <div className="flex items-center py-4 gap-2 flex-wrap">
        <FilterInput
          table={table}
          columnId="fullName" // Changed from "firstname" to "fullName"
          placeholder="Filtrer par nom..."
        />
        <StatusFilterDropdown table={table} columnId="subscriptionStatus" />
        <DateRangeFilterDropdown table={table} columnId="subscriptionEndDate" />
        <ColumnVisibilityToggle
          table={table}
          defaultColumnVisibility={defaultColumnVisibility}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() =>
                    (window.location.href = `/details-member?id=${row.original.id}`)
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Aucun adhérent trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination table={table} />
    </div>
  );
}
