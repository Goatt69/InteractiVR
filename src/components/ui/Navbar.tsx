'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  useDisclosure,
  Tooltip
} from '@heroui/react';
import UserAuth from '../UserAuth';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleSignInClick = () => {
    onOpen();
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  useEffect(() => {
    console.log('Auth drawer state changed:', isOpen);
  }, [isOpen]);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Experiences", href: "/experiences" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" }
  ];

  return (
    <Navbar
      isBordered
      isBlurred
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="shadow-sm bg-white/80 backdrop-blur-md"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/next.svg"
              alt="InteractiVR Logo"
              width={80}
              height={20}
              priority
              className="dark:invert"
            />
            <p className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-xl">
              InteractiVR
            </p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {navItems.map((item) => (
          <NavbarItem key={item.label}>
            <Link
              color="foreground"
              href={item.href}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        {!isMounted ? null : isAuthenticated ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                name={user?.name || 'User'}
                size="sm"
                src='https://avatar.iran.liara.run/public'
                showFallback
                fallback={user?.name?.[0]?.toUpperCase() || 'U'}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user?.email || 'User'}</p>
              </DropdownItem>
              <DropdownItem key="dashboard" href="/dashboard">Dashboard</DropdownItem>
              <DropdownItem key="settings" href="/settings">My Settings</DropdownItem>
              <DropdownItem key="team_settings" href="/team">Team Settings</DropdownItem>
              <DropdownItem key="analytics" href="/analytics">Analytics</DropdownItem>
              <DropdownItem key="experiences" href="/experiences">My Experiences</DropdownItem>
              <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
              {user?.role === 'admin' ? (
                <DropdownItem key="admin" href="/admin" className="text-primary">
                  Admin Panel
                </DropdownItem>
              ): (null)}
              <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Button
            color="primary"
            onPress={handleSignInClick}
            variant="flat"
          >
            Sign In
          </Button>
        )}
      </NavbarContent>

      <NavbarMenu>
        {navItems.map((item) => (
          <NavbarMenuItem key={item.label}>
            <Link
              className="w-full text-gray-700 hover:text-blue-600 transition-colors"
              href={item.href}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>

      {/* Auth Component with Drawer */}
      <UserAuth isOpen={isOpen} onOpenChange={onOpenChange} />
    </Navbar>
  );
}
