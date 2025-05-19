import React, { useState } from "react";
import { useGetRolesQuery, Permission, Role } from "@/api/admin/adminApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, ChevronDown } from "lucide-react";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
          Roles Management
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roles List</CardTitle>
          <CardDescription>
            View all system roles and their assigned permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
            </div>
          ) : roles.length > 0 ? (
            <div className="space-y-3">
              {roles.map((role) => (
                <Collapsible
                  key={role.name}
                  open={expandedRoles[role.name]}
                  onOpenChange={() => toggleRole(role.name)}
                  className="border rounded-md overflow-hidden"
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex w-full justify-between p-4 hover:bg-accent hover:text-accent-foreground rounded-none border-none"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{role.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {role.permissions.length} permissions
                        </Badge>
                      </div>
                      {expandedRoles[role.name] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 pb-4">
                    {role.permissions.length > 0 ? (
                      <div className="rounded-md border overflow-hidden mt-2">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Permission Name</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {role.permissions.map((permission) => (
                              <TableRow key={permission.name}>
                                <TableCell className="font-medium">
                                  {permission.name}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground py-2">
                        This role has no assigned permissions.
                      </p>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <p className="text-muted-foreground">No roles found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RolesPage;
