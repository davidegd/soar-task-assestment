"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell, MoonIcon, SearchIcon, Settings, SunIcon } from "lucide-react";
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
import UserAvatarPlaceholder from "@/assets/images/user.png";

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
      return pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2);
    })();
  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between  bg-background px-4 md:px-6">
      <div className="flex w-1/2 items-center gap-2 md:w-1/4">
        <MobileNav />
        <h1 className="text-2xl font-semibold  text-secondary">{pageTitle}</h1>
      </div>

      <div className="flex w-3/4 items-center justify-end gap-4 space-x-6">
        <div className="hidden flex-1 items-center justify-end md:flex ">
          <div className="">
            <div className="relative flex items-center">
              <SearchIcon className="absolute ml-4 h-4 w-4 text-secondary" />
              <Input
                type="search"
                placeholder="Search for something"
                className="h-12 w-60 rounded-full border-none bg-muted pl-10 text-secondary"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between space-x-6">
          <Button
            variant="ghost"
            className="relative hidden h-11 w-11 items-center rounded-full bg-muted md:flex"
            size="sm"
          >
            <Link href="/settings" className="bg-transparent">
              <Settings className=" h-16 w-auto text-secondary" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="relative hidden h-11 w-11 items-center rounded-full bg-muted md:flex"
            size="sm"
          >
            <Bell width={40} height={40} className="text-blue-500 " />
            {notifications > 0 && (
              <span className="absolute right-3 top-3 flex h-2 w-2 items-center justify-center rounded-full border border-blue-500 bg-transparent text-xs font-medium">
                {""}
              </span>
            )}
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="ring:none  flex items-center justify-center rounded-full hover:cursor-pointer hover:opacity-90 focus-visible:border-none focus-visible:ring-0">
                <Image
                  src={(user?.avatar as unknown as string) ?? UserAvatarPlaceholder}
                  alt="User avatar"
                  className="h-12 w-12 rounded-full object-cover"
                  width={148}
                  height={48}
                />
                <span className="sr-only">User menu</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-background">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Button
                  variant="ghost"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  <p className="flex text-xs">
                    {theme === "dark" ? <SunIcon /> : <MoonIcon />}{" "}
                    <span className="ml-4">{theme === "dark" ? "Lights on" : "Lights off"}</span>
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
