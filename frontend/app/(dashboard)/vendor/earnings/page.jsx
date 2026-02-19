"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { IndianRupee, TrendingUp, CalendarCheck } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

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
import { toast } from "sonner";

const chartConfig = {
  earnings: {
    label: "Earnings",
    color: "var(--color-chart-1)",
  },
};

export default function EarningsPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      loadEarnings();
    } else {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  async function loadEarnings() {
    try {
      const token = await getToken();

      if (!token) {
        toast.error("Authentication failed");
        return;
      }

      const res = await getEarnings(token);
      setData(res);
    } catch (err) {
      console.error(err?.response?.data || err);
      toast.error("Failed to load earnings");
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded) return null;
  if (!isSignedIn) return <p>Please sign in</p>;

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-[100px] rounded-xl" />
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
          value={`₹${data?.monthlyEarnings?.toLocaleString() || 0}`}
          description="Current month revenue"
        />

        <StatsCard
          icon={TrendingUp}
          title="Total Earnings"
          value={`₹${data?.totalEarnings?.toLocaleString() || 0}`}
          description="Lifetime revenue"
        />

        <StatsCard
          icon={CalendarCheck}
          title="Avg. Booking Value"
          value={`₹${data?.averageBookingValue || 0}`}
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
            <BarChart data={data?.monthly || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
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
