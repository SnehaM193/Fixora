"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  IndianRupee,
  CalendarCheck,
  Clock,
  CheckCircle,
} from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { BookingTable } from "@/components/booking-table";
import {
  getVendorBookings,
  getEarnings,
  updateBookingStatus,
} from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function VendorDashboardPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) loadData();
  }, [isLoaded, isSignedIn]);

  async function loadData() {
    try {
      setLoading(true);
      const token = await getToken();

      const [bData, eData] = await Promise.all([
        getVendorBookings(token),
        getEarnings(token),
      ]);

      setBookings(Array.isArray(bData) ? bData : []);
      setEarnings(eData);
    } catch (err) {
      toast.error("Failed to load vendor data");
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

    try {
      const token = await getToken();
      await updateBookingStatus(
        bookingId,
        statusMap[action],
        token
      );

      toast.success("Booking updated");
      loadData();
    } catch {
      toast.error("Failed to update booking");
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-[100px] rounded-xl" />
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    );
  }

  const pending = bookings.filter(b => b.status === "Pending").length;
  const completed = bookings.filter(b => b.status === "Completed").length;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Vendor Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={IndianRupee}
          title="Total Earnings"
          value={`₹${earnings?.totalEarnings || 0}`}
          description="Completed jobs revenue"
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
          description="Awaiting action"
        />
        <StatsCard
          icon={CheckCircle}
          title="Completed Jobs"
          value={completed}
          description="Finished services"
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
