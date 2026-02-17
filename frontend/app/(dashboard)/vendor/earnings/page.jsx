"use client";

import { useState, useEffect } from "react";
import { IndianRupee, TrendingUp, CalendarCheck } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getEarnings } from "@/lib/api";
import { StatsCard } from "@/components/stats-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  earnings: {
    label: "Earnings",
    color: "var(--color-chart-1)",
  },
};

export default function EarningsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEarnings();
  }, []);

  async function loadEarnings() {
    try {
      const res = await getEarnings();
      setData(res.data);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Earnings
          </h1>
          <p className="text-sm text-muted-foreground">
            Track your revenue and booking value.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[100px] rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[350px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Earnings
        </h1>
        <p className="text-sm text-muted-foreground">
          Track your revenue and booking value.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard
          icon={IndianRupee}
          title="This Month"
          value={`\u20B9${data?.monthlyEarnings?.toLocaleString() || 0}`}
          description="February 2026"
        />
        <StatsCard
          icon={TrendingUp}
          title="Total Earnings"
          value={`\u20B9${data?.totalEarnings?.toLocaleString() || 0}`}
          description="Lifetime revenue"
        />
        <StatsCard
          icon={CalendarCheck}
          title="Avg. Booking Value"
          value={`\u20B9${data?.averageBookingValue || 0}`}
          description="Per booking"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Earnings</CardTitle>
          <CardDescription>
            Revenue breakdown for the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <BarChart data={data?.monthly || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `\u20B9${v / 1000}k`} />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="earnings"
                fill="var(--color-chart-1)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
