"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Skull } from "lucide-react";

import { usePasswordHell } from "@/hooks/usePasswordHell";

const EASE = [0.16, 1, 0.3, 1] as const;

export function PasswordHell() {
  const {
    password,
    setPassword,
    ruleResults,
    visibleCount,
    allPassed,
    passedCount,
    totalCount,
    charLength,
    digitSum,
    isPrimeLength,
  } = usePasswordHell();

  return (
    <section className="mx-auto max-w-6xl px-6 pb-28">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <span className="inline-block border-b border-mad/30 pb-1 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-mad/70">
            Experiment #001
          </span>
          <h2 className="mt-4 font-playfair text-2xl font-bold text-white md:text-3xl">
            비밀번호 지옥
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            15개의 규칙을 모두 통과하는 비밀번호를 만들어보세요
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative mt-10 overflow-hidden rounded-2xl border border-card-border bg-card p-6 md:p-8"
      >
        <div className="mx-auto max-w-lg">
          <label
            htmlFor="pw-hell"
            className="mb-2 block font-mono text-xs text-gray-500"
          >
            비밀번호를 입력하세요
          </label>
          <input
            id="pw-hell"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="행운을 빕니다..."
            autoComplete="off"
            className="w-full rounded-lg border border-card-border bg-dark px-4 py-3 font-mono text-sm text-white placeholder:text-gray-600 focus:border-mad/50 focus:outline-none"
          />

          <div className="mt-2 flex justify-between font-mono text-[10px] text-gray-600">
            <span>
              길이: {charLength}자
              {password.length > 0 &&
                ` (${isPrimeLength ? "소수" : "소수 아님"})`}
            </span>
            <span>숫자 합: {digitSum}</span>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-lg space-y-2">
          <AnimatePresence mode="popLayout">
            {ruleResults.slice(0, visibleCount).map((rule) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                transition={{ duration: 0.4, ease: EASE }}
                className={`flex items-start gap-3 rounded-lg border px-4 py-3 transition-colors duration-300 ${
                  rule.passed
                    ? "border-mad/20 bg-mad/5"
                    : "border-card-border bg-dark/50"
                }`}
              >
                <span className="mt-0.5 flex-shrink-0">
                  {rule.passed ? (
                    <Check size={14} className="text-mad" />
                  ) : (
                    <X size={14} className="text-gray-600" />
                  )}
                </span>
                <span
                  className={`text-sm ${
                    rule.passed ? "text-mad/80" : "text-gray-400"
                  }`}
                >
                  <span className="mr-2 font-mono text-[10px] text-gray-600">
                    #{String(rule.id).padStart(2, "0")}
                  </span>
                  {rule.text}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mx-auto mt-6 max-w-lg">
          <div className="flex items-center justify-between font-mono text-[10px]">
            <span className="text-gray-600">진행률</span>
            <span className="text-mad/70">
              {passedCount} / {totalCount}
            </span>
          </div>
          <div className="mt-1 h-1 overflow-hidden rounded-full bg-dark">
            <motion.div
              className="h-full rounded-full bg-mad"
              animate={{
                width: `${(passedCount / totalCount) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: EASE }}
            />
          </div>
        </div>

        <AnimatePresence>
          {allPassed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mx-auto mt-8 max-w-lg rounded-xl border border-chem/30 bg-chem/5 p-6 text-center"
            >
              <Skull size={32} className="mx-auto text-chem" />
              <h3 className="mt-3 font-playfair text-lg font-bold text-chem">
                축하합니다!
              </h3>
              <p className="mt-2 text-sm text-gray-300">
                비밀번호를 성공적으로 만들었습니다.
              </p>
              <p className="mt-1 text-sm text-gray-300">
                그런데 이 비밀번호는 이미{" "}
                <span className="font-bold text-chem">유출</span>되었습니다.
              </p>
              <p className="mt-3 font-mono text-xs text-gray-600">
                (방금 화면에 그대로 노출했잖아요)
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
