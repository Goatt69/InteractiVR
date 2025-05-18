"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardBody, CardHeader, Divider, Spinner } from "@heroui/react";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
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
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <h2 className="text-xl font-semibold">User Profile</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium capitalize">{user?.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="p-12 text-center">
              <p className="text-gray-500">Your recent activity will appear here.</p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
