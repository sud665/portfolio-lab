"use client";

import { Download, Mail, Phone } from "lucide-react";
import { ScrollReveal } from "@/components/common/ScrollReveal";

interface HRContactProps {
  resumePdf: string;
  email: string;
  phone: string;
}

export function HRContact({ resumePdf, email, phone }: HRContactProps) {
  return (
    <section aria-label="연락처" className="mx-auto max-w-4xl px-6 py-20">
      <ScrollReveal>
        <div className="text-center">
          <h2 className="font-playfair text-3xl font-bold text-white">
            새로운 도전을 함께할 팀을 찾고 있습니다
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={resumePdf}
              className="flex items-center gap-2 rounded-full bg-amber px-7 py-3 text-sm font-semibold text-dark transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(245,158,11,0.3)]"
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
        </div>
      </ScrollReveal>
    </section>
  );
}
