"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { User, Phone, MapPin, Mail } from "lucide-react";

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
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function UserProfilePage() {
  const { user, isLoaded } = useUser();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setPhone(user.unsafeMetadata?.phone || "");
      setAddress(user.unsafeMetadata?.address || "");
    }
  }, [user]);

  async function handleSave(e) {
    e.preventDefault();
    if (!user) return;

    setSaving(true);

    try {
      await user.update({
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" "),
        unsafeMetadata: {
          phone,
          address,
        },
      });

      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  if (!isLoaded) {
    return (
      <div className="p-6">
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "U";

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Customer Profile
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your personal details and contact information.
        </p>
      </div>

      {/* ================= PROFILE CARD ================= */}
      <Card className="shadow-sm border-border/60">
        <CardHeader>
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold">
                {name || "Your Name"}
              </CardTitle>
              <CardDescription>
                {user?.primaryEmailAddress?.emailAddress}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">

            {/* Full Name */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                value={user?.primaryEmailAddress?.emailAddress || ""}
                disabled
                className="h-11 bg-muted"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11"
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4" />
                Address
              </Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-11"
              />
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={saving}
                className="w-full md:w-auto px-8"
              >
                {saving ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
