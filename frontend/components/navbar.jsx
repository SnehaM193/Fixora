"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Sun, Moon } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useRole } from "../lib/role-context";
import { Button } from "../components/ui/button";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { role } = useRole();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dashboardHref = role === "vendor" ? "/vendor" : "/dashboard";

  // 🔥 Prevent hydration mismatch for logo
  const logoSrc =
    mounted && theme === "dark"
      ? "/logo-light.png"
      : "/logo-dark.png";

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          {mounted && (
            <Image
              src={logoSrc}
              alt="Fixora Logo"
              width={180}
              height={60}
              priority
            />
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
            Services
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
            How It Works
          </a>
          <a href="#why-fixora" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
            Why Fixora
          </a>
        </nav>

        {/* Desktop Right Section */}
        <div className="hidden items-center gap-3 md:flex">

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-md border p-2"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          )}

          <SignedOut>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <Button variant="ghost" size="sm" asChild>
              <Link href={dashboardHref}>Dashboard</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden rounded-md p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-3 py-4">
            <a href="#services" onClick={() => setMobileOpen(false)}>
              Services
            </a>
            <a href="#how-it-works" onClick={() => setMobileOpen(false)}>
              How It Works
            </a>
            <a href="#why-fixora" onClick={() => setMobileOpen(false)}>
              Why Fixora
            </a>
          </nav>

          <div className="flex flex-col gap-2">
            <SignedOut>
              <Button variant="outline" size="sm" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </SignedOut>

            <SignedIn>
              <Button variant="outline" size="sm" asChild>
                <Link href={dashboardHref}>Dashboard</Link>
              </Button>
            </SignedIn>
          </div>
        </div>
      )}
    </header>
  );
}
