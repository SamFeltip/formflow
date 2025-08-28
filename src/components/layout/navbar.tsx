"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FormInput,
  Calendar,
  Users,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { users } from "@/db/schema";
import React from "react";

export function Navbar({ user }: { user?: typeof users.$inferSelect }) {
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [];

  if (user?.role == "approver" || user?.role == "user") {
    navItems.push({
      href: "/",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    });
  }

  if (user?.role == "admin") {
    navItems.push({
      href: "/timelines",
      label: "Timelines",
      icon: <Calendar className="h-4 w-4" />,
    });
  }

  if (user?.role == "approver" || user?.role == "admin") {
    navItems.push({
      href: "/team",
      label: "Team",
      icon: <Users className="h-4 w-4" />,
    });
  }

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <FormInput className="h-5 w-5" />
              <span className="hidden md:inline">FormFlow</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn("gap-2", isActive(item.href) && "bg-muted")}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image} alt="User" />
                      <AvatarFallback>
                        {user?.role ? user?.role[0].toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name || user?.role}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/user/${user.id}`}>
                      <Button variant="ghost" className="w-full justify-start">
                        View Profile
                      </Button>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <form
                      action="/auth/sign-out"
                      method="post"
                      className="w-full"
                    >
                      <Button type="submit" className="w-full text-left">
                        Sign Out
                      </Button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container px-4 mx-auto max-w-7xl py-3">
            <nav className="grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                    isActive(item.href) ? "bg-muted" : "hover:bg-muted"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
