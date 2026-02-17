"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CalendarDays, Clock, FileText } from "lucide-react";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { VendorCard } from "@/components/vendor-card";
import { getServices, getVendors, createBooking } from "@/lib/api";

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
  const [services, setServices] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [loading, setLoading] = useState(true);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const res = await getServices();
      setServices(res.data);
    } finally {
      setLoading(false);
    }
  }

  async function handleServiceChange(serviceId) {
    setSelectedService(serviceId);
    setVendorsLoading(true);
    try {
      const res = await getVendors(serviceId);
      setVendors(res.data);
    } finally {
      setVendorsLoading(false);
    }
  }

  function handleBookVendor(vendor) {
    setSelectedVendor(vendor);
    setBookingDate("");
    setBookingTime("");
    setBookingNotes("");
    setDialogOpen(true);
  }

  async function handleConfirmBooking() {
    if (!bookingDate || !bookingTime) {
      toast.error("Please select a date and time.");
      return;
    }
    setSubmitting(true);
    try {
      await createBooking({
        service: selectedVendor.service,
        vendorId: selectedVendor.id,
        vendorName: selectedVendor.name,
        date: bookingDate,
        time: bookingTime,
        price: selectedVendor.price,
        notes: bookingNotes,
        address: "Your saved address",
      });
      toast.success("Booking created successfully!");
      setDialogOpen(false);
    } catch {
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Book a Service
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose a service and find available professionals.
          </p>
        </div>
        <Skeleton className="h-10 w-64 rounded-lg" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[250px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Book a Service
        </h1>
        <p className="text-sm text-muted-foreground">
          Choose a service and find available professionals.
        </p>
      </div>

      <div className="max-w-xs">
        <Select value={selectedService} onValueChange={handleServiceChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a service category" />
          </SelectTrigger>
          <SelectContent>
            {services.map((svc) => (
              <SelectItem key={svc.id} value={svc.id}>
                {svc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!selectedService && (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-muted-foreground">
            Select a service category above to browse available vendors.
          </p>
        </div>
      )}

      {selectedService && vendorsLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[250px] rounded-xl" />
          ))}
        </div>
      )}

      {selectedService && !vendorsLoading && vendors.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-muted-foreground">
            No vendors available for this service at the moment.
          </p>
        </div>
      )}

      {selectedService && !vendorsLoading && vendors.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onBook={handleBookVendor}
            />
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book {selectedVendor?.name}</DialogTitle>
            <DialogDescription>
              {selectedVendor?.service} - {selectedVendor?.currency === "INR" ? "\u20B9" : "$"}
              {selectedVendor?.price}/visit
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="date" className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                min={today}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="time" className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                Time Slot
              </Label>
              <Select value={bookingTime} onValueChange={setBookingTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="notes" className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                Notes (optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Describe the issue or any special instructions..."
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmBooking} disabled={submitting}>
              {submitting ? "Booking..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
