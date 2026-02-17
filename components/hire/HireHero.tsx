"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ChevronDown } from "lucide-react";

import { ScrollReveal } from "@/components/common/ScrollReveal";

const mockupData = [
  // ━━ Top row ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "niepce",
    className: "left-[1%] top-[6%] w-48 lg:w-56 xl:w-64",
    rotate: -8,
    depth: 0.7,
    delay: 0.3,
    floatDuration: 6,
    floatRange: 14,
  },
  {
    id: "ymjlab",
    className: "left-[22%] top-[2%] w-40 lg:w-48 xl:w-52",
    rotate: -3,
    depth: 0.4,
    delay: 0.7,
    floatDuration: 7.5,
    floatRange: 10,
  },
  {
    id: "modelic",
    className: "right-[20%] top-[3%] w-40 lg:w-48 xl:w-52",
    rotate: 4,
    depth: 0.45,
    delay: 0.8,
    floatDuration: 6.8,
    floatRange: 12,
  },
  {
    id: "ktl",
    className: "right-[1%] top-[5%] w-48 lg:w-56 xl:w-64",
    rotate: 7,
    depth: 0.6,
    delay: 0.5,
    floatDuration: 7,
    floatRange: 16,
  },
  // ━━ Bottom row ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "lawfirmhk",
    className: "left-[2%] bottom-[8%] w-44 lg:w-52 xl:w-56",
    rotate: 6,
    depth: 0.6,
    delay: 0.6,
    floatDuration: 6.5,
    floatRange: 10,
  },
  {
    id: "tforus",
    className: "left-[24%] bottom-[4%] w-36 lg:w-44 xl:w-48",
    rotate: 2,
    depth: 0.35,
    delay: 0.9,
    floatDuration: 7.2,
    floatRange: 8,
  },
  {
    id: "ebizcloud",
    className: "right-[22%] bottom-[5%] w-36 lg:w-44 xl:w-48",
    rotate: -3,
    depth: 0.5,
    delay: 1.0,
    floatDuration: 6.2,
    floatRange: 11,
  },
  {
    id: "shinzigames",
    className: "right-[2%] bottom-[7%] w-44 lg:w-52 xl:w-60",
    rotate: -6,
    depth: 0.8,
    delay: 0.4,
    floatDuration: 5.5,
    floatRange: 12,
  },
  // ━━ Side accents (xl only) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "mokomokotour",
    className: "left-[-2%] top-[42%] hidden w-40 xl:block xl:w-48",
    rotate: -10,
    depth: 0.9,
    delay: 1.1,
    floatDuration: 5.8,
    floatRange: 13,
  },
  {
    id: "wowsystem",
    className: "right-[-2%] top-[40%] hidden w-40 xl:block xl:w-48",
    rotate: 9,
    depth: 0.85,
    delay: 0.9,
    floatDuration: 6.4,
    floatRange: 11,
  },
];

function BrowserFrame({ id }: { id: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 shadow-2xl shadow-black/50">
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/5 px-2.5 py-1.5">
        <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
        <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
        <div className="h-1.5 w-1.5 rounded-full bg-white/15" />
        <div className="ml-1.5 h-2.5 flex-1 rounded-full bg-white/5" />
      </div>
      <Image
        src={`/images/portfolio/${id}.png`}
        alt={id}
        width={400}
        height={250}
        className="w-full object-cover object-top"
      />
    </div>
  );
}

function FloatingMockup({
  id,
  className,
  rotate,
  depth,
  delay,
  floatDuration,
  floatRange,
  springX,
  springY,
}: {
  id: string;
  className: string;
  rotate: number;
  depth: number;
  delay: number;
  floatDuration: number;
  floatRange: number;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
}) {
  const parallaxX = useTransform(springX, [-0.5, 0.5], [-30 * depth, 30 * depth]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [8 * depth, -8 * depth]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8 * depth, 8 * depth]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, rotate: rotate * 1.5 }}
      animate={{ opacity: 0.6, scale: 1, rotate }}
      transition={{ delay, duration: 1, ease: "easeOut" }}
      className={`absolute ${className}`}
      style={{
        x: parallaxX,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        animate={{ y: [-floatRange / 2, floatRange / 2] }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        <BrowserFrame id={id} />
      </motion.div>
    </motion.div>
  );
}

export function HireHero() {
  const containerRef = useRef<HTMLElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center overflow-hidden px-6"
      style={{ perspective: "1200px" }}
    >
      {/* ━━ Morphing gradient blobs ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute h-[500px] w-[500px] rounded-full bg-chem/10 blur-[120px]"
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.2, 0.85, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ left: "10%", top: "10%" }}
        />
        <motion.div
          className="absolute h-[400px] w-[400px] rounded-full bg-code/8 blur-[100px]"
          animate={{
            x: [0, -70, 50, 0],
            y: [0, 50, -60, 0],
            scale: [1, 0.9, 1.15, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          style={{ right: "5%", top: "20%" }}
        />
        <motion.div
          className="absolute h-[350px] w-[350px] rounded-full bg-ai/6 blur-[80px]"
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 50, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{ left: "35%", bottom: "5%" }}
        />
      </div>

      {/* ━━ 3D Floating browser mockups (md+) ━━━━━━━━━━━━━━━━━ */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        {mockupData.map((m) => (
          <FloatingMockup
            key={m.id}
            {...m}
            springX={springX}
            springY={springY}
          />
        ))}
      </div>

      {/* ━━ Edge vignette only ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,var(--color-dark)_90%)]" />

      {/* ━━ Content ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="relative z-10 mx-auto max-w-5xl rounded-3xl bg-dark/40 px-8 py-14 text-center backdrop-blur-md md:px-16 md:py-20">
        <ScrollReveal>
          <p className="mb-6 font-mono text-sm uppercase tracking-widest text-chem">
            Web Development Studio
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h1
            className="font-playfair font-bold leading-[1.1] text-white drop-shadow-[0_2px_30px_rgba(0,0,0,0.5)]"
            style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)" }}
          >
            웹사이트,
            <br />
            제대로 만들어드립니다.
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-lg text-lg font-light leading-relaxed text-gray-400">
            기획부터 디자인, 개발, 배포까지
            <br className="hidden sm:block" />
            원스톱으로 해결해드립니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <a
              href="#contact"
              className="rounded-full bg-chem px-10 py-3.5 font-medium text-white transition-opacity hover:opacity-90"
            >
              무료 상담받기
            </a>
            <a
              href="#portfolio"
              className="rounded-full border border-white/20 px-10 py-3.5 font-medium text-white/80 transition-colors hover:border-white/40 hover:text-white"
            >
              작업물 보기
            </a>
          </div>
        </ScrollReveal>
      </div>

      {/* ━━ Scroll indicator ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.a
        href="#portfolio"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-10 z-10 flex flex-col items-center gap-2 text-white/30 transition-colors hover:text-white/60"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.a>
    </section>
  );
}
