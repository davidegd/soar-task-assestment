"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell, SearchIcon, Settings } from "lucide-react";
import { MobileNav } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApp } from "@/context/app-context";
import UserAvatarPlaceholder from "@/assets/images/user.png";

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const { user } = useApp();
  const [notifications] = useState(2);
  const pathname = usePathname();

  const pageTitle =
    title ||
    (() => {
      if (pathname === "/dashboard") return "Overview";
      return pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2);
    })();

  return (
    <header
      className="sticky top-0 z-30 flex h-20 w-full items-center justify-between bg-background px-4 md:px-6"
      role="banner"
    >
      <div className="flex w-1/2 items-center gap-2 md:w-1/4">
        <MobileNav />
        <h1
          className="text-2xl font-semibold text-secondary"
          aria-label={`Page title: ${pageTitle}`}
        >
          {pageTitle}
        </h1>
      </div>

      <div className="flex w-3/4 items-center justify-end gap-4 space-x-6">
        <div className="hidden flex-1 items-center justify-end md:flex">
          <div className="relative flex items-center">
            <SearchIcon className="absolute ml-4 h-4 w-4 text-secondary" aria-hidden="true" />
            <Input
              type="search"
              placeholder="Search for something"
              className="h-12 w-60 rounded-full border-none bg-muted pl-10 text-secondary"
              aria-label="Search"
            />
          </div>
        </div>
        <div className="flex items-center justify-between space-x-6">
          <Button
            variant="ghost"
            className="relative hidden h-11 w-11 items-center rounded-full bg-muted md:flex"
            size="sm"
            aria-label="Settings"
          >
            <Link href="/settings" className="bg-transparent" aria-label="Go to settings">
              <Settings className="h-16 w-auto text-secondary" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="relative hidden h-11 w-11 items-center rounded-full bg-muted md:flex"
            size="sm"
            aria-label="Notifications"
          >
            <Bell width={40} height={40} className="text-blue-500" />
            {notifications > 0 && (
              <span
                className="absolute right-3 top-3 flex h-2 w-2 items-center justify-center rounded-full border border-blue-500 bg-transparent text-xs font-medium"
                aria-label={`${notifications} new notifications`}
              >
                {""}
              </span>
            )}
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className="ring:none flex items-center justify-center rounded-full hover:cursor-pointer hover:opacity-90 focus-visible:border-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                aria-label="User menu"
              >
                <Image
                  src={(user?.avatar as unknown as string) ?? UserAvatarPlaceholder}
                  alt="User avatar"
                  className="h-12 w-12 rounded-full object-cover"
                  width={148}
                  height={48}
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-background" aria-label="User menu options">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" aria-label="Go to profile">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  // Add logout logic here
                }}
                aria-label="Logout"
              >
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
