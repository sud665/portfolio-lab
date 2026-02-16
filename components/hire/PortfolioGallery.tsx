"use client";

import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Calendar, Building2 } from "lucide-react";

import { type PortfolioItem } from "@/lib/types";
import { ScrollReveal } from "@/components/common/ScrollReveal";

const cardGradients: Record<string, string> = {
  chem: "from-chem via-[#8a0c3a] to-[#2a0512]",
  code: "from-code via-[#025a9e] to-[#021b30]",
  ai: "from-ai via-[#5a1c37] to-[#1e0a13]",
  amber: "from-amber via-[#8a6420] to-[#2a1e08]",
};

const badgeColors: Record<string, string> = {
  chem: "bg-chem/15 text-chem",
  code: "bg-code/15 text-code",
  ai: "bg-ai/15 text-ai",
  amber: "bg-amber/15 text-amber",
};

const dotColors: Record<string, string> = {
  chem: "bg-chem",
  code: "bg-code",
  ai: "bg-ai",
  amber: "bg-amber",
};

function BrowserMockup({ size }: { size: "sm" | "md" | "lg" }) {
  const isSmall = size === "sm";
  const dotSize = isSmall ? "h-1.5 w-1.5" : "h-2.5 w-2.5";
  const barPadding = isSmall ? "px-2 py-1.5" : "px-4 py-2.5";
  const bodyPadding = isSmall ? "p-3" : "p-5";

  return (
    <div className="overflow-hidden rounded-xl border border-white/15 bg-white/10 shadow-2xl backdrop-blur-sm">
      <div
        className={`flex items-center gap-1.5 border-b border-white/10 ${barPadding}`}
      >
        <div className={`rounded-full bg-white/50 ${dotSize}`} />
        <div className={`rounded-full bg-white/35 ${dotSize}`} />
        <div className={`rounded-full bg-white/20 ${dotSize}`} />
        <div className="ml-3 h-4 flex-1 rounded-full bg-white/10" />
      </div>
      <div className={`space-y-2.5 ${bodyPadding}`}>
        <div className="h-3.5 w-2/3 rounded-full bg-white/15" />
        <div className="h-2.5 w-full rounded-full bg-white/10" />
        <div className="h-2.5 w-4/5 rounded-full bg-white/10" />
        {!isSmall && (
          <>
            <div className="h-2.5 w-3/5 rounded-full bg-white/[0.08]" />
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="h-10 rounded-lg bg-white/10" />
              <div className="h-10 rounded-lg bg-white/[0.08]" />
              <div className="h-10 rounded-lg bg-white/10" />
            </div>
            {size === "lg" && (
              <div className="h-6 w-24 rounded-md bg-white/15" />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CardShell({
  item,
  selectedId,
  onSelect,
  className,
  children,
}: {
  item: PortfolioItem;
  selectedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      layoutId={`card-${item.id}`}
      onClick={() => onSelect(item.id)}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className={`group cursor-pointer overflow-hidden rounded-3xl transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/30 ${
        selectedId === item.id ? "invisible" : ""
      } ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}

interface PortfolioGalleryProps {
  portfolio: PortfolioItem[];
}

export function PortfolioGallery({ portfolio }: PortfolioGalleryProps) {
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

  const handleSelect = (id: string) => setSelectedId(id);

  return (
    <section id="portfolio" className="mx-auto max-w-6xl px-6 py-24">
      <ScrollReveal>
        <div className="mb-14">
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-chem">
            Portfolio
          </p>
          <h2 className="font-playfair text-4xl font-bold text-white md:text-5xl">
            제작 사례
          </h2>
          <p className="mt-4 max-w-lg text-gray-400">
            다양한 산업의 클라이언트와 함께 만든 웹사이트들입니다.
          </p>
        </div>
      </ScrollReveal>

      <div className="flex flex-col gap-5">
        {/* ━━ ROW 1 : Featured ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {portfolio[0] && (
          <ScrollReveal>
            <CardShell
              item={portfolio[0]}
              selectedId={selectedId}
              onSelect={handleSelect}
            >
              <div
                className={`relative flex min-h-96 flex-col bg-gradient-to-br ${cardGradients[portfolio[0].color]} p-8 md:min-h-[420px] md:flex-row md:items-end md:p-12`}
              >
                <div className="mb-8 flex justify-center md:absolute md:right-10 md:top-1/2 md:mb-0 md:w-72 md:-translate-y-1/2 lg:w-80">
                  <div className="w-64 transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105 md:w-full">
                    <BrowserMockup size="lg" />
                  </div>
                </div>

                <div className="relative z-10 max-w-sm md:max-w-md">
                  <span className="mb-3 inline-block rounded-full bg-white/20 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                    Featured — {portfolio[0].category}
                  </span>
                  <h3 className="font-playfair text-3xl font-bold text-white md:text-5xl">
                    {portfolio[0].title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-white/80">
                    {portfolio[0].subtitle}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {portfolio[0].techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-medium text-white/60 backdrop-blur-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pointer-events-none absolute right-6 top-6 hidden md:grid md:grid-cols-5 md:gap-2 md:opacity-[0.07]">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className="h-2 w-2 rounded-full bg-white" />
                  ))}
                </div>
                <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full border border-white/[0.05]" />
              </div>
            </CardShell>
          </ScrollReveal>
        )}

        {/* ━━ ROW 2 : 5 : 7 Asymmetric ━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {portfolio.length > 2 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            {/* Narrow-tall left */}
            {portfolio[1] && (
              <ScrollReveal className="md:col-span-5">
                <CardShell
                  item={portfolio[1]}
                  selectedId={selectedId}
                  onSelect={handleSelect}
                  className="h-full"
                >
                  <div
                    className={`relative flex h-full min-h-80 flex-col bg-gradient-to-tr ${cardGradients[portfolio[1].color]} p-7 md:min-h-[460px] md:p-8`}
                  >
                    <div className="mb-auto flex justify-end">
                      <div className="w-32 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-1 group-hover:scale-105">
                        <BrowserMockup size="sm" />
                      </div>
                    </div>
                    <div className="relative z-10 mt-auto">
                      <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                        {portfolio[1].category}
                      </span>
                      <h3 className="font-playfair text-2xl font-bold text-white md:text-3xl">
                        {portfolio[1].title}
                      </h3>
                      <p className="mt-1.5 text-sm text-white/70">
                        {portfolio[1].subtitle}
                      </p>
                    </div>
                    <div className="pointer-events-none absolute -left-10 top-1/3 h-36 w-36 rounded-full border border-white/[0.06]" />
                  </div>
                </CardShell>
              </ScrollReveal>
            )}

            {/* Wide right */}
            {portfolio[2] && (
              <ScrollReveal delay={0.1} className="md:col-span-7">
                <CardShell
                  item={portfolio[2]}
                  selectedId={selectedId}
                  onSelect={handleSelect}
                  className="h-full"
                >
                  <div
                    className={`relative flex h-full min-h-80 flex-col bg-gradient-to-bl ${cardGradients[portfolio[2].color]} p-7 md:min-h-[460px] md:flex-row md:items-end md:p-10`}
                  >
                    <div className="relative z-10 flex flex-1 flex-col justify-end">
                      <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                        {portfolio[2].category}
                      </span>
                      <h3 className="font-playfair text-2xl font-bold text-white md:text-3xl">
                        {portfolio[2].title}
                      </h3>
                      <p className="mt-1.5 max-w-xs text-sm text-white/70">
                        {portfolio[2].subtitle}
                      </p>
                    </div>
                    <div className="mt-6 flex justify-end md:mt-0 md:w-48 md:shrink-0">
                      <div className="w-44 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105 md:w-full">
                        <BrowserMockup size="md" />
                      </div>
                    </div>
                    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rotate-45 rounded-3xl border border-white/[0.04]" />
                  </div>
                </CardShell>
              </ScrollReveal>
            )}
          </div>
        )}

        {/* ━━ ROW 3 : 7 : 5 Reversed ━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {portfolio.length > 4 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            {/* Wide left */}
            {portfolio[3] && (
              <ScrollReveal className="md:col-span-7">
                <CardShell
                  item={portfolio[3]}
                  selectedId={selectedId}
                  onSelect={handleSelect}
                  className="h-full"
                >
                  <div
                    className={`relative flex h-full min-h-80 flex-col bg-gradient-to-r ${cardGradients[portfolio[3].color]} p-7 md:min-h-[460px] md:flex-row md:items-end md:p-10`}
                  >
                    <div className="mb-6 flex justify-start md:mb-0 md:w-48 md:shrink-0">
                      <div className="w-44 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105 md:w-full">
                        <BrowserMockup size="md" />
                      </div>
                    </div>
                    <div className="relative z-10 flex flex-1 flex-col justify-end md:pl-8">
                      <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                        {portfolio[3].category}
                      </span>
                      <h3 className="font-playfair text-2xl font-bold text-white md:text-3xl">
                        {portfolio[3].title}
                      </h3>
                      <p className="mt-1.5 max-w-xs text-sm text-white/70">
                        {portfolio[3].subtitle}
                      </p>
                    </div>
                    <div className="pointer-events-none absolute right-8 top-8 opacity-[0.06]">
                      <div className="h-px w-20 bg-white" />
                      <div className="ml-10 mt-4 h-px w-16 bg-white" />
                      <div className="ml-5 mt-4 h-px w-12 bg-white" />
                    </div>
                  </div>
                </CardShell>
              </ScrollReveal>
            )}

            {/* Narrow-tall right */}
            {portfolio[4] && (
              <ScrollReveal delay={0.1} className="md:col-span-5">
                <CardShell
                  item={portfolio[4]}
                  selectedId={selectedId}
                  onSelect={handleSelect}
                  className="h-full"
                >
                  <div
                    className={`relative flex h-full min-h-80 flex-col bg-gradient-to-b ${cardGradients[portfolio[4].color]} p-7 md:min-h-[460px] md:p-8`}
                  >
                    <div className="mb-auto flex justify-center">
                      <div className="w-40 transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105">
                        <BrowserMockup size="sm" />
                      </div>
                    </div>
                    <div className="relative z-10 mt-auto">
                      <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                        {portfolio[4].category}
                      </span>
                      <h3 className="font-playfair text-2xl font-bold text-white md:text-3xl">
                        {portfolio[4].title}
                      </h3>
                      <p className="mt-1.5 text-sm text-white/70">
                        {portfolio[4].subtitle}
                      </p>
                    </div>
                    <div className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full border border-white/[0.05]" />
                    <div className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-white/[0.02]" />
                  </div>
                </CardShell>
              </ScrollReveal>
            )}
          </div>
        )}

        {/* ━━ ROW 4 : Banner ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {portfolio[5] && (
          <ScrollReveal>
            <CardShell
              item={portfolio[5]}
              selectedId={selectedId}
              onSelect={handleSelect}
            >
              <div
                className={`relative flex min-h-64 flex-col items-center justify-center overflow-hidden bg-gradient-to-tl ${cardGradients[portfolio[5].color]} p-8 text-center md:min-h-72 md:p-12`}
              >
                <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                  {portfolio[5].category}
                </span>
                <h3 className="font-playfair text-3xl font-bold text-white md:text-4xl">
                  {portfolio[5].title}
                </h3>
                <p className="mt-2 max-w-md text-base text-white/75">
                  {portfolio[5].subtitle}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {portfolio[5].techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-medium text-white/60 backdrop-blur-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="pointer-events-none absolute -left-4 top-6 w-28 -rotate-12 opacity-[0.08]">
                  <BrowserMockup size="sm" />
                </div>
                <div className="pointer-events-none absolute -right-4 bottom-4 w-24 rotate-6 opacity-[0.06]">
                  <BrowserMockup size="sm" />
                </div>
              </div>
            </CardShell>
          </ScrollReveal>
        )}
      </div>

      {/* ━━ Expanded Overlay ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            />

            <motion.div
              layoutId={`card-${selectedItem.id}`}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-3 z-50 flex flex-col overflow-hidden rounded-3xl border border-card-border bg-card sm:inset-6 md:inset-10 lg:inset-x-[12%] lg:inset-y-6"
            >
              <div
                className={`relative shrink-0 bg-gradient-to-br ${cardGradients[selectedItem.color]} px-8 pb-10 pt-16 md:px-12`}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(null);
                  }}
                  className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/50 hover:scale-110"
                >
                  <X className="h-5 w-5" />
                </button>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="mb-8 flex justify-center"
                >
                  <div className="w-full max-w-sm">
                    <BrowserMockup size="lg" />
                  </div>
                </motion.div>

                <span className="mb-3 inline-block rounded-full bg-white/20 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                  {selectedItem.category}
                </span>
                <h2 className="font-playfair text-3xl font-bold text-white md:text-4xl">
                  {selectedItem.title}
                </h2>
                <p className="mt-2 text-base text-white/80">
                  {selectedItem.subtitle}
                </p>

                <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full border border-white/[0.05]" />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="flex-1 overflow-y-auto p-8 md:p-10"
              >
                <div className="mb-8 flex flex-wrap gap-6 border-b border-card-border pb-6">
                  <div className="flex items-center gap-2.5 text-gray-400">
                    <Building2 className="h-4 w-4" />
                    <span className="text-sm">{selectedItem.client}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{selectedItem.year}</span>
                  </div>
                </div>

                <p className="mb-10 text-base leading-relaxed text-gray-300">
                  {selectedItem.description}
                </p>

                <div className="mb-10">
                  <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.techStack.map((tech) => (
                      <span
                        key={tech}
                        className={`rounded-lg px-3.5 py-1.5 text-sm font-medium ${badgeColors[selectedItem.color]}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedItem.features.length > 0 && (
                  <div className="mb-10">
                    <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
                      Key Features
                    </h4>
                    <ul className="space-y-3">
                      {selectedItem.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-3 text-sm leading-relaxed text-gray-300"
                        >
                          <span
                            className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dotColors[selectedItem.color]}`}
                          />
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
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-dark transition-transform hover:scale-105"
                  >
                    사이트 방문
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
