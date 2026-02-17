"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarPlus,
  ClipboardList,
  User,
  Wrench,
  BarChart3,
  DollarSign,
  PieChart,
  ArrowLeftRight,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
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
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useRole } from "@/lib/auth-context";

const userNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Book Service",
    href: "/dashboard/book-service",
    icon: CalendarPlus,
  },
  {
    title: "My Bookings",
    href: "/dashboard/my-bookings",
    icon: ClipboardList,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
];

const vendorNavItems = [
  {
    title: "Dashboard",
    href: "/vendor",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Bookings",
    href: "/vendor/manage-bookings",
    icon: ClipboardList,
  },
  {
    title: "Earnings",
    href: "/vendor/earnings",
    icon: DollarSign,
  },
  {
    title: "Analytics",
    href: "/vendor/analytics",
    icon: PieChart,
  },
  {
    title: "Profile",
    href: "/vendor/profile",
    icon: User,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { role, toggleRole } = useRole();

  const navItems = role === "vendor" ? vendorNavItems : userNavItems;
  const label = role === "vendor" ? "Vendor Panel" : "Customer Panel";

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Wrench className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-sidebar-foreground">
            Fixora
          </span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
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

      <SidebarFooter className="p-4">
        <SidebarSeparator className="mb-4" />
        <button
          onClick={toggleRole}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <ArrowLeftRight className="h-4 w-4" />
          <span>Switch to {role === "vendor" ? "Customer" : "Vendor"}</span>
        </button>
        <div className="mt-3 flex items-center gap-3 px-1">
          <UserButton afterSignOutUrl="/" />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-sidebar-foreground">
              {role === "vendor" ? "Vendor Mode" : "Customer Mode"}
            </span>
            <span className="text-xs text-sidebar-foreground/50 capitalize">
              {role}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
