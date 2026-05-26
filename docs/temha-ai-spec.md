# 템하(Temha) AI 스펙 문서
> **목적**: AI가 준수해야 할 규칙과 스펙을 명확하게 정의한 문서
> **형식**: JSON/표 형태로 딱딱하게 작성, LLM이 "규칙 목록"처럼 읽을 수 있도록 구성

## MCP 도구별 스펙

### create_page

```json
{
  "tool": "create_page",
  "input": {
    "projectId": {"type": "string", "required": true},
    "title": {"type": "string", "required": true},
    "name": {
      "type": "string",
      "required": true,
      "rules": ["영문 대소문자, 숫자, 하이픈(-), 언더스코어(_)만 허용", "한글/특수문자/공백 금지"],
      "examples": ["about-us", "product_list"]
    }
  }
}
```

### create_block

```json
{
  "tool": "create_block",
  "input": {
    "projectId": {"type": "string", "required": true},
    "pageId": {"type": "string", "required": true},
    "area": {"type": "string", "required": true, "enum": ["header", "footer", "content"], "rules": ["header/footer: 블록 1개만", "content: 여러 블록 허용"]},
    "name": {"type": "string", "required": true, "rules": ["영문, 숫자, 하이픈(-), 언더스코어(_)만", "페이지 내 중복 불가", "최상위 div class와 동일"], "examples": ["hero-N1", "feature-cards-N2"]},
    "title": {"type": "string", "required": true},
    "html": {"type": "string", "required": true, "rules": ["최상단 <div class=\"{name}\">로 시작", "class 외 속성(id, style, data-*) 금지", "순수 HTML만 (!<CDATA 없음)", "name과 최상단 div class 동일"], "structure": ["<div class=\"{name}\">", "<div class=\"contents-container container-{size}\">", "<div class=\"contents-inner\">", "<!-- 콘텐츠 -->", "</div></div></div>"], "exceptions": ["header/footer: 특수 구조 사용 (고정 코드 포함)"]},
    "css": {"type": "string", "required": true, "rules": ["순수 CSS만", "최상위: position:relative, overflow:hidden 필수 (헤더 제외)", "rem 단위만 (1rem=10px)", "인라인 스타일 금지", "블록 스코프: .{block_name} .element"]},
    "js": {"type": "string", "required": false, "rules": ["IIFE 패턴: (function(){...})();", "jQuery: $(function(){...});", "블록 스코프: $(\".{name}[id='{bid}']\").each(...)", "accordset/Videoset: JavaScript 생성 금지"]}
  },
  "special_cases": {
    "header": {"css": "고정 CSS 전체 포함", "js": "고정 JS 전체 포함", "html": "btn-allmenu, btn-momenu, header-fullmenu 필수"},
    "footer": {"css": "고정 CSS 전체 포함", "js": "불필요"}
  }
}
```

## HTML 규칙

### 필수 구조
| 항목 | 규칙 |
|------|------|
| **최상위 블록** | `<div class="{name}">` 필수 (name과 동일) |
| **contents-container** | 최상위 블록 바로 하위 필수 |
| **contents-inner** | contents-container 내부 필수 (fullscreen 레이아웃 방지) |
| **헤더/푸터** | 시맨틱 태그 금지, `<div>` 사용 |

### 금지 사항
| 항목 | 금지 내용 |
|------|-----------|
| **인라인 스타일** | `style="..."` 사용 금지 (CSS 클래스 사용 필수) |
| **최상위 div 속성** | `id`, `style`, `data-*` 등 class 외 속성 금지 (id는 시스템에서 자동 삽입) |
| **시맨틱 태그** | 블록 내부에서 `<header>`, `<footer>` 사용 금지 (div 사용 권장) |
| **클래스 중복** | 최상위 블록 클래스는 고유해야 함 (상/하위 중복 금지) |
| **중복 해결** | 하위 요소에 부모 섹션명 접두사 추가 (`first` → `first-first`) |

### 필수 속성
| 요소 | 필수 속성 |
|------|-----------|
| **버튼** | `type="button"` (form submit 제외) |
| **링크** | `href="javascript:void(0);"` (기능 없는 링크) |
| **이미지** | `alt` 속성 필수 |
| **폼** | `label`의 `for`와 `input`의 `id` 연결 |
| **폼 입력** | `placeholder`, `required`, `id`, `name` |
| **Switchset** | `role="switch"`, `aria-label`, `visually-hidden` 클래스 |
| **Fileset** | 취소 버튼: `aria-label`, 업로드 버튼: `role="button"` |

## CSS 규칙

### 단위 규칙
| 항목 | 규칙 |
|------|------|
| **크기 단위** | `rem`만 사용 (1rem=10px, px 금지) |
| **최상위 블록** | `position:relative`, `overflow:hidden` 필수 (헤더 제외) |
| **블록간 여백** | `margin` 금지, `padding-top/bottom`만 사용 |
| **블록 내부 여백** | 블록 내부에서는 `margin`, `padding` 자유 사용 |

### 블록간 여백 계산
| 항목 | 규칙 |
|------|------|
| **총 여백** | 이전 블록 `padding-bottom` + 다음 블록 `padding-top` |
| **계산** | 각 블록의 `padding-top`과 `padding-bottom` 합산 |

### 폰트 규칙
| 항목 | 규칙 |
|------|------|
| **폰트 크기** | `h1`~`h3`, `p1`~`p3` 클래스만 사용 (직접 `font-size` 금지) |
| **폰트 패밀리** | CSS 변수 사용 (`var(--ff-ko1)` 등) |

### 배경 규칙
| 항목 | 규칙 |
|------|------|
| **배경 이미지 (①)** | `.블록명 { background: url() no-repeat center/cover }` — **상세 `topic: background`** |
| **오버레이 (③④)** | `<div class="block_overlay">` + `.블록명 .block_overlay { opacity }` |
| **금지** | `::before`/`::after`에 `background-image`·`filter: brightness`로 배경/어둡게 처리 |
| **금지** | 임의 배경 래퍼 div (`my-bg` 등). **`block_overlay`만 예외** |
| **contents-inner 배경 금지** | contents-inner 내부에 배경 이미지 배치 금지 |

### 최상위 블록 CSS 제약
| 허용 속성 | 금지 속성 |
|-----------|-----------|
| `position: relative` (헤더 제외) | `display: flex/grid` |
| `overflow: hidden` (헤더 제외) | `font-size` |
| `background` | `color` |
| `padding-top`, `padding-bottom` | `padding` (축약형 금지) |

## JavaScript 규칙
### 필수 패턴

```javascript
// IIFE 패턴
(function () {
  // jQuery 래퍼
  $(function () {
    // 블록 스코프 (템하 방식: 클래스와 ID 함께 사용)
    $(".block-N1[id='abc123def456']").each(function () {
      const $block = $(this);
      // 이벤트 처리
      $block.find(".btn-toggle").click(function () {
        // 이벤트 로직
      });
    });
  });
})();
```

### 블록 ID 사용 규칙
| 항목 | 규칙 |
|------|------|
| **블록 ID 필수** | JavaScript에서 반드시 블록 ID(bid) 사용: `$(".block-N1[id='{bid}']")` |
| **금지** | 클래스만 사용 금지 (복제 시 충돌) |

### Swiper 슬라이더 규칙
| 항목 | 규칙 |
|------|------|
| **블록당 1개** | 블록당 1개 슬라이더만 허용 |
| **라이브러리** | Swiper@11 사용 |
| **블록 ID 필수** | 블록 ID를 사용하여 인스턴스 생성 |
| **일반 스와이퍼 구조** | `contents-inner` 내부에 배치, 일반 컨테이너 크기 사용 |
| **Fullscreen 비주얼 스와이퍼** | 사용자가 "fullscreen", "전체 화면", "꽉찬" 비주얼 스와이퍼를 요청할 때만 아래 특수 구조 적용 |

### JavaScript 작성 금지 컴포넌트
| 컴포넌트 | 규칙 |
|---------|------|
| **Accordset** | JavaScript 생성 금지, 시스템에서 토글 자동 처리 (`active` 클래스로 제어) |
| **Videoset** | 모든 JavaScript 작성 금지, 시스템에서 재생/일시정지/모달 등 자동 처리 |

### 이벤트 관리 규칙
| 항목 | 규칙 |
|------|------|
| **이벤트 중복 방지** | `$(window).off('resize').on('resize', ...)` |
| **body scroll lock** | 모달/풀메뉴 열 때 `$('body').css('overflow', 'hidden')` |
| **이벤트 위임** | 동적 요소는 `$block.on('click', '.selector', ...)` |
| **메모리 누수 방지** | 블록 제거 시 `swiperInstance.destroy()` 등 리소스 정리 |

## 컴포넌트 사용 규칙
### 버튼 (Btnset)
| 항목 | 규칙 |
|------|------|
| **사용 제한** | 허용된 버튼 스타일 리스트에 있는 클래스만 사용 |
| **기본 클래스** | 모든 버튼은 `btnset` 기본 클래스 필수 |
| **절대 금지** | 리스트에 없는 버튼 클래스 사용 금지 |
**허용된 버튼 스타일**: `read_temha_rules({ topic: "components" })` 또는 `temha-topic-components.md` 참조

### 아이콘
| 항목 | 규칙 |
|------|------|
| **사용 제한** | 허용된 아이콘 리스트에 있는 아이콘만 사용 |
| **기본 클래스** | 모든 아이콘은 `ff-ico` 클래스 필수 |
| **절대 금지** | 리스트에 없는 아이콘 클래스 사용 금지 |
**허용된 아이콘**: `read_temha_rules({ topic: "components" })` 또는 `temha-topic-components.md` 참조

### 이미지 (Imageset)
| 항목 | 규칙 |
|------|------|
| **더미 이미지** | Unsplash, Pexels의 실제 작동하는 URL만 사용 (웹 검색 필수) |
| **금지** | placeholder 형식 (`via.placeholder.com` 등), 예시 코드 복사, 추측/임의 ID 사용 |
| **CSS** | `<picture class="imageset">` 사용 시 `display: block;` 필수 |
| **alt 속성** | 모든 이미지에 `alt` 속성 필수 |

### 비디오 (Videoset)
#### JavaScript 규칙
| 항목 | 규칙 |
|------|------|
| **절대 금지** | Videoset 컴포넌트 사용 시 모든 JavaScript 작성 금지 (기본형/팝업형 재생/일시정지, 이벤트 리스너, 플레이 버튼 표시/숨김 등 모든 기능) |
| **필수** | Videoset 블록은 HTML과 CSS만 작성하고 JavaScript는 작성하지 않음 |

#### 구조 요소
| 요소 | 클래스 | 필수 여부 | 설명 |
|------|--------|----------|------|
| **기본 컨테이너** | `videoset` | 필수 | 모든 Videoset 타입 필수 |
| **비디오 요소** | `videoset-video` | 필수 | 기본형/모달/백그라운드 모두 필수 (⚠️ `video` 클래스 아님) |
| **플레이 버튼** | `videoset-play` | 기본형 필수 | 기본형 비디오 필수 |
| **플레이 버튼 컨테이너** | `videoset-body` | 기본형 필수 | 기본형 비디오 필수 |
| **팝업 버튼** | `videoset-button` | 팝업형 필수 | 팝업형 비디오 필수 |
| **플레이 아이콘** | `videoset-icon` | 팝업형 필수 | 팝업형 비디오 필수 |
| **썸네일** | `videoset-img` | 팝업형 필수 | 팝업형 비디오 필수 |
| **백그라운드** | `video_bg` | 백그라운드형 필수 | 백그라운드형 비디오 필수 |

#### 팝업형 비디오 모달 규칙
| 항목 | 규칙 |
|------|------|
| **모달 배치** | 모달은 반드시 최상위 블록 내부에 배치 (닫는 태그 `</div>` 직전) |
| **data-modal 매칭** | `data-modal-target`과 `data-modal-id` 값이 정확히 일치해야 함 (대소문자 구분, 공백 없음) |
| **페이지 내 고유성** | 같은 페이지 내에서 동일한 모달 ID 중복 금지 |
| **모달 클래스** | `modalset modalset-video` 클래스 사용 필수 |
| **닫기 버튼** | `modalset-close` 클래스와 `data-modal-close="modalset"` 속성 사용 필수 |
| **접근성** | 모달 닫기 버튼 내부에 `blind` 클래스를 가진 접근성 텍스트 포함 필수 |

#### 비디오 URL 규칙
| 항목 | 규칙 |
|------|------|
| **허용 서비스** | Pexels, Vimeo (iframe embed), YouTube (iframe embed, 권장) |
| **URL 형식** | Pexels: `https://www.pexels.com/video/{id}/`, Vimeo: `https://player.vimeo.com/video/{id}`, YouTube: `https://www.youtube.com/embed/{id}` (watch 형식 금지) |
| **웹 검색 필수** | 실제 작동하는 URL 확인 후 사용 |
| **금지** | 예시 코드 복사, 추측/임의 ID, 작동하지 않는 URL, YouTube watch 형식, Vimeo 일반 페이지 URL |

#### 백그라운드 비디오 규칙
| 항목 | 규칙 |
|------|------|
| **video_bg 클래스** | `video_bg` 클래스 사용 필수 |
| **비디오 요소 클래스** | 비디오 요소에 `videoset-video` 클래스 사용 필수 (⚠️ `video` 클래스 아님) |
| **부모 요소** | 부모 요소에 `position: relative`, `overflow: hidden` 사용 필수 |
| **video 태그 속성** | `<video>` 태그에 `autoplay`, `muted`, `loop`, `playsinline` 속성 사용 필수 |
| **contents-container** | `fullscreen` 클래스가 없다면 `min-height`로 높이값 설정 필수 |
| **CSS 규칙** | `video_bg`와 `videoset-video` 클래스는 이미 다른 곳에서 CSS 처리하므로 블록 CSS에 추가 불필요 |

#### 스와이퍼 슬라이드 MP4 (메인 비주얼) — `video_bg` 아님

| 항목 | 규칙 |
|------|------|
| **구조** | `swiper-slide` > **`thumb`** > **`div.videoset`** > `<video src="…mp4">` |
| **필수** | **`div.videoset` 래퍼** — `videoset-video` class는 슬라이드에서 **선택** |
| **금지** | 슬라이드에 `video_bg`, `slide-media`, `<source>` |
| **금지** | `videoset` 없이 `<video>`만 배치 |
| **상세** | `read_temha_rules({ topic: "swiper" })` — 금지 예시 HTML 포함 |

#### 외부 비디오 (YouTube, Vimeo) 규칙
| 항목 | 규칙 |
|------|------|
| **iframe 클래스** | `iframe` 태그에 `videoset-video` 클래스 사용 필수 (기본형/모달/백그라운드 모두) |
| **frameborder** | `frameborder="0"` 속성 사용 필수 |
| **allowfullscreen** | `allowfullscreen` 속성 사용 필수 |
| **YouTube URL** | `embed` 형식 사용 필수 (`watch` 형식 금지) |
| **Vimeo URL** | `player.vimeo.com` embed URL 사용 필수 (일반 페이지 URL 금지) |

#### 접근성 규칙
| 항목 | 규칙 |
|------|------|
| **이미지/버튼** | 모든 이미지에 `alt` 속성, 플레이 버튼/모달 닫기에 `blind` 클래스 접근성 텍스트 필수 |

### 입력 컴포넌트
| 컴포넌트 | 구조 | 필수 클래스/속성 |
|---------|------|----------------|
| **Inputset** | `form-box` > `inputset` > `form-tit` + `inputset-input` | `inputset`, `inputset-input form-control`, `form-tit` (필수 마크: `<span>*</span>`), `placeholder`, `required`, `id`, `name` |
| **Textarea** | `form-box` > `inputset` > `form-tit` + `inputset-textarea` | `inputset-textarea form-control` |
| **Selectset** | 기본: `form-box` > `selectset` > `selectset-select` + `selectset-arrow` / 커스텀: `selectset` > `selectset-area` > `selectset-toggle` + `selectset-list` | - |
| **접근성** | 모든 입력 컴포넌트: `label`의 `for`와 입력 요소의 `id` 연결, `blind` 또는 `visually-hidden` 클래스 |

### 선택 컴포넌트
| 컴포넌트 | 구조 | 필수 속성 |
|---------|------|----------|
| **Checkset** | `form-box` > `checkset` > `checkset-input` + `checkset-label` | `input`의 `id`와 `label`의 `for` 연결 |
| **Radioset** | `form-box` > `radioset` > `radioset-input` + `radioset-label` | `name` 속성으로 그룹화, `id`와 `for` 연결 |
| **Dropset** | `dropset` > `dropset-area` > `dropset-toggle` + `dropset-list` | `dropset-toggle`, `dropset-link`에 `type="button"` |
| **Tabset** | `tabset` > `tabset-list` > `tabset-item` > `tabset-link` (패널형: `tabset-container` > `tabset-cont`) | `href="javascript:void(0);"` |

### 레이아웃 컴포넌트
| 컴포넌트 | 구조 | 필수 속성 |
|---------|------|----------|
| **Cardset** | `cardset` > `cardset-figure` + `cardset-body` | `cardset-img` 클래스, `alt` 속성 |
| **Accordset** | `accordset` > `accordset-item` > `accordset-header` + `accordset-body` | `accordset-button`에 `type="button"`, JavaScript 금지 |

### 데이터 컴포넌트
| 컴포넌트 | 구조 | 필수 속성 |
|---------|------|----------|
| **Tableset** | `tableset` > `tableset-inner` > `tableset-table` | `thead`, `tbody`, `th`, `td` 사용, `th`에 `scope="col/row"` 권장 |
| **Badge** | - | 기본: `badge`, 텍스트: `textset-badge`, 버튼: `btnset-badge` |
| **Toastset** | 기본: `toastset` > `toastset-header` + `toastset-body` / 알림형: `toastset-alert` > `toastset-body` > `toastset-icon` + `toastset-group` | `toastset-close`에 `type="button"` |
| **Tooltipset** | - | `data-tooltip-type/color/place/title/text` 필수, `btn-tooltipset` 클래스 |
| **Modalset** | - | 열기: `modalset-open-btn`, `data-modal-target`, `data-modal-id` (매칭 필수), 닫기: `modalset-close`, `data-modal-close="modalset"`, `blind` 클래스 |
| **Pagiset** | - | `href="javascript:void(0);"`, `pagiset-first/prev/next/last`에 `visually-hidden` |

### 미디어 컴포넌트
| 컴포넌트 | 구조 | 규칙 |
|---------|------|------|
| **Textset** | `textset` > `textset-subtit` + `textset-tit` + `textset-desc` | `h1`~`h6`, `p1`~`p3` 클래스만 사용 |
| **Grid** | `row` > `col` (필수) | `row-cols-{1-12}`, `row-md-cols-{1-12}` (992px 이하), `row-sm-cols-{1-12}` (768px 이하), `gutter-{1-10}` |

## 반응형 규칙
| 항목 | 규칙 |
|------|------|
| **원칙** | HTML 구조 변경 최소화, CSS 미디어쿼리 활용 |
| **브레이크포인트** | `@media (max-width: 992px)` (태블릿/모바일) |
| **단일 마크업** | 반응형은 CSS로만 처리, HTML 구조는 동일 |

## 네이밍 규칙
### 블록 클래스
| 항목 | 규칙 | 예시 |
|------|------|------|
| **형식** | `kebab-case` | `hero-product-N1` |
| **고유성** | 프로젝트 내 고유해야 함 | |
| **패턴** | `~-N*` 형태 | `sample-N1`, `feature-cards-N2` |
| **금지** | 카멜케이스, 스네이크케이스, 숫자로 시작 | `myBlock-N1`, `block_1-N1`, `1block-N1` |

### 요소 및 상태 패턴
| 패턴 | 형식 | 예시 |
|------|------|------|
| **요소** | `{block}-{element}` | `header-title`, `button-icon` |
| **상태** | `{block}-{state}` | `menu-active`, `button-disabled` |

### 구조별 네이밍
| 구조 | 네이밍 패턴 | 예시 |
|------|-----------|------|
| **블록 최상위** | `.{block_name}` | `.hero-N1` |
| **컨테이너** | `{section}-container` + `container-*` | `.header-container`, `.contents-container` |
| **헤더 서브** | `header-{position}` | `.header-left`, `.header-center`, `.header-right` |
| **GNB** | `header-gnb`, `header-gnblist` | `.header-gnb`, `.header-gnblist` |
| **푸터** | `footer-{section}` | `.footer-top`, `.footer-bottom` |
| **푸터 메뉴** | `footer-{type}list` | `.footer-menulist`, `.footer-snslist` |

### 목적별 접두사
| 접두사 | 용도 | 예시 |
|--------|------|------|
| `hero-` | 메인 비주얼 | `hero-product-N1` |
| `feature-` | 기능 소개 | `feature-tech-stack-N2` |
| `cta-` | 행동 유도 | `cta-newsletter-signup-N3` |
| `testimonial-` | 고객 후기 | `testimonial-client-review-N1` |
| `form-` | 폼 섹션 | `form-contact-inquiry-N1` |
| `faq-` | 자주 묻는 질문 | `faq-common-questions-N1` |
| `gallery-` | 갤러리 | `gallery-product-images-N1` |
| `stats-` | 통계/숫자 | `stats-company-numbers-N1` |
| `article-` | 아티클/본문 | `article-blog-post-N1` |
| `product-` | 제품 소개 | `product-features-N1` |
| `service-` | 서비스 소개 | `service-offerings-N1` |
| `about-` | 회사/소개 | `about-company-history-N1` |
| `contact-` | 연락처/문의 | `contact-information-N1` |

### 네이밍 Best Practices
| 항목 | 규칙 |
|------|------|
| **원칙** | 목적 명확히, kebab-case, 프로젝트 내 고유, `-N1`, `-N2` 순차 증가, 일관성 유지 |
| **좋은 예시** | `hero-product-N1`, `feature-tech-stack-N2`, `cta-newsletter-signup-N3` |
| **나쁜 예시** | `section1-N1` (의미 없음), `myBlock-N1` (카멜케이스), `block_1-N1` (스네이크케이스), `block1-N1` (숫자로 시작) |

## 특수 블록 규칙
### 헤더 블록
| 항목 | 규칙 |
|------|------|
| **CSS** | 고정 CSS 코드 전체 포함 필수 - `read_temha_rules({ topic: "header-footer" })` |
| **JavaScript** | 고정 JavaScript 코드 전체 포함 필수 - `read_temha_rules({ topic: "header-footer" })` |
| **HTML 구조** | `btn-allmenu`, `btn-momenu`, `header-fullmenu` 필수 - `read_temha_rules({ topic: "header-footer" })` |
| **ico-hamburger** | `btn-allmenu`, `btn-momenu` 내부에 `ico-hamburger` 클래스를 가진 `<span>` 요소 3개 필수 |
| **로고 이미지** | 배경색에 따라 로고 선택: 화이트/라이트 배경 → 블랙 로고, 블랙/다크 배경 → 화이트 로고 |
| **position/overflow** | 헤더 블록은 `position: relative`, `overflow: hidden` 사용하지 않음 |

### 푸터 블록
| 항목 | 규칙 |
|------|------|
| **CSS** | 고정 CSS 코드 전체 포함 필수 - `read_temha_rules({ topic: "header-footer" })` |
| **JavaScript** | 불필요 (빈 문자열 또는 전달하지 않음) |
| **HTML 구조** | `footer-N1`, `footer-container`, `footer-top`, `footer-bottom` 필수 - `read_temha_rules({ topic: "header-footer" })` |
| **footer-menulink** | `footer-menulink` 내부에 `<span>` 태그 필수 |

### Fullscreen 비주얼 스와이퍼 (조건부 적용)
| 항목 | 규칙 |
|------|------|
| **적용 조건** | 사용자가 "fullscreen", "전체 화면", "꽉찬", "메인 비주얼" 비주얼 스와이퍼를 요청할 때만 적용 |
| **구조** | `contents-inner` 없이 `contents-container` 바로 하위에 `slide-area` 배치 |
| **클래스** | `container-full fullscreen` 조합 사용 |
| **너비** | `slide-area`와 `swiper` 모두 `100vw` 사용 |
| **이미지/비디오** | `thumb` 영역 내에서 `position: absolute`로 배치 |
| **접근성** | `blind` 클래스로 제목을 시각적으로 숨기되 스크린 리더에서는 읽히도록 설정 |
| **일반 스와이퍼** | 위 조건이 아닌 경우 일반 구조 사용: `contents-inner` 내부에 배치, 일반 컨테이너 크기 사용 |

## 폼 시스템 규칙
| 항목 | 규칙 |
|------|------|
| **구조** | `{block_name}` > `contents-container` > `form-group` > `form` |
| **백엔드 연동** | `https://api.imbackend.com/fn/v1/form.form` 액션 사용 |
| **폼 래핑** | 모든 입력 요소는 `form-box` > `inputset` 구조로 래핑 |
| **제출 버튼** | `type="submit"` 형태로 적용 |
| **필수 속성** | `required`, `method="POST"`, `action`, `target="_blank"` |

## 컨테이너 시스템 스펙
### 컨테이너 크기
| 클래스 | CSS 값 | 설명 |
|--------|--------|------|
| `container-full` | `width: 100%` | 전체 폭 |
| `container-lg` | `max-width: 1440px` | 대형 |
| `container-md` | `max-width: 1280px` | 중형 (기본) |
| `container-sm` | `max-width: 1080px` | 소형 |

### 컨테이너 사용 규칙
| 항목 | 규칙 |
|------|------|
| **필수 구조** | `contents-container container-{size}` 형태로 사용 |
| **fullscreen 조합** | `container-full fullscreen` 조합 사용 가능 (메인 비주얼 등) |
| **기본값** | `container-md`가 기본값 (명시하지 않으면 자동 적용) |

## CSS 변수(토큰) 스펙
### 색상 변수
| 변수명 | 설명 |
|--------|------|
| `--primary` | 주요 색상 |
| `--secondary` | 보조 색상 |
| `--success` | 성공 색상 |
| `--info` | 정보 색상 |
| `--warning` | 경고 색상 |
| `--danger` | 위험 색상 |
| `--black` | 검정색 |
| `--white` | 흰색 |
| `--text-color1` | 텍스트 색상 1 (검은색) |
| `--text-color2` | 텍스트 색상 2 |
| `--text-color3` | 텍스트 색상 3 |
| `--text-color4` | 텍스트 색상 4 (가장 연한 회색) |

### 폰트 크기 변수
| 변수명 | 설명 |
|--------|------|
| `--fs-h1` | 헤딩 1 크기 |
| `--fs-h2` | 헤딩 2 크기 |
| `--fs-h3` | 헤딩 3 크기 |
| `--fs-h4` | 헤딩 4 크기 |
| `--fs-h5` | 헤딩 5 크기 |
| `--fs-h6` | 헤딩 6 크기 |
| `--fs-p1` | 본문 1 크기 |
| `--fs-p2` | 본문 2 크기 |
| `--fs-p3` | 본문 3 크기 |

### 높이 변수
| 변수명 | 기본값 | 설명 |
|--------|--------|------|
| `--ht-xl` | `5.6rem` | 초대형 높이 |
| `--ht-lg` | `4.8rem` | 대형 높이 |
| `--ht-md` | `4rem` | 중형 높이 |
| `--ht-sm` | `3.2rem` | 소형 높이 |

### 폰트 패밀리 변수
| 변수명 | 범위 | 설명 |
|--------|------|------|
| `--ff-ko1` ~ `--ff-ko6` | 기존 사용 중 | 한글 폰트 (1~6) |
| `--ff-en1` ~ `--ff-en6` | 기존 사용 중 | 영문 폰트 (1~6) |
| `--ff-ko7` 이상 | 새로 생성 가능 | 한글 폰트 (7부터) |
| `--ff-en7` 이상 | 새로 생성 가능 | 영문 폰트 (7부터) |

### CSS 변수 사용
| 항목 | 규칙 |
|------|------|
| **사용** | `var(--primary)`, `var(--fs-h1)` 등으로 직접 사용 |

## Grid 시스템 스펙
### Grid 클래스
| 클래스 | 설명 | 범위 |
|--------|------|------|
| `row` | 행 컨테이너 (필수) | - |
| `col` | 열 요소 (필수) | - |
| `row-cols-{n}` | 열 개수 지정 | `{1-12}` |
| `row-md-cols-{n}` | 태블릿 열 개수 | `{1-12}` (992px 이하) |
| `row-sm-cols-{n}` | 모바일 열 개수 | `{1-12}` (768px 이하) |
| `gutter-{n}` | 간격 지정 | `{1-10}` |

### Grid 브레이크포인트
| 브레이크포인트 | 크기 | 클래스 |
|---------------|------|--------|
| **PC** | 1200px 이상 | 기본값 (row-cols-*) |
| **Tablet** | 992px 이하 | `row-md-cols-*` |
| **Mobile** | 768px 이하 | `row-sm-cols-*` |

### Grid 거터 시스템
| 항목 | 규칙 |
|------|------|
| **기본값** | `4px` (`--th-gutter` 변수), `gutter-1` ~ `gutter-10` 클래스 |
| **원리** | padding으로 간격 생성, margin 음수로 컨테이너 크기 맞춤 |
| **커스텀** | `--th-gutter` 변수 수정 |
