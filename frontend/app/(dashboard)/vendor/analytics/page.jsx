"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { getAnalytics } from "@/lib/api";
import { toast } from "sonner";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VendorAnalyticsPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      loadAnalytics();
    } else {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  async function loadAnalytics() {
    try {
      const token = await getToken();

      if (!token) {
        toast.error("Authentication failed");
        return;
      }

      const data = await getAnalytics(token);
      setAnalytics(data);
    } catch (err) {
      console.error(err?.response?.data || err);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded) return null;
  if (!isSignedIn) return <p>Please sign in</p>;
  if (loading) return <p>Loading analytics...</p>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {analytics?.totalBookings || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {analytics?.completedBookings || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ₹{analytics?.totalEarnings?.toLocaleString() || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Earnings</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics?.chartData || []}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="earnings" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
