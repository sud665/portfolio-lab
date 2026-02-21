---
id: "postgresql-index-strategy"
title: "멀티테넌시에서 쿼리 속도를 15배 올린 인덱스 전략"
subtitle: "PostgreSQL 복합 인덱스 설계와 실행계획 분석"
date: "2026-02-20"
category: "DB"
tags: ["PostgreSQL", "인덱스", "성능최적화", "멀티테넌시"]
summary: "테넌트별 조회가 3초에서 0.2초로 줄어든 과정을 공유합니다."
---

## 문제 상황

멀티테넌시 SaaS 플랫폼에서 테넌트별 데이터 조회가 점점 느려지고 있었다. 초기에는 데이터가 적어 문제가 없었지만, 테넌트 수가 50개를 넘어가면서 특정 쿼리가 3초 이상 걸리기 시작했다.

```sql
-- 문제가 된 쿼리
SELECT * FROM orders
WHERE tenant_id = $1
AND status = 'active'
ORDER BY created_at DESC
LIMIT 20;
```

## CS 개념: B-Tree 인덱스와 복합 인덱스

PostgreSQL의 기본 인덱스는 B-Tree 구조다. B-Tree는 정렬된 데이터를 효율적으로 탐색할 수 있게 해주는 자료구조로, O(log n) 시간 복잡도로 검색이 가능하다.

**복합 인덱스**는 여러 컬럼을 하나의 인덱스로 묶는 것이다. 핵심은 **컬럼 순서**가 성능에 결정적 영향을 미친다는 점이다.

## 해결 과정

먼저 `EXPLAIN ANALYZE`로 실행계획을 분석했다.

```sql
EXPLAIN ANALYZE
SELECT * FROM orders
WHERE tenant_id = 'tenant_42'
AND status = 'active'
ORDER BY created_at DESC
LIMIT 20;
```

Seq Scan이 발생하고 있었다. 복합 인덱스를 생성했다.

```sql
CREATE INDEX idx_orders_tenant_status_created
ON orders (tenant_id, status, created_at DESC);
```

## 결과와 배운 점

- 쿼리 시간: 3초 → 0.2초 (15배 개선)
- Seq Scan → Index Scan으로 변경
- 테넌트 100개에서도 안정적 성능 유지

인덱스 설계는 "어떤 쿼리를 자주 실행하는가"에서 출발해야 한다는 것을 배웠다.
