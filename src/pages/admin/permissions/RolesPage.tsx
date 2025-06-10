import React, { useState } from "react";
import { useGetRolesQuery } from "@/services/admin/adminApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronRight,
  ChevronDown,
  UserCog,
  Shield,
  Users,
} from "lucide-react";

const RolesPage: React.FC = () => {
  // Keep track of which roles are expanded
  const [expandedRoles, setExpandedRoles] = useState<Record<string, boolean>>(
    {}
  );

  const { data: roles = [], isLoading } = useGetRolesQuery();

  const toggleRole = (roleName: string) => {
    setExpandedRoles((prev) => ({
      ...prev,
      [roleName]: !prev[roleName],
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-pulse">
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalPermissions = roles.reduce(
    (sum, role) => sum + role.permissions.length,
    0
  );
  const avgPermissionsPerRole =
    roles.length > 0 ? Math.round(totalPermissions / roles.length) : 0;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Roles Management
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            View and manage system roles and their assigned permissions
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <UserCog className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">
                    {roles.length}
                  </p>
                  <p className="text-purple-600 dark:text-purple-400">
                    Total Roles
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                    {totalPermissions}
                  </p>
                  <p className="text-blue-600 dark:text-blue-400">
                    Total Permissions
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-300">
                    {avgPermissionsPerRole}
                  </p>
                  <p className="text-green-600 dark:text-green-400">
                    Avg Permissions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Roles Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {roles.length > 0 ? (
            <div className="space-y-6">
              {roles.map((role) => (
                <Collapsible
                  key={role.name}
                  open={expandedRoles[role.name]}
                  onOpenChange={() => toggleRole(role.name)}
                  className="overflow-hidden"
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex w-full justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg border-none text-left h-auto bg-white dark:bg-gray-800"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <UserCog className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                            {role.name}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className="text-sm border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                            >
                              {role.permissions.length} permissions
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {expandedRoles[role.name] ? (
                        <ChevronDown className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-6 pb-6 bg-white dark:bg-gray-800 rounded-b-lg">
                    {role.permissions.length > 0 ? (
                      <div className="mt-4 overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-b border-gray-200 dark:border-gray-700">
                              <TableHead className="h-12 text-base font-semibold text-gray-900 dark:text-gray-100">
                                Permission Name
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {role.permissions.map((permission) => (
                              <TableRow
                                key={permission.name}
                                className="h-12 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700"
                              >
                                <TableCell className="font-medium text-gray-900 dark:text-gray-100 text-base">
                                  <div className="flex items-center gap-3">
                                    <div className="h-6 w-6 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                                      <Shield className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    {permission.name}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="h-12 w-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                          <Shield className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                        </div>
                        <p className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">
                          No permissions assigned
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          This role has no permissions yet
                        </p>
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                <UserCog className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                No roles found
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Roles will appear here once they are created
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RolesPage;
