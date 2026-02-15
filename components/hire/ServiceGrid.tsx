"use client";

import { type HireService } from "@/lib/types";
import { ScrollReveal } from "@/components/common/ScrollReveal";

interface ServiceGridProps {
  services: HireService[];
}

export function ServiceGrid({ services }: ServiceGridProps) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <ScrollReveal>
        <h2 className="mb-12 text-center font-playfair text-3xl font-bold text-white">
          이런 걸 만들어드려요
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {services.map((service, i) => (
          <ScrollReveal key={service.title} delay={i * 0.08}>
            <div className="rounded-xl border border-card-border bg-card p-6 text-center transition-all duration-300 hover:scale-[1.02] hover:border-chem/40">
              <span className="text-4xl">{service.icon}</span>
              <h3 className="mt-3 font-semibold text-white">
                {service.title}
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                {service.description}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
