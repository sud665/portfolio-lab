"use client";

import { useState } from "react";
import { MessageCircle, Phone, Mail, Loader2, Check } from "lucide-react";
import { ScrollReveal } from "@/components/common/ScrollReveal";

interface ContactSectionProps {
  phone: string;
  email: string;
  kakao: string;
  services: { title: string }[];
}

export function ContactSection({
  phone,
  email,
  kakao,
  services,
}: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    service: "",
    description: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "발송 실패");
      }

      setStatus("success");
      setFormData({ name: "", contact: "", service: "", description: "" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "발송에 실패했습니다.");
      setTimeout(() => setStatus("idle"), 4000);
    }
  }

  return (
    <section
      id="contact"
      className="mx-auto max-w-5xl px-6 py-20">
      <ScrollReveal>
        <h2 className="mb-12 text-center font-playfair text-3xl font-bold text-white">
          프로젝트를 시작해볼까요?
        </h2>
      </ScrollReveal>

      {/* Contact cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ScrollReveal delay={0}>
          <a
            href={kakao || "#"}
            className="flex flex-col items-center gap-2 rounded-xl border border-card-border bg-card p-6 text-center transition-all duration-300 hover:border-chem/40">
            <MessageCircle
              size={28}
              className="text-chem"
            />
            <span className="font-semibold text-white">카카오톡</span>
            <span className="text-sm text-gray-400">가장 빠른 상담</span>
          </a>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <a
            href={`tel:${phone}`}
            className="flex flex-col items-center gap-2 rounded-xl border border-card-border bg-card p-6 text-center transition-all duration-300 hover:border-chem/40">
            <Phone
              size={28}
              className="text-chem"
            />
            <span className="font-semibold text-white">전화</span>
            <span className="text-sm text-gray-400">{phone}</span>
          </a>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <a
            href={`mailto:${email}`}
            className="flex flex-col items-center gap-2 rounded-xl border border-card-border bg-card p-6 text-center transition-all duration-300 hover:border-chem/40">
            <Mail
              size={28}
              className="text-chem"
            />
            <span className="font-semibold text-white">이메일</span>
            <span className="text-sm text-gray-400">{email}</span>
          </a>
        </ScrollReveal>
      </div>

      {/* Contact form */}
      <ScrollReveal delay={0.3}>
        <form
          onSubmit={handleSubmit}
          className="mt-12 rounded-2xl border border-card-border bg-card p-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-400">이름</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-lg border border-card-border bg-dark px-4 py-3 text-white outline-none focus:border-chem"
                placeholder="서외구"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">연락처</label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                className="w-full rounded-lg border border-card-border bg-dark px-4 py-3 text-white outline-none focus:border-chem"
                placeholder="010-0000-0000"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm text-gray-400">
              원하는 서비스
            </label>
            <select
              value={formData.service}
              onChange={(e) =>
                setFormData({ ...formData, service: e.target.value })
              }
              className="w-full rounded-lg border border-card-border bg-dark px-4 py-3 text-white outline-none focus:border-chem">
              <option value="">선택해주세요</option>
              {services.map((s) => (
                <option
                  key={s.title}
                  value={s.title}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm text-gray-400">
              간단 설명
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full resize-none rounded-lg border border-card-border bg-dark px-4 py-3 text-white outline-none focus:border-chem"
              placeholder="어떤 사이트를 만들고 싶으신가요?"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-chem py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60">
            {status === "loading" && <Loader2 size={18} className="animate-spin" />}
            {status === "success" && <Check size={18} />}
            {status === "loading"
              ? "보내는 중..."
              : status === "success"
                ? "문의가 접수되었습니다!"
                : "문의 보내기"}
          </button>
          {status === "error" && (
            <p className="mt-2 text-center text-sm text-red-400">{errorMsg}</p>
          )}
        </form>
      </ScrollReveal>
    </section>
  );
}
