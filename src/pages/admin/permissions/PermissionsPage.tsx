import React, { useState } from "react";
import {
  useGetPermissionsQuery,
  useCreatePermissionMutation,
  useDeletePermissionMutation,
  Permission,
} from "@/services/admin/adminApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Shield,
  Key,
  Settings,
  Search,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PermissionsPage: React.FC = () => {
  // State for dialogs and form inputs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newPermissionName, setNewPermissionName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Handler functions
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality can be implemented here
  };

  // Fetch permissions data
  const {
    data: permissions = [],
    isLoading,
    refetch,
  } = useGetPermissionsQuery();

  // Mutation hooks
  const [createPermission, { isLoading: isCreating }] =
    useCreatePermissionMutation();
  const [deletePermission, { isLoading: isDeleting }] =
    useDeletePermissionMutation();

  // Handle deletion dialog
  const handleDeleteClick = (permission: Permission) => {
    setSelectedPermission(permission);
    setDeleteDialogOpen(true);
  };

  // Handle dialog close
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedPermission(null);
  };

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
    setNewPermissionName("");
  };

  // Confirm deletion
  const confirmDelete = async () => {
    if (selectedPermission) {
      try {
        await deletePermission(selectedPermission.name).unwrap();
        toast.success(
          `Permission "${selectedPermission.name}" deleted successfully`
        );
        // Force refetch to update UI
        await refetch();
        handleDeleteDialogClose();
      } catch (error: any) {
        console.error("Error deleting permission:", error);
        const errorMessage =
          error?.data?.message || error?.message || "Unknown error occurred";
        toast.error(`Failed to delete permission: ${errorMessage}`);
      }
    }
  };

  // Handle permission creation
  const handleCreatePermission = async () => {
    if (!newPermissionName.trim()) {
      toast.error("Permission name cannot be empty");
      return;
    }

    try {
      await createPermission({ name: newPermissionName }).unwrap();
      toast.success(`Permission "${newPermissionName}" created successfully`);
      handleCreateDialogClose();
    } catch (error: any) {
      console.error("Error creating permission:", error);
      const errorMessage =
        error?.data?.message || error?.message || "Unknown error occurred";
      toast.error(`Failed to create permission: ${errorMessage}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-pulse">
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Permissions Management
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage system permissions and access control
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 mb-8">
            <div className="p-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg w-full flex justify-center items-center">
              <div className="flex items-center gap-6 w-full justify-center">
                <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <Shield className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1 text-center">
                  <p className="text-4xl font-bold text-emerald-900 dark:text-emerald-300">
                    {permissions.length}
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400 text-lg font-medium">
                    Total Permissions
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="mb-6 flex justify-between items-center">
            <form
              onSubmit={handleSearch}
              className="flex gap-4 flex-1 max-w-md"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <Button
                type="submit"
                variant="outline"
                className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Search
              </Button>
            </form>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Permission
            </Button>
          </div>

          {/* Permissions Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableHead className="text-gray-900 dark:text-gray-100">
                    Permission Name
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">
                    Description
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <TableRow key={i} className="h-16">
                          <TableCell>
                            <Skeleton className="h-4 w-full max-w-[300px]" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Skeleton className="h-8 w-8 rounded ml-auto" />
                          </TableCell>
                        </TableRow>
                      ))
                  : permissions.map((permission) => (
                      <TableRow
                        key={permission.name}
                        className="h-16 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                              <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            {permission.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            Permission for {permission.name.toLowerCase()}
                          </p>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            >
                              <DropdownMenuLabel className="text-gray-900 dark:text-gray-100">
                                Actions
                              </DropdownMenuLabel>

                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(permission)}
                                className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                Delete Permission
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={handleDeleteDialogClose}>
        <DialogContent className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">
              Confirm Delete
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this permission "
              {selectedPermission?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleDeleteDialogClose}
              className="border-gray-200 dark:border-gray-700"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Permission Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={handleCreateDialogClose}>
        <DialogContent className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">
              Create New Permission
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Enter a name for the new permission. Permission names should be
              descriptive and follow a consistent format.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label
                htmlFor="permission-name"
                className="text-gray-900 dark:text-gray-100"
              >
                Permission Name
              </Label>
              <Input
                id="permission-name"
                placeholder="e.g., MANAGE_USERS or READ_PRODUCTS"
                value={newPermissionName}
                onChange={(e) => setNewPermissionName(e.target.value)}
                autoComplete="off"
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCreateDialogClose}
              className="border-gray-200 dark:border-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePermission}
              disabled={isCreating || !newPermissionName.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white"
            >
              {isCreating ? "Creating..." : "Create Permission"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PermissionsPage;
