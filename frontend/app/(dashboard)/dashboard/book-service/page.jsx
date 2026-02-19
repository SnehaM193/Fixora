"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VendorCard } from "@/components/vendor-card";

import { services } from "@/lib/services";
import { createBooking, getAllVendors } from "@/lib/api";

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

export default function BookServicePage() {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  const [selectedService, setSelectedService] = useState("");
  const [vendors, setVendors] = useState([]);
  const [allVendors, setAllVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ================================
  // LOAD ALL VENDORS FROM DB
  // ================================
  useEffect(() => {
    loadVendors();
  }, []);

  async function loadVendors() {
    try {
      const data = await getAllVendors();
      setAllVendors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load vendors");
    }
  }

  // ================================
  // FILTER VENDORS BY SERVICE
  // ================================
  function handleServiceChange(serviceType) {
    setSelectedService(serviceType);

    if (!serviceType) {
      setVendors([]);
      return;
    }

    const filtered = allVendors.filter((vendor) =>
      vendor.serviceType?.toLowerCase() === serviceType.toLowerCase()
    );

    setVendors(filtered);
  }

  // ================================
  // OPEN BOOKING MODAL
  // ================================
  function openBookingDialog(vendor) {
    setSelectedVendor(vendor);
    setBookingDate("");
    setBookingTime("");
    setBookingNotes("");
    setDialogOpen(true);
  }

  // ================================
  // CONFIRM BOOKING
  // ================================
  async function handleConfirmBooking() {
    if (!isLoaded) return;

    if (!isSignedIn) {
      toast.error("Please sign in first.");
      return;
    }

    if (!selectedVendor) {
      toast.error("Please select a vendor.");
      return;
    }

    if (!bookingDate || !bookingTime) {
      toast.error("Select date and time.");
      return;
    }

    try {
      setSubmitting(true);

      const token = await getToken();

      if (!token) {
        toast.error("Authentication failed.");
        return;
      }

      await createBooking(
        {
          service: selectedVendor.serviceType,
          vendorId: selectedVendor._id, // REAL Mongo ID
          date: bookingDate,
          time: bookingTime,
          price: selectedVendor.pricePerVisit,
          notes: bookingNotes,
        },
        token
      );

      toast.success("Booking successful!");
      setDialogOpen(false);
    } catch (err) {
      console.error(err?.response?.data || err);
      toast.error("Booking failed.");
    } finally {
      setSubmitting(false);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Book a Service</h1>
        <p className="text-muted-foreground">
          Select a category and book a trusted professional.
        </p>
      </div>

      {/* SERVICE DROPDOWN */}
      <div className="max-w-sm">
        <Select value={selectedService} onValueChange={handleServiceChange}>
          <SelectTrigger>
            <SelectValue placeholder="Choose Service Category" />
          </SelectTrigger>
          <SelectContent>
            {services.map((svc) => (
              <SelectItem key={svc.id} value={svc.type}>
                {svc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* NO VENDORS MESSAGE */}
      {selectedService && vendors.length === 0 && (
        <p className="text-muted-foreground">
          No vendors available for this category.
        </p>
      )}

      {/* VENDOR LIST */}
      {vendors.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vendors.map((vendor) => (
            <div key={vendor._id} className="flex flex-col gap-3">
              <VendorCard vendor={vendor} />
              <Button onClick={() => openBookingDialog(vendor)}>
                Book Service
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* BOOKING DIALOG */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Book {selectedVendor?.businessName}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <Input
              type="date"
              min={today}
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />

            <Select value={bookingTime} onValueChange={setBookingTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select Time Slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Textarea
              placeholder="Add notes (optional)"
              value={bookingNotes}
              onChange={(e) => setBookingNotes(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              onClick={handleConfirmBooking}
              disabled={submitting}
              className="w-full"
            >
              {submitting ? "Booking..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
