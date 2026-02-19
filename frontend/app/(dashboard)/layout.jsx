"use client";

import Link from "next/link";
import Image from "next/image";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-14 items-center gap-3 border-b border-border bg-background px-4 lg:px-6">
          
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-5" />

          {/* 🔥 Logo → Back to Home */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-dark.png"
              alt="Fixora"
              width={110}
              height={32}
              className="dark:hidden"
              priority
            />
            <Image
              src="/logo-light.png"
              alt="Fixora"
              width={110}
              height={32}
              className="hidden dark:block"
              priority
            />
          </Link>

        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
