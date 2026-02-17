"use client";

import { useState, useEffect } from "react";
import { CalendarCheck, CheckCircle, IndianRupee, Clock } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { BookingTable } from "@/components/booking-table";
import { getBookings, cancelBooking } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserDashboardPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      const res = await getBookings();
      setBookings(res.data);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(action, bookingId) {
    if (action === "cancel") {
      await cancelBooking(bookingId);
      toast.success("Booking cancelled successfully");
      loadBookings();
    }
  }

  const upcoming = bookings.filter(
    (b) => b.status === "Pending" || b.status === "In Progress"
  ).length;
  const completed = bookings.filter((b) => b.status === "Completed").length;
  const totalSpent = bookings
    .filter((b) => b.status === "Completed")
    .reduce((sum, b) => sum + b.price, 0);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Here is your overview.
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
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome back! Here is your overview.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={Clock}
          title="Upcoming"
          value={upcoming}
          description="Pending or in-progress bookings"
        />
        <StatsCard
          icon={CheckCircle}
          title="Completed"
          value={completed}
          description="Services completed"
        />
        <StatsCard
          icon={IndianRupee}
          title="Total Spent"
          value={`\u20B9${totalSpent.toLocaleString()}`}
          description="Lifetime spending"
        />
        <StatsCard
          icon={CalendarCheck}
          title="Total Bookings"
          value={bookings.length}
          description="All-time bookings"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <BookingTable
            bookings={bookings.slice(0, 5)}
            role="user"
            onAction={handleAction}
          />
        </CardContent>
      </Card>
    </div>
  );
}
