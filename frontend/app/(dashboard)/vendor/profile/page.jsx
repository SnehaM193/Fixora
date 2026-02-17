"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  User,
  Phone,
  MapPin,
  Mail,
  IndianRupee,
  Briefcase,
  Clock,
  Wrench,
} from "lucide-react";
import { getVendorProfile, updateVendorProfile } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function VendorProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await getVendorProfile();
      setProfile(res.data);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateVendorProfile(profile);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  function handleChange(field, value) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Vendor Profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your business details and service information.
          </p>
        </div>
        <Skeleton className="h-[600px] rounded-xl" />
      </div>
    );
  }

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "V";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Vendor Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your business details and service information.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{profile?.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {profile?.email}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={profile?.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile?.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone" className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={profile?.phone || ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="address" className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <Input
                  id="address"
                  value={profile?.address || ""}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              </div>
              <Button type="submit" className="self-start" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Business Info */}
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label className="flex items-center gap-1.5">
                <Wrench className="h-4 w-4" />
                Services Offered
              </Label>
              <div className="flex flex-wrap gap-2">
                {(profile?.servicesOffered || []).map((svc) => (
                  <Badge key={svc} variant="secondary">
                    {svc}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="pricePerHour"
                className="flex items-center gap-1.5"
              >
                <IndianRupee className="h-4 w-4" />
                Price Per Visit
              </Label>
              <Input
                id="pricePerHour"
                type="number"
                value={profile?.pricePerHour || ""}
                onChange={(e) =>
                  handleChange("pricePerHour", Number(e.target.value))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="experience"
                className="flex items-center gap-1.5"
              >
                <Briefcase className="h-4 w-4" />
                Experience
              </Label>
              <Input
                id="experience"
                value={profile?.experience || ""}
                onChange={(e) => handleChange("experience", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="availability"
                className="flex items-center gap-1.5"
              >
                <Clock className="h-4 w-4" />
                Availability
              </Label>
              <Input
                id="availability"
                value={profile?.availability || ""}
                onChange={(e) => handleChange("availability", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
