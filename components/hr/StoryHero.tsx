"use client";

import { Fragment } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Download,
  Mail,
  Phone,
  Github,
  BookOpen,
  ChevronDown,
  FlaskConical,
  Code2,
  Bot,
} from "lucide-react";

interface StoryHeroProps {
  name: string;
  email: string;
  phone: string;
  github: string;
  blog: string;
  resumePdf: string;
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const careerPhases = [
  {
    icon: FlaskConical,
    label: "화학공학",
    period: "7년",
    color: "text-chem",
    border: "border-chem/20",
    bg: "bg-chem/5",
  },
  {
    icon: Code2,
    label: "풀스택 개발",
    period: "~4년",
    color: "text-code",
    border: "border-code/20",
    bg: "bg-code/5",
  },
  {
    icon: Bot,
    label: "AI Agent",
    period: "현재",
    color: "text-ai",
    border: "border-ai/20",
    bg: "bg-ai/5",
  },
];

const summaryPoints = [
  "Next.js · React 풀스택 웹 서비스 개발",
  "Nest.js · Java Spring 백엔드 API 구현",
  "LangChain/LangGraph AI Agent 시스템 구축",
  "Docker · CI/CD DevOps 환경 구축·운영",
  "20+ 웹 서비스 기획·개발·배포·운영",
];

const metrics = [
  { value: "11년+", label: "총 경력", detail: "화학공학 7년 + 개발 4년" },
  { value: "20+", label: "서비스", detail: "SaaS · 기업사이트 · 플랫폼" },
  { value: "Full-Stack", label: "포지션", detail: "프론트 · 백엔드 · AI" },
];

export function StoryHero({
  name,
  email,
  phone,
  github,
  blog,
  resumePdf,
}: StoryHeroProps) {
  const contactLinks = [
    { icon: Phone, label: phone, href: `tel:${phone}` },
    { icon: Mail, label: email, href: `mailto:${email}` },
    ...(github ? [{ icon: Github, label: "GitHub", href: github }] : []),
    ...(blog ? [{ icon: BookOpen, label: "Blog", href: blog }] : []),
  ];

  return (
    <section
      aria-label="프로필 요약"
      className="relative overflow-hidden px-6 py-28 md:py-36">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-glow-amber" />

      {/* Subtle dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,188,66,0.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-4xl">
        {/* Badge */}
        <motion.div
          {...fadeUp(0)}
          className="text-center">
          <span className="inline-block border-b border-amber/30 pb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-amber/70">
            Career Brief
          </span>
        </motion.div>

        {/* Profile photo */}
        <motion.div
          {...fadeUp(0.06)}
          className="mt-10 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-amber/10 blur-2xl" />
            <div className="relative rounded-full bg-gradient-to-br from-amber/60 via-amber/20 to-amber/60 p-[2px]">
              <div className="overflow-hidden rounded-full bg-dark p-[3px]">
                <Image
                  src="/images/profile.jpg"
                  alt={`${name} 프로필 사진`}
                  width={140}
                  height={140}
                  className="rounded-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1
          {...fadeUp(0.14)}
          className="mt-7 text-center font-playfair text-[clamp(2.75rem,6vw,5rem)] font-bold leading-tight tracking-tight text-white">
          {name}
        </motion.h1>

        {/* Title */}
        <motion.div
          {...fadeUp(0.22)}
          className="mt-3 text-center">
          <p className="text-lg font-medium text-amber">
            풀스택 개발자 · AI Engineer
          </p>
        </motion.div>

        {/* Contact badges */}
        <motion.div
          {...fadeUp(0.28)}
          className="mt-6 flex flex-wrap justify-center gap-2">
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              className="flex items-center gap-1.5 rounded-full border border-card-border bg-card/60 px-3 py-1.5 text-xs text-gray-400 backdrop-blur-sm transition-colors duration-300 hover:border-amber/30 hover:text-amber">
              <link.icon
                size={12}
                aria-hidden="true"
              />
              {link.label}
            </a>
          ))}
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.36,
            ease: [0.16, 1, 0.3, 1] as const,
          }}
          className="mx-auto mt-10 h-px w-20 origin-center bg-gradient-to-r from-transparent via-amber/40 to-transparent"
        />

        {/* Career Phase Flow */}
        <motion.div
          {...fadeUp(0.4)}
          className="mx-auto mt-10 flex max-w-md items-center justify-center">
          {careerPhases.map((phase, i) => (
            <Fragment key={phase.label}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full border ${phase.border} ${phase.bg}`}>
                  <phase.icon
                    size={18}
                    className={phase.color}
                  />
                </div>
                <div className="text-center">
                  <div className={`text-[11px] font-semibold ${phase.color}`}>
                    {phase.label}
                  </div>
                  <div className="text-[10px] text-gray-600">
                    {phase.period}
                  </div>
                </div>
              </div>
              {i < careerPhases.length - 1 && (
                <div className="mx-4 mb-6 h-px w-10 bg-gradient-to-r from-card-border via-card-border/60 to-card-border/30" />
              )}
            </Fragment>
          ))}
        </motion.div>

        {/* Intro paragraph */}
        <motion.div
          {...fadeUp(0.48)}
          className="mx-auto mt-10 max-w-2xl">
          <div className="relative rounded-2xl border border-card-border/60 bg-card/30 p-6 backdrop-blur-sm md:p-8">
            <div className="absolute -top-3.5 left-6 px-3">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber/50">
                About
              </span>
            </div>
            <p className="text-sm leading-[1.8] text-gray-300">
              화학공학과를 졸업하고 KCC에서 7년간 현장의 문제를 직접
              마주했습니다. &ldquo;이걸 시스템으로 만들 수 있다면?&rdquo; — 그
              질문이 모든 것의 시작이었습니다. 현장에서 반복되는 비효율을 보며
              &lsquo;기술로 해결할 수 있다&rsquo;는 확신이 생겼고, 풀스택
              개발자로 전환하여 다수의 서비스를 기획부터 배포, 운영까지
              경험했습니다.
            </p>
            <p className="mt-3 text-sm leading-[1.8] text-gray-400">
              현재는 LangChain/LangGraph를 활용한 AI Agent 시스템을 구축하며
              자동화를 넘어 지능화된 시스템을 만드는 개발자로 성장하고 있습니다.
            </p>
          </div>
        </motion.div>

        {/* Summary points */}
        <motion.div
          {...fadeUp(0.54)}
          className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-2">
          {summaryPoints.map((point) => (
            <span
              key={point}
              className="rounded-full border border-card-border bg-card/40 px-3.5 py-1.5 text-[11px] text-gray-400">
              {point}
            </span>
          ))}
        </motion.div>

        {/* Metrics strip */}
        <motion.div
          {...fadeUp(0.6)}
          className="mx-auto mt-10 grid max-w-xl grid-cols-3 gap-3">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-card-border bg-card/50 px-3 py-5 text-center backdrop-blur-sm transition-colors duration-300 hover:border-amber/20 md:px-5 md:py-6">
              <div className="font-outfit text-2xl font-bold text-white md:text-3xl">
                {m.value}
              </div>
              <div className="mt-1 text-[11px] font-semibold text-amber md:text-xs">
                {m.label}
              </div>
              <div className="mt-0.5 hidden text-[10px] text-gray-600 md:block">
                {m.detail}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          {...fadeUp(0.68)}
          className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href={resumePdf}
            className="flex items-center gap-2 rounded-full bg-amber px-7 py-3 text-sm font-semibold text-dark transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(255,188,66,0.3)]">
            <Download
              size={15}
              aria-hidden="true"
            />
            이력서 다운로드
          </a>
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 rounded-full border border-amber/20 px-7 py-3 text-sm font-medium text-amber transition-colors duration-300 hover:border-amber/40 hover:bg-amber/5">
            <Mail
              size={15}
              aria-hidden="true"
            />
            이메일 보내기
          </a>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.5, duration: 1.2 }}
          className="mt-20 flex justify-center">
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: "easeInOut",
            }}>
            <ChevronDown
              size={18}
              className="text-gray-600"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
