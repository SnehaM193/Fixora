"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getBookings, cancelBooking } from "@/lib/api";
import { BookingTable } from "@/components/booking-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState(null);

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
      setCancelId(bookingId);
    }
  }

  async function confirmCancel() {
    if (!cancelId) return;
    await cancelBooking(cancelId);
    toast.success("Booking cancelled successfully");
    setCancelId(null);
    setLoading(true);
    loadBookings();
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            My Bookings
          </h1>
          <p className="text-sm text-muted-foreground">
            View and manage all your service bookings.
          </p>
        </div>
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          My Bookings
        </h1>
        <p className="text-sm text-muted-foreground">
          View and manage all your service bookings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <BookingTable
            bookings={bookings}
            role="user"
            onAction={handleAction}
          />
        </CardContent>
      </Card>

      <AlertDialog
        open={!!cancelId}
        onOpenChange={(open) => !open && setCancelId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The vendor will be notified of the
              cancellation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel}>
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
