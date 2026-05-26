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
| 그누보드, 게시판, 로그인, `vue_gnu`, `data-gb-url` | `gnuboard` |
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
| `temha-gnuboard-guide.md` | 그누보드 Vue 연동 |
| `temha-topic-workflow.md` | 7단계 절차·에러·우선순위 |
| `템하작성규약.md` | 레거시 통합본 (`topic: legacy`) |

---

## 참고 URL

- 템플릿 예시: https://temha.io  
- 컴포넌트 갤러리(오프라인 MD): `temhakit-design-guide.md` ← https://kit.temha.io
