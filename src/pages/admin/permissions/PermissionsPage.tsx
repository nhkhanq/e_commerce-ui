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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
      } catch (error: any) {
        console.error("Error deleting permission:", error);
        const errorMessage =
          error?.data?.message || error?.message || "Unknown error occurred";
        toast.error(`Failed to delete permission: ${errorMessage}`);
      } finally {
        setDeleteDialogOpen(false);
        setSelectedPermission(null);
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
      setNewPermissionName("");
      setCreateDialogOpen(false);
    } catch (error: any) {
      console.error("Error creating permission:", error);
      const errorMessage =
        error?.data?.message || error?.message || "Unknown error occurred";
      toast.error(`Failed to create permission: ${errorMessage}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
          Permissions Management
        </h1>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Permission</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Permissions List</CardTitle>
          <CardDescription>
            Manage your system permissions for user roles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
          ) : permissions.length > 0 ? (
            <div className="rounded-md border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Permission Name</TableHead>
                    <TableHead className="w-24 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((permission) => (
                    <TableRow key={permission.name}>
                      <TableCell className="font-medium">
                        {permission.name}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(permission)}
                          disabled={isDeleting}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <p className="text-muted-foreground mb-4">No permissions found</p>
              <Button
                variant="outline"
                onClick={() => setCreateDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add your first permission
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Permission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the permission "
              {selectedPermission?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Permission Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Permission</DialogTitle>
            <DialogDescription>
              Enter a name for the new permission. Permission names should be
              descriptive and follow a consistent format.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="permission-name">Permission Name</Label>
              <Input
                id="permission-name"
                placeholder="e.g., MANAGE_USERS or READ_PRODUCTS"
                value={newPermissionName}
                onChange={(e) => setNewPermissionName(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePermission}
              disabled={isCreating || !newPermissionName.trim()}
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
