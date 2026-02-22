import { MessageCircle, Phone, Mail } from "lucide-react";

import { type Profile } from "@/lib/types";
import { ScrollReveal } from "@/components/common/ScrollReveal";

interface WishketCTAProps {
  profile: Profile;
}

export function WishketCTA({ profile }: WishketCTAProps) {
  return (
    <section id="contact" className="mx-auto max-w-4xl px-6 py-28">
      <ScrollReveal>
        <h2 className="mb-14 text-center font-playfair text-3xl font-bold text-foreground md:text-4xl">
          프로젝트를 시작해볼까요?
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ScrollReveal>
          <a
            href={profile.kakao || "#"}
            className="flex flex-col items-center gap-2 rounded-xl border border-card-border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <MessageCircle className="h-7 w-7 text-chem" />
            <span className="font-semibold text-foreground">카카오톡</span>
            <span className="text-sm text-muted">가장 빠른 상담</span>
          </a>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <a
            href={`tel:${profile.phone}`}
            className="flex flex-col items-center gap-2 rounded-xl border border-card-border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <Phone className="h-7 w-7 text-chem" />
            <span className="font-semibold text-foreground">전화</span>
            <span className="text-sm text-muted">{profile.phone}</span>
          </a>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <a
            href={`mailto:${profile.email}`}
            className="flex flex-col items-center gap-2 rounded-xl border border-card-border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <Mail className="h-7 w-7 text-chem" />
            <span className="font-semibold text-foreground">이메일</span>
            <span className="text-sm text-muted">{profile.email}</span>
          </a>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={0.3}>
        <div className="mt-10 text-center">
          <a
            href={`mailto:${profile.email}`}
            className="inline-block rounded-full bg-chem px-12 py-4 text-lg font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-110"
          >
            무료 상담받기
          </a>
        </div>
      </ScrollReveal>
    </section>
  );
}
