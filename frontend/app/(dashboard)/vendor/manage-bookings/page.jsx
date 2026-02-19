"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  getVendorBookings,
  updateBookingStatus,
} from "@/lib/api";
import { BookingTable } from "@/components/booking-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function ManageBookingsPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

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

      if (!token) {
        toast.error("Authentication failed");
        return;
      }

      const data = await getVendorBookings(token);

      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Vendor bookings error:", err?.response?.data || err);
      toast.error("Failed to load bookings");
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

    const newStatus = statusMap[action];

    if (!newStatus) return;

    try {
      const token = await getToken();

      if (!token) {
        toast.error("Authentication failed");
        return;
      }

      await updateBookingStatus(bookingId, newStatus, token);

      toast.success(`Booking marked as ${newStatus}`);

      // update UI immediately without refetch
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: newStatus } : b
        )
      );
    } catch (err) {
      console.error("Update booking error:", err?.response?.data || err);
      toast.error("Failed to update booking");
    }
  }

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <p>Please sign in to manage bookings.</p>;
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-[500px] rounded-xl" />
      </div>
    );
  }

  const pending = bookings.filter((b) => b.status === "Pending");
  const active = bookings.filter(
    (b) => b.status === "Accepted" || b.status === "In Progress"
  );
  const completed = bookings.filter((b) => b.status === "Completed");
  const cancelled = bookings.filter((b) => b.status === "Cancelled");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Manage Bookings</h1>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({active.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completed.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelled.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingTable
                bookings={pending}
                role="vendor"
                onAction={handleAction}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingTable
                bookings={active}
                role="vendor"
                onAction={handleAction}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingTable
                bookings={completed}
                role="vendor"
                onAction={handleAction}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cancelled" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cancelled Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingTable
                bookings={cancelled}
                role="vendor"
                onAction={handleAction}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
