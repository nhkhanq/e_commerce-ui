import React from "react";
import { PanelLeftClose, PanelRightClose } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto h-16 flex items-center justify-between px-4 md:px-6">
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelRightClose className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="hidden lg:block">
          <h1 className="text-lg font-semibold">Admin Panel</h1>
        </div>

        <div className="flex-grow flex justify-center lg:hidden">
          <h1 className="text-lg font-semibold">Admin Panel</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* TODO: Add UserMenu (Avatar, Dropdown for profile/logout) */}
          {/* Example: <UserNav /> */}
          {/* TODO: Add ThemeToggle if not globally handled */}
          {/* Example: <ThemeToggle /> */}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
