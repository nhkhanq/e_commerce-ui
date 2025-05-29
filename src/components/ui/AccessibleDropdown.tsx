import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";

interface AccessibleDropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerProps?: React.ComponentProps<typeof Button>;
  contentProps?: React.ComponentProps<typeof DropdownMenuContent>;
  ariaLabel?: string;
}

export const AccessibleDropdown: React.FC<AccessibleDropdownProps> = ({
  trigger,
  children,
  open,
  onOpenChange,
  triggerProps = {},
  contentProps = {},
  ariaLabel = "Menu options",
}) => {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-haspopup="menu"
          aria-expanded={open || false}
          aria-label={ariaLabel}
          {...triggerProps}
        >
          {trigger}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onInteractOutside={() => {
          if (onOpenChange) {
            onOpenChange(false);
          }
        }}
        {...contentProps}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Re-export các component cần thiết
export { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator };
