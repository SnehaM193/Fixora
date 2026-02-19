"use client";

import Image from "next/image";
import { Droplets, Zap, Snowflake, Refrigerator, Hammer } from "lucide-react";

const iconMap = {
  plumbing: Droplets,
  electrical: Zap,
  ac: Snowflake,
  appliance: Refrigerator,
  carpentry: Hammer,
};

export function ServiceCard({ service }) {
  const Icon = iconMap[service.type] || Droplets;

  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
      
      {/* Image Section */}
      <div className="relative h-40 w-full">
        {service.image ? (
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/10">
            <Icon className="h-10 w-10 text-primary" />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold text-card-foreground">
          {service.name}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {service.description}
        </p>
      </div>
    </div>
  );
}
