# 헤더·푸터 블록 — 템플릿 개발 가이드

> **이 문서는 템플릿 개발자와 AI MCP 모두가 반드시 따라야 하는 규약입니다.**
> 에디터 제어판은 HTML 내 특정 class명을 탐색해 CSS/HTML을 직접 조작합니다.
> class명이 없거나 다르면 해당 기능이 작동하지 않습니다.

### MUST vs 자유 작성 (AI MCP — 읽을 것)

| 구분 | 문서 위치 | AI 동작 |
|------|-----------|---------|
| **MUST** | §1 제어판, §2~3 **HTML class**, **§2-5 CSS 기본 가이드 (PDF v1.0)** | 에디터 연동에 필요한 **최소 CSS만** |
| **HTML 예시** | §6·§7 골격 | class 구조 참고. **블록명은 프로젝트에 맞게** |
| **자유 작성** | GNB 간격·hover·풀메뉴 애니·푸터 배치·색상 등 | **시안·요구사항대로** `.블록명`으로 작성 |
| **금지** | `header-N1` / `footer-N1` **통째 CSS·JS 복사** | 블록명만 바꿔 붙이기 |

CSS는 **「페이지 템플릿 제작 방법」PDF와 동일한 기본 가이드(§2-5)만 필수**입니다.  
나머지 스타일·JS(햄버거 토글 등)는 DOM 구조(§2~3, §6~7)를 지킨 채 **디자인에 맞게 새로 작성**합니다.

---

## 1. 에디터 제어판 ↔ Class명 매핑 규칙

### 1-1. 헤더 블록 제어판 매핑

에디터 제어판의 각 옵션이 어떤 class명을 찾아 무엇을 하는지 정의합니다.

| 제어판 옵션 | 기준 class / 선택자 | 동작 방식 |
|------------|-------------------|----------|
| **가로확장 ON** | `header-container` | `container-md/lg/sm` → `container-full` 교체 |
| **가로확장 OFF** | `header-container` | `container-full` → 기존 class 복원 |
| **상하단 여백** | `.블록명` (최상위 블록 class) | style.css에서 해당 블록 class만 선언된 `padding` 상하단 값 읽기/쓰기. 값이 없으면 css 삽입 |
| **로고 ON** | `header-title` | 로고 `<a><img></a>` 태그 원래 위치에 재삽입 |
| **로고 OFF** | `header-title` | 로고 태그 제거 (위치 기억 후 복원 가능) |
| **로고 사이즈** | `.블록명 .header-title a` | `height: 값rem` 읽기/쓰기 |
| **메뉴 ON** | `header-gnb` 또는 `header-center` | gnb 태그 재삽입. 템플릿에 gnb가 없으면 `header-left` 밑에 `header-center` 추가 |
| **메뉴 OFF** | `header-gnb` (또는 `header-gnblist`) | 해당 class 태그 제거 |
| **버튼 ON** | `header-utils` | `<a class="btn...">` 태그를 utils 안에 삽입 |
| **버튼 OFF** | `header-utils` | `<a class="btn">` 태그 제거 |
| **햄버거 메뉴 ON** | `header-utils` | `<li class="allmenu">` 를 utils 내 **최하단**에 삽입 (항상 우측 끝) |
| **햄버거 메뉴 OFF** | `header-utils` | `<li class="allmenu">` 제거. `header-fullmenu` → `display:none` |
| **헤더 고정(fixed)** | `.블록명` | style.css에 `position:fixed !important; width:100%; top:0; left:0; z-index:999` 삽입 |
| **헤더 겹치기** | `.블록명` | `position:absolute; width:100%; top:0; left:0; z-index:999` 삽입 |
| **투명도(opacity)** | `.블록명` | 배경색의 rgba b값으로 변환 처리 (예: `rgba(255,255,255,0.5)`) |
| **배경 컬러** | `.블록명` | background-color 값 직접 적용 |

### 1-2. 푸터 블록 제어판 매핑

| 제어판 옵션 | 기준 class / 선택자 | 동작 방식 |
|------------|-------------------|----------|
| **가로확장 ON** | `footer-container` | `container-md/lg/sm` → `container-full` 교체 |
| **가로확장 OFF** | `footer-container` | `container-full` → 기존 class 복원 |
| **상단 여백** | `.블록명` | style.css에서 `padding-top` 읽기/쓰기 |
| **하단 여백** | `.블록명` | style.css에서 `padding-bottom` 읽기/쓰기 |
| **로고 ON** | `footer-logo` | img 태그 원래 위치에 재삽입 |
| **로고 OFF** | `footer-logo` | img 태그 제거 |
| **로고 사이즈** | `.블록명 .footer-logo img` | `height: 값rem` 읽기/쓰기 |
| **헤더 메뉴(제어판 노출·연동)** | `footer-gnb` + `li.gnb-item` | 푸터에 `ul.footer-gnb`가 있을 때만 제어판 노출. **헤더 GNB 수정 시 에디터가 푸터 메뉴를 자동 동기화** (§3-2) |
| **이용약관 ON/OFF** | `footer-menulink.email` li | display 처리. 클릭 시 레이어 팝업 |
| **개인정보처리방침 ON/OFF** | `footer-menulink.privacy` li | display 처리. 클릭 시 레이어 팝업 |
| **푸터 메뉴 개수** | `footer-menulist` | li 태그 추가/제거. 기존 개수 기준으로 제어판 값 표시 |
| **SNS 아이콘 개수** | `footer-snslist` | li 태그 추가/제거. SVG 아이콘은 `ico_instagram_white.svg` 형태로 중복 사용 |
| **배경 이미지** | `.블록명` | `background:url(경로) no-repeat center/cover` 추가 |
| **배경 이미지 고정** | `.블록명` | `background-attachment:fixed` 추가 |
| **오버레이 효과** | `block_overlay` | 블록 최상위 태그 바로 아래 `<div class="block_overlay">` 삽입. 비디오 있으면 2순위 |
| **배경 비디오(YouTube)** | `video_bg` | 블록 최상위 태그 안 **1순위**로 `<div class="video_bg"><iframe>` 삽입 |
| **배경 비디오(Vimeo)** | `video_bg` | 동일. URL 마지막 값 추출해 embed URL 생성 |

### 1-3. 기본 콘텐츠 블록 제어판 매핑

| 제어판 옵션 | 기준 class / 선택자 | 동작 방식 |
|------------|-------------------|----------|
| **가로확장 ON** | `contents-container` | `container-md/lg/sm` → `container-full` 교체 |
| **가로확장 OFF** | `contents-container` | `container-full` → 기존 class 복원 |
| **세로확장 ON** | `contents-container` | `fullscreen` 클래스 추가 |
| **세로확장 OFF** | `contents-container` | `fullscreen` 클래스 제거 |
| **상단/하단 여백** | `.블록명` | padding-top/bottom 읽기/쓰기 |
| **배경 이미지/컬러/비디오** | `.블록명` | 헤더/푸터와 동일 방식 |
| **오버레이 효과** | `block_overlay` | 동일 |

---

## 2. 헤더 HTML 필수 class명 규약

### 2-1. 기본 헤더 구조 (필수 class명)

```
<블록명>                      ← 최상위. 에디터가 스타일 기준점으로 사용
  └─ header-container         ← 가로확장 기준. container-md/lg/sm 중 하나 필수
       ├─ header-left          ← 로고 영역
       │    └─ header-title    ← 로고 태그. 로고 ON/OFF, 사이즈 기준
       ├─ header-center        ← GNB 중앙 배치 시 사용
       │    └─ header-gnb      ← 메뉴 ON/OFF 기준 (또는 header-gnblist)
       │         └─ header-gnblist   ← 메뉴 관리 기준. 이게 없으면 메뉴 기능 없음
       │              └─ header-gnbitem
       │                   ├─ header-gnblink    ← 1뎁스 링크
       │                   └─ header-sublist    ← 2뎁스 (있을 때만)
       │                        └─ header-subitem
       │                             └─ header-sublink
       └─ header-right         ← 우측 영역
            └─ header-utils    ← 버튼/햄버거 주입 위치. 이게 없으면 버튼/햄버거 기능 없음
```

### 2-2. 풀스크린 메뉴 구조 (햄버거 메뉴 사용 시 필수)

```
<블록명>
  ├─ header-container ...
  └─ header-fullmenu fullmenu-{top|right|left|bottom}  ← 열리는 방향 class 선택
       └─ fullmenu-wrapper
            ├─ fullmenu-head
            │    └─ fullmenu-title   ← 풀메뉴 로고
            ├─ fullmenu-gnblist
            │    └─ fullmenu-gnbitem
            │         ├─ fullmenu-gnblink    ← 1뎁스
            │         └─ fullmenu-sublist
            │              └─ fullmenu-subitem
            │                   └─ fullmenu-sublink  ← 2뎁스
            └─ fullmenu-close        ← 닫기 버튼 (필수)
```

### 2-3. 상단 탑 메뉴가 있을 때 추가 구조

```
header-container
  ├─ header-top                ← 탑 메뉴 영역
  │    └─ header-top-menu
  │         └─ (로그인/회원가입 등 링크)
  ├─ header-left
  ├─ header-center
  └─ header-right
```

### 2-4. 헤더 개발 제약사항

```
✅ header-container 는 반드시 container-md / container-lg / container-sm 중 하나를 기본값으로 가져야 함
✅ header-utils 는 항상 header-right 안에 위치
✅ 햄버거 메뉴 li.allmenu 는 header-utils 내 최하단 (우측 끝 고정)
✅ header-gnblist 가 없으면 에디터의 메뉴 관리 기능이 작동하지 않음
✅ fullmenu-close 버튼은 반드시 존재해야 함 (없으면 풀메뉴가 닫히지 않음)
✅ PC/Mobile 메뉴는 하나의 코드로 동일하게 사용 (별도 코드 금지)
✅ 블록 최상위 class명은 반드시 존재해야 함 (에디터 스타일 기준점)
```

### 2-5. CSS 기본 가이드 (PDF v1.0 · 에디터 연동 MUST)

> 출처: 「페이지 템플릿 제작 방법」v1.0 + 에디터 실동작.  
> **아래만 필수.** GNB·풀메뉴·푸터 레이아웃·반응형·색상 등 **나머지 CSS/JS는 시안대로 자유 작성**.

#### (1) 헤더 — `.블록명` `position` (3종 중 1개 필수)

| 값 | 용도 | CSS 예시 (`.블록명`에 선언) |
|----|------|---------------------------|
| `relative` | 기본·일반 스크롤 | `position: relative;` |
| `absolute` | 헤더 겹치기(제어판) | `position: absolute; width: 100%; top: 0; left: 0; z-index: 999;` |
| `fixed` | 헤더 고정(제어판) | **`position: fixed !important;`** `width: 100%; top: 0; left: 0; z-index: 999;` |

- **반드시** `relative` · `absolute` · `fixed` 중 **하나**는 `.블록명`에 있어야 제어판·레이아웃이 인식합니다.
- **`fixed` 사용 시 `!important` 필수** — `position: fixed !important;` 형태로 작성 (제어판이 덮어쓰기 함).
- `sticky`만 단독 사용은 에디터 제어판 「헤더 고정/겹치기」와 **매핑되지 않음** → `fixed` 또는 `absolute` 사용.

#### (2) 헤더 — `header-container` (PDF v1.0)

```css
.블록명 .header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  width: 100%;
  min-height: 8rem;   /* 디자인에 맞게 rem 조정 */
  z-index: 100;
}
```

#### (3) 헤더 — 로고 `header-title` (MUST)

에디터 「로고 사이즈(높이)」는 **`.블록명 .header-title a`의 `height`(rem)** 만 읽습니다.  
**아래 두 규칙 세트를 반드시 포함** (px 28 → `2.8rem`, 1rem=10px 기준).

```css
.블록명 .header-title a {
  height: 2.8rem;   /* 제어판 로고 높이와 동일 rem */
}

.블록명 .header-title img {
  height: 100%;
  object-fit: contain;
  vertical-align: top;
  transition: filter 0.3s;
}
```

| 항목 | 규칙 |
|------|------|
| 제어판 연동 | `a`에 `height: Nrem` — **`img`에 직접 px/rem 고정만 하면 사이즈 슬라이더 미동작** |
| `img` | `height: 100%` + `object-fit: contain` 필수 |
| HTML | `<h1 class="header-title"><a>…<img alt="…"></a></h1>` (§2-1) |

#### (4) 헤더 — 상·하단 여백

```css
.블록명 {
  position: relative;   /* 또는 absolute / fixed !important */
  padding-top: 0rem;
  padding-bottom: 0rem;
}
```

제어판 「상하단 여백」은 `.블록명`의 `padding-top` / `padding-bottom`을 읽습니다.

#### (5) 헤더 — 버튼·햄버거 (PDF v1.0)

- 헤더 버튼: `template.css`의 **`btnset btnset-primary btnset-sm`** 만 사용. **별도 버튼 CSS 추가 금지**
- 햄버거: `btn-allmenu` / `btn-momenu` + `ico-hamburger` 구조 (§2-2). **아이콘 전용 CSS만** 블록에 추가 가능

#### (6) 푸터 — 블록·로고 (PDF v1.0)

푸터 블록은 **헤더 제외**하고 `position: relative` 필수.

```css
.블록명 {
  position: relative;
  padding-top: 2.4rem;    /* 제어판 상·하단 여백 */
  padding-bottom: 2.4rem;
}

.블록명 .footer-logo a {
  display: block;
  height: 3.3rem;   /* 제어판 로고 높이 — 디자인 rem */
}

.블록명 .footer-logo img {
  width: auto;
  height: 100%;
  object-fit: contain;
}
```

| 항목 | 규칙 |
|------|------|
| 여백 | `.블록명` padding-top/bottom (헤더와 동일 방식) |
| 로고 | `footer-logo` — **`a`에 rem 높이** + `img { height:100% }` 권장 |

#### (7) 푸터 — 그 외

- `footer-container { margin: 0 auto; }` (PDF 공통)
- 메뉴·SNS·주소 **레이아웃·색·간격** → 시안대로 `.블록명`에 작성
- 푸터 **JavaScript 불필요** (`js` 생략 또는 `""`)

---

## 3. 푸터 HTML 필수 class명 규약

### 3-1. 기본 푸터 구조 (필수 class명)

```
<블록명>                      ← 최상위. 배경/여백 기준점
  └─ footer-container         ← 가로확장 기준. container 클래스 포함
       ├─ footer-top           ← 상단 영역 (로고, 메뉴, SNS)
       │    ├─ footer-logo      ← 로고 ON/OFF, 사이즈 기준
       │    ├─ footer-menulist  ← 이용약관/개인정보/추가메뉴 기준
       │    │    └─ footer-menulink   ← 메뉴 아이템
       │    │         (이용약관: footer-menulink email)
       │    │         (개인정보: footer-menulink privacy)
       │    └─ footer-snslist   ← SNS 아이콘 영역
       │         └─ footer-snsitem
       │              └─ footer-snslink
       └─ footer-bottom        ← 하단 영역 (주소, 카피라이트)
            └─ footer-txtgroup / footer-txt
```

### 3-2. 푸터 `footer-gnb` — 헤더 GNB 자동 연동 (MUST)

푸터 하단에 **헤더와 같은 메뉴**를 두고, 에디터에서 헤더 GNB를 바꾸면 푸터도 같이 바뀌게 하려면 **아래 class·태그를 그대로** 씁니다.  
`header-gnblist` / `header-gnbitem` 을 푸터에 쓰면 **연동되지 않습니다.**

```
<블록명>
  └─ footer-container
       ├─ footer-logo
       ├─ ul.footer-gnb          ← MUST: <ul> + class footer-gnb
       │    └─ li.gnb-item       ← MUST: <li> + class gnb-item (header-gnbitem 아님)
       │         └─ a + span
       ├─ footer-menulist        ← 이용약관/개인정보 (연동 메뉴와 별도)
       ├─ footer-snslist
       └─ footer-txtgroup
```

**표준 HTML (복사용)**

```html
<ul class="footer-gnb">
  <li class="gnb-item">
    <a class="p1" href="./index.html" data-link-type="page">
      <span>home</span>
    </a>
  </li>
  <li class="gnb-item">
    <a class="p1" href="./notice_list.html" data-link-type="page">
      <span>게시판</span>
    </a>
  </li>
</ul>
```

| 항목 | 규칙 |
|------|------|
| 컨테이너 | **`<ul class="footer-gnb">`** (div.footer-gnb 금지) |
| 항목 | **`<li class="gnb-item">`** (`header-gnbitem` / `footer-menulink` 아님) |
| 링크 | `<a>` 안에 **`<span>메뉴명</span>`** |
| 페이지 링크 | `data-link-type="page"` + `href` (예: `./index.html`) |
| 2뎁스 | 헤더와 동일하게 2뎁스 구조를 쓸 때도 **`li.gnb-item`** 규칙 유지 (에디터가 헤더 기준으로 덮어씀) |

**`footer-menulist` 와 구분**

| 영역 | class | 용도 |
|------|-------|------|
| 헤더 연동 메뉴 | `footer-gnb` → `gnb-item` | 헤더 GNB와 **자동 동기화** |
| 이용약관·개인정보·추가 링크 | `footer-menulist` → `footer-menulink` | 제어판 개수 조절, 레이어 팝업 (연동 아님) |

### 3-3. Family Site 셀렉트박스 포함 시

```
footer-bottom 또는 footer-left 안에 <div class="selectset"> 삽입
```

### 3-4. 배경 비디오 삽입 구조

```html
<!-- 비디오는 무조건 블록 최상위 태그 바로 안 1순위 -->
<div class="블록명">
  <div class="video_bg">
    <!-- YouTube -->
    <iframe src="https://www.youtube.com/embed/{ID}?autoplay=1&mute=1&loop=1&playlist={ID}"></iframe>
    <!-- Vimeo -->
    <iframe src="https://player.vimeo.com/video/{ID}?autoplay=1&mute=1&loop=1&background=1"></iframe>
  </div>
  <div class="block_overlay"></div>   <!-- 오버레이는 video_bg 다음 -->
  <div class="footer-container">...</div>
</div>
```

### 3-5. 푸터 개발 제약사항

```
✅ footer-container 는 반드시 container-md / container-lg / container-sm 중 하나를 기본값으로 가져야 함
✅ 이용약관 li 는 class에 email 포함: footer-menulink email
✅ 개인정보처리방침 li 는 class에 privacy 포함: footer-menulink privacy
✅ SNS 아이콘은 ico_instagram_white.svg 형태의 단일 SVG 파일로 통일
✅ 헤더 연동 메뉴: ul.footer-gnb > li.gnb-item > a > span (§3-2). header-gnbitem 사용 금지
✅ footer-gnb 없으면 에디터에서 「헤더 메뉴」 옵션이 아예 안 보임
✅ video_bg 는 블록 태그 안 1순위. 오버레이(block_overlay)보다 먼저
✅ block_overlay 는 블록 태그 바로 아래 2순위 (비디오 있으면)
✅ 블록 최상위 class명은 반드시 존재해야 함
✅ 푸터 블록 `.블록명`은 PDF v1.0 기준 `position: relative` 선언 (헤더 제외)
```

### 3-6. 푸터 사이트맵형 HTML 골격 (CSS는 §2-5 + 시안)

```
footer-container
  ├─ footer-logo
  ├─ ul.footer-gnb          ← 헤더 연동 (§3-2)
  ├─ ul.footer-snslist
  ├─ ul.footer-menulist       ← 이용약관 등
  └─ footer-txtgroup / footer-bottom
```

푸터 **필수 CSS**는 §2-5 (6)·(7). 배치·색·간격은 시안대로 작성.

---

## 4. 컨테이너 레이아웃 규약

가로확장 기준이 되는 container class는 Template.css에 공통 정의됩니다.

```css
/* 헤더/푸터/콘텐츠 공통 레이아웃 */
.container-full { max-width: 100%; margin: 0 auto; padding: 0 8rem; }
.container-lg   { max-width: 1440px; margin: 0 auto; }
.container-md   { max-width: 1280px; margin: 0 auto; }
.container-sm   { max-width: 1024px; margin: 0 auto; }

/* 세로확장 (기본 콘텐츠 블록용) */
.fullscreen { min-height: 100vh; display: flex; align-items: center; }
```

**규칙:**
- 에디터는 `container-md/lg/sm` ↔ `container-full` 을 **클래스 교체** 방식으로 처리
- 가로확장 OFF 시 복원할 원래 class(md/lg/sm)는 템플릿에 명시되어야 함
- `container-full`만 있고 md/lg/sm이 없으면 OFF 시 복원 불가

---

## 5. 배경/오버레이/비디오 규약

> **일반 블록·히어로** 포함 전체 상세: `read_temha_rules({ topic: "background" })` — ①~④ MUST, `::before` 배경 **금지**.

### 5-1. 배경 이미지

```css
/* 에디터가 .블록명에 추가하는 CSS */
.블록명 {
  position: relative;
  background: url(이미지경로) no-repeat center/cover;
  background-attachment: fixed; /* 배경 이미지 고정 옵션 ON 시 추가 */
}
```

### 5-2. 오버레이

```html
<!-- 에디터가 블록 태그 바로 아래 삽입 -->
<div class="블록명">
  <div class="block_overlay"></div>
  <div class="footer-container / contents-container">...</div>
</div>
```

```css
/* CSS도 style.css에 자동 추가됨 */
.블록명 .block_overlay {
  position: absolute; content: ''; z-index: 0;
  background: #000; opacity: 0.5;
  left: 0; top: 0; bottom: 0; right: 0;
}
```

- 투명도: 블록옵션 1~10 → CSS `opacity: 0.1 ~ 1.0`

### 5-3. 배경 비디오

```css
/* template.css에 공통 처리 (수정 금지) */
.video_bg { position: absolute; overflow: hidden; width: 100%; height: 300%; top: -100%; }
.video_bg iframe { position: absolute; left:0; top:0; bottom:0; right:0; z-index:0; width:100%; height:100%; }
```

- YouTube URL: `https://www.youtube.com/watch?v={ID}` → ID 추출
- Vimeo URL: `https://vimeo.com/{ID}` → ID 추출

---

## 6. HTML 골격 예시 — 헤더

> **CSS는 §2-5만 필수.** 아래는 class 구조 참고용 — `header-N1` 대신 **프로젝트 블록명** 사용.

```html
<div class="블록명">
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
      <div class="header-utils">
        <ul>
          <li class="button">
            <a href="javascript:void(0)" class="btnset btnset-primary btnset-sm">Button</a>
          </li>
          <li class="allmenu">
            <button class="btn-allmenu" type="button">
              <span class="ico-hamburger"></span>
              <span class="ico-hamburger"></span>
              <span class="ico-hamburger"></span>
            </button>
          </li>
        </ul>
      </div>
      <button class="btn-momenu" type="button">
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

## 7. HTML 골격 예시 — 푸터

> **CSS는 §2-5만 필수.** class 구조 참고 — `footer-N1` 대신 **프로젝트 블록명** 사용.

### 7-1. 기본형 (연동 메뉴 없음)

```html
<div class="블록명">
  <div class="footer-container container-lg">
    <div class="footer-top">
      <h2 class="footer-logo">
        <a href="javascript:void(0);">
          <img src="https://temha.io/api/t-a/57/1762488000/resources/images/img_logo_white.png" alt="로고" />
        </a>
      </h2>
      <ul class="footer-menulist">
        <li class="footer-menulink email">
          <a href="javascript:void(0);">
            <span>이용약관</span>
          </a>
        </li>
        <li class="footer-menulink privacy">
          <a href="javascript:void(0);">
            <span>개인정보처리방침</span>
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

### 7-2. HTML 예시 — `footer-gnb` (헤더 연동)

`footer-top` 또는 `footer-container` 안 적절한 위치에 삽입합니다.

```html
<ul class="footer-gnb">
  <li class="gnb-item">
    <a class="p1" href="./index.html" data-link-type="page">
      <span>home</span>
    </a>
  </li>
  <li class="gnb-item">
    <a class="p1" href="./notice_list.html" data-link-type="page">
      <span>게시판</span>
    </a>
  </li>
</ul>
```

### JavaScript

푸터는 JavaScript가 필요하지 않습니다. `js` 파라미터를 전달하지 않거나 빈 문자열(`""`)로 전달합니다.

---

## 8. 개발 체크리스트

템플릿 개발 완료 전 반드시 확인하세요.

### 헤더

- [ ] 최상위 블록 class명이 존재하는가 (예: `petaccessory-N1`)
- [ ] `.블록명`에 `position: relative` **또는** `absolute` **또는** `fixed !important` 가 있는가 (§2-5)
- [ ] `fixed` 사용 시 `position: fixed !important;` 인가
- [ ] `.블록명 .header-title a { height: Nrem; }` + `img { height:100%; object-fit:contain; }` 있는가 (§2-5)
- [ ] `header-container`에 `container-md/lg/sm` 중 하나가 기본값으로 있는가
- [ ] `header-title` 로고 태그가 있는가
- [ ] `header-gnblist`가 있는가 (메뉴 기능 필수)
- [ ] `header-utils`가 `header-right` 안에 있는가 (버튼/햄버거 주입 위치)
- [ ] `btn-allmenu` 또는 `btn-momenu`가 있는가
- [ ] `header-fullmenu`에 `fullmenu-{top/right/left}` 방향 class가 있는가
- [ ] `fullmenu-close` 버튼이 있는가
- [ ] PC/Mobile 메뉴가 하나의 코드로 작성되었는가

### 푸터

- [ ] 최상위 블록 class명이 존재하는가 (예: `footer-N1`)
- [ ] `footer-container`에 `container-md/lg/sm` 중 하나가 기본값으로 있는가
- [ ] `footer-logo`가 있는가
- [ ] **헤더 연동 메뉴** 사용 시: `ul.footer-gnb` > `li.gnb-item` > `a` > `span` 인가 (§3-2)
- [ ] 이용약관 li에 `email` class가 있는가 (`footer-menulink email`)
- [ ] 개인정보처리방침 li에 `privacy` class가 있는가 (`footer-menulink privacy`)
- [ ] `footer-snslist`가 있는가 (SNS 기능 필요 시)
- [ ] 푸터 CSS: §2-5 (6)·(7) 기본 가이드 + 시안 레이아웃을 `.블록명`으로 작성했는가
- [ ] 배경 비디오 사용 시 `video_bg`가 블록 태그 안 1순위인가
- [ ] 오버레이 사용 시 `block_overlay`가 `video_bg` 다음 순서인가
