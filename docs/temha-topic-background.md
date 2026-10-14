# 블록 배경 이미지·오버레이 — 템플릿 개발 가이드

> 에디터 제어판이 읽는 **배경 이미지·오버레이** 규칙입니다.  
> 일반 콘텐츠·푸터·히어로 블록 모두 동일하게 적용합니다.

### MUST 4단계 (에디터 연동)

| 번호 | 적용 위치 | 내용 |
|------|-----------|------|
| **①** | `.블록명` CSS | `position: relative` + `background: url(경로) no-repeat center/cover` |
| **②** | `.블록명` CSS | (옵션) 제어판 「배경 이미지 고정」ON → `background-attachment: fixed` |
| **③** | HTML | 블록 **첫 자식**으로 `<div class="block_overlay"></div>` (오버레이 쓸 때) |
| **④** | `.블록명 .block_overlay` CSS | 어둡게·투명도 — 제어판이 `opacity` 조절 |

**금지:** `::before` / `::after`에 `background-image` · `filter: brightness()` 로 배경·어둡게 처리  
→ 에디터 제어판·오버레이 ON/OFF가 동작하지 않음.

---

## 1. 배경 이미지 CSS (① · ②) — MUST

```css
/* ① 블록 최상위 class에만 배경 이미지 */
.블록명 {
  position: relative;
  overflow: hidden;
  background: url(/resources/images/hero_bg.jpg) no-repeat center/cover;
  /* ② 배경 고정 옵션 ON 시에만 추가 */
  background-attachment: fixed;
}
```

| 항목 | 규칙 |
|------|------|
| 선택자 | **`.블록명`만** — `contents-inner`, `::before`, 별도 `.bg-wrap` 금지 |
| 문법 | `background: url(...) no-repeat center/cover` (에디터가 동일 패턴으로 읽/씀) |
| 고정 | `background-attachment: fixed` — 제어판 「배경 이미지 고정」 |

---

## 2. 오버레이 HTML (③) — MUST

```html
<div class="hero-flagship-N1">
  <!-- ③ 오버레이: 블록 바로 아래, 콘텐츠보다 앞(형제 순서) -->
  <div class="block_overlay"></div>

  <div class="contents-container container-full">
    <div class="contents-inner">
      <!-- 텍스트·버튼 등 -->
    </div>
  </div>
</div>
```

### 자식 순서 (고정)

| 순서 | 요소 | 조건 |
|------|------|------|
| 1 | `video_bg` | 배경 **비디오** 사용 시만 |
| 2 | `block_overlay` | 오버레이·어둡게 사용 시 |
| 3 | `contents-container` / `footer-container` 등 | 본문 |

비디오 + 오버레이 예:

```html
<div class="블록명">
  <div class="video_bg">…iframe…</div>
  <div class="block_overlay"></div>
  <div class="contents-container">…</div>
</div>
```

---

## 3. 오버레이 CSS (④) — MUST

```css
/* ④ 에디터가 style.css에 추가·수정 (투명도 1~10 → opacity 0.1~1.0) */
.블록명 .block_overlay {
  position: absolute;
  content: "";
  z-index: 0;
  background: #000;
  opacity: 0.5;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
```

| 항목 | 규칙 |
|------|------|
| 클래스명 | 반드시 **`block_overlay`** (다른 class명 금지) |
| 어둡게 | `background: #000` + `opacity` — **`filter` on pseudo 금지** |
| 제어판 | 오버레이 OFF 시 HTML에서 `block_overlay` 제거 |

콘텐츠가 오버레이 위에 보이도록:

```css
.블록명 .contents-container {
  position: relative;
  z-index: 1;
}
```

---

## 4. 금지 패턴 (AI·퍼블 공통)

### ❌ `::before` / `::after` 배경 (에디터 미연동)

```css
/* 금지 — 제어판 배경 이미지·오버레이와 무관 */
.hero-flagship-N1::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("https://…");
  background-size: cover;
  filter: brightness(0.55);
  z-index: 0;
}
```

**이유:** 배경은 **① `.블록명`의 `background`**, 어둡게는 **③ `block_overlay` + ④ CSS**로만 처리.

### ❌ 기타

| 금지 | 대안 |
|------|------|
| 배경 전용 `<div class="my-bg">` | ① `.블록명 { background: … }` |
| `contents-inner`에 배경 이미지 | ① 블록 최상위 |
| 오버레이를 `::after`로 구현 | ③ `<div class="block_overlay">` |
| `opacity`만 블록 전체에 적용해 텍스트까지 흐림 | ④ `.block_overlay`만 opacity |

---

## 5. 배경 컬러만 (이미지 없음)

제어판 「배경 컬러」는 `.블록명`에 `background-color` 직접 적용.  
오버레이 없으면 `block_overlay` HTML·CSS **생략 가능**.

---

## 6. 완성 예시 (이미지 + 오버레이)

```html
<div class="glamping-N3">
  <div class="block_overlay"></div>
  <div class="footer-container container-md">…</div>
</div>
```

```css
.glamping-N3 {
  position: relative;
  overflow: hidden;
  background: url(../../resources/images/footer_bg.jpg) no-repeat center/cover;
  background-attachment: fixed;
  padding-top: 2.4rem;
  padding-bottom: 2.4rem;
}

.glamping-N3 .block_overlay {
  position: absolute;
  content: "";
  z-index: 0;
  background: #000;
  opacity: 0.5;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.glamping-N3 .footer-container {
  position: relative;
  z-index: 1;
}
```

---

## 7. 체크리스트

- [ ] 배경 이미지가 **`.블록명`의 `background: url()`** 인가 (`::before` 아님)
- [ ] 오버레이 사용 시 **`block_overlay` div** 가 블록 첫쪽(비디오 다음)에 있는가
- [ ] **`.블록명 .block_overlay`** CSS가 있는가 (④)
- [ ] `filter: brightness` 등으로 대체하지 않았는가
- [ ] 콘텐츠 `z-index`가 오버레이(0)보다 위인가
