"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  createVendorProfile,
  updateVendorProfile,
  getVendorProfile,
} from "@/lib/api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function VendorProfilePage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState({
    _id: null,
    businessName: "",
    serviceType: "",
    phone: "",
    address: "",
    pricePerVisit: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) loadProfile();
  }, [isLoaded, isSignedIn]);

  async function loadProfile() {
    try {
      const token = await getToken();
      if (!token) return;

      const data = await getVendorProfile(token);

      if (data) {
        setProfile({
          _id: data._id,
          businessName: data.businessName || "",
          serviceType: data.serviceType || "",
          phone: data.phone || "",
          address: data.address || "",
          pricePerVisit: data.pricePerVisit || "",
          description: data.description || "",
        });
      }
    } catch {
      // No profile yet
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field, value) {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSave(e) {
    e.preventDefault();

    if (!profile.serviceType) {
      toast.error("Please select a service type");
      return;
    }

    if (!profile.phone || !profile.address || !profile.pricePerVisit) {
      toast.error("Please fill all required fields");
      return;
    }

    setSaving(true);

    try {
      const token = await getToken();
      const { _id, ...payload } = profile;

      payload.pricePerVisit = Number(payload.pricePerVisit);

      if (_id) {
        await updateVendorProfile(payload, token);
        toast.success("Profile updated successfully!");
      } else {
        await createVendorProfile(payload, token);
        toast.success("You are now a Vendor!");
      }

      router.push("/vendor");
    } catch (err) {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  if (!isLoaded) return null;
  if (!isSignedIn) return <p className="p-6">Please sign in</p>;
  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-10 p-8">
      
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Vendor Profile
        </h1>
        <p className="text-muted-foreground text-base">
          Set up your professional service profile to start receiving bookings.
        </p>
      </div>

      {/* CARD */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Business Information</CardTitle>
          <CardDescription>
            This information will be visible to customers.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSave} className="space-y-8">

            {/* Business Name */}
            <div className="space-y-2">
              <Label>Business Name</Label>
              <Input
                value={profile.businessName}
                onChange={(e) =>
                  handleChange("businessName", e.target.value)
                }
                placeholder="e.g. Elite Plumbing Services"
                className="h-11"
                required
              />
            </div>

            {/* Service Type */}
            <div className="space-y-2">
              <Label>Service Type</Label>
              <Select
                value={profile.serviceType}
                onValueChange={(value) =>
                  handleChange("serviceType", value)
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="ac">AC Repair</SelectItem>
                  <SelectItem value="appliance">Appliance Repair</SelectItem>
                  <SelectItem value="carpentry">Carpentry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Phone & Price */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  value={profile.phone}
                  onChange={(e) =>
                    handleChange("phone", e.target.value)
                  }
                  placeholder="Enter phone number"
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Price Per Visit (₹)</Label>
                <Input
                  type="number"
                  value={profile.pricePerVisit}
                  onChange={(e) =>
                    handleChange("pricePerVisit", e.target.value)
                  }
                  placeholder="Enter price"
                  className="h-11"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label>Service Address</Label>
              <Input
                value={profile.address}
                onChange={(e) =>
                  handleChange("address", e.target.value)
                }
                placeholder="Enter service location"
                className="h-11"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={profile.description}
                onChange={(e) =>
                  handleChange("description", e.target.value)
                }
                placeholder="Describe your services, experience, and expertise..."
                rows={4}
              />
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={saving}
                className="px-8"
              >
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
