"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function VendorCard({ vendor, onBook }) {
  // Use businessName instead of name
  const displayName = vendor?.businessName || "Vendor";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="p-4 flex flex-col gap-4">
      <CardContent className="flex flex-col gap-3 p-0">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
          {initials}
        </div>

        {/* Vendor Info */}
        <div>
          <h3 className="text-lg font-semibold">
            {vendor.businessName}
          </h3>

          <p className="text-sm text-muted-foreground capitalize">
            {vendor.serviceType}
          </p>

          <p className="text-sm text-muted-foreground">
            ₹{vendor.pricePerVisit} per visit
          </p>
        </div>

        {/* Book Button */}
        {onBook && (
          <Button onClick={() => onBook(vendor)}>
            Book Service
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
