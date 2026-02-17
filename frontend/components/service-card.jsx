"use client";

import { Droplets, Zap, Snowflake, Refrigerator, Hammer } from "lucide-react";

const iconMap = {
  Droplets: Droplets,
  Zap: Zap,
  Snowflake: Snowflake,
  Refrigerator: Refrigerator,
  Hammer: Hammer,
};

export function ServiceCard({ service }) {
  const Icon = iconMap[service.icon] || Droplets;

  return (
    <div className="group flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-7 w-7 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-card-foreground">
        {service.name}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {service.description}
      </p>
    </div>
  );
}
