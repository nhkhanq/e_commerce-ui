import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Box,
  Users,
  Tags,
  ShieldCheck,
  KeyRound,
  PackageCheck,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  // SheetTrigger, // Trigger is in AdminHeader for mobile
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils"; // Assuming you have cn utility from shadcn/ui

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface NavItemProps {
  to?: string; // Optional for collapsible triggers
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  isSubItem?: boolean;
  children?: NavItemConfig[];
  currentPath: string;
  setSidebarOpen: (open: boolean) => void; // For closing sidebar on mobile nav
}

interface NavItemConfig {
  to?: string;
  icon: React.ReactNode;
  label: string;
  isSubItem?: boolean;
  children?: NavItemConfig[];
}

const NavItemContent: React.FC<
  Omit<NavItemProps, "currentPath" | "setSidebarOpen" | "children"> & {
    isActive: boolean;
  }
> = ({ icon, label, isSubItem, isActive }) => (
  <div
    className={cn(
      "flex items-center space-x-3 py-2 px-3 rounded-md transition-all",
      isSubItem && "pl-7",
      isActive
        ? "bg-primary text-primary-foreground font-medium"
        : "hover:bg-muted hover:text-foreground text-muted-foreground"
    )}
  >
    {icon}
    <span className="text-sm truncate">{label}</span>
  </div>
);

const NavItem: React.FC<NavItemProps> = ({
  to,
  icon,
  label,
  onClick,
  isSubItem = false,
  children,
  currentPath,
  setSidebarOpen,
}) => {
  const [isOpen, setIsOpen] = React.useState(
    children ? children.some((child) => child.to === currentPath) : false
  );

  const handleItemClick = () => {
    if (onClick) onClick();
    if (window.innerWidth < 1024) {
      // Tailwind lg breakpoint
      setSidebarOpen(false);
    }
  };

  if (children) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-1">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start h-auto py-0 px-0 font-normal data-[state=open]:bg-muted"
          >
            <NavItemContent
              icon={icon}
              label={label}
              isSubItem={isSubItem}
              isActive={children.some((child) => child.to === currentPath)}
            />
            {/* <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", isOpen && "rotate-180")} /> */}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1 pl-4 border-l border-border ml-3">
          {children.map((child, index) => (
            <NavItem
              key={index}
              {...child}
              currentPath={currentPath}
              setSidebarOpen={setSidebarOpen}
              isSubItem={true}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <NavLink to={to!} onClick={handleItemClick} end>
      <NavItemContent
        icon={icon}
        label={label}
        isSubItem={isSubItem}
        isActive={currentPath === to}
      />
    </NavLink>
  );
};

const navItemsConfig: NavItemConfig[] = [
  {
    to: "/admin/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    label: "Dashboard",
  },
  {
    label: "Products",
    icon: <Box className="h-4 w-4" />,
    children: [
      {
        to: "/admin/products",
        label: "Manage Products",
        icon: <span className="h-4 w-4 inline-block" />,
      },
      {
        to: "/admin/products/new",
        label: "Add Product",
        icon: <span className="h-4 w-4 inline-block" />,
      },
    ],
  },
  {
    label: "Categories",
    icon: <Tags className="h-4 w-4" />,
    children: [
      {
        to: "/admin/categories",
        label: "Manage Categories",
        icon: <span className="h-4 w-4 inline-block" />,
      },
      {
        to: "/admin/categories/new",
        label: "Add Category",
        icon: <span className="h-4 w-4 inline-block" />,
      },
    ],
  },
  {
    label: "Orders",
    icon: <ClipboardList className="h-4 w-4" />,
    children: [
      {
        to: "/admin/orders",
        label: "All Orders",
        icon: <ShoppingCart className="h-4 w-4 opacity-75" />,
      },
      {
        to: "/admin/orders?status=DELIVERING",
        label: "Delivering Orders",
        icon: <PackageCheck className="h-4 w-4 opacity-75" />,
      },
    ],
  },
  {
    to: "/admin/users",
    icon: <Users className="h-4 w-4" />,
    label: "Customers",
  },
  {
    label: "Vouchers",
    icon: <Tags className="h-4 w-4" />,
    children: [
      {
        to: "/admin/vouchers",
        label: "Manage Vouchers",
        icon: <span className="h-4 w-4 inline-block" />,
      },
      {
        to: "/admin/vouchers/new",
        label: "Add Voucher",
        icon: <span className="h-4 w-4 inline-block" />,
      },
    ],
  },
  {
    label: "Access Control",
    icon: <ShieldCheck className="h-4 w-4" />,
    children: [
      {
        to: "/admin/roles",
        label: "Roles",
        icon: <KeyRound className="h-4 w-4 opacity-75" />,
      },
      {
        to: "/admin/permissions",
        label: "Permissions",
        icon: <KeyRound className="h-4 w-4 opacity-75" />,
      },
    ],
  },
];

const SidebarContent: React.FC<{
  currentPath: string;
  setSidebarOpen: (open: boolean) => void;
}> = ({ currentPath, setSidebarOpen }) => (
  <div className="flex flex-col h-full">
    <div className="flex items-center justify-between p-4 border-b h-16">
      <Link to="/admin/dashboard" className="flex items-center space-x-2">
        {/* <YourLogoIcon className="h-6 w-6 text-primary" /> */}
        <span className="text-lg font-semibold text-foreground">
          Admin Panel
        </span>
      </Link>
      {/* Optional: Close button for desktop if sidebar was a drawer type always */}
    </div>
    <nav className="flex-grow p-3 space-y-1 overflow-y-auto">
      {navItemsConfig.map((item, index) => (
        <NavItem
          key={index}
          {...item}
          currentPath={currentPath}
          setSidebarOpen={setSidebarOpen}
        />
      ))}
    </nav>
    {/* Optional Footer in Sidebar */}
    {/* <div className="p-4 border-t">
      <Button variant="outline" className="w-full">Logout</Button>
    </div> */}
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = NavLink_ReactRouterDom.useLocation(); // Need to import useLocation from react-router-dom
  const currentPath = location.pathname;

  return (
    <>
      {/* Mobile Sidebar using Sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SidebarContent
            currentPath={currentPath}
            setSidebarOpen={setSidebarOpen}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:block w-64 bg-background border-r flex-col fixed inset-y-0 left-0 z-20"
          // Below is for a potentially collapsible desktop sidebar, more complex
          // "transition-all duration-300 ease-in-out",
          // sidebarOpen ? "w-64" : "w-20",
        )}
      >
        <SidebarContent
          currentPath={currentPath}
          setSidebarOpen={setSidebarOpen}
        />
      </aside>
      {/* Add a spacer for the fixed desktop sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0"></div>
    </>
  );
};

// Temporary fix for NavLink_ReactRouterDom.useLocation()
const NavLink_ReactRouterDom = {
  useLocation: () => ({ pathname: window.location.pathname }),
};

export default Sidebar;
