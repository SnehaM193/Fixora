"use client";

import { useState, useEffect } from "react";
import {
  IndianRupee,
  CalendarCheck,
  Clock,
  CheckCircle,
} from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { BookingTable } from "@/components/booking-table";
import { getVendorBookings, getEarnings, updateBookingStatus } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function VendorDashboardPage() {
  const [bookings, setBookings] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [bRes, eRes] = await Promise.all([
        getVendorBookings(),
        getEarnings(),
      ]);
      setBookings(bRes.data);
      setEarnings(eRes.data);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(action, bookingId) {
    const statusMap = {
      accept: "Accepted",
      reject: "Cancelled",
      complete: "Completed",
    };
    const status = statusMap[action];
    if (status) {
      await updateBookingStatus(bookingId, status);
      toast.success(`Booking ${action}ed successfully`);
      loadData();
    }
  }

  const pending = bookings.filter((b) => b.status === "Pending").length;
  const completed = bookings.filter((b) => b.status === "Completed").length;

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Vendor Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Overview of your business performance.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[100px] rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Vendor Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Overview of your business performance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={IndianRupee}
          title="Total Earnings"
          value={`\u20B9${earnings?.totalEarnings?.toLocaleString() || 0}`}
          description="Lifetime revenue"
        />
        <StatsCard
          icon={CalendarCheck}
          title="Total Bookings"
          value={earnings?.totalBookings || 0}
          description="All-time bookings"
        />
        <StatsCard
          icon={Clock}
          title="Pending Requests"
          value={pending}
          description="Awaiting your response"
        />
        <StatsCard
          icon={CheckCircle}
          title="Completed Jobs"
          value={completed}
          description="Successfully completed"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <BookingTable
            bookings={bookings.slice(0, 5)}
            role="vendor"
            onAction={handleAction}
          />
        </CardContent>
      </Card>
    </div>
  );
}
