"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { CalendarCheck, CheckCircle, Clock } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { BookingTable } from "@/components/booking-table";
import { getBookings, cancelBooking } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserDashboardPage() {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      loadBookings();
    } else {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  async function loadBookings() {
    try {
      setLoading(true);

      const token = await getToken();
      if (!token) return;

      const data = await getBookings(token);
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load bookings error:", err?.response?.data || err);
      toast.error("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(action, bookingId) {
    if (action === "cancel") {
      try {
        const token = await getToken();
        if (!token) return;

        await cancelBooking(bookingId, token);
        toast.success("Booking cancelled successfully");
        loadBookings();
      } catch (err) {
        toast.error("Failed to cancel booking.");
      }
    }
  }

  // ✅ Better Logic

  const upcoming = bookings.filter(
    (b) =>
      b.status === "Pending" ||
      b.status === "Accepted" ||
      b.status === "In Progress"
  ).length;

  const completed = bookings.filter(
    (b) => b.status === "Completed"
  ).length;

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <p>Please sign in to view your dashboard.</p>;
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-[100px] rounded-xl" />
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
          Overview of your service activity.
        </p>
      </div>

      {/* ✅ Only 3 clean cards now */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          icon={Clock}
          title="Upcoming Services"
          value={upcoming}
          description="Pending or active bookings"
        />

        <StatsCard
          icon={CheckCircle}
          title="Completed Services"
          value={completed}
          description="Successfully completed jobs"
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
