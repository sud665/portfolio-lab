# STEP 02 — content 파싱 시스템 (MD → 데이터)

> 이 단계의 목표: content/ 폴더의 MD 파일을 읽어서 TypeScript 데이터로 변환하는 유틸리티 구축

---

## 🔨 프롬프트 (Claude Code에 입력)

```
content/ 폴더의 MD 파일을 파싱하는 시스템을 만들어줘.

### 1. lib/types.ts — 타입 정의

export interface Profile {
  name: string;
  title: string;
  email: string;
  phone: string;
  github: string;
  blog: string;
  linkedin: string;
  kakao: string;
  resume_pdf: string;
  tagline: string;
  bio: string;           // frontmatter 아래 본문 텍스트
}

export interface Project {
  id: string;
  tier: 'main' | 'sub';
  title: string;
  icon: string;
  order: number;
  techStack: string[];
  // 본문 섹션별 파싱
  description: string;       // ## 설명
  highlights: string[];      // ## 하이라이트 (- 항목들)
  architecture: string;      // ## 아키텍처 (코드블록 텍스트)
  decisions: { question: string; answer: string }[];  // ## 기술의사결정
  challenges: { problem: string; solution: string }[]; // ## 챌린지
  impact: string;            // ## 임팩트
  stats: { label: string; value: string }[];  // ## 수치
}

export interface Career {
  phase: 'chem' | 'code' | 'ai';
  title: string;
  period: string;
  icon: string;
  order: number;
  description: string;   // 본문
}

export interface HireService {
  icon: string;
  title: string;
  description: string;
}

export interface HireProcess {
  step: number;
  title: string;
  description: string;
}

### 2. lib/content.ts — 파싱 유틸리티

gray-matter로 frontmatter 추출하고, 본문을 ## 헤더 기준으로 섹션 분리.

함수들:
- getProfile(): Profile
  - content/profile.md 읽기
  - frontmatter → 필드 매핑
  - 본문 → bio

- getProjects(): Project[]
  - content/projects/*.md 읽기 (_template.md 제외)
  - frontmatter → 기본 필드
  - 본문을 ## 헤더로 분리:
    - "## 설명" → description
    - "## 하이라이트" → highlights (- 로 시작하는 줄 → 배열)
    - "## 아키텍처" → architecture (텍스트 그대로)
    - "## 기술의사결정" → decisions ("- 왜 X? → Y" 포맷 파싱)
    - "## 챌린지" → challenges ("- 문제: X → 해결: Y" 포맷 파싱)
    - "## 임팩트" → impact
    - "## 수치" → stats ("- 라벨: 값" 포맷 파싱)
  - order 기준 정렬
  - 섹션이 없으면 빈 값 (빈 문자열 or 빈 배열)

- getCareers(): Career[]
  - content/career/*.md 읽기
  - order 기준 정렬

- getHireData(): { services: HireService[], process: HireProcess[] }
  - content/hire/services.md 읽기
  - "## 서비스" 아래 "### 아이콘 제목" 패턴 파싱
  - "## 프로세스" 아래 "숫자. 제목 — 설명" 패턴 파싱

모든 함수는 동기식으로 fs.readFileSync 사용 (빌드타임 데이터).
에러 처리: 파일 없으면 빈 기본값 반환 (크래시 방지).
```

---

## ✅ 체크포인트 (Claude Code에 입력)

```
STEP 02 파싱 시스템 테스트해줘:

1. 테스트 스크립트를 만들어서 실행해봐:

   // test-content.ts (임시 파일)
   import { getProfile, getProjects, getCareers, getHireData } from './lib/content';

   const profile = getProfile();
   console.log('=== Profile ===');
   console.log('이름:', profile.name);
   console.log('태그라인:', profile.tagline);
   console.log('bio 길이:', profile.bio.length, '자');

   const projects = getProjects();
   console.log('\n=== Projects ===');
   projects.forEach(p => {
     console.log(`[${p.tier}] ${p.icon} ${p.title} (order: ${p.order})`);
     console.log('  스택:', p.techStack.join(', '));
     console.log('  하이라이트:', p.highlights.length, '개');
     console.log('  아키텍처:', p.architecture ? '있음' : '없음');
     console.log('  의사결정:', p.decisions.length, '개');
     console.log('  챌린지:', p.challenges.length, '개');
   });

   const careers = getCareers();
   console.log('\n=== Careers ===');
   careers.forEach(c => console.log(`${c.icon} ${c.title} (${c.period})`));

   const hire = getHireData();
   console.log('\n=== Hire ===');
   console.log('서비스:', hire.services.length, '개');
   console.log('프로세스:', hire.process.length, '단계');

2. npx tsx test-content.ts 실행해서 출력 확인

3. 확인할 것:
   - _template.md가 제외되었는지
   - projects가 order 순서대로 정렬되었는지
   - 하이라이트, 의사결정, 챌린지가 배열로 제대로 파싱되었는지
   - 빈 섹션이 에러 없이 빈 값으로 처리되는지

4. 테스트 통과 후 test-content.ts 삭제

5. TypeScript 에러 확인: npx tsc --noEmit

모두 통과하면 "STEP 02 ✅ 완료"라고 알려줘.
파싱 결과가 이상하면 수정 후 다시 테스트해줘.
```

---

## 🔍 이 단계에서 확인할 것

| 항목 | 기대 결과 |
|------|----------|
| getProfile() | 이름, 태그라인, bio 정상 출력 |
| getProjects() | 4개 프로젝트, order 순 정렬 |
| _template 제외 | 5개 MD 중 4개만 반환 |
| 섹션 파싱 | 하이라이트/의사결정/챌린지 배열 변환 |
| 에러 없음 | 빈 섹션도 크래시 없이 처리 |

→ 전부 통과하면 **STEP-03.md**로 이동
