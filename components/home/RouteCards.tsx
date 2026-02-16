"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const cards = [
  {
    href: "/dev",
    icon: "🖥️",
    title: "FOR DEVELOPERS",
    subtitle: "기술 중심 포트폴리오",
    description: "아키텍처, 코드, 기술 의사결정",
    subtitleClass: "text-code",
    borderHover: "hover:border-code",
    shadow: "hover:shadow-[0_0_30px_rgba(108,92,231,0.3)]",
  },
  {
    href: "/hr",
    icon: "💼",
    title: "FOR HR / RECRUITERS",
    subtitle: "성장 스토리 포트폴리오",
    description: "커리어 전환, 임팩트, 핵심 역량",
    subtitleClass: "text-amber",
    borderHover: "hover:border-amber",
    shadow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]",
  },
  {
    href: "/hire",
    icon: "🌐",
    title: "HIRE ME",
    subtitle: "웹사이트 제작 의뢰",
    description: "홈페이지, 쇼핑몰, 랜딩페이지",
    subtitleClass: "text-chem",
    borderHover: "hover:border-chem",
    shadow: "hover:shadow-[0_0_30px_rgba(0,229,160,0.3)]",
  },
];

interface RouteCardsProps {
  tagline: string;
  name: string;
}

export function RouteCards({ tagline, name }: RouteCardsProps) {
  return (
    <section className="w-full h-full flex flex-col items-center justify-center px-6 py-20">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="bg-gradient-to-r from-chem via-code to-ai bg-clip-text text-center font-playfair font-bold text-transparent"
        style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
        {tagline}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="mt-4 text-lg font-light text-gray-400">
        풀스택 개발자 {name} 포트폴리오
      </motion.p>

      <div className="mt-16 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map((card, i) => (
          <motion.div
            key={card.href}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: i * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{ scale: 1.03, y: -4 }}>
            <Link
              href={card.href}
              className={`block rounded-2xl border border-card-border bg-card p-8 transition-all duration-300 ${card.borderHover} ${card.shadow}`}>
              <span className="text-4xl" aria-hidden="true">{card.icon}</span>
              <h2 className="mt-4 text-lg font-bold tracking-wide text-white">
                {card.title}
              </h2>
              <p className={`mt-1 text-sm ${card.subtitleClass}`}>
                {card.subtitle}
              </p>
              <p className="mt-3 text-sm text-gray-400">{card.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
