import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useReactivateUserMutation } from "@/services/auth/authApi";
import { useFocusManagement } from "@/hooks/useFocusManagement";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface ReactivateUserButtonProps {
  userId: string;
  userEmail?: string;
  variant?:
    | "default"
    | "outline"
    | "destructive"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
}

const ReactivateUserButton: FC<ReactivateUserButtonProps> = ({
  userId,
  userEmail,
  variant = "outline",
  size = "sm",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reactivateUser, { isLoading }] = useReactivateUserMutation();

  useFocusManagement({
    onEscape: () => setIsOpen(false),
    enabled: isOpen,
  });

  const handleReactivateUser = async () => {
    console.log("Attempting to reactivate user for userId:", userId);
    console.log("userId type:", typeof userId);
    console.log("userId length:", userId?.length);

    if (!userId || userId.trim() === "") {
      toast.error("Failed to reactivate user", {
        description: "User ID is missing or empty",
        icon: <AlertTriangle className="h-4 w-4" />,
      });
      return;
    }

    try {
      await reactivateUser(userId).unwrap();
      toast.success("User account reactivated successfully!", {
        description: userEmail
          ? `Reactivated account for: ${userEmail}`
          : `Reactivated account for user ID: ${userId}`,
        icon: <CheckCircle className="h-4 w-4" />,
      });
      setIsOpen(false);
    } catch (error: any) {
      console.error("Reactivate user error:", error);
      toast.error("Failed to reactivate user account", {
        description: error?.data?.message || "An unexpected error occurred",
        icon: <AlertTriangle className="h-4 w-4" />,
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={disabled || isLoading}
          className="gap-2"
        >
          <Shield className="h-4 w-4" />
          Reactivate User
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Reactivate User Account
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p className="mb-2">
                Are you sure you want to reactivate this user account?
              </p>
              {userEmail && (
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                  <strong>User:</strong> {userEmail}
                </div>
              )}
              <p className="mt-2 text-sm text-muted-foreground">
                This action will unlock their account and allow them to login
                again.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReactivateUser}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Reactivating...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Reactivate Account
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReactivateUserButton;
