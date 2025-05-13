'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Divider } from '@heroui/react';
import UserAuth from './UserAuth';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur-md bg-white/80 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and brand name */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center">
              <Image
                src="/next.svg"
                alt="InteractiVR Logo"
                width={80}
                height={20}
                priority
                className="dark:invert"
              />
              <Divider orientation="vertical" className="h-8 mx-2" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                InteractiVR
              </h1>
            </Link>
          </div>

          {/* User Authentication Section */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              // User is logged in - show profile dropdown
              <Dropdown>
                <DropdownTrigger>
                  <Button 
                    variant="light" 
                    className="p-1"
                    isIconOnly
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white">
                      <span className="text-sm font-medium">US</span>
                    </div>
                  </Button>
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
              // User is not logged in - show auth button/dropdown
              <Dropdown 
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

            {/* Mobile menu button - visible on small screens */}
            <Button
              isIconOnly
              variant="light"
              className="md:hidden"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-label="Toggle menu"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none"
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                className="w-6 h-6"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
