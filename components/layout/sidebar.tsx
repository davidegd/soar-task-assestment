"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, CheckSquare, X, SunIcon, MoonIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { getNavigationItems } from "./navigation-items"
import { useTheme } from "next-themes"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const navItems = getNavigationItems(pathname)

  return (
    <div
      className={cn(
        "hidden h-full flex-col border-r border-border bg-background shadow-sm md:flex",
        className
      )}
      role="navigation"
      aria-label="Sidebar Navigation"
    >
      <div className="flex h-16 items-center px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
          aria-label="Go to Dashboard"
        >
          <CheckSquare className="h-6 w-6" />
          <span>Soar Task</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2 pr-2">
        <nav className="grid items-start text-sm font-medium">
          {navItems.map((item) => (
            <div className="flex" key={item.href}>
              {item.active ? (
                <div className="-ml-1 h-10 w-2.5 rounded-lg bg-primary" aria-hidden="true"></div>
              ) : (
                <div className="h-10 w-1" aria-hidden="true"></div>
              )}
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-6 py-3 transition-all",
                  item.active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
                aria-current={item.active ? "page" : undefined}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </div>
          ))}
        </nav>
      </div>
      <Button
        variant="ghost"
        size="lg"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="w-full items-center"
      >
        <p className="flex text-sm">
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}{" "}
          <span className="ml-4">{theme === "dark" ? "Lights on" : "Lights off"}</span>
        </p>
      </Button>
    </div>
  )
}

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const navItems = getNavigationItems(pathname)

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="mr-2"
        onClick={() => setOpen(!open)}
        aria-label="Toggle Mobile Menu"
        aria-expanded={open}
        aria-controls="mobile-navigation"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      {open && (
        <div
          id="mobile-navigation"
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <div className="fixed left-0 top-0 h-full w-3/4 bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 font-semibold"
                aria-label="Go to Dashboard"
              >
                <CheckSquare className="h-6 w-6" />
                <span>Soar Task</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                aria-label="Close Mobile Menu"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="mt-8 space-y-2">
              {navItems.map((item) => (
                <div className="flex" key={item.href}>
                  {item.active ? (
                    <div className="h-10 w-2.5 rounded-lg bg-primary" aria-hidden="true"></div>
                  ) : (
                    <div className="h-10 w-1" aria-hidden="true"></div>
                  )}
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                      item.active ? "text-primary" : "text-muted-foreground hover:bg-muted"
                    )}
                    onClick={() => setOpen(false)}
                    aria-current={item.active ? "page" : undefined}
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
  )
}
