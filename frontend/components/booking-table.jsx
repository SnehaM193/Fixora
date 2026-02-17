"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";

export function BookingTable({ bookings, role, onAction }) {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <p className="text-sm text-muted-foreground">No bookings found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            {role === "vendor" ? (
              <TableHead>Customer</TableHead>
            ) : (
              <TableHead>Vendor</TableHead>
            )}
            <TableHead>Service</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">
                {role === "vendor"
                  ? booking.customerName
                  : booking.vendorName}
              </TableCell>
              <TableCell>{booking.service}</TableCell>
              <TableCell>{booking.date}</TableCell>
              <TableCell>{booking.time}</TableCell>
              <TableCell>
                <StatusBadge status={booking.status} />
              </TableCell>
              <TableCell className="text-right">
                {role === "user" && booking.status === "Pending" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onAction && onAction("cancel", booking.id)}
                  >
                    Cancel
                  </Button>
                )}
                {role === "vendor" && booking.status === "Pending" && (
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        onAction && onAction("accept", booking.id)
                      }
                    >
                      Accept
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        onAction && onAction("reject", booking.id)
                      }
                    >
                      Reject
                    </Button>
                  </div>
                )}
                {role === "vendor" &&
                  (booking.status === "Accepted" ||
                    booking.status === "In Progress") && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        onAction && onAction("complete", booking.id)
                      }
                    >
                      Mark Complete
                    </Button>
                  )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
