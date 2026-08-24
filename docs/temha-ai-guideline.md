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

## 헤더 블록 생성

### 헤더 HTML 구조

```html
<div class="header-N1">
  <div class="header-container container-lg">
    <div class="header-left">
      <h1 class="header-title">
        <a href="javascript:void(0)">
          <img src="https://temha.io/api/t-a/57/1762488000/resources/images/img_logo_black.png" alt="로고" />
        </a>
      </h1>
    </div>
    <div class="header-center">
      <div class="header-gnb">
        <ul class="header-gnblist">
          <li class="header-gnbitem">
            <a href="javascript:void(0)" class="header-gnblink">
              <span>메뉴</span>
            </a>
            <ul class="header-sublist">
              <li class="header-subitem">
                <a class="header-sublink" href="javascript:void(0)">
                  <span>서브메뉴</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <div class="header-right">
      <div class="header-utils">유틸리티</div>
      <button class="btn-momenu" type="button">
        <span class="ico-hamburger"></span>
        <span class="ico-hamburger"></span>
        <span class="ico-hamburger"></span>
      </button>
      <button class="btn-allmenu" type="button">
        <span class="ico-hamburger"></span>
        <span class="ico-hamburger"></span>
        <span class="ico-hamburger"></span>
      </button>
    </div>
  </div>
  <!-- Fullmenu -->
  <div class="header-fullmenu fullmenu-top">
    <div class="fullmenu-wrapper">
      <div class="fullmenu-head">
        <h4 class="fullmenu-title">
          <a href="javascript:void(0)">
            <img src="https://temha.io/api/t-a/57/1762488000/resources/images/img_logo_white.png" alt="로고" />
          </a>
        </h4>
      </div>
      <ul class="fullmenu-gnblist">
        <li class="fullmenu-gnbitem">
          <a class="h5 fullmenu-gnblink" href="javascript:void(0)">
            <span>메뉴</span>
          </a>
          <ul class="fullmenu-sublist">
            <li class="fullmenu-subitem">
              <a class="p1 fullmenu-sublink" href="javascript:void(0)">
                <span>서브메뉴</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <button class="fullmenu-close" type="button">
      <img src="ico-close-white.svg" alt="닫기" />
    </button>
  </div>
</div>
```

### 헤더 CSS 고정 코드 (전체 필수)

```css
.header-N1 { position: sticky !important; top: 0; z-index: 200; width: 100%; background: var(--white); } .header-N1 .header-container { display: flex; align-items: center; justify-content: space-between; min-height: 6rem; box-sizing: border-box; } .header-N1.top-menu-active .header-container { padding-top: 6.7rem; } .header-N1 .header-top { width: 100%; border-bottom: 1px solid #e5e5e5; position: absolute; top: 0; left: 0; } .header-N1 .user-menu { width: 100%; display: flex; align-items: center; justify-content: flex-end; padding: 0 8rem; margin: 0 auto; } .header-N1 .user-menu li { position: relative; } .header-N1 .user-menu li:not(:first-child)::before { content: ""; position: absolute; top: 50%; left: 0; transform: translateY(-50%); width: 1px; height: 1.2rem; background: #e5e5e5; } .header-N1 .user-menu li a { padding: 2rem 1.2rem; text-align: center; white-space: nowrap; } .header-N1 .user-menu li:last-child a { padding: 2rem 0 2rem 1.2rem; } .header-N1 .header-left { display: flex; align-items: center; gap: 3rem; } .header-N1 .header-title { display: flex; margin-bottom: 0; } .header-N1 .header-title a { height: 3.2rem; } .header-N1 .header-title img { height: 100%; object-fit: contain; vertical-align: top; } .header-N1 .header-gnblist { display: flex; justify-content: center; align-items: center; height: 100%; } .header-N1 .header-gnbitem { position: relative; } .header-N1 .header-gnblink { height: 100%; padding: 2.8rem 3rem; text-align: center; white-space: nowrap; color: var(--black); } .header-N1 .header-gnblink span { position: relative; } .header-N1 .header-gnblink span::after { content: ""; height: 0.2rem; width: 100%; transition: 0.3s; transform: scaleX(0); } .header-N1 .header-sublist { min-height: 0; position: absolute; left: 50%; transform: translateX(-50%); top: 100%; transition: opacity 0.3s; padding: 1rem; opacity: 0; overflow: hidden; pointer-events: none; border-radius: 0.4rem; background: var(--white); box-shadow: 1px 1px 3rem 0 rgba(0, 0, 0, 0.15); backdrop-filter: blur(3rem); } .header-N1 .header-gnbitem:has(.header-sublist .header-subitem):hover .header-sublist { min-height: auto; opacity: 1; overflow: hidden; pointer-events: auto; } .header-N1 .header-gnbitem:hover .header-gnblink span::after { content: ""; display: inline-block; position: absolute; left: 0; top: 100%; background: var(--black); transform: scaleX(1); } .header-N1 .header-subitem { width: 100%; min-width: 10rem; overflow: hidden; } .header-N1 .header-sublink { width: 100%; padding: 1rem 1.4rem; transition: color 0.2s, background 0.2s; will-change: color, background; border-radius: 0.4rem; } .header-N1 .header-sublink:hover { background: #f8f9fb; color: var(--black); } .header-N1 .header-right { display: flex; align-items: center; } .header-N1 .header-right .header-gnb { margin-right: 1.8rem; } .header-N1 .header-utils > ul { display: flex; align-items: center; } .header-N1 .header-utils > ul > li { margin-left: 1.2rem; } .header-N1 .header-utils > ul > li > img { width: auto; height: 100%; object-fit: cover; vertical-align: top; } .header-N1 .header-right button { max-width: 3.2rem; max-width: 3.2rem; background: none; border: none; } .header-N1 .header-right button img { width: auto; max-height: 100%; object-fit: cover; vertical-align: top; } .header-N1 .header-utils .member a { width: 3.2rem; height: 3.2rem; font-size: 0; display: block; } .header-N1 .header-utils .member img { max-width: 100%; max-height: 100%; object-fit: cover; vertical-align: top; } .header-N1 .header-utils .btn-allmenu { display: flex; flex-direction: column; gap: 0.6rem; } .header-N1 .header-utils .btn-allmenu:hover .ico-hamburger:nth-child(2) { width: 2.4rem; } .header-N1 .header-utils .btn-allmenu .ico-hamburger, .header-N1 .btn-momenu .ico-hamburger { width: 2.4rem; height: 0.2rem; background: var(--black); border-radius: 1rem; transition: width 0.3s, transform 0.3s, opacity 0.3s; will-change: width, transform, opacity; } .header-N1 .header-utils .btn-allmenu .ico-hamburger:nth-child(even), .header-N1 .btn-momenu .ico-hamburger:nth-child(2) { width: 1.4rem; } .header-N1 .btn-momenu { display: none; } .header-N1 .btn-moclose { display: none; } .header-N1 .header-fullmenu { position: fixed; z-index: 99999; padding: 0 2.4rem; background: var(--black); transition: 0.3s; opacity: 0; visibility: hidden; overflow: hidden; } .header-N1 .header-fullmenu.fullmenu-right { width: 0; height: 100%; top: 0; right: 0; } .header-N1 .header-fullmenu.fullmenu-left { width: 0; height: 100%; top: 0; left: 0; } .header-N1 .header-fullmenu.fullmenu-top { top: 0; left: 0; width: 100%; height: 0; } .header-N1 .header-fullmenu.fullmenu-bottom { bottom: 0; left: 0; width: 100%; height: 0; } .header-N1 .header-fullmenu.fullmenu-active { width: 100%; height: 100vh; opacity: 1; visibility: visible; } .header-N1 .fullmenu-wrapper { position: relative; top: 50%; transform: translateY(-50%); width: 100%; max-width: 128rem; margin: 0 auto; } .header-N1 .fullmenu-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10rem; } .header-N1 .fullmenu-title { margin-bottom: 0; } .header-N1 .fullmenu-title a { width: 13.6rem; height: 4.3rem; } .header-N1 .fullmenu-title img { width: 100%; height: 100%; object-fit: contain; } .header-N1 .fullmenu-gnblist { display: flex; justify-content: flex-start; } .header-N1 .fullmenu-gnbitem { width: 20%; } .header-N1 .fullmenu-gnbitem + .fullmenu-gnbitem { margin-left: 4rem; } .header-N1 .fullmenu-gnblink { position: relative; width: 100%; padding-bottom: 4rem; color: var(--white); border-bottom: 1px solid rgba(255, 255, 255, 0.2); } .header-N1 .fullmenu-gnblink::after { content: ""; position: absolute; left: 0; bottom: 0; display: block; width: 0; height: 0.1rem; background: var(--white); transition: 0.2s; } .header-N1 .fullmenu-gnblink.on::after { width: 18rem; } .header-N1 .fullmenu-sublist { padding-top: 4rem; } .header-N1 .fullmenu-subitem + .fullmenu-subitem { padding-top: 0.8rem; } .header-N1 .fullmenu-sublink { color: #a2a2a2; position: relative; padding-bottom: 5px; transition: 0.3s; } .header-N1 .fullmenu-sublink::before { content: ""; width: 0; height: 1px; background-color: var(--white); position: absolute; top: 100%; right: 0; transition: width 0.7s cubic-bezier(0.22, 0.61, 0.36, 1); } .header-N1 .fullmenu-sublink:hover { color: var(--white); } .header-N1 .fullmenu-sublink:hover::before { width: 100%; right: auto; left: 0; } .header-N1 .fullmenu-close { position: fixed; right: 8rem; top: 2.4rem; width: 3.2rem; height: 3.2rem; padding: 0.5rem; background: transparent; border: none; } .header-N1 .fullmenu-close img { width: 100%; height: 100%; object-fit: cover; } @media (max-width: 1200px) { .header-N1 .user-menu { padding: 0 4rem; } } @media (max-width: 992px) { .header-N1 { padding-top: 0; padding-bottom: 0; } .header-N1.top-menu-active .header-container { padding-top: 0; } .header-N1 .header-gnb { width: 100%; height: 0; position: absolute; top: 100%; left: 0; overflow: hidden; padding: 0 2.4rem; transition: height 0.3s; z-index: 9; } .header-N1.block-active { min-height: 100vh; } .header-N1.block-active .header-gnb { height: calc(100vh - 6rem); padding-bottom: 19rem; overflow-y: auto; } .header-N1 .header-container { min-height: 6rem; } .header-N1 .header-top { border: none; opacity: 0; visibility: hidden; transition: opacity 0.3s 0.1s, visibilty 0.3s 0.1s; will-change: opacity, visibility; z-index: 10; } .header-N1.block-active .header-top { top: 100%; opacity: 1; visibility: visible; } .header-N1 .user-menu { padding: 0 2.2rem; justify-content: flex-start; } .header-N1 .user-menu li a, .header-N1 .user-menu li:last-child a { padding: 2.4rem 1.2rem; } .header-N1 .user-menu li:first-child a { padding-left: 0; } .header-N1 .header-title a { width: 11rem; height: 2rem; } .header-N1 .header-center { width: 100%; height: 0; top: 100%; left: 0; transform: none; } .header-N1 .header-gnblist { display: block; opacity: 0; visibility: hidden; transition: opacity 0.3s 0.1s; } .header-N1 .header-gnblink { display: flex; align-items: flex-end; width: 100%; padding: 1.8rem 0; text-align: left; transition: border 0.3s; will-change: border; border-bottom: 1px solid rgba(var(--black-rgb), 0.2); } .header-N1.top-menu-active .header-gnbitem:first-child .header-gnblink { padding-top: 6.8rem; } .header-N1 .header-gnbitem:hover .header-gnblink span { border: none; } .header-N1 .header-gnbitem:hover .header-gnblink span::after { content: none; } .header-N1 .header-sublist { display: none; position: relative; left: 0; transform: none; opacity: 1; padding: 1.8rem 0 2rem 0; box-shadow: none; background: none; } .header-N1 .header-gnbitem.item-active .header-gnblink { border-bottom: 1px solid var(--black); } .header-N1 .header-subitem { width: 100%; } .header-N1 .header-subitem + .header-subitem { padding-top: 0.8rem; } .header-N1 .header-sublink { padding: 0; color: rgba(var(--black-rgb), 0.5); } .header-N1 .header-sublink:active { color: var(--black); } .header-N1 .header-sublink:hover { background: none; color: var(--black); } .header-N1 .header-right button, .header-N1 .header-utils .member a { width: 2.8rem; height: 2.8rem; } .header-N1 .header-utils > ul > li { margin-left: 0.6rem; } .header-N1 .header-utils .btn-allmenu { display: none; } .header-N1 .header-utils .button .btnset { white-space: nowrap; } .header-N1 .btn-momenu { display: flex; flex-direction: column; justify-content: center; gap: 0.6rem; margin-left: 0.6rem; } .header-N1 .btn-momenu .ico-hamburger { width: 2rem; } .header-N1 .btn-momenu .ico-hamburger:nth-child(2) { width: 1.2rem; } .header-N1.block-active .header-center { pointer-events: auto; } .header-N1.block-active .header-title { height: 6rem; display: flex; align-items: center; } .header-N1.block-active .header-gnblist { opacity: 1; visibility: visible; } .header-N1 .header-gnbitem:has(.header-subitem) .header-gnblink::after { content: ""; display: flex; width: 1.6rem; height: 1.6rem; background-image: url("/api/t-a/159/1762135200/resources/icons/ico_downarrow_black.svg"); background-repeat: no-repeat; background-position: center right; background-size: cover; transition: transform 0.3s; will-change: transform; } .header-N1.block-active .header-gnblink { align-items: center; justify-content: space-between; } .header-N1.block-active .header-gnbitem.item-active .header-gnblink::after { content: ""; transform: rotate(180deg); } .header-N1.block-active .btn-momenu .ico-hamburger:nth-child(1) { transform: translateY(0.8rem) rotate(45deg); } .header-N1.block-active .btn-momenu .ico-hamburger:nth-child(3) { transform: translateY(-0.8rem) rotate(-45deg); } .header-N1.block-active .btn-momenu .ico-hamburger:nth-child(2) { opacity: 0; visibility: hidden; } .header-N1 .header-fullmenu { display: none; } }
```

### 헤더 JavaScript 고정 코드 (전체 필수)

```javascript
(function () { $(function () { $(".header-N1").each(function () { const $block = $(this); let isMobileMenuInitialized = false; let isDesktopMenuInitialized = false; // 모바일 메뉴 초기화 function initMobileMenu() { if (isMobileMenuInitialized) return; const $btnMomenu = $block.find(".btn-momenu"); $btnMomenu.off("click").on("click", function () { $block.toggleClass("block-active"); $block.find(".header-gnbitem").removeClass("item-active"); $block.find(".header-sublist").removeAttr("style"); }); $block.find(".header-gnbitem").each(function () { const $this = $(this); const $thisLink = $this.find(".header-gnblink"); const $sublist = $this.find(".header-sublist"); if ($sublist.length) { $thisLink.off("click").on("click", function (event) { event.preventDefault(); const $clickedItem = $(this).closest(".header-gnbitem"); if (!$clickedItem.hasClass("item-active")) { $block.find(".header-gnbitem").removeClass("item-active"); $block.find(".header-sublist").stop().slideUp(300); } $clickedItem.toggleClass("item-active"); $sublist.stop().slideToggle(300); }); } }); isMobileMenuInitialized = true; } // 데스크탑 메뉴 초기화 function initDesktopMenu() { if (isDesktopMenuInitialized) return; $block.find(".header-gnbitem .header-gnblink").off("click"); isDesktopMenuInitialized = true; } // 해상도에 따른 메뉴 처리 function handleResize() { if (window.innerWidth <= 992) { if (!isMobileMenuInitialized) initMobileMenu(); isDesktopMenuInitialized = false; } else { if (!isDesktopMenuInitialized) initDesktopMenu(); isMobileMenuInitialized = false; } } // 스크롤 시 메뉴 처리 function handleScroll() { const $headerTop = $block.find(".header-top"); if ($headerTop.length) $block.addClass("top-menu-active"); if ($(window).scrollTop() === 0) $block.addClass("header-top-active"); $(window).on("scroll", function () { if ($(window).scrollTop() > 0) { $block.removeClass("header-top-active"); } else { $block.addClass("header-top-active"); } }); } handleScroll(); // 전체 메뉴 열기/닫기 처리 function handleFullMenu() { $block.find(".btn-allmenu").on("click", function () { $block.find(".header-fullmenu").addClass("fullmenu-active"); }); $block.find(".fullmenu-close").on("click", function () { $block.find(".header-fullmenu").removeClass("fullmenu-active"); }); $block.find(".fullmenu-gnbitem").each(function () { const $this = $(this); $this.on("mouseover", function () { if (window.innerWidth > 992) { $this.find(".fullmenu-gnblink").addClass("on"); } }); $this.on("mouseout", function () { if (window.innerWidth > 992) { $this.find(".fullmenu-gnblink").removeClass("on"); } }); }); } handleFullMenu(); // 리사이즈 시마다 메뉴 동작 초기화 $(window).on("resize", handleResize); handleResize(); }); }); })();
```

---

## 푸터 블록 생성

### 푸터 HTML 구조

```html
<div class="footer-N1">
  <div class="footer-container container-lg">
    <div class="footer-top">
      <h2 class="footer-logo">
        <a href="javascript:void(0);">
          <img src="https://temha.io/api/t-a/57/1762488000/resources/images/img_logo_white.png" alt="로고" />
        </a>
      </h2>
      <ul class="footer-menulist">
        <li class="footer-menulink">
          <a href="javascript:void(0);">
            <span>회사소개</span>
          </a>
        </li>
        <li class="footer-menulink">
          <a href="javascript:void(0);">
            <span>서비스</span>
          </a>
        </li>
        <li class="footer-menulink">
          <a href="javascript:void(0);">
            <span>문의하기</span>
          </a>
        </li>
      </ul>
      <ul class="footer-snslist">
        <li class="footer-snsitem">
          <a class="footer-snslink" href="javascript:void(0)">
            <img src="https://temha.io/api/t-a/57/1762488000/resources/icons/ico_instagram_lightgrey.svg" alt="인스타그램">
          </a>
        </li>
      </ul>
    </div>
    <div class="footer-bottom">
      <address class="footer-txt">
        <p class="p2">서울시 금천구 벚꽃로36길 30 가산KS타워 1409호</p>
        <p>
          <span class="p2">T. 070-8872-8874</span>
          <span class="p2">E. help@example.com</span>
        </p>
      </address>
      <div class="footer-txt">
        <p class="p2">© 2025 Company Name. All rights reserved.</p>
      </div>
    </div>
  </div>
</div>
```

### 푸터 CSS 고정 코드 (전체 필수)

```css
.footer-N1 { position: relative; background: #111; padding-top: 2.4rem; padding-bottom: 2.4rem; overflow: hidden; } .footer-N1 .footer-container { display: flex; flex-direction: column; } .footer-N1 .footer-top { display: flex; justify-content: space-between; position: relative; margin-bottom: 1.6rem; } .footer-N1 .footer-logo { text-align: center; margin-bottom: 0; } .footer-N1 .footer-logo a { display: block; height: 3.3rem; } .footer-N1 .footer-logo img { height: 100%; object-fit: contain; } .footer-N1 .footer-menulist { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: var(--fs-p2); list-style: none; padding: 0; margin: 0; } .footer-N1 .footer-menulink a { padding-right: 1.2rem; color: var(--white); text-decoration: none; transition: color 0.3s; } .footer-N1 .footer-menulink a:hover { color: rgba(var(--white-rgb), 0.8); } .footer-N1 .footer-menulink + .footer-menulink a { padding-left: 1.2rem; } .footer-N1 .footer-menulink { position: relative; } .footer-N1 .footer-menulink + .footer-menulink::after { content: ""; position: absolute; top: 50%; left: 0; transform: translateY(-50%); width: 1px; height: 1.4rem; background: rgba(var(--white-rgb), 0.1); } .footer-N1 .footer-snslist { display: flex; align-items: center; list-style: none; padding: 0; margin: 0; } .footer-N1 .footer-snsitem + .footer-snsitem { margin-left: 0.8rem; } .footer-N1 .footer-snslink { width: 3.6rem; height: 3.6rem; padding: 0.6rem; display: block; } .footer-N1 .footer-snslink img { width: 100%; height: 100%; object-fit: cover; vertical-align: top; } .footer-N1 .footer-bottom { padding-top: 2.4rem; border-top: 1px solid rgba(255, 255, 255, 0.1); } .footer-N1 .footer-txt { display: flex; justify-content: center; color: var(--text-color3); } .footer-N1 .footer-txt + .footer-txt { margin-top: 0.3rem; } .footer-N1 .footer-txt p, .footer-N1 .footer-txt span { margin-bottom: 0; color: var(--text-color3); } .footer-N1 .footer-txt p + p { margin-left: 0.8rem; } .footer-N1 .footer-txt p span + span { margin-left: 0.8rem; } .footer-N1 address { font-style: normal; } @media (max-width: 992px) { .footer-N1 { padding-top: 4rem; padding-bottom: 4rem; } .footer-N1 .footer-top { margin-bottom: 0; flex-direction: column; align-items: flex-start; } .footer-N1 .footer-logo a { height: 2.6rem; } .footer-N1 .footer-menulist { justify-content: flex-start; position: relative; left: 0; transform: translate(0); margin-top: 1.3rem; } .footer-N1 .footer-menulink a { padding-right: 0.8rem; } .footer-N1 .footer-menulink + .footer-menulink a { padding-left: 0.8rem; } .footer-N1 .footer-snslist { margin: 2.4rem 0 1.6rem 0; justify-content: center; } .footer-N1 .footer-bottom { text-align: left; } .footer-N1 .footer-txt { flex-direction: column; } .footer-N1 .footer-txt p + p { margin-left: 0; } .footer-N1 .footer-txt + .footer-txt { margin-top: 0.6rem; } } @media (max-width: 375px) { .footer-N1 .footer-menulist { justify-content: flex-start; overflow-x: auto; } .footer-N1 .footer-menulink { flex-shrink: 0; } }
```

### 푸터 JavaScript

푸터는 JavaScript가 필요하지 않습니다. `js` 파라미터를 전달하지 않거나 빈 문자열(`""`)로 전달합니다.

---

## 사용 가능한 버튼 스타일 리스트

### 기본 클래스
- `btnset` (필수)

### 색상 변형 클래스
- **Solid 스타일**: `btnset-primary`, `btnset-secondary`, `btnset-dark`, `btnset-light`, `btnset-link`
- **Line 스타일**: `btnset-line-primary`, `btnset-line-secondary`, `btnset-line-dark`, `btnset-line-white`, `btnset-line-light`
- **Blur 스타일**: `btnset-blur-white`, `btnset-blur-black`

### 크기 클래스
- `btnset-lg` (대형)
- `btnset-sm` (소형)
- 기본값 (중형, 클래스 없음)

### 모양 클래스
- `btnset-round` (라운드)
- `btnset-block` (블록)
- `btnset-icon` (아이콘)

**절대 필수**: 위 리스트에 명시된 버튼 클래스만 사용 가능합니다. 리스트에 없는 버튼 클래스를 사용하는 것은 절대 금지됩니다.

---

## 사용 가능한 아이콘 리스트

아이콘은 `ff-ico` 클래스와 함께 사용합니다. 예: `<i class="ff-ico ti-search"></i>`

다음 아이콘만 사용 가능합니다:

'ti-x', 'ti-x-sm', 'ti-plus', 'ti-minus', 'ti-plus-circle', 'ti-minus-circle', 'ti-zoom-in', 'ti-zoom-out', 'ti-x-rect', 'ti-x-rect-sm', 'ti-plus-rect', 'ti-minus-rect', 'ti-plus-rect-circle', 'ti-minus-rect-circle', 'ti-chevron-left', 'ti-chevron-right', 'ti-chevron-up', 'ti-chevron-down', 'ti-chevrons-left', 'ti-chevrons-right', 'ti-chevrons-up', 'ti-chevrons-down', 'ti-caret-left', 'ti-caret-right', 'ti-caret-up', 'ti-caret-down', 'ti-arrow-left', 'ti-arrow-right', 'ti-arrow-up', 'ti-arrow-down', 'ti-arrow-down-left', 'ti-arrow-down-right', 'ti-arrow-up-left', 'ti-arrow-up-right', 'ti-arrow-circle-left', 'ti-arrow-circle-right', 'ti-arrow-circle-up', 'ti-arrow-circle-down', 'ti-arrow2-circle-left', 'ti-arrow2-circle-right', 'ti-arrow2-circle-up', 'ti-arrow2-circle-down', 'ti-arrow-turn-left', 'ti-arrow-turn-right', 'ti-tailed-arrow-left', 'ti-tailed-arrow-right', 'ti-tailed-arrow-left-fill', 'ti-tailed-arrow-right-fill', 'ti-tailed-arrow-left-sm', 'ti-tailed-arrow-right-sm', 'ti-tailed-arrow-left-sm-fill', 'ti-tailed-arrow-right-sm-fill', 'ti-filter-arrow', 'ti-filter-arrow2', 'ti-chevron-rect-left', 'ti-chevron-rect-right', 'ti-chevron-rect-up', 'ti-chevron-rect-down', 'ti-chevron-rect-left-sm', 'ti-chevron-rect-right-sm', 'ti-chevron-rect-up-sm', 'ti-chevron-rect-down-sm', 'ti-chevrons-rect-left', 'ti-chevrons-rect-right', 'ti-chevrons-rect-down', 'ti-caret-rect-left', 'ti-caret-rect-right', 'ti-caret-rect-up', 'ti-caret-rect-down', 'ti-arrow-rect-left', 'ti-arrow-rect-right', 'ti-arrow-rect-up', 'ti-arrow-rect-down', 'ti-half-arrow-rect-left', 'ti-half-arrow-rect-right', 'ti-arrow-circle-rect-left', 'ti-arrow-circle-rect-right', 'ti-arrow-circle-rect-up', 'ti-arrow-circle-rect-down', 'ti-carets-circle-rect-left', 'ti-carets-circle-rect-right', 'ti-arrow-left-circle-fill', 'ti-arrow-right-circle-fill', 'ti-arrow-up-circle-fill', 'ti-chevrons-down-circle-fill', 'ti-chevrons-left-circle-fill', 'ti-chevrons-right-circle-fill', 'ti-check', 'ti-check-sm', 'ti-check-xs', 'ti-check2', 'ti-check-circle', 'ti-check-circle2', 'ti-check-box', 'ti-check-box2', 'ti-circle-fill', 'ti-circle-line', 'ti-circle-line2', 'ti-check-rect', 'ti-check-rect-sm', 'ti-check-rect-xs', 'ti-check-rect-circle', 'ti-check-square', 'ti-check-square2', 'ti-check-circle-fill', 'ti-check-square-fill', 'ti-justify', 'ti-justify-left', 'ti-justify-right', 'ti-justify2-left', 'ti-justify2-right', 'ti-justify-center', 'ti-dots', 'ti-dots-vertical', 'ti-grip-dots', 'ti-grip-dots-vertical', 'ti-dots-sm', 'ti-dots-vertical-sm', 'ti-grip-dots-sm', 'ti-grip-dots-vertical-sm', 'ti-grid', 'ti-grid2', 'ti-justify-rect', 'ti-justify-rect-left', 'ti-justify-rect-right', 'ti-justify2-rect-left', 'ti-justify2-rect-right', 'ti-justify-rect-center', 'ti-grid-rect', 'ti-grid-fill', 'ti-play', 'ti-pause', 'ti-play-fill', 'ti-pause-fill', 'ti-play-fill-sm', 'ti-pause-fill-sm', 'ti-pause-circle', 'ti-play-circle', 'ti-skip-start', 'ti-skip-end', 'ti-play-rect', 'ti-pause-rect', 'ti-play-rect-sm', 'ti-pause-rect-sm', 'ti-play-circle-rect', 'ti-pause-circle-rect', 'ti-skip-start-rect', 'ti-play2-fill', 'ti-pause2-fill', 'ti-play-circle-fill', 'ti-pause-circle-fill', 'ti-skip-end-fill', 'ti-skip-start-fill', 'ti-arrow-repeat', 'ti-half-arrow-repeat', 'ti-arrow-rotate-left', 'ti-arrow-rotate-right', 'ti-camera', 'ti-camera2', 'ti-camera-off', 'ti-image', 'ti-image2', 'ti-video', 'ti-video-off', 'ti-camera-rect', 'ti-camera-off-rect', 'ti-image-rect', 'ti-video-rect', 'ti-video2-rect', 'ti-film-rect', 'ti-video-fill', 'ti-film-fill', 'ti-fullscreen-rect', 'ti-fullscreen-fill', 'ti-user', 'ti-user2', 'ti-user3', 'ti-user4', 'ti-user5', 'ti-user6', 'ti-license', 'ti-user-rect', 'ti-user-fill', 'ti-search', 'ti-search2', 'ti-bell', 'ti-bell-on', 'ti-bell-off', 'ti-bell2', 'ti-bell3', 'ti-bell3-on', 'ti-bell3-off', 'ti-bell4', 'ti-volume', 'ti-volume-up', 'ti-volume-mute', 'ti-volume2', 'ti-volume2-mute', 'ti-megaphone', 'ti-megaphone2', 'ti-megaphone3', 'ti-filter-bar-vertical', 'ti-filter-bar-vertical2', 'ti-filter-bar-vertical3', 'ti-speaker', 'ti-speaker2', 'ti-bell-rect', 'ti-bell2-rect', 'ti-volume-rect', 'ti-volume-up-rect', 'ti-volume-mute-rect', 'ti-bell-fill', 'ti-bell-off-fill', 'ti-megaphone-fill', 'ti-filter-bar-vertical2-fill', 'ti-calendar', 'ti-calendar-check', 'ti-calendar-check2', 'ti-calendar-dot', 'ti-calendar-number', 'ti-clock', 'ti-clock2', 'ti-clock3', 'ti-calendar-rect', 'ti-clock-rect', 'ti-clock2-rect', 'ti-clock-fill', 'ti-house', 'ti-house2', 'ti-house3', 'ti-house4', 'ti-house-rect', 'ti-house2-rect', 'ti-house3-rect', 'ti-house4-rect', 'ti-house-fill', 'ti-house2-fill', 'ti-mail', 'ti-mail-open', 'ti-mail2', 'ti-mail2-open', 'ti-mail-paper', 'ti-page', 'ti-page-error', 'ti-page-down', 'ti-page2', 'ti-page2-error', 'ti-page2-down', 'ti-page-rect', 'ti-page2-rect', 'ti-page3-rect', 'ti-page4-rect', 'ti-page5-rect', 'ti-page-long-rect', 'ti-pages-rect', 'ti-page-fill', 'ti-page-long-fill', 'ti-copy-fill', 'ti-credit-card', 'ti-credit2-card', 'ti-dollar', 'ti-won', 'ti-coins', 'ti-wallet', 'ti-wallet2', 'ti-credit-card-rect', 'ti-credit-card2-rect', 'ti-credit-card-fill', 'ti-credit-card2-fill', 'ti-coins-fill', 'ti-bag', 'ti-bag2', 'ti-bag3', 'ti-cart', 'ti-cart2', 'ti-cart3', 'ti-bag-rect', 'ti-bag-fill', 'ti-cart-fill', 'ti-truck', 'ti-truck2', 'ti-truck3', 'ti-bus', 'ti-subway', 'ti-car', 'ti-airplane', 'ti-rocket', 'ti-send', 'ti-robot', 'ti-airplane-fill', 'ti-box', 'ti-gift', 'ti-gift2', 'ti-firecracker', 'ti-cake', 'ti-tag', 'ti-tag-fill', 'ti-ticket', 'ti-ticket2', 'ti-beer', 'ti-coffee', 'ti-wine-rect', 'ti-wine2-rect', 'ti-umbrella-beach-rect', 'ti-archive', 'ti-archive2', 'ti-archive-fill', 'ti-archive2-fill', 'ti-folder', 'ti-folder2', 'ti-folder2-minus', 'ti-folder2-minus-open', 'ti-folder2-plus', 'ti-folder2-check', 'ti-folder3', 'ti-folders', 'ti-paperclip', 'ti-link', 'ti-copy', 'ti-copy2', 'ti-copy3', 'ti-floppy', 'ti-folder-rect', 'ti-folder-minus-rect', 'ti-folder2-rect', 'ti-folders-rect', 'ti-download-folder', 'ti-upload-folder', 'ti-floppy-rect', 'ti-floppy2-rect', 'ti-folder-fill', 'ti-folder2-fill', 'ti-folders-fill', 'ti-floppy-fill', 'ti-download', 'ti-upload', 'ti-download2', 'ti-upload2', 'ti-download-line', 'ti-upload-line', 'ti-download-cloud', 'ti-upload-cloud', 'ti-download-rect', 'ti-upload-rect', 'ti-download-box-rect', 'ti-upload-box-rect', 'ti-download-box-fill', 'ti-upload-box-fill', 'ti-pc', 'ti-pc2', 'ti-tablet', 'ti-mobile', 'ti-mobile2', 'ti-tv', 'ti-pc-rect', 'ti-tablet-rect', 'ti-mobile-rect', 'ti-tv-fill', 'ti-pc-fill', 'ti-tablet-fill', 'ti-mobile-fill', 'ti-trash', 'ti-trash2', 'ti-trash3', 'ti-trash4', 'ti-trash5', 'ti-trash6', 'ti-trash7', 'ti-trash-rect', 'ti-trash-fill', 'ti-trash2-fill', 'ti-power', 'ti-login', 'ti-logout', 'ti-login-box', 'ti-logout-box', 'ti-login-box2', 'ti-logout-box2', 'ti-login-circle', 'ti-logout-circle', 'ti-login-rect', 'ti-logout-rect', 'ti-pen', 'ti-pen2', 'ti-pen-write', 'ti-pen-write2', 'ti-pen-write3', 'ti-pen-box', 'ti-pen-box-rect', 'ti-pen-fill', 'ti-pen2-fill', 'ti-pen3-fill', 'ti-pen4-fill', 'ti-pen-box-fill', 'ti-book', 'ti-book2', 'ti-book-open', 'ti-book-open2', 'ti-book-open3', 'ti-map', 'ti-magic', 'ti-magic-fill', 'ti-book-rect', 'ti-book-open-rect', 'ti-map-rect', 'ti-location', 'ti-location2', 'ti-location3', 'ti-location4', 'ti-map-location', 'ti-route', 'ti-route2', 'ti-route3', 'ti-location-rect', 'ti-location-fill', 'ti-parking-fill', 'ti-bookmark', 'ti-bookmark-fill', 'ti-bookmark2', 'ti-bookmark2-fill', 'ti-bookmark3', 'ti-bookmark3-fill', 'ti-bookmark-check', 'ti-bookmark-check-fill', 'ti-pin', 'ti-pin-fill', 'ti-pin-angle', 'ti-pin-angle-fill', 'ti-bookmark-rect', 'ti-bookmark-fill-rect', 'ti-pin-rect', 'ti-pin-rect-fill', 'ti-cloud', 'ti-heart', 'ti-heart-fill', 'ti-heart2', 'ti-heart2-fill', 'ti-moon', 'ti-moon-fill', 'ti-star', 'ti-star-fill', 'ti-star-rect', 'ti-star-rect-fill', 'ti-trophy', 'ti-medal', 'ti-badge', 'ti-badge2', 'ti-badge3', 'ti-trophy-rect', 'ti-trophy-rect-fill', 'ti-crown-rect', 'ti-crown-rect-fill', 'ti-gem-rect', 'ti-wifi', 'ti-bluetooth', 'ti-bluetooth-rect', 'ti-eye', 'ti-eye-slash', 'ti-lock', 'ti-unlock', 'ti-lock2', 'ti-unlock2', 'ti-lock3', 'ti-unlock3', 'ti-lock4', 'ti-unlock4', 'ti-eye-rect', 'ti-eye-slash-rect', 'ti-lock-rect', 'ti-unlock-rect', 'ti-eye-fill', 'ti-eye-slash-fill', 'ti-lock-fill', 'ti-unlock-fill', 'ti-lock2-fill', 'ti-unlock2-fill', 'ti-faceid', 'ti-fingerprint', 'ti-fingerprint2', 'ti-fingerprint3', 'ti-gear', 'ti-wrench', 'ti-gear-rect', 'ti-drill-rect', 'ti-question-circle', 'ti-exclamation-circle', 'ti-exclamation-triangle', 'ti-siren', 'ti-exclamation', 'ti-question', 'ti-question-circle-rect', 'ti-exclamation-rect', 'ti-filter', 'ti-filter2', 'ti-filter3', 'ti-filter4', 'ti-filter-bar', 'ti-filter-bar2', 'ti-filter-bar3', 'ti-filter-bar4', 'ti-filter-rect', 'ti-filter2-rect', 'ti-filter-fill', 'ti-filter2-fill', 'ti-filter-bar-fill', 'ti-filter-bar2-fill', 'ti-filter-bar3-fill', 'ti-filter-bar4-fill', 'ti-filter-bar-vertical-fill', 'ti-share', 'ti-share2', 'ti-tel', 'ti-tel2', 'ti-tel3', 'ti-headset', 'ti-headset2', 'ti-headset3', 'ti-headset-rect', 'ti-tel-fill', 'ti-tel2-fill', 'ti-headset-fill', 'ti-chat', 'ti-chat2', 'ti-chat-dot', 'ti-chat-square', 'ti-chat-square2', 'ti-chat-square-text', 'ti-chat-square-dot', 'ti-chat-square-dot2', 'ti-chats', 'ti-chat-fill', 'ti-chat2-fill', 'ti-chat-dot-fill', 'ti-chat-square-dot-fill', 'ti-quote-left', 'ti-quote-right', 'ti-quote-left-rect', 'ti-quote-right-rect', 'ti-microphone', 'ti-microphone2', 'ti-microphone-rect', 'ti-microphone-fill', 'ti-printer', 'ti-printer2', 'ti-medical', 'ti-kit-medical', 'ti-pill', 'ti-medical-notes', 'ti-tooth', 'ti-syringe-rect', 'ti-pill-fill', 'ti-medical-notes-fill', 'ti-kit-medical-fill', 'ti-school-rect', 'ti-mortarboard-rect', 'ti-presentation-rect', 'ti-global', 'ti-lightbulb', 'ti-lightbulb-fill', 'ti-lightbulb2', 'ti-lightbulb2-fill', 'ti-loader', 'ti-loader2', 'ti-goal', 'ti-flag', 'ti-chart-rect', 'ti-chart-rect-fill', 'ti-hole', 'ti-brush', 'ti-brush-fill', 'ti-shop', 'ti-buildings', 'ti-briefcase', 'ti-briefcase2', 'ti-briefcase3', 'ti-briefcase-fill', 'ti-briefcase2-fill', 'ti-briefcase3-fill', 'ti-layer', 'ti-layer-fill', 'ti-thumbs-up', 'ti-thumbs-down', 'ti-thumbs-up-fill', 'ti-thumbs-down-fill', 'ti-mouse', 'ti-touch', 'ti-drag', 'ti-mouse-fill', 'ti-list', 'ti-list2', 'ti-check-list', 'ti-list-rect', 'ti-list2-rect', 'ti-check-list-rect', 'ti-scissors', 'ti-scissors2', 'ti-code', 'ti-code-rect', 'ti-shield', 'ti-shield-plus', 'ti-shield-x', 'ti-shield-check', 'ti-shield-fill', 'ti-shield-plus-fill', 'ti-shield-x-fill', 'ti-shield-check-fill', 'ti-sns-temha'

**절대 필수**: 위 리스트에 명시된 아이콘만 사용 가능합니다. 리스트에 없는 아이콘 클래스를 사용하는 것은 절대 금지됩니다.

---

## 컴포넌트별 HTML 구조 예시

### Inputset (텍스트 입력)

```html
<div class="form-box">
  <div class="inputset inputset-line">
    <label for="inputset-1" class="form-tit h6 blind">텍스트 <span>*</span></label>
    <input id="inputset-1" type="text" name="텍스트" class="inputset-input form-control" placeholder="내용을 입력하세요." required />
  </div>
</div>
```

**스타일 변형**: `inputset`, `inputset-line`, `inputset-round`, `inputset-floating`, `inputset-icon`, `inputset-password`, `inputset-time`, `inputset-date`, `inputset-danger`, `inputset-warning`, `inputset-success`
**크기**: `inputset-sm`, `inputset-lg`

### Textarea (멀티라인 텍스트)

```html
<div class="form-box">
  <div class="inputset inputset-line">
    <label for="textarea-1" class="form-tit h6">문의 내용 <span>*</span></label>
    <textarea id="textarea-1" name="문의 내용" class="inputset-textarea form-control" placeholder="문의 내용을 입력해주세요." required></textarea>
  </div>
</div>
```

### Selectset (드롭다운)

```html
<div class="form-box">
  <label for="selectset-1" class="form-tit h6 blind">셀렉트 박스</label>
  <div class="selectset">
    <select id="selectset-1" class="selectset-select">
      <option selected hidden>선택하세요</option>
      <option value="옵션1">옵션1</option>
    </select>
    <span class="selectset-arrow"></span>
  </div>
</div>
```

**스타일 변형**: `selectset`, `selectset-line`, `selectset-round`
**크기**: `selectset-sm`, `selectset-lg`

**커스텀형**:
```html
<div class="selectset">
  <div class="selectset-area">
    <button class="selectset-toggle btn" type="button"><span>셀렉트 박스</span></button>
    <ul class="selectset-list">
      <li class="selectset-item">
        <button class="selectset-link btn" type="button" data-value="옵션1"><span>옵션1</span></button>
      </li>
    </ul>
  </div>
</div>
```

### Fileset (파일 업로드)

```html
<div class="form-box">
  <div class="fileset fileset-lg">
    <legend class="form-tit h6">첨부 파일 (선택사항)</legend>
    <div class="fileset-body">
      <label for="file-input" class="fileset-label">
        <div class="fileset-group">
          <input id="file-input" type="file" class="fileset-input" />
          <button class="fileset-cancel" aria-label="파일 삭제"></button>
        </div>
        <span class="btnset btnset-primary btnset-lg fileset-upload" role="button">파일 첨부하기</span>
      </label>
    </div>
  </div>
</div>
```

**크기**: `fileset-sm`, `fileset-lg`

### Btnset (버튼)

```html
<a href="javascript:void(0);" class="btnset btnset-primary">Primary</a>
<button type="button" class="btnset btnset-line-primary">Line Primary</button>
<a href="javascript:void(0);" class="btnset btnset-primary btnset-lg">Large</a>
```

**허용된 클래스만 사용**: 위 "사용 가능한 버튼 스타일 리스트" 섹션 참조

### Checkset (체크박스)

```html
<div class="form-box">
  <div class="checkset checkset-fill">
    <input id="checkset-1" name="체크박스" class="checkset-input" type="checkbox" value="옵션1" />
    <label for="checkset-1" class="checkset-label">옵션1</label>
  </div>
</div>
```

**스타일 변형**: `checkset-fill`, `checkset-line`, `checkset-fill-round`, `checkset-line-round`, `checkset-thumb`
**크기**: `checkset-sm`, `checkset-lg`

**Thumb 스타일 세부 변형**:
- `checkset-thumb thumb-fill` (채워진 버튼)
- `checkset-thumb thumb-line` (라인 버튼)
- `checkset-thumb thumb-fill thumb-round` (라운드 버튼)
- `checkset-thumb thumb-fill thumb-icon` (아이콘 버튼)
- `checkset-thumb thumb-fill thumb-basic-icon` (기본 아이콘 버튼)

### Radioset (라디오 버튼)

```html
<div class="form-box">
  <div class="radioset radioset-fill">
    <input id="radioset-1" name="radio-group" class="radioset-input" type="radio" value="옵션1" checked />
    <label for="radioset-1" class="radioset-label">옵션1</label>
  </div>
</div>
```

**스타일 변형**: `radioset-fill`, `radioset-line`, `radioset-fill-round`, `radioset-line-round`, `radioset-thumb`
**크기**: `radioset-sm`, `radioset-lg`

**Thumb 스타일 세부 변형**:
- `radioset-thumb thumb-fill` (채워진 버튼)
- `radioset-thumb thumb-line` (라인 버튼)
- `radioset-thumb thumb-fill thumb-round` (라운드 버튼)
- `radioset-thumb thumb-fill thumb-icon` (아이콘 버튼)
- `radioset-thumb thumb-fill thumb-basic-icon` (기본 아이콘 버튼)

### Switchset (토글 스위치)

```html
<div class="switchset switchset-type1">
  <label class="switchset-label">
    <input class="switchset-input visually-hidden" type="checkbox" role="switch" aria-label="선택" value />
    <span class="switchset-bg"></span>
    <span class="switchset-thumb"></span>
  </label>
  <span class="switchset-tit">기본형 스위치 버튼 : 타입1</span>
</div>
```

**타입 변형**: `switchset-type1`, `switchset-type2`, `switchset-type3`
**크기**: `switchset-sm`, `switchset-lg`

### Dropset (드롭다운 메뉴)

```html
<div class="dropset dropset-relax">
  <div class="dropset-area">
    <button class="dropset-toggle btn" type="button">
      <span>드롭다운</span>
    </button>
    <ul class="dropset-list">
      <li class="dropset-item">
        <a class="dropset-link btn" href="javascript:void(0)">
          <span>템플릿1</span>
        </a>
      </li>
    </ul>
  </div>
</div>
```

**스타일 변형**: `dropset-relax`, `dropset-solid`, `dropset-narrow`
**크기**: `dropset-xl`, `dropset-lg`, `dropset-sm`
**색상 변형**: `btn-primary`, `btn-secondary`, `btn-dark` (dropset-toggle, dropset-link에 적용)

### Tabset (탭)

```html
<div class="tabset tabset-solid">
  <ul class="tabset-list tabset-lg">
    <li class="tabset-item">
      <a class="tabset-link active" href="javascript:void(0)"><span>Link</span></a>
    </li>
  </ul>
</div>
```

**스타일 변형**: `tabset-solid`, `tabset-fluid`, `tabset-text`, `tabset-brick`, `tabset-round`, `tabset-panel`
**리스트 스타일**: `tabset-fill`, `tabset-line` (tabset-list에 적용)
**크기**: `tabset-lg`, `tabset-sm`

**패널형 구조**:
```html
<div class="tabset tabset-panel">
  <ul class="tabset-list tabset-lg">
    <li class="tabset-item">
      <a class="tabset-link active" href="javascript:void(0)"><span>Link</span></a>
    </li>
  </ul>
  <div class="tabset-container">
    <div class="tabset-cont active">내용 1</div>
    <div class="tabset-cont">내용 2</div>
  </div>
</div>
```

### Cardset (카드)

```html
<div class="cardset">
  <figure class="cardset-figure">
    <img class="cardset-img" src="이미지경로" alt="이미지">
  </figure>
  <div class="cardset-body">
    <h5 class="cardset-tit h5">제목</h5>
    <p class="cardset-desc">설명</p>
    <p class="cardset-txt p2">2000-01-01</p>
  </div>
</div>
```

**스타일 변형**: `cardset`, `cardset-border`, `cardset-round`, `cardset-hor`, `cardset-overlap`, `cardset-hover`, `cardset-user`, `cardset-sns`

**구조 요소**:
- 기본: `cardset-figure`, `cardset-img`, `cardset-body`, `cardset-tit`, `cardset-desc`, `cardset-txt`
- 추가: `cardset-cont`, `cardset-profile`, `cardset-header`, `cardset-footer`
- 오버랩 위치: `body-top`, `body-bottom`
- 오버랩 색상: `body-dark`, `body-light`
- 콘텐츠 배경: `cont-primary`, `cont-secondary`

### Tableset (테이블)

```html
<div class="tableset tableset-border tableset-divider">
  <div class="tableset-inner">
    <table class="tableset-table table">
      <colgroup>
        <col class="width-200" />
        <col />
      </colgroup>
      <thead class="thead-light thead-border-top">
        <tr>
          <th scope="col">제목</th>
          <th scope="col">제목</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>내용</td>
          <td>내용입니다.</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

**스타일 변형**: `tableset`, `tableset-border`, `tableset-divider`, `tableset-stripe`, `tableset-round`
**헤더 스타일**: `thead-light`, `thead-dark`, `thead-border-top`, `thead-border-bottom`
**바디 스타일**: `tbody-bottom-border`, `tbody-bottom-borderless`
**정렬 옵션**: `tableset-center`, `tableset-valign-top`, `tableset-valign-bottom`

### Badge (뱃지/라벨)

```html
<!-- 텍스트 배지 -->
<h2 class="textset-tit h2">제목 <span class="textset-badge h2">New</span></h2>

<!-- 기본 배지 -->
<span class="p2 badge badge-primary">텍스트배지</span>
```

**색상**: `badge-primary`, `badge-danger`, `badge-success`, `badge-mono`, `badge-navy`, `badge-orange`, `badge-violet`, `badge-red`
**라인 스타일**: `badge-line`, `badge-line-primary`, `badge-line-danger`, `badge-line-mono`, `badge-line-violet`, `badge-line-success`, `badge-line-orange`, `badge-line-navy`
**모양**: `badge-round`, `badge-circle`, `badge-circle-border`
**위치**: `badge-top-right`, `badge-top-left`, `badge-position`
**텍스트 배지**: `textset-badge` (텍스트와 함께 사용)
**버튼 배지**: `btnset-badge` (버튼과 함께 사용)

### Toastset (토스트 알림)

```html
<div class="toastset">
  <div class="toastset-header">
    <h2 class="p2 toastset-tit">제목</h2>
    <button type="button" class="toastset-close"></button>
  </div>
  <div class="toastset-body">
    <p class="p2 toastset-desc">내용</p>
  </div>
</div>
```

**타입**: `toastset-alert`, `toastset-message`
**상태**: `toastset-success`, `toastset-warning`, `toastset-error`
**투명도**: `toastset-opacity`
**위치**: `toastset-center`, `toastset-bottom-right`, `toastset-top-left`

**알림형 구조** (toastset-alert):
```html
<div class="toastset toastset-alert">
  <div class="toastset-body">
    <span class="toastset-icon ff-ico ti-check-circle"></span>
    <div class="toastset-group">
      <h2 class="p2 toastset-tit">제목</h2>
      <p class="p2 toastset-desc">내용</p>
    </div>
  </div>
</div>
```

### Tooltipset (툴팁)

```html
<button class="btnset btnset-line-primary btn-tooltipset" data-tooltip-type="guide" data-tooltip-color="default" data-tooltip-place="top" data-tooltip-title="제목" data-tooltip-text="내용">버튼</button>
```

**타입**: `data-tooltip-type="guide"`, `data-tooltip-type="name"`, `data-tooltip-type="bubble"`
**색상**: `data-tooltip-color="default"`, `data-tooltip-color="bg"`, `data-tooltip-color="line"`, `data-tooltip-color="dark"`
**위치**: `data-tooltip-place="top"`, `data-tooltip-place="bottom"`, `data-tooltip-place="left"`, `data-tooltip-place="right"`

### Pagiset (페이지네이션)

```html
<nav class="pagiset">
  <div class="pagiset-ctrl">
    <a class="pagiset-link pagiset-first" href="javascript:void(0)"><span class="visually-hidden">처음</span></a>
  </div>
  <div class="pagiset-ctrl">
    <a class="pagiset-link pagiset-prev" href="javascript:void(0)"><span class="visually-hidden">이전</span></a>
  </div>
  <div class="pagiset-list">
    <a class="pagiset-link active-fill" href="javascript:void(0)">1</a>
    <a class="pagiset-link" href="javascript:void(0)">2</a>
  </div>
  <div class="pagiset-ctrl">
    <a class="pagiset-link pagiset-next" href="javascript:void(0)"><span class="visually-hidden">다음</span></a>
  </div>
  <div class="pagiset-ctrl">
    <a class="pagiset-link pagiset-last" href="javascript:void(0)"><span class="visually-hidden">마지막</span></a>
  </div>
</nav>
```

**스타일**: `pagiset-circ` (라운드), `pagiset-fract` (분수형), `pagiset-assem` (그룹형), `pagiset-line` (라인)
**활성화**: `active-fill`, `active-line`

**분수형 구조**:
```html
<nav class="pagiset pagiset-fract">
  <div class="pagiset-text">
    <strong>1</strong> / <span>5</span>
  </div>
</nav>
```

**그룹형 구조**:
```html
<nav class="pagiset pagiset-assem">
  <ul class="pagiset-list">
    <li class="pagiset-item">
      <a class="pagiset-link active-fill" href="javascript:void(0)">1</a>
    </li>
    <li class="pagiset-item">
      <div class="pagiset-ctrl">
        <a class="pagiset-link pagiset-next" href="javascript:void(0)"><span class="visually-hidden">다음</span></a>
      </div>
    </li>
  </ul>
</nav>
```

### Accordset (아코디언)

```html
<div class="accordset accordset-arrow">
  <div class="accordset-item">
    <div class="accordset-header">
      <button class="accordset-button btn" type="button">
        <span>제목</span>
      </button>
    </div>
    <div class="accordset-body">
      <div class="accordset-content">내용</div>
    </div>
  </div>
</div>
```

**스타일 변형**: `accordset`, `accordset-arrow`, `accordset-plus`, `accordset-round`
**강조 스타일**: `accent-header`, `accent-body`

**Q&A형 구조**:
```html
<div class="accordset accordset-arrow">
  <div class="accordset-item">
    <div class="accordset-header">
      <button class="accordset-button btn" type="button">
        <span class="h5 accordset-q">Q</span>
        <span>제목</span>
      </button>
    </div>
    <div class="accordset-body">
      <div class="accordset-content">
        <span class="h5 accordset-a">A</span>
        <p>내용</p>
      </div>
    </div>
  </div>
</div>
```

### Grid (그리드)

```html
<div class="row row-cols-3 row-md-cols-2 row-sm-cols-1 gutter-2">
  <div class="col">
    <div>Column 1</div>
  </div>
  <div class="col">
    <div>Column 2</div>
  </div>
</div>
```

### Imageset (이미지)

```html
<picture class="imageset">
  <source media="(max-width: 992px)" srcset="https://images.unsplash.com/photo-XXX?w=600" />
  <img src="https://images.unsplash.com/photo-XXX?w=1920" alt="이미지 설명" class="imageset-img" />
</picture>
```

**필수 CSS**: `<picture class="imageset">` 사용 시 `picture.imageset { display: block; }` 추가

### Videoset (비디오)

**기본형**:
```html
<div class="videoset">
  <video class="videoset-video" src="비디오URL" loop muted playsinline></video>
  <div class="videoset-body">
    <button type="button" class="videoset-play ff-ico ti-play-circle-fill">
      <span class="blind">재생</span>
    </button>
  </div>
</div>
```

**팝업형** (모달은 최상위 블록 내부에 배치 필수):
```html
<div class="video-popup-N1">
  <div class="contents-container container-md">
    <div class="contents-inner">
      <div class="videoset">
        <div class="videoset-button">
          <picture class="imageset">
            <img class="videoset-img" src="썸네일URL" alt="비디오 썸네일" />
          </picture>
          <span class="videoset-icon modalset-open-btn ff-ico ti-play-circle-fill" data-modal-target="video-modal-1">
            <span class="blind">재생</span>
          </span>
        </div>
      </div>
    </div>
  </div>
  <!-- 모달은 최상위 블록 내부에 배치 (닫는 태그 </div> 직전) -->
  <div class="modalset modalset-video" data-modal-id="video-modal-1">
    <div class="modalset-content">
      <button type="button" class="modalset-close" data-modal-close="modalset">
        <span class="blind">닫기</span>
      </button>
      <div class="modalset-body">
        <video class="videoset-video" src="비디오URL" controls autoplay loop playsinline></video>
      </div>
    </div>
  </div>
</div>
```

**백그라운드형**:
```html
<div class="sample-video-N1">
  <div class="video_bg">
    <video class="videoset-video" src="비디오URL" autoplay muted loop playsinline></video>
  </div>
  <div class="contents-container container-md video-height">
    <div class="contents-inner">콘텐츠</div>
  </div>
</div>
```
```css
.sample-video-N1 .contents-container.video-height { min-height: 60rem; }
```


### Textset (텍스트)

```html
<div class="textset">
  <p class="textset-subtit p1">템플릿하우스</p>
  <h2 class="textset-tit h2">코딩을 쉽고 빠르게</h2>
  <p class="textset-desc p1">
    원하는 블록을 가져다 놓기만 하세요. <br />
    시간 단축, 업무 생산성을 200% 올릴 수 있습니다.
  </p>
  <a class="btnset btnset-link" href="javascript:void(0);">Read More</a>
</div>
```

### Modalset (모달)

```html
<!-- 열기 버튼 -->
<button class="btnset btnset-primary modalset-open-btn" type="button" data-modal-target="modal-1">모달 열기</button>

<!-- 모달 -->
<div class="modalset" data-modal-id="modal-1">
  <div class="modalset-content">
    <div class="modalset-header">
      <h2 class="h4 modalset-title">제목</h2>
      <button class="modalset-close" data-modal-close="modalset">
        <span class="blind">닫기</span>
      </button>
    </div>
    <div class="modalset-body">
      <div class="modalset-textarea">
        <p class="modalset-text">내용</p>
      </div>
    </div>
    <div class="modalset-footer">
      <button class="btnset btnset-primary" data-modal-close="modalset">확인</button>
    </div>
  </div>
</div>
```

**스타일 변형**: `modalset`, `modalset-dark`, `modalset-confirm`, `modalset-full`, `modalset-lg`, `modalset-sm`, `modalset-xs`

---

## 메인 비주얼 스와이퍼 구조

### 메인 비주얼 스와이퍼 HTML 구조

```html
<div class="main-visual-N1">
  <div class="contents-container container-full fullscreen">
    <h2 class="blind">Slogan</h2>
    <div class="slide-area">
      <div class="swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <div class="thumb">
              <div class="videoset">
                <video src="video.mp4" playsinline muted autoplay loop class="videoset-video" poster="poster.jpg"></video>
              </div>
            </div>
            <div class="textset">
              <strong class="textset-tit h2">2025 FW COLLECTION OPEN</strong>
              <p class="textset-desc">A women's shoe collection capturing the spirit of this year</p>
              <a href="javascript:void(0)" class="btnset btnset-line-white">Shop Now</a>
            </div>
          </div>
        </div>
      </div>
      <div class="fixed-area">
        <div class="paging-wrap">
          <!-- 페이지네이션 -->
        </div>
        <div class="btn-wrap">
          <button type="button" class="pause active ff-ico ti-pause-fill-sm">
            <span class="blind">정지</span>
          </button>
          <button type="button" class="play ff-ico ti-play-fill-sm">
            <span class="blind">재생</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 메인 비주얼 스와이퍼 CSS

```css
.main-visual-N1 .contents-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-visual-N1 .contents-container:not(.fullscreen) {
  height: 76rem;
}

.main-visual-N1 .slide-area {
  width: 100vw;
  height: 100%;
}

.main-visual-N1 .swiper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100%;
}

.main-visual-N1 .thumb {
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.main-visual-N1 .thumb::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgba(var(--black-rgb), 0.2);
  pointer-events: none;
}

.main-visual-N1 .thumb .imageset,
.main-visual-N1 .thumb .videoset {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.main-visual-N1 .textset {
  position: relative;
  z-index: 2;
  margin: 0 auto;
  width: 100%;
  text-align: center;
}

@media (max-width: 992px) {
  .main-visual-N1 .contents-container:not(.fullscreen) {
    height: 60rem;
  }
  .main-visual-N1 .swiper {
    margin-left: -1.6rem;
    width: calc(100% + 3.2rem);
  }
  .main-visual-N1 .swiper-slide {
    padding: 0 1.6rem 8rem;
  }
}
```

**주의**: 메인 비주얼 스와이퍼는 `contents-inner` 없이 `contents-container` 바로 하위에 `slide-area` 배치

---

## 일반 블록 구조

### 기본 블록 구조

```html
<div class="block-N1">
  <div class="contents-container container-md">
    <div class="contents-inner">
      <!-- 실제 콘텐츠 -->
    </div>
  </div>
</div>
```

### 기본 블록 CSS

```css
.block-N1 {
  position: relative;
  overflow: hidden;
  padding-top: 8rem;
  padding-bottom: 8rem;
  background: #fff;
}

.block-N1 .contents-inner {
  /* 내부 스타일 */
}

@media (max-width: 992px) {
  .block-N1 {
    padding-top: 4rem;
    padding-bottom: 4rem;
  }
}
```

---

## JavaScript 작성 패턴

### 기본 패턴 (블록 ID 필수 사용)

```javascript
(function () {
  $(function () {
    $(".block-N1[id='{bid}']").each(function () {
      const $block = $(this);
      
      // 이벤트 처리
      $block.find(".btn-toggle").click(function () {
        // 로직
      });
    });
  });
})();
```

### Swiper 슬라이더 패턴

```javascript
(function () {
  $(function () {
    $(".block-N1[id='{bid}']").each(function () {
      const $block = $(this);
      const $swiper = $block.find(".swiper");
      
      let swiperInstance = new Swiper($swiper[0], {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        pagination: {
          el: $block.find(".swiper-pagination")[0],
          clickable: true
        },
        navigation: {
          nextEl: $block.find(".swiper-button-next")[0],
          prevEl: $block.find(".swiper-button-prev")[0]
        }
      });
      
      $(window).off("resize").on("resize", () => {
        swiperInstance?.update();
      });
    });
  });
})();
```

**주의**: 
- 블록당 1개 슬라이더만 허용
- Swiper@11 사용
- 이벤트 중복 방지를 위해 `$(window).off("resize")` 후 `on` 사용

---

## 폼 시스템 구조

### 문의 폼 HTML 구조

```html
<div class="form-N1">
  <div class="contents-container container-md">
    <div class="form-group">
      <form target="_blank" action="https://api.imbackend.com/fn/v1/form.form" method="POST">
        <div class="form-box">
          <div class="inputset inputset-line">
            <input type="text" id="name" class="inputset-input form-control" required />
            <label for="name" class="form-tit">이름</label>
          </div>
        </div>
        <div class="form-box">
          <div class="inputset inputset-line">
            <input type="email" id="email" class="inputset-input form-control" required />
            <label for="email" class="form-tit">이메일</label>
          </div>
        </div>
        <div class="form-box">
          <div class="inputset">
            <textarea id="message" class="inputset-textarea form-control" required></textarea>
            <label for="message" class="form-tit">문의내용</label>
          </div>
        </div>
        <div class="form-btn">
          <button type="submit" class="btnset btnset-primary">문의하기</button>
        </div>
      </form>
    </div>
  </div>
</div>
```


---

## 참고 자료

- **스펙 문서**: `temha-ai-spec.md` (규칙 및 스펙 정의)
- **템플릿 예시**: [temha.io](https://temha.io)
- **컴포넌트 예시**: [kit.temha.io](https://kit.temha.io)
