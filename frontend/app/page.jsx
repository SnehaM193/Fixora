"use client";

import Link from "next/link";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { ServiceCard } from "@/components/service-card";
import { services } from "@/lib/mock-data";

const steps = [
  {
    icon: Search,
    title: "Choose a Service",
    description:
      "Browse through our categories and find the right professional for your needs.",
  },
  {
    icon: CalendarCheck,
    title: "Schedule a Visit",
    description:
      "Pick a convenient date and time, add details, and confirm your booking.",
  },
  {
    icon: CheckCircle,
    title: "Get It Fixed",
    description:
      "A verified professional arrives at your door and gets the job done right.",
  },
];

const features = [
  {
    icon: Shield,
    title: "Verified Professionals",
    description:
      "Every vendor is background-checked and verified before joining our platform.",
  },
  {
    icon: Clock,
    title: "On-Time Guarantee",
    description:
      "We value your time. Professionals arrive within the scheduled window or you get a discount.",
  },
  {
    icon: Star,
    title: "Rated & Reviewed",
    description:
      "Transparent ratings and real reviews help you choose the best professional.",
  },
  {
    icon: CreditCard,
    title: "Transparent Pricing",
    description:
      "No hidden fees. See the price upfront before you book any service.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--color-primary)/0.08,transparent_70%)]" />
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 pb-20 pt-24 text-center lg:px-8 lg:pb-32 lg:pt-36">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Wrench className="h-3.5 w-3.5" />
            Trusted by 10,000+ homeowners
          </div>
          <h1 className="max-w-4xl text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Book Trusted Local Repairs{" "}
            <span className="text-primary">in Minutes</span>
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            From plumbing to electrical, Fixora connects you with verified
            professionals in your area. Schedule a repair, track your booking,
            and pay securely -- all in one place.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="gap-2 px-8" asChild>
              <Link href="/sign-up">
                Book a Service
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8" asChild>
              <Link href="/sign-up">Join as a Vendor</Link>
            </Button>
          </div>
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-primary" />
              Free to Book
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-primary" />
              Verified Experts
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-primary" />
              Satisfaction Guaranteed
            </span>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="border-t border-border/60 bg-muted/30 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Services We Offer
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              Find the right professional for any home repair or maintenance
              need.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              Getting your home fixed is as easy as 1-2-3.
            </p>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative flex flex-col items-center gap-4 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                  <step.icon className="h-7 w-7" />
                </div>
                <span className="absolute -top-2 right-1/2 translate-x-10 text-xs font-bold text-primary/40">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Fixora */}
      <section id="why-fixora" className="border-t border-border/60 bg-muted/30 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why Choose Fixora
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              We go the extra mile to make home repairs stress-free.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-2xl bg-primary px-8 py-14 text-center text-primary-foreground shadow-xl shadow-primary/20">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Get Things Fixed?
            </h2>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-primary-foreground/80">
              Join thousands of homeowners who trust Fixora for their home repair
              needs. Sign up today and book your first service.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 px-8"
                asChild
              >
                <Link href="/sign-up">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="px-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link href="/sign-up">Become a Vendor</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 lg:flex-row lg:justify-between lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <Wrench className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">Fixora</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <a href="#services" className="hover:text-foreground">
              Services
            </a>
            <a href="#how-it-works" className="hover:text-foreground">
              How It Works
            </a>
            <a href="#why-fixora" className="hover:text-foreground">
              Why Fixora
            </a>
            <Link href="/sign-in" className="hover:text-foreground">
              Sign In
            </Link>
          </nav>
          <p className="text-sm text-muted-foreground">
            2026 Fixora. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
