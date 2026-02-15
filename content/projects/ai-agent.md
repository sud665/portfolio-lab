---
id: "ai-agent"
tier: "main"
title: "AI Agent 업무관리 시스템"
icon: "🤖"
order: 1
techStack:
  - LangChain
  - LangGraph
  - Next.js
  - Nest.js
  - Python
---

## 설명
LangChain과 LangGraph를 활용하여 멀티스텝 추론이 가능한
AI Agent 기반 업무관리 시스템을 설계하고 구축했습니다.

## 하이라이트
- LangGraph 기반 멀티에이전트 워크플로우 설계
- 업무 자동 분류 및 우선순위 추천 기능
- 자연어 기반 업무 생성 및 관리 인터페이스

## 아키텍처
User → API Gateway → LangGraph
                      ├→ Task Agent
                      ├→ Priority Agent
                      └→ Summary Agent

## 기술의사결정
- 왜 LangGraph? → 멀티스텝 추론과 상태 관리가 필요한 워크플로우에 적합
- 왜 Nest.js? → 모듈화된 백엔드 구조로 Agent별 서비스 분리 용이

## 챌린지
- 문제: Agent 루프 방지 → 해결: State Machine 기반 흐름 제어
- 문제: 응답 지연 → 해결: Streaming 응답 적용

## 임팩트
AI가 업무를 자동으로 분류하고 우선순위를 추천하여 팀 업무 효율성을 향상시켰습니다.

## 수치
- 사용자 수: [추후 작성]
- 처리량: [추후 작성]
