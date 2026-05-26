# 스와이퍼·메인 비주얼

> 메인 비주얼·롤링 배너 작업 시 `read_temha_rules({ topic: "swiper" })` 로드.

## 메인 비주얼 스와이퍼 구조

### 슬라이드 미디어 — 이미지 vs 동영상 (MUST)

| 슬라이드 종류 | `thumb` 안 구조 | 금지 |
|---------------|-----------------|------|
| **이미지** | `<picture class="imageset">` ... `imageset-img` | `img`만 단독 배치 |
| **동영상** | `thumb` > **`div.videoset`** > `<video>` | `videoset` 없음 · 아래 **금지 패턴** |

- 동영상은 **반드시** `<div class="videoset">` 로 감싸기 (에디터·template.css 연동의 **핵심**).
- `class="videoset-video"` 는 **필수 아님** (있어도 되고 없어도 됨). **없어도 `videoset`만 있으면 인식**.
- 메인 비주얼 **자동재생** 슬라이드: `playsinline` `muted` `autoplay` `loop` + `poster` 권장.
- `videoset-body` / `videoset-play`는 **재생 버튼이 있는 기본형**에만 사용. 풀스크린 슬라이드 배경 영상에는 **불필요**.
- MP4는 **`<video src="...mp4">`** — `<source>` 자식 **금지**.
- `src` / `poster`는 `/api/t-a/.../resources/` 또는 `get_videos` — Pexels·Unsplash URL 직접 삽입 **금지**.

### ❌ 금지 — AI가 자주 넣는 잘못된 슬라이드 동영상

**복사·유사 구조 금지.** `videoset` 없이 `video`만 두거나, `video_bg`를 쓰는 대표 예:

```html
<!-- ❌ 전부 금지 -->
<div class="swiper-slide">
  <div class="slide-media video_bg">
    <video autoplay muted loop playsinline poster="https://images.unsplash.com/...">
      <source src="https://videos.pexels.com/.../5325953-hd_1920_1080_30fps.mp4" type="video/mp4">
    </video>
  </div>
  <div class="textset">...</div>
</div>
```

| 잘못된 점 | 올바른 처리 |
|-----------|-------------|
| `slide-media`, **`video_bg`** | `video_bg` = **블록 최상위** YouTube/Vimeo 배경 전용 (`topic: background`). 슬라이드 X |
| **`thumb` 없음** | `div.thumb` 필수 |
| **`videoset` 없음** | `div.videoset`로 `video` 감싸기 |
| **`<source>`** | `video`에 `src="/api/t-a/.../videos/....mp4"` |
| 외부 Pexels/Unsplash | 템하 업로드·`get_videos` 경로 |

**✅ 유일한 슬라이드 동영상 골격:**

```html
<div class="swiper-slide">
  <div class="thumb">
    <div class="videoset">
      <video
        src="/api/t-a/166/1779188400/resources/videos/racienne_N4.mp4"
        playsinline
        muted
        autoplay
        loop
        poster="/api/t-a/166/1779188400/resources/images/racienne_N4_01.png"
      ></video>
    </div>
  </div>
  <div class="textset">...</div>
</div>
```

> `videoset-video` class는 **선택** (스타일용). **필수는 `div.videoset` 래퍼만.**

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
                <video
                  src="/api/t-a/166/1779188400/resources/videos/racienne_N4.mp4"
                  playsinline
                  muted
                  autoplay
                  loop
                  poster="/api/t-a/166/1779188400/resources/images/racienne_N4_01.png"
                ></video>
              </div>
            </div>
            <div class="textset">
              <strong class="textset-tit h2">2025 FW COLLECTION OPEN</strong>
              <p class="textset-desc">A women's shoe collection capturing the spirit of this year</p>
              <a href="javascript:void(0)" class="btnset btnset-line-white">Shop Now</a>
            </div>
          </div>
          <div class="swiper-slide">
            <div class="thumb">
              <picture class="imageset">
                <source media="(max-width:992px)" srcset="/api/t-a/166/1779188400/resources/images/racienne_N4_04.png" />
                <img src="/api/t-a/166/1779188400/resources/images/racienne_N4_02.png" alt="" class="imageset-img" />
              </picture>
            </div>
            <div class="textset">
              <strong class="textset-tit h2">Our Timeless Bestsellers</strong>
              <p class="textset-desc">Timeless bestsellers that never go out of style</p>
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

### 동영상 슬라이드 체크리스트

| 체크 | 항목 |
|------|------|
| ✅ | `thumb` > **`div.videoset`** > `<video>` (`videoset-video` class 선택) |
| ✅ | `playsinline` `muted` `autoplay` `loop` |
| ✅ | `poster` (템하 리소스 경로) |
| ❌ | `slide-media`, `video_bg` |
| ❌ | `<source>` — `video src`만 |
| ❌ | 외부 Pexels/Unsplash URL |

블록 배경 `video_bg` · 팝업형 Videoset → `temha-ai-spec.md` Videoset 절 · `topic: background`

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
