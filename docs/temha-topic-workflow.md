# 템하 블록 작업 절차·에러·우선순위

> temha-ai-guideline.md 에서 분리된 토픽 문서

# 템하(Temha) AI 행동 지침서

> **목적**: AI가 실제로 블록을 생성할 때 필요한 코드 예시, 리스트, 고정 코드를 제공하는 실용 가이드
> **포인트**: 스펙의 규칙을 실제 코드로 어떻게 적용하는지 보여주는 문서

---

## 블록 생성 절차

### 1단계: 사용자 요구사항 분석

**입력**: 사용자 요청 (예: "회사소개 페이지의 히어로 섹션을 만들어줘")

**처리**:
- 페이지 용도 파악 (회사소개, 제품 소개, 랜딩 페이지 등)
- 블록 역할 정의 (히어로, 기능 소개, CTA 등)
- 필요한 컴포넌트 목록 작성

### 2단계: 블록 타입 결정

**선택지**: `header`, `footer`, `content`

**규칙**:
- `header`: 블록 1개만 허용, 고정 코드 필수
- `footer`: 블록 1개만 허용, 고정 코드 필수
- `content`: 여러 블록 허용, 일반 구조 사용

### 3단계: name 파라미터 정의

**규칙**:
- 영문, 숫자, 하이픈(-), 언더스코어(_)만 사용
- `kebab-case` 형식
- `~-N*` 패턴 (예: `hero-N1`, `feature-cards-N2`)
- 페이지 내에서 중복 불가

**예시**:
- ✅ `hero-product-N1`
- ✅ `feature-tech-stack-N2`
- ❌ `히어로-N1` (한글 금지)
- ❌ `hero N1` (공백 금지)

### 4단계: HTML 구조 작성

**순서**:
1. 최상위 `<div class="{name}">` 작성
2. `contents-container container-{size}` 추가
3. `contents-inner` 추가 (헤더/푸터/메인 비주얼 제외)
4. 실제 콘텐츠 작성

**특수 케이스**:
- **헤더/푸터**: `temha-ai-guideline.md`의 고정 HTML 구조 사용
- **메인 비주얼**: `contents-inner` 없이 `slide-area` 직접 배치

### 5단계: CSS 작성

**순서**:
1. 최상위 블록 필수 CSS (`position: relative`, `overflow: hidden` - 헤더 제외)
2. `rem` 단위 변환 (1rem = 10px)
3. 블록 스코프 지정 (`.{block_name} .element`)
4. 반응형 미디어쿼리 추가 (`@media (max-width: 992px)`)

**주의사항**:
- 인라인 스타일 금지
- `margin` 대신 `padding-top`, `padding-bottom` 사용
- 최상위 블록에 배경 직접 적용 (별도 배경 div 금지)

### 6단계: JavaScript 작성 (필요시)

**순서**:
1. IIFE 패턴 작성
2. jQuery 래퍼 추가
3. 블록 ID 사용 (`$(".block-N1[id='{bid}']")`)
4. 이벤트 처리 로직 작성

**금지 컴포넌트**:
- `accordset`: JavaScript 생성 금지
- `Videoset`: JavaScript 생성 금지

### 7단계: 검증 체크리스트 확인

**필수 확인 항목** (`temha-ai-spec.md`의 "검증 체크리스트" 참조):
- [ ] `name` 파라미터가 영문/숫자/-/_ 만 사용하는가?
- [ ] 최상위 HTML이 `<div class="{name}">`로 시작하는가?
- [ ] 최상위 div에 class 외 속성이 없는가?
- [ ] `contents-container`와 `contents-inner` 구조가 올바른가?
- [ ] CSS에 `position: relative`, `overflow: hidden`이 포함되어 있는가? (헤더 제외)
- [ ] 모든 크기가 `rem` 단위인가?
- [ ] JavaScript에서 블록 ID를 사용하는가?
- [ ] 허용된 버튼/아이콘 클래스만 사용하는가?
- [ ] 이미지에 `alt` 속성이 있는가?

---

## 에러 처리 가이드

### 규칙 위반 시 대응 방법

#### 1. name 파라미터 오류

**오류 예시**: `name: "히어로-N1"` (한글 포함)

**대응**:
1. 자동으로 영문 변환: `"히어로-N1"` → `"hero-N1"`
2. 사용자에게 알림: "name 파라미터가 한글을 포함하여 자동으로 영문으로 변환했습니다."

#### 2. 최상위 div 구조 오류

**오류 예시**: `<div class="hero-N1" id="custom-id">` (id 속성 포함)

**대응**:
1. `id` 속성 제거 (시스템에서 자동 삽입)
2. 최종 HTML: `<div class="hero-N1">`

#### 3. 허용되지 않은 버튼/아이콘 클래스 사용

**오류 예시**: `<a class="btnset btnset-md">` (`btnset-md`는 존재하지 않음)

**대응**:
1. 가장 유사한 허용된 클래스로 변경: `btnset-md` → `btnset` (기본값)
2. 또는 사용자에게 알림: "`btnset-md`는 존재하지 않습니다. `btnset` 또는 `btnset-lg`, `btnset-sm`을 사용해주세요."

#### 4. CSS 단위 오류

**오류 예시**: `font-size: 16px;` (px 사용)

**대응**:
1. 자동 변환: `16px` → `1.6rem` (1rem = 10px)
2. 모든 px 값을 rem으로 변환

#### 5. JavaScript 블록 ID 미사용

**오류 예시**: `$(".block-N1").each(...)` (블록 ID 없음)

**대응**:
1. 자동 수정: `$(".block-N1[id='{bid}']").each(...)`
2. 템하 방식으로 변경

#### 6. Videoset/Accordset JavaScript 생성

**오류 예시**: Videoset 사용 시 JavaScript 코드 작성

**대응**:
1. JavaScript 코드 제거
2. 사용자에게 알림: "Videoset 컴포넌트는 시스템에서 자동으로 JavaScript를 처리하므로 JavaScript 코드를 생성하지 않았습니다."

### 자동 수정 원칙

| 우선순위 | 원칙 | 예시 |
|---------|------|------|
| **1순위** | 규칙 위반 시 자동 수정 후 진행 | 한글 name → 영문 변환 |
| **2순위** | 수정 불가능한 경우 사용자에게 알림 | 존재하지 않는 버튼 클래스 사용 |
| **3순위** | 명확하지 않은 경우 스펙 문서 참조 | `temha-ai-spec.md` 확인 |

---

## 우선순위 가이드

### 규칙 충돌 시 우선순위

#### 1순위: 글로벌 정책 (global_policies)
- 단위는 `rem`만 사용
- 인라인 스타일 금지
- 블록 ID 필수 사용

#### 2순위: 컨테이너 규칙
- `contents-container` 필수
- `contents-inner` 필수 (특수 케이스 제외)
- 컨테이너 크기 선택 (`container-full`, `container-lg`, `container-md`, `container-sm`)

#### 3순위: 블록 규칙
- 최상위 블록 구조 (`<div class="{name}">`)
- 최상위 블록 CSS (`position: relative`, `overflow: hidden` - 헤더 제외)
- 블록간 여백 (`padding-top`, `padding-bottom`만 사용)

#### 4순위: 컴포넌트 규칙
- 허용된 버튼/아이콘 클래스만 사용
- 컴포넌트별 HTML 구조 준수
- 컴포넌트별 JavaScript 규칙 (accordset, Videoset 금지)

#### 5순위: 예시/참고
- 일반적인 패턴 참고
- 반응형 처리 방법

### 특수 케이스 우선순위

| 케이스 | 우선순위 | 규칙 |
|--------|---------|------|
| **헤더 블록** | 최우선 | 고정 코드 전체 포함 필수, `position: relative`, `overflow: hidden` 제외 |
| **푸터 블록** | 최우선 | 고정 코드 전체 포함 필수, JavaScript 불필요 |
| **메인 비주얼** | 높음 | `contents-inner` 없이 구조 사용, `container-full fullscreen` 조합 |
| **Videoset** | 높음 | JavaScript 생성 금지 |
| **Accordset** | 높음 | JavaScript 생성 금지 |

### 결정 트리

```
사용자 요청
  ↓
블록 타입이 header/footer인가?
  → 예: 고정 코드 사용 (guideline.md 참조)
  → 아니오: 일반 구조 사용
    ↓
Videoset/Accordset 사용하는가?
  → 예: JavaScript 생성 금지
  → 아니오: JavaScript 작성 (필요시)
    ↓
name 파라미터 검증
  → 한글 포함? → 영문 변환
  → 특수문자 포함? → 제거 또는 변환
    ↓
HTML 구조 검증
  → 최상위 div 구조 확인
  → contents-container/inner 확인
    ↓
CSS 검증
  → rem 단위 확인
  → 블록 스코프 확인
  → position/overflow 확인 (헤더 제외)
    ↓
JavaScript 검증 (필요시)
  → 블록 ID 사용 확인
  → IIFE 패턴 확인
    ↓
최종 검증 체크리스트 확인
```

---
