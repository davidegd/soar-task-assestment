"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CreditCard,
  Users,
  BarChart3,
  FileText,
  Settings,
  Menu,
  CheckSquare,
  Landmark,
  Wallet,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
}

function getNavItems(pathname: string) {
  return [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      active: pathname === "/dashboard",
    },
    {
      title: "Transactions",
      href: "/transactions",
      icon: <FileText className="h-5 w-5" />,
      active: pathname === "/transactions",
    },
    {
      title: "Accounts",
      href: "/accounts",
      icon: <Users className="h-5 w-5" />,
      active: pathname === "/accounts",
    },
    {
      title: "Investments",
      href: "/investments",
      icon: <BarChart3 className="h-5 w-5" />,
      active: pathname === "/investments",
    },
    {
      title: "Credit Cards",
      href: "/cards",
      icon: <CreditCard className="h-5 w-5" />,
      active: pathname === "/cards",
    },
    {
      title: "Loans",
      href: "/loans",
      icon: <Landmark className="h-5 w-5" />,
      active: pathname === "/loans",
    },
    {
      title: "Services",
      href: "/services",
      icon: <CheckSquare className="h-5 w-5" />,
      active: pathname === "/services",
    },
    {
      title: "My Privileges",
      href: "/privileges",
      icon: <Wallet className="h-5 w-5" />,
      active: pathname === "/privileges",
    },
    {
      title: "Setting",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
      active: pathname === "/settings",
    },
  ];
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const navItems = getNavItems(pathname);

  return (
    <div
      className={cn(
        " h-full flex-col bg-background shadow-sm hidden md:flex",
        className
      )}
    >
      <div className="flex h-16 items-center  px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <CheckSquare className="h-6 w-6" />
          <span>Soar Task</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2 pr-2">
        <nav className="grid items-start  text-sm font-medium">
          {navItems.map((item) => (
            <div className="flex" key={item.href}>
              {item.active ? (
                <div className="w-2.5 h-10 bg-primary rounded-lg -ml-1 "> </div>
              ) : (
                <div className="w-1 h-10" />
              )}
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-6 py-3 transition-all",
                  item.active
                    ? "  text-primary"
                    : "text-muted-foreground  hover:text-foreground"
                )}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navItems = getNavItems(pathname);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="mr-2"
        onClick={() => setOpen(!open)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-0 top-0 h-full w-3/4 bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 font-semibold"
              >
                <CheckSquare className="h-6 w-6" />
                <span>Soar Task</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="mt-8 space-y-2">
              {navItems.map((item) => (
                <div className="flex" key={item.href}>
                  {item.active ? (
                    <div className="w-2.5 h-10 bg-primary rounded-lg l-0 float-left ">
                      {" "}
                    </div>
                  ) : (
                    <div className="w-1 h-10" />
                  )}
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                      item.active
                        ? "text-primary"
                        : "hover:bg-muted text-muted-foreground"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
