# Chapter3-1. UI 컴포넌트 모듈화와 디자인 시스템

## 과제 목표

**레거시 코드베이스를 현대적인 디자인 시스템으로 개편하는 실무 경험**

1. 정리되지 않은 레거시 코드의 문제점 식별 및 분석
2. TailwindCSS, shadcn/ui, CVA 등의 현대 도구 활용
3. 일관된 디자인 토큰과 컴포넌트 API 구축
4. UI와 비즈니스 로직이 적절한 분리된 리팩토링

---

## Before 패키지 분석 후 After 패키지 개편

### 개편 목표

**디자인 시스템**

- TailwindCSS 기반 일관된 디자인 토큰 정의
- 하드코딩 제거, 재사용 가능한 스타일 시스템 구축
- dark mode, 반응형 등 확장 가능한 구조

---

**컴포넌트 아키텍처**

- UI 컴포넌트는 순수하게 UI만 담당
- 도메인 로직은 적절히 분리
- 일관된 컴포넌트 API 설계

### 사용할 도구

**TailwindCSS 4.x**

- 디자인 토큰 기반 스타일링
- 유틸리티 클래스 활용
- dark mode, 반응형 내장 지원

**shadcn/ui**

- Radix UI 기반, 접근성 내장
- 복사 가능한 컴포넌트 (라이브러리가 아닌 소스코드)
- 자유로운 커스터마이징

**CVA (Class Variance Authority)**

- 선언적 variants 패턴
- 타입 안전한 스타일 조합
- 조건부 스타일링 처리

**React Hook Form + Zod**

- 선언적 폼 검증
- 타입 안전한 스키마
- 최소 리렌더링 최적화

---

## 필수 과제

### 1. 디자인 시스템 구축

- [x] TailwindCSS 설정 및 디자인 토큰 정의
- [x] shadcn/ui 컴포넌트 설치 (Button, Input, Select, Card, Table 등)
- [x] CVA를 활용한 variants 패턴 적용
- [x] 일관된 스타일 시스템 구축

### 2. Before 패키지 분석

- [x] Before 패키지 실행 및 전체 코드 탐색
- [x] 스타일링, 컴포넌트 설계, 폼 관리 측면에서 문제점 파악
- [x] 개선이 필요한 부분과 그 이유 정리

### 3. 컴포넌트 개편

- [x] UI와 비즈니스 로직 분리
- [x] 순수한 UI 컴포넌트로 재구성
- [x] 일관된 컴포넌트 API 설계
- [x] 적절한 컴포넌트 구조 설계

---

## 심화 과제

- [x] Dark Mode 완전 지원 (CSS Variables + Tailwind)
- [x] Design Token 시스템 고도화 (색상 팔레트, 타이포그래피 스케일)
- [x] 뷰와 비즈니스로직이 분리되도록

---

[스토리북 배포링크](https://6928875420cba3b115e9b0c4-pxbzklizgd.chromatic.com/?path=/docs/components-button--docs)
[서비스 배포링크](https://ahnsummer.github.io/front_7th_chapter3-1/)

## 과제 회고

> 과제를 진행하면서 느낀 점, 배운 점을 자유롭게 작성해주세요.

### Before 패키지에서 발견한 문제점

1. **UI 컴포넌트와 비즈니스 로직의 혼재**

   - `FormInput` 컴포넌트가 `fieldType`, `entityType`, `checkBusinessRules` 같은 도메인 특화 prop을 받아 내부에서 비즈니스 규칙을 검증함
   - 예약어 체크, 회사 이메일 검증, 금칙어 체크 등이 UI 컴포넌트 내부에 하드코딩되어 재사용성 저하
   - `Table` 컴포넌트가 `entityType`에 따라 다른 렌더링 로직을 포함하여 도메인별 특수 처리가 컴포넌트 내부에 존재

2. **스타일링의 일관성 부족**

   - 인라인 스타일(`style` prop) 남용으로 스타일 관리가 어려움
   - CSS 클래스 기반 스타일링에서 하드코딩된 색상값(`#1976d2`, `#d32f2f` 등) 사용
   - 디자인 토큰이 없어 일관된 디자인 시스템 구축 불가

3. **디자인 토큰의 불일치**

   - **컬러 토큰값의 불일치**: 같은 의미의 컬러 토큰이 컴포넌트마다 다른 값을 가짐
     - Button의 `secondary`: `#f5f5f5` (회색 배경)
     - Badge의 `secondary`: `#757575` (진한 회색 배경)
     - 같은 "secondary" 토큰이지만 완전히 다른 색상으로 사용됨
   - **컬러 표현 방식의 불일치**: `#fff` (짧은 형식)와 `#1976d2` (긴 형식) 등 혼재하여 일관성 부족
   - **Props 네이밍 불일치**: 컬러 variant를 표현하는 prop 이름이 컴포넌트마다 다름
     - Badge: `type` prop (`type="primary"`)
     - Button: `variant` prop (`variant="primary"`)
     - 같은 목적이지만 다른 prop 이름 사용으로 API 일관성 저하

4. **단위 사용의 불일치**

   - `px`, `rem`, `em` 단위가 혼재하여 사용됨
     - `px`: `padding: 6px 12px`, `font-size: 13px`, `margin-bottom: 16px`
     - `rem`: `font-size: 1.125rem`, `font-size: 0.875rem`, `font-size: 0.625rem`
     - `em`: `min-height: 6em`, `line-height: 1.1876em`
   - 일관된 단위 시스템이 없어 반응형 디자인과 접근성 고려가 어려움

5. **거대한 컴포넌트와 책임 분리 부족**
   - `ManagementPage` 컴포넌트가 647줄로 거대하며, 데이터 로딩, CRUD 처리, UI 렌더링 등 모든 책임을 가짐
   - User와 Post 엔티티의 공통 로직이 중복되어 유지보수 어려움

### 개편 과정에서 집중한 부분

1. **모노레포 구조를 통한 관심사 분리**

   - `@repo/after` (디자인 시스템): 순수 UI 컴포넌트만 포함, 비즈니스 로직 제거
   - `@repo/app` (애플리케이션): 비즈니스 로직과 도메인 특화 컴포넌트 포함
   - `@repo/utils`: 공통 유틸리티(`cn` 함수 등) 제공
   - 각 패키지가 독립적으로 빌드되고 배포 가능하도록 설정

2. **Table 컴포넌트의 render prop 패턴으로 비즈니스 로직 분리**

   - Before: `Table` 컴포넌트가 `entityType`을 받아 내부에서 `renderCell` 함수로 도메인별 렌더링 처리
   - After: `Table` 컴포넌트는 `columns`의 `render` prop만 받아 순수 UI 컴포넌트로 변경
   - `getUserColumns`, `getPostColumns` 함수에서 도메인별 렌더링 로직을 분리하여 `app` 패키지에서 관리
   - Badge 렌더링, 액션 버튼 등 모든 도메인 특화 로직이 `table-columns.tsx`로 이동

3. **Input 컴포넌트의 onValidate prop으로 검증 로직 분리**

   - Before: `FormInput`이 `fieldType`, `entityType`, `checkBusinessRules`를 받아 내부에서 검증
   - After: `Input` 컴포넌트는 `onValidate` prop만 받아 외부에서 검증 함수를 주입받도록 변경
   - `app/src/utils/validation.ts`에서 `validateUsername`, `validateEmail`, `validatePostTitle` 등 도메인별 검증 함수 분리
   - `UserFormFields`, `PostFormFields`에서 각 필드에 맞는 검증 함수를 `onValidate`로 전달

4. **useEntityManagement 훅으로 공통 로직 추상화**

   - User와 Post 엔티티의 CRUD 로직이 중복되어 있던 문제를 해결
   - `useEntityManagement` 훅에서 `entityType`에 따라 적절한 서비스를 호출하는 공통 로직 추상화
   - `ManagementPage` 컴포넌트가 173줄로 축소되어 가독성과 유지보수성 향상
   - 폼 데이터 관리, 에러 처리, 성공 메시지 등 공통 패턴을 훅으로 캡슐화

5. **컴포넌트 분리로 관심사 분리**

   - `ManagementPage`를 `PageHeader`, `EntityTabs`, `StatsSection`, `AlertSection`, `CreateModal`, `EditModal` 등으로 분리
   - 각 컴포넌트가 단일 책임을 가지도록 설계하여 재사용성과 테스트 용이성 향상

6. **Tailwind CSS + CVA로 스타일링 시스템화**
   - 모든 컴포넌트를 Tailwind CSS 유틸리티 클래스와 CVA variants로 마이그레이션
   - 디자인 토큰을 CSS 변수로 정의하여 일관된 색상, 간격, 타이포그래피 관리
   - 인라인 스타일 제거로 스타일 관리 일원화

### 사용한 기술 스택 경험

- **Tailwind CSS 4.x**: 유틸리티 퍼스트 접근으로 빠른 스타일링과 일관된 디자인 시스템 구축
- **CVA (Class Variance Authority)**: 타입 안전한 variants 관리로 컴포넌트 API 설계가 명확해짐
- **shadcn/ui**: Radix UI 기반으로 접근성을 고려한 컴포넌트를 빠르게 구축 가능
- **모노레포 (pnpm workspaces)**: 패키지 간 의존성 관리와 독립적인 빌드/배포가 용이함
- **Vite 라이브러리 모드**: 디자인 시스템을 라이브러리로 빌드하여 다른 프로젝트에서 재사용 가능

### 어려웠던 점과 해결 방법

1. **거대한 컴포넌트의 분리 전략**

   - 문제: Before 패키지의 `ManagementPage`가 647줄로 거대하여 코드 파악과 유지보수가 어려움. 하나의 컴포넌트에 페이지 헤더, 탭, 통계 카드, 알림, 테이블, 모달 등 모든 UI와 비즈니스 로직이 혼재되어 있음
   - 해결 과정:
     1. **시각적 영역별 컴포넌트 분리**: 페이지를 시각적으로 구분되는 영역으로 나눔
        - `PageHeader`: 페이지 제목과 설명 (단일 책임: 헤더 표시)
        - `EntityTabs`: 엔티티 타입 선택 탭 (단일 책임: 탭 UI와 상태 관리)
        - `StatsSection`: 통계 카드 그리드 (단일 책임: 통계 데이터 시각화)
        - `AlertSection`: 성공/에러 알림 (단일 책임: 알림 표시)
        - `CreateModal`/`EditModal`: 생성/수정 모달 (단일 책임: 폼 모달)
     2. **비즈니스 로직 추상화**: 데이터 관리 로직을 커스텀 훅으로 분리
        - `useEntityManagement`: CRUD 작업, 폼 데이터 관리, 에러 처리 등 모든 비즈니스 로직을 캡슐화
        - User와 Post의 공통 패턴을 추상화하여 중복 제거
     3. **도메인별 유틸리티 함수 분리**: 계산 로직과 설정을 별도 파일로 분리
        - `getUserColumns`/`getPostColumns`: 테이블 컬럼 정의를 도메인별로 분리
        - `calculateUserStats`/`calculatePostStats`: 통계 계산 로직 분리
     4. **폼 필드 컴포넌트 분리**: 엔티티별 폼 필드를 독립 컴포넌트로 분리
        - `UserFormFields`/`PostFormFields`: 각 엔티티의 폼 필드만 담당
   - 결과: 647줄 → 173줄로 축소, 각 컴포넌트가 단일 책임을 가지며 재사용성과 테스트 용이성 향상

2. **React 중복 번들링 문제**

   - 문제: `@repo/after`를 `@repo/app`에서 import할 때 React가 중복 번들링되어 `Cannot read properties of null` 오류 발생
   - 해결: Vite 설정에서 `react`, `react-dom`, `react/jsx-runtime`을 external로 설정하여 peer dependency로 처리

### 리뷰받고 싶거나 질문하고 싶은 내용

1. **디자인 시스템 패키지의 비즈니스 로직 제거 수준**: 현재 Badge, Button 등은 순수 UI 컴포넌트로 분리했지만, Table의 경우 여전히 pagination, sorting 등의 로직이 포함되어 있습니다. 이런 기능성 로직도 분리해야 할까요?

2. **모노레포 구조의 패키지 분리 전략**: 현재 `after`(디자인 시스템), `app`(애플리케이션), `utils`(공통 유틸)로 분리했는데, 향후 도메인별로 패키지를 더 세분화할 때의 베스트 프랙티스가 궁금합니다.

3. **CVA variants 설계**: 현재 각 컴포넌트마다 CVA variants를 정의하고 있는데, 공통 variants를 추출하여 재사용하는 것이 좋을지, 아니면 컴포넌트별로 독립적으로 관리하는 것이 좋을지 의견이 궁금합니다.
