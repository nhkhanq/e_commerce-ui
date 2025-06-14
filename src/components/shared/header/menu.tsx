import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle";
import { Link } from "react-router-dom";
import { EllipsisVertical, ShoppingCart, Heart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserButton from "./user-button";
import { useAuth } from "@/context/auth-context";

const Menu = () => {
  const { hasRole, isAuthenticated } = useAuth();

  // Only check admin role if user is authenticated to avoid errors
  const isAdmin = isAuthenticated ? hasRole("ROLE_ADMIN") : false;

  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle />
        {!isAdmin && (
          <>
            <Button asChild variant="ghost">
              <Link to="/wishlist">
                <Heart className="mr-2 h-4 w-4" /> Wishlist
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/cart">
                <ShoppingCart className="mr-2 h-4 w-4" /> Cart
              </Link>
            </Button>
          </>
        )}
        <UserButton />
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetTitle className="pl-2">Menu</SheetTitle>
            <ModeToggle />
            {!isAdmin && (
              <>
                <Button asChild variant="ghost">
                  <Link to="/wishlist">
                    <Heart className="mr-2 h-4 w-4" /> Wishlist
                  </Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link to="/cart">
                    <ShoppingCart className="mr-2 h-4 w-4" /> Cart
                  </Link>
                </Button>
              </>
            )}
            <UserButton />
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
