"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
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
  const { getToken, isSignedIn, isLoaded } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState(null);

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
        toast.error("Authentication failed.");
        return;
      }

      const data = await getBookings(token);

      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load bookings error:", err?.response?.data || err);
      toast.error(
        err?.response?.data?.message || "Failed to load bookings."
      );
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

    try {
      const token = await getToken();

      if (!token) {
        toast.error("Authentication failed.");
        return;
      }

      await cancelBooking(cancelId, token);

      toast.success("Booking cancelled successfully");
      setCancelId(null);
      loadBookings();
    } catch (err) {
      console.error("Cancel error:", err?.response?.data || err);
      toast.error(
        err?.response?.data?.message || "Failed to cancel booking."
      );
    }
  }

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <p>Please sign in to view your bookings.</p>;
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
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
              This action cannot be undone.
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
