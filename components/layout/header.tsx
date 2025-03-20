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
      <div className="flex items-center gap-2 w-1/2 md:w-1/4">
        <MobileNav />
        <h1 className="text-2xl font-semibold  text-secondary">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-4 justify-end w-3/4 space-x-6">
        <div className="hidden md:flex flex-1 items-center justify-end ">
          <div className="">
            <div className="relative flex items-center">
              <SearchIcon className="absolute ml-4 h-4 w-4 text-secondary" />
              <Input
                type="search"
                placeholder="Search for something"
                className="w-60 pl-10 rounded-full text-secondary h-12 border-none bg-muted"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center space-x-6">
          <Button
            variant="ghost"
            className="relative hidden md:flex rounded-full items-center bg-muted w-11 h-11"
            size="sm"
          >
            <Link href="/settings" className="bg-transparent">
              <Settings className=" h-16 w-auto text-secondary" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="relative hidden md:flex rounded-full items-center bg-muted w-11 h-11"
            size="sm"
          >
            <Bell width={40} height={40} className="text-blue-500 " />
            {notifications > 0 && (
              <span className="absolute right-3 top-3 flex h-2 w-2 items-center justify-center rounded-full bg-transparent border border-blue-500 text-xs font-medium">
                {""}
              </span>
            )}
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="items-center  justify-center flex rounded-full ring:none focus-visible:ring-0 focus-visible:border-none hover:cursor-pointer hover:opacity-90">
                <Image
                  src={
                    (user?.avatar as unknown as string) ?? UserAvatarPlaceholder
                  }
                  alt="User avatar"
                  className="rounded-full w-12 h-12 object-cover"
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
