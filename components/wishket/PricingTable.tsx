import {
  Building2,
  Smartphone,
  ShoppingCart,
  LayoutDashboard,
  Bot,
  Wrench,
  Server,
  GitBranch,
} from "lucide-react";

import { ScrollReveal } from "@/components/common/ScrollReveal";

const pricing = [
  { service: "회사소개 홈페이지", price: "200~400만원", duration: "2~3주", icon: Building2 },
  { service: "랜딩페이지", price: "100~250만원", duration: "1~2주", icon: Smartphone },
  { service: "쇼핑몰", price: "400~800만원", duration: "4~6주", icon: ShoppingCart },
  { service: "관리자 페이지", price: "300~600만원", duration: "3~5주", icon: LayoutDashboard },
  { service: "백엔드 API 개발", price: "300~700만원", duration: "3~6주", icon: Server },
  { service: "CI/CD 구축", price: "100~300만원", duration: "1~2주", icon: GitBranch },
  { service: "AI 챗봇 연동", price: "150~400만원", duration: "2~4주", icon: Bot },
  { service: "기존 사이트 수정", price: "50~200만원", duration: "1~2주", icon: Wrench },
];

export function PricingTable() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-28">
      <ScrollReveal>
        <h2 className="mb-3 text-center font-playfair text-3xl font-bold text-foreground md:text-4xl">
          견적 범위
        </h2>
        <p className="mb-14 text-center text-muted">
          프로젝트 규모와 요구사항에 따라 달라질 수 있습니다
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pricing.map((item, i) => (
          <ScrollReveal key={item.service} delay={i * 0.06}>
            <div className="rounded-2xl border border-card-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chem/8 text-chem">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{item.service}</h3>
              <p className="mt-2 text-2xl font-bold text-chem">{item.price}</p>
              <p className="mt-1 text-sm text-muted">예상 기간: {item.duration}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
