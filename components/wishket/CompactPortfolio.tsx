"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Building2, Calendar } from "lucide-react";

import { type PortfolioItem } from "@/lib/types";
import { ScrollReveal } from "@/components/common/ScrollReveal";

function getThumbnailPath(id: string): string {
  return `/images/portfolio/${id}.png`;
}

interface CompactPortfolioProps {
  portfolio: PortfolioItem[];
}

export function CompactPortfolio({ portfolio }: CompactPortfolioProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedItem = portfolio.find((p) => p.id === selectedId);

  useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="mx-auto max-w-5xl px-6 py-28">
      <ScrollReveal>
        <h2 className="mb-3 text-center font-playfair text-3xl font-bold text-foreground md:text-4xl">
          제작 사례
        </h2>
        <p className="mb-14 text-center text-muted">
          다양한 산업의 클라이언트와 함께 만든 웹사이트들입니다
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {portfolio.map((item, i) => (
          <ScrollReveal key={item.id} delay={i * 0.05}>
            <div
              onClick={() => setSelectedId(item.id)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-card-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={getThumbnailPath(item.id)}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <p className="text-xs text-muted">
                  {item.category} · {item.client} · {item.year}
                </p>
                <h3 className="mt-1.5 text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md bg-chem/8 px-2 py-0.5 text-xs text-chem"
                    >
                      {tech}
                    </span>
                  ))}
                  {item.techStack.length > 4 && (
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-muted">
                      +{item.techStack.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 z-50 flex flex-col overflow-hidden rounded-2xl border border-card-border bg-white shadow-2xl sm:inset-8 md:inset-12 lg:inset-x-[15%] lg:inset-y-8"
            >
              <div className="flex items-center justify-between border-b border-card-border px-6 py-4">
                <h3 className="font-playfair text-xl font-bold text-foreground">
                  {selectedItem.title}
                </h3>
                <button
                  onClick={() => setSelectedId(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-gray-100 hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                    {selectedItem.client}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {selectedItem.year}
                  </span>
                </div>
                <p className="mb-6 leading-relaxed text-muted">
                  {selectedItem.description}
                </p>
                <div className="mb-6">
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg bg-chem/10 px-3 py-1 text-sm text-chem"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                {selectedItem.features.length > 0 && (
                  <div className="mb-6">
                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {selectedItem.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-sm text-muted"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-chem" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedItem.url && selectedItem.url !== "#" && (
                  <a
                    href={selectedItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 font-semibold text-white transition-transform hover:scale-105"
                  >
                    사이트 방문
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
