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
        <p className="text-sm text-muted-foreground">
          No bookings found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              {role === "vendor" ? "Customer" : "Vendor"}
            </TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking._id}>
              <TableCell className="font-medium">
                {role === "vendor"
                  ? booking.userId   // until you add customer name properly
                  : booking.vendorName}
              </TableCell>

              <TableCell>{booking.service}</TableCell>
              <TableCell>{booking.date}</TableCell>
              <TableCell>{booking.time}</TableCell>

              <TableCell>
                <StatusBadge status={booking.status} />
              </TableCell>

              <TableCell className="text-right">
                {/* ========================= */}
                {/* CUSTOMER ACTIONS */}
                {/* ========================= */}
                {role === "user" &&
                  booking.status === "Pending" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        onAction &&
                        onAction("cancel", booking._id)
                      }
                    >
                      Cancel
                    </Button>
                  )}

                {/* ========================= */}
                {/* VENDOR ACTIONS */}
                {/* ========================= */}
                {role === "vendor" &&
                  booking.status === "Pending" && (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          onAction &&
                          onAction("accept", booking._id)
                        }
                      >
                        Accept
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          onAction &&
                          onAction("reject", booking._id)
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  )}

                {role === "vendor" &&
                  booking.status === "Accepted" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        onAction &&
                        onAction("complete", booking._id)
                      }
                    >
                      Mark Completed
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
