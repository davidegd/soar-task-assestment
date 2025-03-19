"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell, MoonIcon, Settings, SunIcon, UserIcon } from "lucide-react";
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
import { useTheme } from "next-themes";

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const { user } = useApp();
  const [notifications] = useState(2);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const pageTitle =
    title ||
    (() => {
      if (pathname === "/dashboard") return "Overview";
      if (pathname === "/settings") return "Setting";
      return pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2);
    })();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2 w-1/2 md:w-1/4">
        <MobileNav />
        <h1 className="text-xl font-semibold">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-4 justify-end w-3/4 ">
        <div className="hidden md:flex flex-1 items-center justify-end mr-4 ">
          <div className="w-full max-w-md">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <Input
                type="search"
                placeholder="Search for something"
                className="w-full pl-8 rounded-2xl"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center space-x-2">
          <Button
            variant="secondary"
            size="icon"
            className="relative hidden md:flex rounded-full items-center"
          >
            <Link href="/settings" className="bg-transparent">
              <Settings className=" h-4 w-4" />
            </Link>
          </Button>

          <Button
            variant="secondary"
            size="icon"
            className="relative hidden md:flex rounded-full"
          >
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                {notifications}
              </span>
            )}
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <div className="h-12 w-14 items-center justify-center flex rounded-full bg-background">
                  <UserIcon className="text-primary w-10 h-10" />
                </div>

                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Button
                  variant="ghost"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  <p className="text-xs flex">
                    {theme === "dark" ? <SunIcon /> : <MoonIcon />}{" "}
                    <span className="ml-4">
                      {theme === "dark" ? "Lights on" : "Lights off"}
                    </span>
                  </p>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild></DropdownMenuItem>
              <DropdownMenuItem>
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
