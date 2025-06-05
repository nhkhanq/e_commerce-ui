import React from "react";

interface AdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  sidebarOpen: _sidebarOpen,
  setSidebarOpen: _setSidebarOpen,
}) => {
  return null;
};

export default AdminHeader;
