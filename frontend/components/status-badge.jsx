"use client";

import { Badge } from "@/components/ui/badge";

const statusConfig = {
  Pending: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  Accepted: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  "In Progress": "bg-sky-100 text-sky-800 hover:bg-sky-100",
  Completed: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  Cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
};

export function StatusBadge({ status }) {
  return (
    <Badge variant="secondary" className={statusConfig[status] || ""}>
      {status}
    </Badge>
  );
}
