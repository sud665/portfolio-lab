"use client";

import { type HireProcess } from "@/lib/types";
import { ScrollReveal } from "@/components/common/ScrollReveal";

interface ProcessFlowProps {
  process: HireProcess[];
}

export function ProcessFlow({ process }: ProcessFlowProps) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <ScrollReveal>
        <h2 className="mb-12 text-center font-playfair text-3xl font-bold text-white">
          이렇게 진행돼요
        </h2>
      </ScrollReveal>

      {/* Desktop */}
      <div className="hidden md:block">
        <div className="flex items-start justify-between">
          {process.map((step, i) => (
            <ScrollReveal
              key={step.step}
              delay={i * 0.1}
              className="flex flex-1 flex-col items-center text-center"
            >
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chem text-lg font-bold text-white">
                  {step.step}
                </div>
                {i < process.length - 1 && (
                  <div className="mx-2 w-12 border-t-2 border-dashed border-chem/30" />
                )}
              </div>
              <h3 className="mt-4 font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{step.description}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="block md:hidden">
        <div className="relative pl-10">
          <div className="absolute top-0 bottom-0 left-5 w-0.5 bg-chem/20" />

          {process.map((step, i) => (
            <ScrollReveal
              key={step.step}
              delay={i * 0.08}
              className="relative mb-8"
            >
              <div className="absolute -left-5 flex h-10 w-10 items-center justify-center rounded-full bg-chem text-sm font-bold text-white">
                {step.step}
              </div>
              <div className="pl-8">
                <h3 className="font-semibold text-white">{step.title}</h3>
                <p className="mt-1 text-sm text-gray-400">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
