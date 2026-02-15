"use client";

import { ScrollReveal } from "@/components/common/ScrollReveal";
import { techStacks } from "@/lib/constants";

export function TechStack() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <ScrollReveal>
        <h2 className="mb-12 text-center font-playfair text-3xl font-bold text-white">
          Tech Stack
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {techStacks.map((stack, i) => (
          <ScrollReveal key={stack.category} delay={i * 0.1}>
            <div className="rounded-xl border border-card-border bg-card p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-code/40">
              <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-gray-500">
                {stack.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {stack.items.map((item) => (
                  <span
                    key={item.name}
                    className={`rounded-lg border px-3 py-1 text-sm ${
                      item.highlight
                        ? "border-ai/20 bg-ai/10 text-ai"
                        : "border-code/20 bg-code/10 text-code-light"
                    }`}
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
