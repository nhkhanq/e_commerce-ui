import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle";
import { Link } from "react-router-dom";
import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle />
        <Button asChild variant="ghost">
          <Link to="/cart">
            <ShoppingCart /> Cart
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to="/sign-in">
            <ShoppingCart /> Sign In
          </Link>
        </Button>
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
                <ShoppingCart /> Cart
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/sign-in">
                <UserIcon /> Sign In
              </Link>
            </Button>
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
