"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RotateCcw } from "lucide-react";

const ZODIACS = [
  { name: "쥐", emoji: "🐭" },
  { name: "소", emoji: "🐮" },
  { name: "호랑이", emoji: "🐯" },
  { name: "토끼", emoji: "🐰" },
  { name: "용", emoji: "🐲" },
  { name: "뱀", emoji: "🐍" },
  { name: "말", emoji: "🐴" },
  { name: "양", emoji: "🐑" },
  { name: "원숭이", emoji: "🐵" },
  { name: "닭", emoji: "🐔" },
  { name: "개", emoji: "🐶" },
  { name: "돼지", emoji: "🐷" },
] as const;

const FORTUNES: Record<string, string[]> = {
  금전운: [
    "점심값이 평소보다 200원 비쌀 수 있습니다",
    "길에서 500원을 주울 운세이나, 허리 디스크 조심",
    "택배 도착 예정. 하지만 그건 지난달에 시킨 양말입니다",
    "오늘 커피를 안 마시면 3,500원을 절약할 수 있습니다. 하지만 마실 겁니다",
    "누군가 밥을 사주려 할 것입니다. 거절하지 마세요. 다음은 없습니다",
    "카드값 문자가 올 수 있습니다. 안 보는 게 정신건강에 좋습니다",
    "중고거래에서 네고를 시도하면 오히려 가격이 올라갈 운세",
    "ATM 앞에서 잔액을 확인하면 기분이 나빠질 수 있습니다",
    "오늘 로또를 사면 꽝입니다. 내일도 꽝입니다",
    "편의점에서 1+1을 발견할 운세. 하지만 필요 없는 물건입니다",
    "이번 달 구독 서비스 해지하면 47,000원 절약 가능. 하지만 안 할 겁니다",
    "주식 차트를 보면 안 되는 날입니다. 보면 팝니다. 팔면 오릅니다",
  ],
  연애운: [
    "엘리베이터에서 눈이 마주치는 사람이 있으나, 그냥 이웃입니다",
    "고백할 용기가 생기는 날이지만, 상대는 이미 퇴근했습니다",
    "이상형을 만날 수 있으나, 화면 속 유튜버입니다",
    "썸 타는 느낌이 들겠으나, 그냥 에어컨 바람입니다",
    "좋아하는 사람이 연락을 할 수 있으나, 단체 카톡방입니다",
    "소개팅 제의가 올 수 있으나, 사진과 실물은 다를 수 있습니다",
    "카페에서 운명적 만남이 있으나, 바리스타가 주문을 물어보는 것입니다",
    "오늘 고백하면 성공 확률 0.3%. 안 하면 0%",
    "프로필 사진을 바꾸면 좋아요가 올 수 있으나, 엄마입니다",
    "짝사랑 상대가 내 SNS를 볼 수 있으나, 실수로 누른 것입니다",
    "로맨틱한 저녁 식사가 예정되어 있으나, 혼밥입니다",
    "연애 운이 상승하는 날이나, 집에서 나가야 적용됩니다",
  ],
  건강운: [
    "오늘 계단을 오르면 운동한 것으로 인정됩니다",
    "컵라면을 먹고 싶겠으나, 몸이 원하는 건 물입니다",
    "자세를 고쳐 앉으세요. 지금 거북목입니다",
    "오늘 만보 걷기에 도전하겠으나, 3천보에서 포기할 운세",
    "헬스장 등록을 고려할 수 있으나, 3일 후 유령회원이 됩니다",
    "충분한 수면이 필요한 날이나, 넷플릭스가 다음 화를 자동재생합니다",
    "건강검진 결과가 나올 수 있으나, 안 보는 게 건강에 좋습니다",
    "비타민을 먹으면 좋은 날이나, 어디 뒀는지 모를 운세",
    "스트레칭을 하면 몸이 좋아지겠으나, 소리가 날 것입니다",
    "오늘의 적정 수면시간은 9시간이나, 가능한 시간은 5시간입니다",
    "야식을 참으면 내일 아침이 상쾌할 것이나, 참을 수 없습니다",
    "눈 건강을 위해 화면을 쉬어야 하나, 이 운세를 끝까지 읽고 있습니다",
  ],
  직장운: [
    "상사가 말을 걸 수 있으나, 좋은 말은 아닙니다",
    "퇴근 시간이 평소보다 17분 늦어질 수 있습니다",
    "회의에서 좋은 아이디어가 떠오르나, 이미 누가 말했습니다",
    "이메일에 '감사합니다'를 쓰지만 감사하지 않는 날",
    "월요일 같은 하루가 될 것이나, 실제로 월요일일 수 있습니다",
    "재택근무를 하면 생산성이 올라가나, 침대가 가깝습니다",
    "오늘 야근이 없을 것 같으나, 5시 59분에 메일이 올 수 있습니다",
    "프레젠테이션에서 박수를 받을 운세이나, 예의상입니다",
    "동료가 커피를 사줄 수 있으나, 부탁이 따라옵니다",
    "투두리스트를 작성할 운세이나, 완료하는 것은 내일의 나입니다",
    "점심시간에 맛집을 발견할 수 있으나, 웨이팅 40분입니다",
    "칼퇴에 성공할 운세이나, 지하철이 만원입니다",
  ],
};

const LUCKY_ITEMS = [
  "파란색 양말", "민트초코", "왼쪽 에어팟", "어제의 남은 밥",
  "자판기 커피", "충전기", "안 쓰는 텀블러", "영수증",
  "카드 포인트", "편의점 삼각김밥", "노란 우산", "검정 볼펜",
  "마스크", "에코백", "무지 노트", "손톱깎이",
];

const LUCKY_NUMBERS = [3, 7, 12, 17, 23, 29, 31, 42, 56, 77, 88, 99];

function getZodiac(year: number) {
  const idx = ((year - 4) % 12 + 12) % 12;
  return ZODIACS[idx];
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function pickFortunes(year: number, rerollCount: number) {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate() +
    year * 7 +
    rerollCount * 31;
  const rng = seededRandom(seed);

  const pick = (arr: string[]) => arr[Math.floor(rng() * arr.length)];
  const pickNum = (arr: number[]) => arr[Math.floor(rng() * arr.length)];

  return {
    금전운: pick(FORTUNES["금전운"]),
    연애운: pick(FORTUNES["연애운"]),
    건강운: pick(FORTUNES["건강운"]),
    직장운: pick(FORTUNES["직장운"]),
    럭키아이템: pick(LUCKY_ITEMS),
    럭키넘버: pickNum(LUCKY_NUMBERS),
    신뢰도: Math.round((40 + rng() * 55) * 10) / 10,
  };
}

const EASE = [0.16, 1, 0.3, 1] as const;

const categoryMeta: Record<string, { label: string; color: string }> = {
  금전운: { label: "금전운", color: "text-amber" },
  연애운: { label: "연애운", color: "text-chem" },
  건강운: { label: "건강운", color: "text-mad" },
  직장운: { label: "직장운", color: "text-code" },
};

export function FortuneLab() {
  const [birthYear, setBirthYear] = useState("");
  const [phase, setPhase] = useState<"input" | "analyzing" | "result">("input");
  const [rerollCount, setRerollCount] = useState(0);

  const year = parseInt(birthYear, 10);
  const zodiac = !isNaN(year) ? getZodiac(year) : null;

  const fortunes = useMemo(() => {
    if (!zodiac || isNaN(year)) return null;
    return pickFortunes(year, rerollCount);
  }, [year, zodiac, rerollCount]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!zodiac) return;
      setPhase("analyzing");
      setTimeout(() => setPhase("result"), 2000);
    },
    [zodiac],
  );

  const handleReroll = useCallback(() => {
    setRerollCount((c) => c + 1);
    setPhase("analyzing");
    setTimeout(() => setPhase("result"), 1200);
  }, []);

  const handleReset = useCallback(() => {
    setBirthYear("");
    setPhase("input");
    setRerollCount(0);
  }, []);

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
            Experiment #005
          </span>
          <h2 className="mt-4 font-playfair text-2xl font-bold text-white md:text-3xl">
            MADMAX 운세 연구소
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            과학적 근거 없는 초정밀 띠별 운세 분석 시스템
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative mt-10 overflow-hidden rounded-2xl border border-card-border bg-card"
        style={{ minHeight: "24rem" }}
      >
        <AnimatePresence mode="wait">
          {/* 입력 */}
          {phase === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-96 flex-col items-center justify-center px-6 text-center"
            >
              <Sparkles size={32} className="text-mad/50" />
              <h3 className="mt-4 font-playfair text-lg font-bold text-white">
                태어난 해를 알려주세요
              </h3>
              <p className="mt-1 font-mono text-[10px] text-gray-600">
                ⚠ 분석 정확도: 자체 측정 98.2%
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-6 flex items-center gap-3"
              >
                <input
                  type="number"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  placeholder="1995"
                  min={1924}
                  max={2024}
                  required
                  className="w-28 rounded-lg border border-card-border bg-dark px-4 py-3 text-center font-mono text-sm text-white placeholder:text-gray-600 focus:border-mad/50 focus:outline-none"
                />
                <span className="font-mono text-sm text-gray-500">년생</span>
              </form>

              {/* 띠 미리보기 */}
              <AnimatePresence>
                {zodiac && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 flex items-center gap-2"
                  >
                    <span className="text-2xl">{zodiac.emoji}</span>
                    <span className="font-mono text-sm text-mad">
                      {zodiac.name}띠
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {zodiac && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  type="submit"
                  onClick={handleSubmit}
                  className="mt-6 rounded-full bg-mad px-8 py-3 font-semibold text-dark transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(57,255,20,0.3)]"
                >
                  운세 분석
                </motion.button>
              )}
            </motion.div>
          )}

          {/* 분석 중 */}
          {phase === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-96 flex-col items-center justify-center text-center"
            >
              {zodiac && (
                <motion.div
                  animate={{ rotate: [0, 10, -10, 5, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-5xl"
                >
                  {zodiac.emoji}
                </motion.div>
              )}
              <h3 className="mt-4 font-playfair text-lg font-bold text-white">
                운세 분석 중...
              </h3>
              <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="mt-2 font-mono text-xs text-mad/60"
              >
                사주팔자 계산 · 천체 배열 확인 · AI 영감 수신 중
              </motion.p>
            </motion.div>
          )}

          {/* 결과 */}
          {phase === "result" && fortunes && zodiac && (
            <motion.div
              key={`result-${rerollCount}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-6 py-8 md:px-8"
            >
              {/* 헤더 */}
              <div className="text-center">
                <span className="text-4xl">{zodiac.emoji}</span>
                <h3 className="mt-2 font-playfair text-xl font-bold text-white">
                  {year}년생 {zodiac.name}띠 오늘의 운세
                </h3>
                <p className="mt-1 font-mono text-[10px] text-gray-600">
                  분석 신뢰도: {fortunes.신뢰도}% · 생성일:{" "}
                  {new Date().toLocaleDateString("ko-KR")}
                </p>
              </div>

              {/* 운세 카드들 */}
              <div className="mx-auto mt-6 grid max-w-2xl grid-cols-1 gap-3 md:grid-cols-2">
                {Object.entries(categoryMeta).map(
                  ([key, { label, color }], i) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.1, ease: EASE }}
                      className="rounded-xl border border-card-border bg-dark/50 p-4"
                    >
                      <span
                        className={`font-mono text-[10px] font-bold uppercase tracking-widest ${color}`}
                      >
                        {label}
                      </span>
                      <p className="mt-2 text-sm leading-relaxed text-gray-300">
                        {fortunes[key as keyof typeof fortunes]}
                      </p>
                    </motion.div>
                  ),
                )}
              </div>

              {/* 럭키 포인트 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mx-auto mt-4 flex max-w-2xl gap-3"
              >
                <div className="flex-1 rounded-xl border border-card-border bg-dark/50 p-4 text-center">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-mad/60">
                    럭키 아이템
                  </span>
                  <p className="mt-1 text-sm font-medium text-white">
                    {fortunes.럭키아이템}
                  </p>
                </div>
                <div className="flex-1 rounded-xl border border-card-border bg-dark/50 p-4 text-center">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-mad/60">
                    럭키 넘버
                  </span>
                  <p className="mt-1 text-sm font-medium text-white">
                    {fortunes.럭키넘버}
                  </p>
                </div>
              </motion.div>

              {/* 면책 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mx-auto mt-6 max-w-2xl rounded-lg border border-card-border bg-dark/30 p-3 text-center"
              >
                <p className="font-mono text-[10px] text-gray-600">
                  ⚠ 본 운세는 MADMAX 연구소에서 자체 개발한 알고리즘으로
                  생성되었으며, 과학적 근거는 전혀 없습니다. 진지하게 받아들인
                  경우 발생하는 모든 결과에 대해 책임지지 않습니다.
                </p>
              </motion.div>

              {/* 버튼들 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-6 flex justify-center gap-3"
              >
                <button
                  onClick={handleReroll}
                  className="flex items-center gap-2 rounded-lg border border-mad/30 px-5 py-2 font-mono text-xs text-mad transition-colors duration-200 hover:bg-mad/5"
                >
                  <RotateCcw size={12} />
                  다시 뽑기
                </button>
                <button
                  onClick={handleReset}
                  className="rounded-lg border border-card-border px-5 py-2 font-mono text-xs text-gray-500 transition-colors duration-200 hover:text-gray-300"
                >
                  처음으로
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
