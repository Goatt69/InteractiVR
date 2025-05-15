'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from '@heroui/react';
import UserAuth from '../UserAuth';

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        {isLoggedIn ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                as="button"
                className="transition-transform"
                name="User"
                size="sm"
                src="https://i.pravatar.cc/150?img=4"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="User actions">
              <DropdownItem key="profile">Profile</DropdownItem>
              <DropdownItem key="settings">Settings</DropdownItem>
              <DropdownItem key="experiences">My Experiences</DropdownItem>
              <DropdownItem key="help">Help & Feedback</DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                onClick={() => setIsLoggedIn(false)}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Dropdown
            placement="bottom-end"
            isOpen={isAuthOpen}
            onOpenChange={(open) => setIsAuthOpen(open)}
          >
            <DropdownTrigger>
              <Button
                color="primary"
                variant="flat"
                className="font-medium"
              >
                Sign In
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Authentication"
              className="p-0 min-w-[340px]"
            >
              <UserAuth />
            </DropdownMenu>
          </Dropdown>
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
    </Navbar>
  );
}
