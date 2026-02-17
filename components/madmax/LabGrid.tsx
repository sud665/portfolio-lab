"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  Package,
  FileCode2,
  Globe,
  Puzzle,
  type LucideIcon,
} from "lucide-react";

import { type LabExperiment } from "@/lib/types";

const iconMap: Record<string, LucideIcon> = {
  Building2,
  Package,
  FileCode2,
  Globe,
  Puzzle,
};

const statusConfig = {
  live: {
    dot: "bg-mad",
    pulse: true,
    label: "LIVE",
    labelClass: "text-mad",
  },
  building: {
    dot: "bg-amber",
    pulse: true,
    label: "BUILDING",
    labelClass: "text-amber",
  },
  idea: {
    dot: "bg-gray-600",
    pulse: false,
    label: "IDEA",
    labelClass: "text-gray-500",
  },
};

interface LabGridProps {
  experiments: LabExperiment[];
}

export function LabGrid({ experiments }: LabGridProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-28">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {experiments.map((exp, i) => {
          const Icon = iconMap[exp.icon];
          const status = statusConfig[exp.status];

          const card = (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={
                exp.status === "live" ? { scale: 1.03, y: -4 } : undefined
              }
              className={`group rounded-2xl border border-card-border bg-card p-8 transition-all duration-300 ${
                exp.status === "live"
                  ? "cursor-pointer hover:border-mad/30 hover:shadow-[0_0_24px_rgba(57,255,20,0.06)]"
                  : ""
              }`}
            >
              {/* 상태 표시 */}
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  {status.pulse && (
                    <span
                      className={`absolute inline-flex h-full w-full animate-ping rounded-full ${status.dot} opacity-75`}
                    />
                  )}
                  <span
                    className={`relative inline-flex h-2 w-2 rounded-full ${status.dot}`}
                  />
                </span>
                <span
                  className={`font-mono text-[10px] font-bold uppercase tracking-widest ${status.labelClass}`}
                >
                  {status.label}
                </span>
              </div>

              {/* 아이콘 */}
              {Icon && (
                <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-xl border border-card-border bg-dark">
                  <Icon size={22} className="text-mad/70" />
                </div>
              )}

              {/* 제목 & 설명 */}
              <h3 className="mt-4 text-lg font-bold tracking-tight text-white">
                {exp.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                {exp.description}
              </p>

              {/* CTA */}
              <div className="mt-6">
                {exp.status === "live" ? (
                  <span className="font-mono text-xs font-medium text-mad transition-colors duration-200 group-hover:text-mad-light">
                    Enter Lab →
                  </span>
                ) : (
                  <span className="font-mono text-xs text-gray-600">
                    Coming Soon
                  </span>
                )}
              </div>
            </motion.div>
          );

          if (exp.status === "live" && exp.href) {
            return (
              <Link key={exp.id} href={exp.href} className="block">
                {card}
              </Link>
            );
          }

          return card;
        })}
      </div>
    </section>
  );
}
