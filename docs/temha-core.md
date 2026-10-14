# 템하(Temha) MCP 핵심 규약 (Core)

> **기본 로드**: `read_temha_rules()` → 이 문서 + `temha-ai-spec.md` + `temhakit-design-guide.md`  
> 템하는 **디자인 시스템(kit) + 컴포넌트 클래스** 기반입니다. Tailwind처럼 임의 CSS/HTML이 아닌 `btnset`, `inputset`, CSS 변수를 사용합니다.

---

## 규약 로드 순서 (필수)

1. **`read_temha_rules()`** — topic 생략 → **core + spec + design** (기본 패키지)
2. 작업에 맞게 **topic 1~2개 추가** (한 번에 3개 topic 초과 금지)
3. **`create_block` / `update_block`** 실행

| 사용자 요청 키워드 (예) | 추가 `topic` |
|------------------------|--------------|
| 헤더, 푸터, GNB, 전체메뉴, `header-N` | `header-footer` |
| 롤링, 슬라이드, 스와이퍼, 캐러셀, 메인 비주얼, 슬라이드 동영상 | `swiper` |
| 문의 폼, form 제출, `form.form` | `forms` |
| 배경 이미지, 오버레이, `block_overlay`, 히어로 배경 | `background` |
| 버튼/아이콘 클래스 검증, 허용 목록 | `components` |
| 그누보드 전체, 게시판 세트, `vue_gnu`, `data-gb-url` | `gnuboard` |
| 헤더 로그인 전/후 분기, 프로필 메뉴, 로그아웃 | `header-login` |
| 게시판 목록 | `gnuboard-list` |
| 게시판 상세 | `gnuboard-view` |
| 게시판 글쓰기·수정 | `gnuboard-write` |
| 로그인, 아이디/비밀번호 찾기 | `member-login` |
| 회원가입, 약관 동의 | `member-signup` |
| 회원 정보수정 | `member-profile` |
| 블록 작성 절차·에러 대응만 | `workflow` |
| (디자인 톤·kit·컬러·타이포) | **기본에 포함** (`design`) — 별도 호출 불필요 |

---

## MUST (요약 — 상세는 spec·design)

| 항목 | 규칙 |
|------|------|
| 최상위 | `<div class="{name}">`만 허용, class 외 id·style·data-* 금지 — **`<motion.div>` 금지** (MCP가 `div`로 자동 치환) |
| 구조 | `contents-container container-{md\|lg\|sm\|full}` → `contents-inner` (헤더/푸터/메인비주얼 예외) |
| CSS | `rem`만 (1rem=10px), 최상위 `position:relative` + `overflow:hidden` (헤더 제외), 블록 간 `margin` 금지 |
| JS | IIFE + `$(function(){})` + `$(".{name}[id='실제bid']").each(...)` |
| 컴포넌트 | `btnset`, `inputset` 등 **design guide / spec**의 클래스만 |
| 금지 JS | `accordset`, `Videoset`에 JS 작성 금지 |

---

## 문서 맵

| 파일 | 역할 |
|------|------|
| `temha-ai-spec.md` | MCP 도구 스펙, HTML/CSS/JS 규칙 표 |
| `temhakit-design-guide.md` | kit.temha.io 디자인 시스템 (컬러·타이포·컴포넌트) |
| `temha-topic-header-footer.md` | 헤더/푸터 **HTML class 필수** + **PDF v1.0 CSS 기본 가이드(§2-5)** |
| `temha-topic-components.md` | 버튼·아이콘 허용 클래스 목록 |
| `temha-topic-swiper.md` | 스와이퍼·메인 비주얼 (`thumb` 내 `videoset` / `imageset`) |
| `temha-topic-forms.md` | 문의 폼 HTML (PDF p.21~25, `form-group`·필드 유형) |
| `temha-topic-background.md` | 블록 배경 이미지 ①② + `block_overlay` ③④ ( `::before` 금지) |
| `temha-gnuboard-guide.md` | 그누보드 게시판/회원가입 Vue 연동 |
| `temha-topic-header-login.md` | 헤더 로그인 전/후 분기 짧은 MUST 규칙 |
| `temha-topic-gnuboard-list.md` | 게시판 목록 짧은 MUST 규칙 |
| `temha-topic-gnuboard-view.md` | 게시판 상세 짧은 MUST 규칙 |
| `temha-topic-gnuboard-write.md` | 게시판 글쓰기·수정 짧은 MUST 규칙 |
| `temha-topic-member-login.md` | 로그인·아이디/비밀번호 찾기 짧은 MUST 규칙 |
| `temha-topic-member-signup.md` | 회원가입 짧은 MUST 규칙 |
| `temha-topic-member-profile.md` | 회원 정보수정 짧은 MUST 규칙 |
| `temha-topic-workflow.md` | 7단계 절차·에러·우선순위 |
| `템하작성규약.md` | 레거시 통합본 (`topic: legacy`) |

---

## 참고 URL

- 템플릿 예시: https://temha.io  
- 컴포넌트 갤러리(오프라인 MD): `temhakit-design-guide.md` ← https://kit.temha.io

---

## 실행 전 Preflight 원칙

블록 생성/수정 전에는 반드시 다음 순서로 확인한다.

1. `read_temha_rules()`로 core/spec/design 기본 규칙을 읽는다.
2. 작업 유형에 맞는 topic을 추가로 읽는다.
3. topic 문서의 필수 class/checklist를 코드에 대조한다.
4. 특히 헤더/푸터, 폼, 배경, 스와이퍼, 컴포넌트는 topic 문서 없이 작성하지 않는다.

놓치기 쉬운 강제 항목:
- 헤더: `header-gnblink`, `header-title`, `header-utils`, `btn-allmenu`, `btn-momenu`, `header-fullmenu` 계열
- 헤더 2뎁스: `header-sublist`, `header-subitem`, `header-sublink` 및 hover/focus 표시 CSS
- 컨테이너: 1440/1280/1024 폭은 `contents-container container-lg|md|sm`으로 제어
- 링크: 내부 페이지는 `data-link-type="page"` + `./page-name.html`, 외부 URL은 `url`, 이메일/전화/파일은 `email`/`tel`/`file`
- 그누보드 상세: `.gnuboard v-cloak=""`, `data-gb-initial-status="read"`, 제목/메타/본문/이전·다음글 요소별 `data-gb-tpl` 필수
- 그누보드 글쓰기/수정: `.gnuboard v-cloak=""`, `data-gb-initial-status="write"`, `form-group` 안의 `v-gb-write`/`v-gb-edit`, 카테고리 `radioset-wrap`, 파일 `fileset`, 에디터 id `editor`/`edit-editor` 필수
- 그누보드 세트: 목록만 만들지 말고 상세(`read`)·글쓰기(`write`)·수정 링크(`getEditLink`)·목록/상세/글쓰기 `data-gb-*-link`를 먼저 설계
- 그누보드 화면 미출력 방지: 저장 후 `get_block`으로 HTML/CSS/JS를 재조회해 `.gnuboard` 루트, `vue_gnuboard(el)` 초기화 JS, `v-cloak`, `data-gb-tpl="wr_*"` 필드명, Vue 보간식의 `&lt;`/`&gt;` 이스케이프를 확인
- 그누보드 목록: 페이지네이션은 `pagination.pages` + `v-gb-list-btn-page` + `v-gb-list-page-active-class`를 사용하고, 빈 목록은 `data-gb-list-empty`로 처리한다. `notice-empty` 같은 임의 fallback UI 고정 노출 금지
- 헤더 로그인 상태: 헤더 내부 `.gnuboard`에 `vue_gnuboard(el)`을 호출하고 `isLoggedIn`, `user.mb_name`, `profileImage`, `handleLogout()`로 로그인 전/후 UI를 분기한다. 로그인 페이지용 `.login-app`/`vue_gnulogin`과 혼동 금지
- 회원 세트: 로그인·회원가입·아이디/비밀번호 찾기는 `vue_gnulogin(el)`, 정보수정은 `vue_gnuprofile(el)`을 호출. `vue_gnuboard(el)` 사용 금지
- 회원가입: `.signup-app` 루트 + `v-gb-terms`/`v-gb-signup` + `v-gb-btn-signup`/`v-gb-btn-terms` 필수. 약관 체크박스는 `checkset` + 고유 `id/for` + `agreeAll`/`agreements.*`를 사용하고, 저장 후 `get_block`으로 JS 초기화 누락 여부를 확인
- MCP validator 예외: 상세/글쓰기 블록에서 `v-gb-list`를 요구받을 때만 `v-if="false" v-gb-list="" v-gb-list-row="1" v-gb-list-onload="true"` anchor를 추가하고, 실제 목록 UI를 숨겨 넣지 않는다
- 폼: `form-group > form > form-box`, `method="POST"`, `action`, `inputset-* form-control`
- 비디오/배경: 인라인 style 대신 class + CSS, `videoset-video` 사용
