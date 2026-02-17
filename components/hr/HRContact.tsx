"use client";

import { Download, Mail, Phone, Github, BookOpen } from "lucide-react";

import { ScrollReveal } from "@/components/common/ScrollReveal";

interface HRContactProps {
  resumePdf: string;
  email: string;
  phone: string;
  github: string;
  blog: string;
}

export function HRContact({ resumePdf, email, phone, github, blog }: HRContactProps) {
  const socialLinks = [
    ...(github ? [{ icon: Github, label: "GitHub", href: github }] : []),
    ...(blog ? [{ icon: BookOpen, label: "Blog", href: blog }] : []),
  ];

  return (
    <section aria-label="연락처" className="relative overflow-hidden px-6 py-24">
      <div className="pointer-events-none absolute inset-0 bg-glow-amber opacity-40" />

      <ScrollReveal>
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber/60">
            Contact
          </span>
          <h2 className="mt-4 font-playfair text-3xl font-bold text-white md:text-4xl">
            함께 일할 팀을 찾고 있습니다
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-gray-500">
            새로운 도전을 함께할 기회를 기다리고 있습니다.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={resumePdf}
              className="flex items-center gap-2 rounded-full bg-amber px-7 py-3 text-sm font-semibold text-dark transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(255,188,66,0.3)]"
            >
              <Download size={15} aria-hidden="true" />
              이력서 PDF
            </a>
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 rounded-full border border-amber/20 px-7 py-3 text-sm font-medium text-amber transition-colors duration-300 hover:border-amber/40 hover:bg-amber/5"
              >
                <Mail size={15} aria-hidden="true" />
                이메일
              </a>
            )}
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2 rounded-full border border-amber/20 px-7 py-3 text-sm font-medium text-amber transition-colors duration-300 hover:border-amber/40 hover:bg-amber/5"
              >
                <Phone size={15} aria-hidden="true" />
                전화
              </a>
            )}
          </div>

          {/* Social links */}
          {socialLinks.length > 0 && (
            <div className="mt-6 flex justify-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-gray-500 transition-colors hover:text-amber"
                >
                  <link.icon size={14} />
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </ScrollReveal>
    </section>
  );
}
