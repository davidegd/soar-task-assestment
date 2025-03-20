"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, CheckSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getNavigationItems } from "./navigation-items";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const navItems = getNavigationItems(pathname);

  return (
    <div
      className={cn(
        " hidden h-full flex-col border-r border-border bg-background shadow-sm md:flex",
        className
      )}
    >
      <div className="flex h-16 items-center  px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <CheckSquare className="h-6 w-6" />
          <span>Soar Task</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2 pr-2">
        <nav className="grid items-start  text-sm font-medium">
          {navItems.map((item) => (
            <div className="flex" key={item.href}>
              {item.active ? (
                <div className="-ml-1 h-10 w-2.5 rounded-lg bg-primary "> </div>
              ) : (
                <div className="h-10 w-1" />
              )}
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-6 py-3 transition-all",
                  item.active ? "  text-primary" : "text-muted-foreground  hover:text-foreground"
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

  const navItems = getNavigationItems(pathname);

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" className="mr-2" onClick={() => setOpen(!open)}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-0 top-0 h-full w-3/4 bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                <CheckSquare className="h-6 w-6" />
                <span>Soar Task</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="mt-8 space-y-2">
              {navItems.map((item) => (
                <div className="flex" key={item.href}>
                  {item.active ? (
                    <div className="h-10 w-2.5 rounded-lg bg-primary "> </div>
                  ) : (
                    <div className="h-10 w-1" />
                  )}
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                      item.active ? "text-primary" : "text-muted-foreground hover:bg-muted"
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
