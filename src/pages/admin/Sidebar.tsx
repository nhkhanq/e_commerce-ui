import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
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
  TrendingUp,
  PanelLeftClose,
  PanelRightClose,
  Image,
  ChevronRight,
  Sparkles,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface NavItemProps {
  to?: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  isSubItem?: boolean;
  children?: NavItemConfig[];
  currentPath: string;
  setSidebarOpen: (open: boolean) => void;
  badge?: string;
  color?: string;
}

interface NavItemConfig {
  to?: string;
  icon: React.ReactNode;
  label: string;
  isSubItem?: boolean;
  children?: NavItemConfig[];
  badge?: string;
  color?: string;
}

const DropdownContext = React.createContext<{
  openItem: string | null;
  setOpenItem: (item: string | null) => void;
}>({
  openItem: null,
  setOpenItem: () => {},
});

const NavItemContent: React.FC<
  Omit<NavItemProps, "currentPath" | "setSidebarOpen" | "children"> & {
    isActive: boolean;
    hasChildren?: boolean;
    isOpen?: boolean;
  }
> = ({
  icon,
  label,
  isSubItem,
  isActive,
  badge,
  color,
  hasChildren,
  isOpen,
}) => (
  <div
    className={cn(
      "group flex items-center justify-between py-3 px-4 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg relative overflow-hidden",
      isSubItem && "ml-6 py-2 px-3",
      isActive
        ? cn(
            "bg-gradient-to-r from-indigo-800 via-blue-800 to-cyan-800 text-white font-semibold shadow-lg shadow-blue-500/30 border border-blue-400/30",
            "before:absolute before:inset-0 before:bg-gradient-to-r before:from-black/30 before:to-transparent before:rounded-xl"
          )
        : cn(
            "hover:bg-gradient-to-r hover:from-gray-50 hover:to-white dark:hover:from-gray-800/50 dark:hover:to-gray-700/30 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
            "backdrop-blur-sm border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50"
          )
    )}
    style={{
      background:
        isActive && color
          ? `linear-gradient(135deg, ${color}15, ${color}25)`
          : undefined,
    }}
  >
    <div className="flex items-center space-x-3 min-w-0 flex-1">
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300",
          isActive
            ? "bg-white/30 text-white shadow-lg backdrop-blur-sm border border-white/30"
            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 group-hover:text-gray-800 dark:group-hover:text-gray-200"
        )}
        style={{
          filter: isActive
            ? "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4))"
            : undefined,
        }}
      >
        {icon}
      </div>
      <span
        className={cn(
          "text-sm font-medium truncate transition-all duration-300",
          isActive
            ? "text-white font-semibold drop-shadow-md"
            : "group-hover:translate-x-0.5"
        )}
        style={{
          textShadow: isActive
            ? "0 2px 6px rgba(0, 0, 0, 0.7), 0 1px 3px rgba(0, 0, 0, 0.5)"
            : undefined,
        }}
      >
        {label}
      </span>
    </div>

    <div className="flex items-center space-x-2">
      {badge && (
        <Badge
          variant={isActive ? "secondary" : "outline"}
          className={cn(
            "text-xs px-2 py-0.5 font-medium transition-all duration-300",
            isActive
              ? "bg-white/20 text-white border-white/30"
              : "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700"
          )}
        >
          {badge}
        </Badge>
      )}

      {hasChildren && (
        <div
          className={cn(
            "transition-transform duration-300 ease-in-out",
            isOpen ? "rotate-90" : "rotate-0"
          )}
        >
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-colors duration-300",
              isActive
                ? "text-white drop-shadow-sm"
                : "text-gray-400 dark:text-gray-500"
            )}
            style={{
              filter: isActive
                ? "drop-shadow(0 2px 3px rgba(0, 0, 0, 0.5))"
                : undefined,
            }}
          />
        </div>
      )}
    </div>
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
  badge,
  color,
}) => {
  const { openItem, setOpenItem } = React.useContext(DropdownContext);
  const isOpen = openItem === label;

  const handleItemClick = () => {
    if (onClick) onClick();
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleToggle = (state: boolean) => {
    setOpenItem(state ? label : null);
  };

  useEffect(() => {
    if (children && children.some((child) => child.to === currentPath)) {
      setOpenItem(label);
    }
  }, [currentPath, label, children]);

  if (children) {
    return (
      <div className="space-y-2">
        <Collapsible
          open={isOpen}
          onOpenChange={handleToggle}
          className="space-y-2"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start h-auto py-0 px-0 font-normal hover:bg-transparent"
            >
              <NavItemContent
                icon={icon}
                label={label}
                isSubItem={isSubItem}
                isActive={children.some((child) => child.to === currentPath)}
                badge={badge}
                color={color}
                hasChildren={true}
                isOpen={isOpen}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 overflow-hidden">
            <div className="pl-4 border-l-2 border-indigo-200 dark:border-indigo-700 ml-4 space-y-1">
              {children.map((child, index) => (
                <div
                  key={index}
                  className="transform transition-all duration-300 ease-out"
                >
                  <NavItem
                    {...child}
                    currentPath={currentPath}
                    setSidebarOpen={setSidebarOpen}
                    isSubItem={true}
                  />
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }

  return (
    <NavLink to={to!} onClick={handleItemClick} end>
      <NavItemContent
        icon={icon}
        label={label}
        isSubItem={isSubItem}
        isActive={currentPath === to}
        badge={badge}
        color={color}
      />
    </NavLink>
  );
};

const navItemsConfig: NavItemConfig[] = [
  {
    to: "/admin/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    label: "Dashboard",
    color: "#6366f1",
  },
  {
    to: "/admin/revenue",
    icon: <TrendingUp className="h-4 w-4" />,
    label: "Revenue Report",
    color: "#059669",
  },
  {
    label: "Products",
    icon: <Box className="h-4 w-4" />,
    color: "#d97706",
    children: [
      {
        to: "/admin/products",
        label: "Manage Products",
        icon: <Box className="h-3 w-3" />,
      },
      {
        to: "/admin/products/new",
        label: "Add Product",
        icon: <Sparkles className="h-3 w-3" />,
      },
    ],
  },
  {
    label: "Categories",
    icon: <Tags className="h-4 w-4" />,
    color: "#db2777",
    children: [
      {
        to: "/admin/categories",
        label: "Manage Categories",
        icon: <Tags className="h-3 w-3" />,
      },
      {
        to: "/admin/categories/new",
        label: "Add Category",
        icon: <Sparkles className="h-3 w-3" />,
      },
    ],
  },
  {
    label: "Orders",
    icon: <ClipboardList className="h-4 w-4" />,
    color: "#2563eb",
    children: [
      {
        to: "/admin/orders",
        label: "All Orders",
        icon: <ShoppingCart className="h-3 w-3" />,
      },
      {
        to: "/admin/orders?status=DELIVERING",
        label: "Delivering Orders",
        icon: <PackageCheck className="h-3 w-3" />,
      },
    ],
  },
  {
    to: "/admin/users",
    icon: <Users className="h-4 w-4" />,
    label: "Customers",
    color: "#0891b2",
  },
  {
    label: "Security",
    icon: <ShieldCheck className="h-4 w-4" />,
    color: "#dc2626",
    children: [
      {
        to: "/admin/permissions",
        label: "Permissions",
        icon: <KeyRound className="h-3 w-3" />,
      },
      {
        to: "/admin/roles",
        label: "Roles",
        icon: <ShieldCheck className="h-3 w-3" />,
      },
    ],
  },
  {
    label: "Vouchers",
    icon: <Tags className="h-4 w-4" />,
    color: "#9333ea",
    children: [
      {
        to: "/admin/vouchers",
        label: "Manage Vouchers",
        icon: <Tags className="h-3 w-3" />,
      },
      {
        to: "/admin/vouchers/new",
        label: "Add Voucher",
        icon: <Sparkles className="h-3 w-3" />,
      },
    ],
  },
  {
    to: "/admin/banners",
    icon: <Image className="h-4 w-4" />,
    label: "Banner",
    color: "#ea580c",
  },
];

const SidebarHeader: React.FC = () => (
  <div className="relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 via-blue-800 to-cyan-800"></div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
    <div className="absolute inset-0 backdrop-blur-sm"></div>

    <div className="relative flex items-center justify-between p-6 h-20">
      <Link to="/admin/dashboard" className="flex items-center space-x-3 group">
        <div className="relative">
          <div className="absolute inset-0 bg-white/20 rounded-xl blur-sm"></div>
          <div className="relative w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center">
            <Box className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-white tracking-tight">
            E-Shop
          </span>
          <span className="text-xs text-white/70 font-medium">Admin Panel</span>
        </div>
      </Link>

      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
        <Activity className="h-4 w-4 text-white/70" />
      </div>
    </div>
  </div>
);

const SidebarContent: React.FC<{
  currentPath: string;
  setSidebarOpen: (open: boolean) => void;
}> = ({ currentPath, setSidebarOpen }) => (
  <div className="flex flex-col h-full bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm">
    <SidebarHeader />

    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <nav className="p-4 space-y-2">
          {navItemsConfig.map((item, index) => (
            <div
              key={index}
              className="transform transition-all duration-300 ease-out hover:translate-x-1"
            >
              <NavItem
                {...item}
                currentPath={currentPath}
                setSidebarOpen={setSidebarOpen}
              />
            </div>
          ))}
        </nav>
      </div>
    </div>
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <DropdownContext.Provider value={{ openItem, setOpenItem }}>
      {/* Mobile Sidebar using Sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="p-0 w-72 border-r-0 shadow-2xl"
          onEscapeKeyDown={() => setSidebarOpen(false)}
          onInteractOutside={() => setSidebarOpen(false)}
        >
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Sidebar navigation for admin panel
          </SheetDescription>
          <SidebarContent
            currentPath={currentPath}
            setSidebarOpen={setSidebarOpen}
          />
        </SheetContent>
      </Sheet>

      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        className="fixed top-20 left-4 z-50 lg:hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300"
      >
        {sidebarOpen ? (
          <PanelLeftClose className="h-5 w-5" />
        ) : (
          <PanelRightClose className="h-5 w-5" />
        )}
      </Button>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:block w-72 border-r border-gray-200/50 dark:border-gray-700/50 flex-col fixed inset-y-0 left-0 z-20 shadow-xl"
        )}
        aria-label="Main navigation"
      >
        <SidebarContent
          currentPath={currentPath}
          setSidebarOpen={setSidebarOpen}
        />
      </aside>

      {/* Add a spacer for the fixed desktop sidebar */}
      <div
        className="hidden lg:block w-72 flex-shrink-0"
        aria-hidden="true"
      ></div>
    </DropdownContext.Provider>
  );
};

export default Sidebar;
