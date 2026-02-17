"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getVendorBookings, updateBookingStatus } from "@/lib/api";
import { BookingTable } from "@/components/booking-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ManageBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      const res = await getVendorBookings();
      setBookings(res.data);
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
      setLoading(true);
      loadBookings();
    }
  }

  const pending = bookings.filter((b) => b.status === "Pending");
  const active = bookings.filter(
    (b) => b.status === "Accepted" || b.status === "In Progress"
  );
  const completed = bookings.filter((b) => b.status === "Completed");
  const cancelled = bookings.filter((b) => b.status === "Cancelled");

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Manage Bookings
          </h1>
          <p className="text-sm text-muted-foreground">
            Accept, reject, or complete incoming booking requests.
          </p>
        </div>
        <Skeleton className="h-[500px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Manage Bookings
        </h1>
        <p className="text-sm text-muted-foreground">
          Accept, reject, or complete incoming booking requests.
        </p>
      </div>

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
