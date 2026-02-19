"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useRole } from "@/lib/role-context";

import {
  Search,
  CalendarCheck,
  CheckCircle,
  Shield,
  Clock,
  Star,
  CreditCard,
  Wrench,
  ArrowRight,
  Users,
  BadgeCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import { ServiceCard } from "@/components/service-card";
import { services } from "@/lib/services";

const steps = [
  {
    icon: Search,
    title: "Choose a Service",
    description:
      "Browse categories and select the right professional instantly.",
  },
  {
    icon: CalendarCheck,
    title: "Schedule a Visit",
    description:
      "Pick your preferred date and time. Booking takes less than 60 seconds.",
  },
  {
    icon: CheckCircle,
    title: "Get It Fixed",
    description:
      "A verified professional arrives and completes the job efficiently.",
  },
];

const features = [
  {
    icon: Shield,
    title: "Verified Professionals",
    description:
      "Every vendor undergoes strict verification before approval.",
  },
  {
    icon: Clock,
    title: "On-Time Guarantee",
    description:
      "Professionals respect your schedule and arrive on time.",
  },
  {
    icon: Star,
    title: "Rated & Reviewed",
    description:
      "Real customer reviews help you make informed decisions.",
  },
  {
    icon: CreditCard,
    title: "Transparent Pricing",
    description:
      "Upfront pricing with no hidden charges.",
  },
  {
    icon: Users,
    title: "Growing Community",
    description:
      "Thousands of happy customers trust Fixora daily.",
  },
  {
    icon: BadgeCheck,
    title: "Quality Assurance",
    description:
      "We ensure consistent service quality across all vendors.",
  },
];

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { setRole } = useRole();
  const router = useRouter();

  if (!isLoaded) return null;

  function handleVendorJoin() {
    if (!isSignedIn) {
      router.push("/sign-up");
      return;
    }

    setRole("vendor");
    router.push("/vendor/profile");
  }

  function handleBookService() {
    if (!isSignedIn) {
      router.push("/sign-up");
      return;
    }

    setRole("customer");
    router.push("/dashboard/book-service");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--color-primary)/0.08,transparent_70%)]" />

        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 pb-24 pt-28 text-center lg:px-8 lg:pb-36 lg:pt-40">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Wrench className="h-3.5 w-3.5" />
            Trusted by 10,000+ homeowners
          </div>

          <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Book Trusted Local Repairs{" "}
            <span className="text-primary">in Minutes</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Fixora connects you with verified professionals. Schedule,
            track, and pay securely — all in one seamless platform.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="gap-2 px-8" onClick={handleBookService}>
              Book a Service
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="px-8"
              onClick={handleVendorJoin}
            >
              Join as a Vendor
            </Button>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section
        id="services"
        className="border-t border-border/60 bg-muted/30 py-24"
      >
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Services We Offer
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Reliable professionals for every home need.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-10 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-lg">
                  <step.icon className="h-7 w-7" />
                </div>

                <h3 className="text-lg font-semibold">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY FIXORA ================= */}
      <section
        id="why-fixora"
        className="border-t border-border/60 bg-muted/20 py-24"
      >
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Why Choose Fixora?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We focus on trust, quality, and reliability.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>

                <h3 className="text-lg font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-border/60 bg-card py-12 text-center">
        <p className="text-sm text-muted-foreground">
          © 2025 Fixora. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
