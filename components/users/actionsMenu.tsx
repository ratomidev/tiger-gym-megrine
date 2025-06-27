"use client";

import { User } from "@/lib/auth/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface ActionsMenuProps {
  user: User;
  onEditClick?: (user: User) => void; 
  onDeleteClick?: (user: User) => void;
}

export function ActionsMenu({ user, onEditClick, onDeleteClick }: ActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => onEditClick && onEditClick(user)}
          className="flex items-center cursor-pointer"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDeleteClick && onDeleteClick(user)}
          className="flex items-center text-red-600 cursor-pointer focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4 text-red-600" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}