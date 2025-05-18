import { useAuth } from '@/contexts/AuthContext';
import { Avatar, Button, Card, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { useState } from 'react';
import UserAuth from '../UserAuth';

/**
 * Component that displays user information when logged in
 * or a sign-in button when not logged in
 */
export default function UserProfile() {
  const { user, isAuthenticated, logout } = useAuth();
  const [authDrawerOpen, setAuthDrawerOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <Button
          color="primary"
          variant="ghost"
          onPress={() => setAuthDrawerOpen(true)}
        >
          Sign In
        </Button>
        <UserAuth
          isOpen={authDrawerOpen}
          onOpenChange={setAuthDrawerOpen}
        />
      </>
    );
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none">
          <Avatar
            name={user?.name}
            alt={user?.name || 'User'}
            className="cursor-pointer transition-transform"
            size="sm"
          />
          <span className="font-medium text-sm hidden md:inline-block">{user?.name}</span>
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="User menu actions">
        <DropdownItem key="profile" textValue="Profile">
          <div className="flex flex-col gap-1">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </DropdownItem>
        <DropdownItem key="dashboard" href="/dashboard">
          Dashboard
        </DropdownItem>
        {user?.role === 'admin' ? (
          <DropdownItem key="admin" href="/admin">
            Admin Panel
          </DropdownItem>
        ) : null}
        <DropdownItem key="settings" href="/settings">
          Settings
        </DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          onPress={logout}
        >
          Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
