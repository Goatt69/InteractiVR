"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Divider,
  Spinner
} from "@heroui/react";

export default function AdminPage() {
  return (
    <RoleGuard allowedRoles={['admin']} redirectTo="/">
      <AdminDashboard />
    </RoleGuard>
  );
}

function AdminDashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <span className="text-sm bg-primary-100 text-primary px-3 py-1 rounded-full">
          Admin: {user?.name}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">User Management</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="overflow-x-auto">
              <Table aria-label="Example static collection table">
                <TableHeader>
                  <TableColumn>NAME</TableColumn>
                  <TableColumn>EMAIL</TableColumn>
                  <TableColumn>ROLE</TableColumn>
                  <TableColumn>CREATED AT</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow key="1">
                    <TableCell>Demo User</TableCell>
                    <TableCell>user@example.com</TableCell>
                    <TableCell>user</TableCell>
                    <TableCell>2023-01-01</TableCell>
                    <TableCell>
                      <Button size="sm" color="primary" variant="ghost">Edit</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow key="2">
                    <TableCell>Admin User</TableCell>
                    <TableCell>admin@example.com</TableCell>
                    <TableCell>admin</TableCell>
                    <TableCell>2023-01-01</TableCell>
                    <TableCell>
                      <Button size="sm" color="primary" variant="ghost">Edit</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="mt-4 text-center text-sm text-gray-500">
                <p>This is a placeholder. In a complete implementation, this would show real users from the database.</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
