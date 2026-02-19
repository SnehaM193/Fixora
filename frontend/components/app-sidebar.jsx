"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarPlus,
  ClipboardList,
  User,
  DollarSign,
  PieChart,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useRole } from "@/lib/role-context";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const userNavItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Book Service", href: "/dashboard/book-service", icon: CalendarPlus },
  { title: "My Bookings", href: "/dashboard/my-bookings", icon: ClipboardList },
  { title: "Profile", href: "/dashboard/profile", icon: User },
];

const vendorNavItems = [
  { title: "Dashboard", href: "/vendor", icon: LayoutDashboard },
  { title: "Manage Bookings", href: "/vendor/manage-bookings", icon: ClipboardList },
  { title: "Earnings", href: "/vendor/earnings", icon: DollarSign },
  { title: "Analytics", href: "/vendor/analytics", icon: PieChart },
  { title: "Profile", href: "/vendor/profile", icon: User },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { role } = useRole();

  const navItems = role === "vendor" ? vendorNavItems : userNavItems;
  const label = role === "vendor" ? "Vendor Panel" : "Customer Panel";

  return (
    <Sidebar className="flex flex-col h-screen w-[260px] border-r bg-sidebar">

      {/* ===== HEADER (Clean Text Instead of Logo) ===== */}
      <SidebarHeader className="shrink-0 border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold tracking-tight">
          Fixora
        </h2>
      </SidebarHeader>

      {/* ===== NAVIGATION ===== */}
      <SidebarContent className="flex-1 overflow-y-auto px-4 py-6">

        <SidebarGroup>
          <SidebarGroupLabel className="mb-4 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {label}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 hover:bg-sidebar-accent"
                    >
                      <Link href={item.href} className="flex items-center gap-4">
                        <item.icon className="h-5 w-5 opacity-80" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      {/* ===== FOOTER ===== */}
      <SidebarFooter className="shrink-0 border-t border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">
              {role === "vendor" ? "Vendor Mode" : "Customer Mode"}
            </span>
            <span className="text-xs text-muted-foreground capitalize">
              {role}
            </span>
          </div>
        </div>
      </SidebarFooter>

    </Sidebar>
  );
}
