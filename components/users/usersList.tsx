"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { User } from "@/lib/auth/types";
import { NewUserForm, NewUserFormValues } from "./newUserForm";
import { toast } from "sonner";
import { ActionsMenu } from "./actionsMenu";
import { EditDialog } from "./editDialog";
import { DeleteDialog } from "./deleteDialog";

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  // Dialog open state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Handle Add User button click - open dialog
  const handleAddUserClick = () => {
    setIsDialogOpen(true);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users");

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form submission
  const handleCreateUser = async (values: NewUserFormValues) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      toast.success("User created successfully");
      setIsDialogOpen(false);
      // Refresh user list
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create user"
      );
      throw error; // Re-throw for the form to handle
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Modify the handler functions to ensure clean state management
  const handleEditUser = (user: User) => {
    // Clean up any existing dialogs first
    setIsDeleteDialogOpen(false);
    // Set the user and open dialog
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    // Clean up any existing dialogs first
    setIsEditDialogOpen(false);
    // Set the user and open dialog
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Add this function
  const resetDialogState = () => {
    // Reset all dialog states
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);

    // Force restore pointer events
    document.body.style.pointerEvents = "";

    // Clear user selection with delay
    setTimeout(() => {
      setSelectedUser(null);
    }, 150);
  };

  // Modify the onClose handlers
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    resetDialogState();
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    resetDialogState();
  };

  return (
    <div className="w-full p-4 flex justify-center">
      <Card className="shadow-sm w-full max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle>Users Management</CardTitle>
          <CardDescription>
            View and manage all users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleAddUserClick}>Add New User</Button>
          </div>

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : error ? (
            <div className="p-4 border rounded-md border-red-200 bg-red-50 text-red-600">
              {error}
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Created
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24">
                        {searchQuery
                          ? "No users matching your search"
                          : "No users found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name || "N/A"}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {user.email}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {format(new Date(user.createdAt), "PPP")}
                        </TableCell>
                        <TableCell className="text-right">
                          <ActionsMenu
                            user={user}
                            onEditClick={handleEditUser}
                            onDeleteClick={handleDeleteUser}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <NewUserForm
            onSubmit={handleCreateUser}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <EditDialog
        user={selectedUser}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onUserUpdated={fetchUsers}
      />

      {/* Delete User Dialog */}
      <DeleteDialog
        user={selectedUser}
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onUserDeleted={fetchUsers}
      />
    </div>
  );
}
