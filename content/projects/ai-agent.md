# AI Agent 업무관리 시스템 — StepNext (MUGU)

> LangGraph 기반 멀티 에이전트 워크플로우 + 실시간 음성 인터랙션 + 멀티 테넌시 SaaS 아키텍처

**Tech Stack**: LangGraph · LangChain · Next.js 16 · Nest.js 10 · TypeORM · PostgreSQL(pgvector) · Redis · BullMQ · Socket.IO · OpenAI Whisper · OpenAI TTS

---

## 핵심 구현 내용

### 1. LangGraph 멀티 에이전트 워크플로우

4-Step 순환 그래프 아키텍처를 설계·구현했다. 단순 Chain이 아닌, 조건부 엣지와 최대 5회 반복 루프를 가진 상태 기반 그래프로 복잡한 멀티턴 대화를 처리한다.

- **Router Step** — 사용자 의도를 29개 액션 중 하나로 분류. 빠른 모델(GPT-4o-mini)로 JSON 스키마 기반 구조화 출력. Zod 스키마 검증 적용
- **Executor Step** — ToolRegistry에서 해당 액션 핸들러를 실행. 메모·일정·업무 CRUD 29개 도구를 동적 디스패치
- **Analyzer Step** — 도구 실행 결과를 분석하여 다음 경로 결정. 실패 시 최대 3회 재시도, 읽기 전용 도구는 즉시 응답 단계로 라우팅
- **Responder Step** — 고품질 모델(GPT-4o)로 자연어 응답 생성. 장기 기억·대화 요약·도구 결과를 컨텍스트로 주입

**핵심 설계 포인트:**

- Router/Responder 모델 분리 전략 — 라우팅은 저비용·고속 모델, 응답 생성은 고품질 모델 사용으로 비용 대비 품질 최적화
- Hallucination Prevention Guardrail — Responder가 응답 생성 전 `toolResults[]` 배열을 검증하여, 실제 성공하지 않은 작업을 성공이라 말하지 못하도록 차단
- 2-Step 삭제 확인 — `pendingDeletion` 상태를 그래프에 유지하여 "어제 회의 삭제해줘" → vector_search로 엔티티 탐색 → 사용자 확인 → 실행의 안전한 흐름 보장

### 2. 실시간 음성 에이전트

WebSocket 기반 양방향 음성 파이프라인을 구현했다. 브라우저에서 마이크 입력을 받아 STT → LangGraph 에이전트 → TTS → 오디오 스트림까지 전 과정을 실시간 처리한다.

- **Voice State Machine** — `IDLE → LISTENING → PROCESSING → SPEAKING` 4단계 상태 머신으로 오디오 수신/차단을 정밀 제어
- **STT 듀얼 모드** — OpenAI Transcriptions API(배치) / Realtime API(WebSocket 스트리밍) 두 모드를 환경변수로 전환 가능
- **TTS 멀티 프로바이더** — OpenAI TTS, Google Cloud TTS, Cartesia TTS 3개 엔진 지원
- **무음 감지(VAD)** — 900ms 무음 시 자동 STT 버퍼 플러시로 자연스러운 턴테이킹 구현
- **이중 모드 지원** — 서버 STT/TTS 모드(Audio Mode)와 브라우저 Web Speech API 모드(Browser Mode) 동시 지원

### 3. 멀티 테넌시 SaaS 아키텍처

회사(`comId`) 단위의 테넌트 격리를 모든 레이어에 적용했다.

- **데이터 격리** — 모든 엔티티에 `comId` FK를 부여하고, 모든 쿼리에 `WHERE comId = ?` 필터를 강제 적용
- **인증 격리** — JWT 토큰에 `comId`를 포함하여 `AppsAuthGuard`에서 테넌트 컨텍스트를 자동 주입
- **타임존 격리** — 회사별 IANA 타임존 설정. DB는 UTC 저장, 애플리케이션 레벨에서 회사 타임존으로 변환
- **스케줄러 격리** — 리마인더/알림 크론잡이 회사별 로컬 시간 기준으로 동작 (예: 각 회사의 오전 9시에 데일리 다이제스트 발송)

### 4. 3계층 메모리 시스템

- **Session Memory** — 직전 액션 결과를 인메모리 캐시로 유지. 멀티턴 대화에서 "방금 만든 메모 수정해줘" 같은 참조 해결
- **Short-Term Memory** — LangChain BufferMemory로 최근 10턴 대화 유지. 세션별 격리
- **Long-Term Memory** — 대화 종료 후 비동기로 LLM이 사실(선호도·관계·컨텍스트)을 추출하여 DB 저장. 신뢰도 0.8 이상만 필터링. 이후 대화에서 Responder 컨텍스트로 주입

### 5. 멀티 LLM 프로바이더 + 자동 폴백

- OpenAI(GPT-4o, GPT-4o-mini), Google Gemini(2.0 Flash, 1.5 Pro), Grok, Claude를 `LLMProviderFactory` + `LLMAdapter`로 추상화
- 모델명에서 프로바이더 자동 감지 (예: `gpt-4o` → OpenAI)
- 선호 프로바이더 장애 시 대체 프로바이더로 자동 폴백

### 6. 타임존 인식 스마트 스케줄러

- **데일리 다이제스트** — 매시 정각에 전체 회사를 스캔, 각 회사의 로컬 시간이 오전 9시인 경우에만 발송
- **미완료 업무 알림** — 각 회사의 오후 6시에 기한 초과 업무 알림 발송
- **분산 락** — Redis 기반 분산 락으로 멀티 인스턴스 배포 시에도 중복 발송 방지 (TTL 5분, 크래시 시 자동 해제)

---

## 아키텍처

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                  │
│  ┌──────────────────────┐    ┌──────────────────────────────────────┐   │
│  │   Next.js 16 Web App │    │        Voice Client (Browser)       │   │
│  │   React 19 + SWR     │    │   Mic Input ──► WebSocket(Socket.IO)│   │
│  │   Shadcn/ui + Zustand│    │   Speaker ◄── Audio Stream (PCM)   │   │
│  └──────────┬───────────┘    └───────────────┬──────────────────────┘   │
│             │ REST/SSE                       │ WS: /boss-baby/voice     │
└─────────────┼────────────────────────────────┼──────────────────────────┘
              │                                │
┌─────────────┼────────────────────────────────┼──────────────────────────┐
│             ▼           NEST.JS BACKEND      ▼                          │
│  ┌─────────────────┐              ┌────────────────────┐                │
│  │  REST Controller │              │  Voice Gateway(WS) │                │
│  │  /boss-baby/*    │              │  VoiceStateManager │                │
│  └────────┬────────┘              └────────┬───────────┘                │
│           │                                │                            │
│           │         ┌──────────────────────┼───────────┐                │
│           │         │    VOICE PIPELINE     │           │                │
│           │         │  ┌─────────┐  ┌──────▼────────┐  │                │
│           │         │  │ OpenAI  │  │ VAD + Buffer   │  │                │
│           │         │  │Whisper/ │◄─┤ (900ms flush)  │  │                │
│           │         │  │Realtime │  └───────────────┘  │                │
│           │         │  └────┬────┘                     │                │
│           │         │       │ transcript                │                │
│           │         │       ▼                           │                │
│  ┌────────▼─────────┼───────────────────────┐          │                │
│  │            LANGGRAPH WORKFLOW             │          │                │
│  │                                          │          │                │
│  │  ┌──────────┐    ┌───────────┐           │          │                │
│  │  │ ROUTER   │───►│ EXECUTOR  │           │          │                │
│  │  │ GPT-4o-  │    │ 29 Tools  │           │          │                │
│  │  │ mini     │    │ memo/task/ │           │          │                │
│  │  │ (t=0.3)  │◄─┐│ schedule   │           │          │                │
│  │  └──────────┘  ││└─────┬─────┘           │          │                │
│  │                ││      ▼                  │          │                │
│  │                │┌───────────┐             │          │                │
│  │     retry ◄────┤│ ANALYZER  │             │          │                │
│  │     (max 5)    ││ route     │             │          │                │
│  │                │└─────┬─────┘             │          │                │
│  │                │      ▼                   │          │                │
│  │                │┌───────────┐             │          │                │
│  │                ││ RESPONDER │─────────────┼──►text   │                │
│  │                ││ GPT-4o    │             │   │      │                │
│  │                ││ (t=0.7)   │             │   │      │                │
│  │                │└───────────┘             │   │      │                │
│  └──────────────────────────────────────────┘   │      │                │
│           │                                     ▼      │                │
│           │         │  ┌────────────────┐  ┌────────┐  │                │
│           │         │  │ OpenAI TTS /   │◄─┤ Text   │  │                │
│           │         │  │ Google TTS /   │  │ Buffer │  │                │
│           │         │  │ Cartesia TTS   │  └────────┘  │                │
│           │         │  └───────┬────────┘              │                │
│           │         └──────────┼────────────────────────┘                │
│           │                    │ audio stream                            │
│           │                    ▼ (to client)                             │
│  ┌────────┼────────────────────────────────────────────────────┐        │
│  │        │          SHARED SERVICES                           │        │
│  │  ┌─────▼──────┐ ┌──────────┐ ┌───────────┐ ┌────────────┐ │        │
│  │  │MemorySystem│ │ Reminder │ │ Mail      │ │ Auth Guard │ │        │
│  │  │ Session    │ │ Scheduler│ │ Service   │ │ JWT+comId  │ │        │
│  │  │ ShortTerm  │ │ (Cron)   │ │ SendGrid/ │ │ Tenant     │ │        │
│  │  │ LongTerm   │ │ TZ-aware │ │ Gmail     │ │ Isolation  │ │        │
│  │  └────────────┘ └──────────┘ └───────────┘ └────────────┘ │        │
│  └─────────────────────────────────────────────────────────────┘        │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │                     DATA LAYER                                │       │
│  │  ┌──────────────┐  ┌─────────┐  ┌────────────────────────┐  │       │
│  │  │ PostgreSQL   │  │  Redis  │  │  LLM APIs              │  │       │
│  │  │ + pgvector   │  │  Lock   │  │  OpenAI / Gemini /     │  │       │
│  │  │ (TypeORM)    │  │  Cache  │  │  Grok / Claude         │  │       │
│  │  │ comId 격리    │  │  Queue  │  │  (Auto-Fallback)       │  │       │
│  │  └──────────────┘  └─────────┘  └────────────────────────┘  │       │
│  └──────────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 기술의사결정

- **왜 LangGraph?** → 단순 Chain은 조건 분기·재시도 루프 표현이 불가. AutoGen은 에이전트 간 자유 대화 방식이라 도구 실행 순서를 제어하기 어려움. LangGraph의 상태 그래프 + 조건부 엣지로 Router→Executor→Analyzer→Responder 순환 루프와 최대 5회 반복·3회 재시도 같은 정밀한 흐름 제어를 구현
- **왜 Router/Responder 모델 분리?** → 라우팅은 구조화 출력만 하면 되므로 GPT-4o-mini(저비용·저지연), 응답 생성은 자연스러움이 중요하므로 GPT-4o(고품질). API 비용을 절감하면서 응답 품질을 유지하는 이중 모델 전략
- **왜 OpenAI Whisper + 자체 VAD?** → 외부 VAD 라이브러리 대신 900ms 무음 감지로 STT 버퍼를 플러시하는 경량 방식 채택. Realtime API(WebSocket)와 Transcriptions API(배치) 두 모드를 환경변수로 전환 가능하게 하여, 지연 시간과 비용의 트레이드오프를 운영 단계에서 조정
- **왜 comId 기반 멀티 테넌시?** → 테넌트별 별도 DB(Database-per-tenant)는 수십~수백 개 소규모 테넌트에서 운영 오버헤드가 과도. 단일 DB + `comId` FK로 Row-Level 격리를 적용하고, JWT에 `comId`를 포함시켜 Guard 레벨에서 자동 필터링. 스키마 하나로 마이그레이션·모니터링이 통합됨

---

## 챌린지

- **문제**: LLM이 도구 실행 없이 "삭제했습니다"라고 거짓 응답하는 Hallucination → **해결**: Responder에 Guardrail 로직을 추가하여 `toolResults[]`에 실제 성공 기록이 없으면 성공 응답을 생성하지 못하도록 강제. 삭제는 반드시 `pendingDeletion` → 사용자 확인 → 도구 실행의 2-Step 플로우를 거치도록 그래프 엣지를 설계

- **문제**: 음성 대화에서 사용자가 말하는 중 에이전트가 응답을 시작하는 턴테이킹 충돌 → **해결**: 4단계 Voice State Machine(`IDLE→LISTENING→PROCESSING→SPEAKING`)을 구현하여 `PROCESSING`/`SPEAKING` 상태에서는 오디오 입력을 차단. VAD 기반 900ms 무음 감지로 발화 종료를 판단

- **문제**: 멀티 테넌트 환경에서 "오늘 일정 알려줘"의 "오늘"이 회사마다 다른 시간대 → **해결**: DB 저장은 전부 UTC, 그래프에 `getCompanyTimezone()` 콜백을 주입하여 Router의 날짜 파싱과 Responder의 시간 표시를 회사 타임존 기준으로 처리. 스케줄러도 매시 정각에 전 회사를 스캔하여 로컬 9시인 회사만 선별 발송

- **문제**: 멀티 인스턴스 배포 시 크론잡 중복 실행으로 리마인더 이메일 다중 발송 → **해결**: Redis 분산 락(TTL 5분)으로 단일 인스턴스만 스케줄러를 실행. `daily-sent:{comId}:{date}` 키로 당일 발송 여부를 마킹하여 크래시 후 재시작 시에도 중복 방지

---

## 임팩트

자연어 한 마디로 메모 작성, 일정 등록, 업무 할당, 팀원 이메일 발송까지 처리하는 AI 비서를 SaaS로 제공. 기존에 여러 앱(캘린더·메모·프로젝트관리·이메일)을 오가며 수행하던 업무를 "무궁아, 내일 오후 2시 회의 잡고 팀원들한테 메일 보내줘" 한 마디로 통합 처리. 음성 모드를 통해 이동 중에도 핸즈프리로 업무 관리가 가능하며, 장기 기억 시스템이 사용자의 선호와 패턴을 학습하여 반복적인 설명 없이도 맥락을 이해하는 개인화된 경험을 제공한다.

---

## 수치

| 항목 | 값 |
|---|---|
| LangGraph 에이전트 도구 | 29개 (메모 7 · 일정 6 · 업무 9 · 공통 7) |
| LLM 프로바이더 | 4개 (OpenAI · Gemini · Grok · Claude) + 자동 폴백 |
| 음성 STT/TTS 엔진 | STT 2모드 (Whisper Batch / Realtime WS) · TTS 3엔진 (OpenAI · Google · Cartesia) |
| Voice State Machine | 4단계 상태 전이, VAD 무음 감지 900ms |
| 그래프 최대 반복 | 5회 (도구 재시도 3회) |
| 메모리 계층 | 3계층 (Session · Short-Term · Long-Term) |
| 멀티 테넌시 격리 | 데이터·인증·타임존·스케줄러 4레벨 |
| 프론트엔드 주요 라우트 | 8개 (Chat · Memo · Schedule · Tasks · Voice · Journal · Notification · Settings) |
| Docker 리소스 제한 | 메모리 6GB · CPU 2코어 |
