"use client";

import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import Image from "next/image";
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

const colorOverlays: Record<string, string> = {
  chem: "from-[#2a0512]/95 via-[#8a0c3a]/50",
  code: "from-[#021b30]/95 via-[#025a9e]/50",
  ai: "from-[#1e0a13]/95 via-[#5a1c37]/50",
  amber: "from-[#2a1e08]/95 via-[#8a6420]/50",
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

const openSpring = { type: "spring" as const, stiffness: 200, damping: 30 };
const closeSpring = { type: "spring" as const, stiffness: 300, damping: 35 };

function getThumbnailPath(id: string): string {
  return `/images/portfolio/${id}.png`;
}

function CardBg({
  id,
  alt,
  color,
}: {
  id: string;
  alt: string;
  color: string;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {!imgError ? (
        <Image
          src={getThumbnailPath(id)}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className={`h-full w-full bg-gradient-to-br ${cardGradients[color]}`}
        />
      )}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${colorOverlays[color]} to-transparent`}
      />
    </div>
  );
}

function ModalHeroBg({
  id,
  alt,
  color,
}: {
  id: string;
  alt: string;
  color: string;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {!imgError ? (
        <Image
          src={getThumbnailPath(id)}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 80vw"
          className="object-cover object-top"
          priority
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className={`h-full w-full bg-gradient-to-br ${cardGradients[color]}`}
        />
      )}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent`}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-r ${colorOverlays[color]} to-transparent opacity-60`}
      />
    </div>
  );
}

function CardShell({
  item,
  onSelect,
  className,
  children,
  cardRef,
}: {
  item: PortfolioItem;
  onSelect: (id: string) => void;
  className?: string;
  children: ReactNode;
  cardRef?: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={cardRef}
      onClick={() => onSelect(item.id)}
      className={`group cursor-pointer overflow-hidden rounded-3xl transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/30 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

interface PortfolioGalleryProps {
  portfolio: PortfolioItem[];
}

interface ModalRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function computeTargetRect(): ModalRect {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let ix: number, iy: number;
  if (vw >= 1024) {
    ix = Math.round(vw * 0.12);
    iy = 24;
  } else if (vw >= 768) {
    ix = iy = 40;
  } else if (vw >= 640) {
    ix = iy = 24;
  } else {
    ix = iy = 12;
  }
  return { top: iy, left: ix, width: vw - ix * 2, height: vh - iy * 2 };
}

export function PortfolioGallery({ portfolio }: PortfolioGalleryProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [originRect, setOriginRect] = useState<ModalRect | null>(null);
  const [targetRect, setTargetRect] = useState<ModalRect | null>(null);

  const selectedItem = portfolio.find((p) => p.id === selectedId);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

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

  const handleSelect = useCallback((id: string) => {
    const el = cardRefs.current.get(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      setOriginRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }
    setTargetRect(computeTargetRect());
    setSelectedId(id);
  }, []);

  const setCardRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) cardRefs.current.set(id, el);
      else cardRefs.current.delete(id);
    },
    [],
  );

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
        {/* ROW 1 : Featured */}
        {portfolio[0] && (
          <ScrollReveal>
            <CardShell
              item={portfolio[0]}
              onSelect={handleSelect}
              cardRef={setCardRef(portfolio[0].id)}
            >
              <div className="relative min-h-96 overflow-hidden md:min-h-[420px]">
                <CardBg
                  id={portfolio[0].id}
                  alt={portfolio[0].title}
                  color={portfolio[0].color}
                />
                <div className="relative z-10 flex min-h-96 flex-col justify-end p-8 md:min-h-[420px] md:p-12">
                  <span className="mb-3 text-xs font-bold uppercase tracking-widest text-white/70">
                    Featured — {portfolio[0].category}
                  </span>
                  <h3 className="font-playfair text-3xl font-bold text-white md:text-5xl">
                    {portfolio[0].title}
                  </h3>
                  <p className="mt-3 max-w-lg text-base leading-relaxed text-white/85">
                    {portfolio[0].subtitle}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {portfolio[0].techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-black/25 px-2.5 py-1 text-xs font-medium text-white/70 backdrop-blur-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardShell>
          </ScrollReveal>
        )}

        {/* ROW 2 : 5 : 7 Asymmetric */}
        {portfolio.length > 2 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            {portfolio[1] && (
              <ScrollReveal className="md:col-span-5">
                <CardShell
                  item={portfolio[1]}
                  onSelect={handleSelect}
                  cardRef={setCardRef(portfolio[1].id)}
                  className="h-full"
                >
                  <div className="relative h-full min-h-80 overflow-hidden md:min-h-[460px]">
                    <CardBg
                      id={portfolio[1].id}
                      alt={portfolio[1].title}
                      color={portfolio[1].color}
                    />
                    <div className="relative z-10 flex h-full min-h-80 flex-col justify-end p-7 md:min-h-[460px] md:p-8">
                      <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/70">
                        {portfolio[1].category}
                      </span>
                      <h3 className="font-playfair text-2xl font-bold text-white md:text-3xl">
                        {portfolio[1].title}
                      </h3>
                      <p className="mt-1.5 text-sm text-white/75">
                        {portfolio[1].subtitle}
                      </p>
                    </div>
                  </div>
                </CardShell>
              </ScrollReveal>
            )}

            {portfolio[2] && (
              <ScrollReveal delay={0.1} className="md:col-span-7">
                <CardShell
                  item={portfolio[2]}
                  onSelect={handleSelect}
                  cardRef={setCardRef(portfolio[2].id)}
                  className="h-full"
                >
                  <div className="relative h-full min-h-80 overflow-hidden md:min-h-[460px]">
                    <CardBg
                      id={portfolio[2].id}
                      alt={portfolio[2].title}
                      color={portfolio[2].color}
                    />
                    <div className="relative z-10 flex h-full min-h-80 flex-col justify-end p-7 md:min-h-[460px] md:p-10">
                      <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/70">
                        {portfolio[2].category}
                      </span>
                      <h3 className="font-playfair text-2xl font-bold text-white md:text-3xl">
                        {portfolio[2].title}
                      </h3>
                      <p className="mt-1.5 max-w-xs text-sm text-white/75">
                        {portfolio[2].subtitle}
                      </p>
                    </div>
                  </div>
                </CardShell>
              </ScrollReveal>
            )}
          </div>
        )}

        {/* ROW 3 : 7 : 5 Reversed */}
        {portfolio.length > 4 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            {portfolio[3] && (
              <ScrollReveal className="md:col-span-7">
                <CardShell
                  item={portfolio[3]}
                  onSelect={handleSelect}
                  cardRef={setCardRef(portfolio[3].id)}
                  className="h-full"
                >
                  <div className="relative h-full min-h-80 overflow-hidden md:min-h-[460px]">
                    <CardBg
                      id={portfolio[3].id}
                      alt={portfolio[3].title}
                      color={portfolio[3].color}
                    />
                    <div className="relative z-10 flex h-full min-h-80 flex-col justify-end p-7 md:min-h-[460px] md:p-10">
                      <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/70">
                        {portfolio[3].category}
                      </span>
                      <h3 className="font-playfair text-2xl font-bold text-white md:text-3xl">
                        {portfolio[3].title}
                      </h3>
                      <p className="mt-1.5 max-w-xs text-sm text-white/75">
                        {portfolio[3].subtitle}
                      </p>
                    </div>
                  </div>
                </CardShell>
              </ScrollReveal>
            )}

            {portfolio[4] && (
              <ScrollReveal delay={0.1} className="md:col-span-5">
                <CardShell
                  item={portfolio[4]}
                  onSelect={handleSelect}
                  cardRef={setCardRef(portfolio[4].id)}
                  className="h-full"
                >
                  <div className="relative h-full min-h-80 overflow-hidden md:min-h-[460px]">
                    <CardBg
                      id={portfolio[4].id}
                      alt={portfolio[4].title}
                      color={portfolio[4].color}
                    />
                    <div className="relative z-10 flex h-full min-h-80 flex-col justify-end p-7 md:min-h-[460px] md:p-8">
                      <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/70">
                        {portfolio[4].category}
                      </span>
                      <h3 className="font-playfair text-2xl font-bold text-white md:text-3xl">
                        {portfolio[4].title}
                      </h3>
                      <p className="mt-1.5 text-sm text-white/75">
                        {portfolio[4].subtitle}
                      </p>
                    </div>
                  </div>
                </CardShell>
              </ScrollReveal>
            )}
          </div>
        )}

        {/* ROW 4 : Banner */}
        {portfolio[5] && (
          <ScrollReveal>
            <CardShell
              item={portfolio[5]}
              onSelect={handleSelect}
              cardRef={setCardRef(portfolio[5].id)}
            >
              <div className="relative min-h-64 overflow-hidden md:min-h-72">
                <CardBg
                  id={portfolio[5].id}
                  alt={portfolio[5].title}
                  color={portfolio[5].color}
                />
                <div className="relative z-10 flex min-h-64 flex-col justify-end p-8 md:min-h-72 md:p-12">
                  <span className="mb-3 text-xs font-bold uppercase tracking-widest text-white/70">
                    {portfolio[5].category}
                  </span>
                  <h3 className="font-playfair text-3xl font-bold text-white md:text-4xl">
                    {portfolio[5].title}
                  </h3>
                  <p className="mt-2 max-w-md text-base text-white/80">
                    {portfolio[5].subtitle}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {portfolio[5].techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-black/25 px-2.5 py-1 text-xs font-medium text-white/70 backdrop-blur-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardShell>
          </ScrollReveal>
        )}
      </div>

      {/* ROW 5+ : Compact grid for remaining items */}
      {portfolio.length > 6 && (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {portfolio.slice(6).map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 0.06}>
              <CardShell
                item={item}
                onSelect={handleSelect}
                cardRef={setCardRef(item.id)}
              >
                <div className="relative min-h-64 overflow-hidden">
                  <CardBg
                    id={item.id}
                    alt={item.title}
                    color={item.color}
                  />
                  <div className="relative z-10 flex min-h-64 flex-col justify-end p-5">
                    <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/70">
                      {item.category}
                    </span>
                    <h3 className="font-playfair text-xl font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-white/75">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              </CardShell>
            </ScrollReveal>
          ))}
        </div>
      )}

      {/* Expanded Modal Overlay */}
      <AnimatePresence>
        {selectedItem && originRect && targetRect && (
          <>
            <motion.div
              key="portfolio-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            />

            <motion.div
              key="portfolio-modal"
              initial={{
                top: originRect.top,
                left: originRect.left,
                width: originRect.width,
                height: originRect.height,
                borderRadius: 24,
              }}
              animate={{
                top: targetRect.top,
                left: targetRect.left,
                width: targetRect.width,
                height: targetRect.height,
                borderRadius: 24,
                transition: openSpring,
              }}
              exit={{
                top: originRect.top,
                left: originRect.left,
                width: originRect.width,
                height: originRect.height,
                borderRadius: 24,
                opacity: 0,
                transition: closeSpring,
              }}
              style={{ position: "fixed", zIndex: 50 }}
              className="flex flex-col overflow-hidden border border-card-border bg-card"
            >
              <div className="relative shrink-0">
                <ModalHeroBg
                  id={selectedItem.id}
                  alt={selectedItem.title}
                  color={selectedItem.color}
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(null);
                  }}
                  className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-black/60"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="relative z-10 flex min-h-72 flex-col justify-end px-8 pb-8 pt-20 md:min-h-80 md:px-12 md:pb-10">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-white/70">
                      {selectedItem.category}
                    </span>
                    <h2 className="font-playfair text-3xl font-bold text-white md:text-4xl">
                      {selectedItem.title}
                    </h2>
                    <p className="mt-2 max-w-lg text-base text-white/80">
                      {selectedItem.subtitle}
                    </p>
                  </motion.div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.3 }}
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
