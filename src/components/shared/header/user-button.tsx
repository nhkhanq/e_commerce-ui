import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, ShoppingBag, UserCircle } from "lucide-react";
import { useLogoutMutation } from "@/services/auth/authApi";
import { useAuth } from "@/context/auth-context";

const UserButton = () => {
  const { user, isAuthenticated, logout: authLogout } = useAuth();
  const [logoutApi, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    if (isLoading) return;

    try {
      await logoutApi().unwrap();
      authLogout();
    } catch (error) {
      console.error("Logout failed:", error);
      // Force logout even if API call fails
      authLogout();
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <Button asChild variant="ghost">
        <Link to="/login">
          <User className="mr-2 h-4 w-4" /> Sign In
        </Link>
      </Button>
    );
  }

  const firstInitial = user.email.charAt(0).toUpperCase();

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700"
          >
            {firstInitial}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium leading-none">
                User Account
              </div>
              <div className="text-xs text-muted-foreground leading-none">
                {user.email}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <Link to="/profile" className="w-full flex items-center">
              <UserCircle className="mr-2 h-4 w-4" /> Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/orders" className="w-full flex items-center">
              <ShoppingBag className="mr-2 h-4 w-4" /> Order History
            </Link>
          </DropdownMenuItem>
          {user.permissions.includes("ROLE_ADMIN") && (
            <DropdownMenuItem>
              <Link to="/admin/dashboard" className="w-full flex items-center">
                Admin Dashboard
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center"
            disabled={isLoading}
          >
            <LogOut className="mr-2 h-4 w-4" />{" "}
            {isLoading ? "Signing Out..." : "Sign Out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
