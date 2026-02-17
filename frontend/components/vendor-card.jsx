"use client";

import { Star, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function VendorCard({ vendor, onBook }) {
  const initials = vendor.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Card className="transition-all hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col gap-1">
            <h3 className="font-semibold text-card-foreground">
              {vendor.name}
            </h3>
            <p className="text-sm text-muted-foreground">{vendor.service}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-medium text-card-foreground">
              {vendor.rating}
            </span>
            <span>({vendor.reviews} reviews)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span>{vendor.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{vendor.availability}</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <div>
            <span className="text-xl font-bold text-card-foreground">
              {vendor.currency === "INR" ? "\u20B9" : "$"}
              {vendor.price}
            </span>
            <span className="text-sm text-muted-foreground">/visit</span>
          </div>
          <Button size="sm" onClick={() => onBook && onBook(vendor)}>
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
