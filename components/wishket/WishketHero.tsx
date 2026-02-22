import { ScrollReveal } from "@/components/common/ScrollReveal";

const stats = [
  { value: "11건", label: "프로젝트 완료" },
  { value: "2~3주", label: "평균 작업 기간" },
  { value: "1인", label: "기획~배포 완결" },
];

export function WishketHero() {
  return (
    <section className="mx-auto max-w-4xl px-6 pb-28 pt-36 text-center">
      <ScrollReveal>
        <p className="mb-6 font-mono text-sm uppercase tracking-widest text-chem">
          Web Development Partner
        </p>
        <h1 className="font-playfair text-5xl font-bold leading-tight text-foreground md:text-6xl">
          기획부터 배포까지,
          <br />
          혼자 다 합니다.
        </h1>
        <p className="mx-auto mt-8 max-w-lg text-lg leading-relaxed text-muted">
          현장 7년 + 개발 4년. 소통부터 운영까지 한 사람이 책임집니다.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="mt-14 grid grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-card p-6 shadow-sm"
            >
              <p className="text-3xl font-bold text-chem">{stat.value}</p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <a
          href="#contact"
          className="mt-12 inline-block rounded-full bg-chem px-12 py-4 text-lg font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-110"
        >
          견적 문의하기
        </a>
      </ScrollReveal>
    </section>
  );
}
