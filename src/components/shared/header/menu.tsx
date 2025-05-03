import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle";
import { Link } from "react-router-dom";
import { EllipsisVertical, ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserButton from "./user-button"; // Import the UserButton component

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle />
        <Button asChild variant="ghost">
          <Link to="/cart">
            <ShoppingCart className="mr-2 h-4 w-4" /> Cart
          </Link>
        </Button>
        <UserButton /> {/* Replace the Sign In button with UserButton */}
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetTitle className="pl-2">Menu</SheetTitle>
            <ModeToggle />
            <Button asChild variant="ghost">
              <Link to="/cart">
                <ShoppingCart className="mr-2 h-4 w-4" /> Cart
              </Link>
            </Button>
            <UserButton /> {/* Replace the Sign In button with UserButton */}
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;