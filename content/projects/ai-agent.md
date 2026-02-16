---
id: "ai-agent"
tier: "main"
title: "AI Agent 업무관리 시스템"
icon: "🤖"
order: 1
techStack:
  - LangGraph
  - LangChain
  - Next.js
  - Nest.js
  - Python
  - PostgreSQL
  - Redis
  - Socket.IO
---

## 설명
LangGraph 기반 4-Step 멀티 에이전트 워크플로우와 실시간 음성 인터랙션을 결합한 AI 업무관리 SaaS. 멀티 테넌시 아키텍처로 기업별 격리된 환경을 제공한다.

## 하이라이트
- LangGraph 4-Step 순환 그래프 + 29개 도구 동적 디스패치
- WebSocket 기반 실시간 음성 에이전트 (STT→Agent→TTS 양방향 파이프라인)
- 멀티 테넌시 4레벨 격리 — comId 기반 데이터·인증·타임존·스케줄러 분리
- 3계층 메모리 시스템 — Session·Short-Term·Long-Term + LLM 장기 기억 추출
- 멀티 LLM 4개 엔진 (OpenAI·Gemini·Grok·Claude) + 자동 폴백

## 아키텍처
@layer Client | chem
- REST API / SSE
- WebSocket (Voice)

@layer Nest.js Backend | code
- Voice Pipeline (VAD → STT → TTS)
- LangGraph Workflow
- Memory (3-Tier)
- Scheduler (TZ-aware Cron)

@layer Data Layer | ai
- PostgreSQL (pgvector)
- Redis
- LLM APIs (4 providers)

## 기술의사결정
- 왜 LangGraph? → 조건부 엣지·재시도 루프가 필요한 멀티스텝 워크플로우에 Chain이나 AutoGen보다 정밀한 흐름 제어 가능
- 왜 Router/Responder 모델 분리? → 라우팅은 GPT-4o-mini(저비용), 응답은 GPT-4o(고품질)로 비용 대비 품질 최적화
- 왜 자체 VAD(900ms 무음 감지)? → 외부 VAD 라이브러리 없이 경량 턴테이킹 구현, Realtime/Batch 두 모드 전환 가능
- 왜 comId 기반 Row-Level 멀티 테넌시? → DB-per-tenant는 소규모 테넌트에서 운영 오버헤드 과도, 단일 DB+JWT comId로 통합 관리

## 챌린지
- 문제: LLM Hallucination (도구 미실행 거짓 응답) → 해결: toolResults[] 검증 Guardrail + pendingDeletion 2-Step 강제
- 문제: 음성 턴테이킹 충돌 → 해결: 4단계 Voice State Machine, PROCESSING/SPEAKING 중 입력 차단
- 문제: 멀티 테넌트 타임존 불일치 → 해결: DB UTC 저장 + 그래프에 회사별 타임존 콜백 주입
- 문제: 멀티 인스턴스 크론잡 중복 → 해결: Redis 분산 락(TTL 5min) + daily-sent 키 중복 방지

## 임팩트
자연어 한 마디로 메모·일정·업무·이메일을 통합 처리하는 AI 비서를 SaaS로 제공. 음성 모드로 핸즈프리 업무 관리, 장기 기억으로 개인화된 경험 제공.

## 수치
- 에이전트 도구: 29개 (메모 7·일정 6·업무 9·공통 7)
- LLM 프로바이더: 4개 + 자동 폴백
- 음성 엔진: STT 2모드·TTS 3엔진
- 메모리 계층: 3계층 (Session·Short-Term·Long-Term)
- 멀티 테넌시 격리: 4레벨 (데이터·인증·타임존·스케줄러)
