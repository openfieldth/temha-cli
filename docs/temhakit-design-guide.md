# Temhakit Design Guide
**Templatehouse 공식 디자인 시스템 — Claude Design 전용**

> 이 문서는 Claude Design이 Temhakit(템하키트) 브랜드와 컴포넌트를 정확하게 재현하기 위한 완전한 디자인 스펙입니다.  
> 모든 값은 `templatehouse.css` 소스에서 직접 추출되었습니다.  
> 참조 사이트: https://kit.temha.io

---

## 시스템 규칙

```
루트 폰트: html { font-size: 62.5% } → 1rem = 10px
단위 기준: rem (예: 1.6rem = 16px, 2.4rem = 24px)
Box-sizing: border-box
텍스트 줄바꿈: word-break: keep-all / text-wrap: pretty
반응형 분기점: 992px (PC → Mobile)
```

---

## 컬러 시스템

### 브랜드 컬러
| 이름 | 변수 | HEX | RGB |
|------|------|-----|-----|
| 메인 Primary | `--primary` | `#d91f29` | 217, 31, 41 |
| 보조 Secondary | `--secondary` | `#333850` | 51, 56, 80 |
| 블랙 | `--black` | `#000000` | 0, 0, 0 |
| 화이트 | `--white` | `#ffffff` | 255, 255, 255 |

### 배경
| 이름 | 변수 | HEX |
|------|------|-----|
| 기본 배경 (Body) | `--body-bg` | `#ffffff` |
| 서브 배경 | `--bg-color` | `#f7f7fb` |
| 추가 커스텀 | `--custom-color-1` | `#E7E7EB` |

### 텍스트 계층
| 이름 | 변수 | HEX | 용도 |
|------|------|-----|------|
| 텍스트1 | `--text-color1` | `#111111` | 제목, 강조 |
| 텍스트2 | `--text-color2` | `#505050` | 본문 기본 |
| 텍스트3 | `--text-color3` | `#767676` | 보조 텍스트 |
| 텍스트4 | `--text-color4` | `#999999` | 비활성, 힌트 |

### 라인
| 이름 | 변수 | HEX |
|------|------|-----|
| 라인1 | `--line-color1` | `#e5e5e5` |
| 라인2 | `--line-color2` | `#d4d4d8` |
| 라인3 | `--line-color3` | `#111111` |

### 시스템 컬러
| 이름 | 변수 | HEX | RGB |
|------|------|-----|-----|
| 성공/긍정 | `--success` | `#198754` | 25, 135, 84 |
| 정보/안내 | `--info` | `#0dcaf0` | 13, 202, 240 |
| 경고/주의 | `--warning` | `#ffc107` | 255, 193, 7 |
| 실패/위험 | `--danger` | `#dc3545` | 220, 53, 69 |

### 컬러 사용 규칙
- 색 변경 시 HEX와 RGB 변수를 반드시 **쌍으로** 수정 (`--primary` + `--primary-rgb`)
- `rgba(var(--primary-rgb), .8)` 형태로 투명도 활용 가능
- 특정 클래스 내에서 CSS 변수 재할당으로 로컬 오버라이드 가능

---

## 타이포그래피

### 폰트 패밀리
| 이름 | 변수 | 분류 |
|------|------|------|
| **Noto Sans KR** (기본) | `--ff-ko1` | 한국어 |
| Pretendard | `--ff-ko2` | 한국어 |
| Noto Serif KR | `--ff-ko3` | 한국어 세리프 |
| Nanumgothic | `--ff-ko4` | 한국어 |
| Nanumsquare | `--ff-ko5` | 한국어 |
| Nanumbarungothic | `--ff-ko6` | 한국어 |
| Castoro | `--ff-en1` | 영문 |
| Inter | `--ff-en2` | 영문 |
| Heebo | `--ff-en3` | 영문 |
| Roboto | `--ff-en4` | 영문 |
| Montserrat | `--ff-en5` | 영문 |
| Temha-Icon | `--ff-ico` | 아이콘 폰트 |

> **기본 body 폰트**: `--ff-ko1` (Noto Sans KR)

### 폰트 웨이트
| 이름 | 변수 | 값 |
|------|------|-----|
| Light | `--fw-right` | 300 |
| Regular | `--fw-regular` | 400 |
| Medium | `--fw-medium` | 500 |
| Bold | `--fw-bold` | 700 |

### 텍스트 스타일 (PC / Mobile)

| 클래스 | 이름 | PC 크기 | PC 행간 | 모바일 크기 | 모바일 행간 | 자간 | 웨이트 |
|--------|------|---------|---------|------------|------------|------|--------|
| `.h1` | 제목 1 | 5.2rem (52px) | 6.6rem | 4.4rem | 5.8rem | -0.025rem | Bold 700 |
| `.h2` | 제목 2 | 4.4rem (44px) | 5.8rem | 3.6rem | 5.0rem | -0.025rem | Bold 700 |
| `.h3` | 제목 3 | 3.6rem (36px) | 5.2rem | 2.8rem | 3.8rem | -0.025rem | Bold 700 |
| `.h4` | 제목 4 | 2.8rem (28px) | 4.2rem | 2.4rem | 3.4rem | -0.025rem | Bold 700 |
| `.h5` | 제목 5 | 2.4rem (24px) | 3.4rem | 2.0rem | 3.0rem | -0.025rem | Medium 500 |
| `.h6` | 제목 6 | 2.0rem (20px) | 3.0rem | 1.6rem | 2.6rem | -0.025rem | Medium 500 |
| `.p1` | 본문 기본 | 1.6rem (16px) | 2.6rem | 1.4rem | 2.4rem | -0.025rem | Regular 400 |
| `.p2` | 본문 소 | 1.4rem (14px) | 2.4rem | 1.2rem | 2.4rem | -0.025rem | Regular 400 |
| `.p3` | 본문 최소 | 1.2rem (12px) | 1.8rem | 1.2rem | 1.8rem | -0.025rem | Regular 400 |

### 텍스트 스타일 CSS 예시
```css
/* 제목 1 */
.h1 {
  font-family: var(--ff-ko1);
  font-size: var(--fs-h1);      /* 5.2rem PC / 4.4rem Mobile */
  font-weight: var(--fw-bold);  /* 700 */
  line-height: var(--lh-h1);    /* 6.6rem PC / 5.8rem Mobile */
  letter-spacing: -0.025rem;
  color: var(--text-color1);
}

/* 본문 기본 */
.p1 {
  font-family: var(--ff-ko1);
  font-size: var(--fs-p1);        /* 1.6rem PC / 1.4rem Mobile */
  font-weight: var(--fw-regular); /* 400 */
  line-height: var(--lh-p1);      /* 2.6rem PC / 2.4rem Mobile */
  letter-spacing: -0.025rem;
  color: var(--text-color1);
}
```

---

## 사이즈 & 버튼 높이 토큰

| 이름 | 변수 | PC | 모바일 |
|------|------|-----|--------|
| XL | `--ht-xl` | 6.4rem (64px) | 5.6rem |
| Large | `--ht-lg` | 5.6rem (56px) | 4.8rem |
| **Medium (기본)** | `--ht-md` | **4.8rem (48px)** | **4.0rem** |
| Small | `--ht-sm` | 4.0rem (40px) | 3.2rem |

---

## 레이아웃

### 컨테이너
```html
<!-- 전체 너비 -->
<div class="container-full">...</div>   <!-- max-width: 100%, padding: 0 4rem (PC) / 0 1.6rem (Mobile) -->

<!-- 라지 -->
<div class="container-lg">...</div>     <!-- max-width: 1440px + 8rem -->

<!-- 미디엄 -->
<div class="container-md">...</div>     <!-- max-width: 1280px + 8rem -->

<!-- 스몰 -->
<div class="container-sm">...</div>     <!-- max-width: 1024px + 8rem -->

<!-- 풀스크린 -->
<div class="fullscreen">...</div>       <!-- height: 100vh, flex center -->
```

### 그리드 시스템
```html
<!-- 기본 12컬럼 그리드 -->
<div class="row gutter-4">
  <div class="col col-6">반 너비</div>
  <div class="col col-6">반 너비</div>
</div>

<!-- row-cols: 자동 균등 분할 -->
<div class="row row-cols-3">       <!-- PC: 3등분 -->
  <div class="col">...</div>
</div>

<!-- 반응형: MD(1200px↓) / SM(992px↓) -->
<div class="row row-cols-4 row-md-cols-2 row-sm-cols-1">
  <div class="col md-col-6 sm-col-12">...</div>
</div>
```

**col 너비**: `col-1`(8.33%) ~ `col-12`(100%)  
**gutter**: `gutter-1`(0.4rem) ~ `gutter-10`(4.0rem)

---

## 유틸리티

### Flexbox
```html
<div class="d-flex justify-content-between align-items-center">...</div>
<div class="d-flex justify-content-center">...</div>
<div class="d-flex justify-content-end align-items-start">...</div>
```

### 접근성 숨김
```html
<span class="blind">스크린리더 전용 텍스트</span>
<span class="visually-hidden">숨김 (포커스 시 표시 안 됨)</span>
```

### 아이콘 폰트
```html
<!-- ::before / ::after 로 출력 -->
<i class="ff-ico ti-heart-fill"></i>
<i class="ff-ico ti-search"></i>
<i class="ff-ico ti-close"></i>

<!-- 버튼에 아이콘 추가 -->
<button class="btnset btnset-primary btnset-icon ff-ico ti-heart-fill" type="button">좋아요</button>
<!-- 아이콘 오른쪽 배치 -->
<button class="btnset btnset-primary btnset-icon ico-right ff-ico ti-arrow-right" type="button">다음</button>
```
> 아이콘 목록: https://kit.temha.io/templates/_sample/html/icons.html

---

## 버튼 컴포넌트

### 기본 규칙
- 베이스 클래스: `btnset`
- 스타일 클래스를 추가해서 변형 (예: `btnset btnset-primary`)
- `btnset + btnset` → 자동 좌측 마진 `0.8rem`

### 채워진 버튼 (Solid)
```html
<button class="btnset btnset-primary" type="button">기본 Primary</button>
<button class="btnset btnset-secondary" type="button">보조 Secondary</button>
<button class="btnset btnset-dark" type="button">다크</button>
<button class="btnset btnset-light" type="button">라이트</button>
<button class="btnset btnset-link" type="button">링크형</button>
```

### 라인 버튼 (Outline)
```html
<button class="btnset btnset-line-primary" type="button">라인 기본</button>
<button class="btnset btnset-line-secondary" type="button">라인 보조</button>
<button class="btnset btnset-line-dark" type="button">라인 다크</button>
<button class="btnset btnset-line-light" type="button">라인 비강조</button>
<button class="btnset btnset-line-white" type="button">라인 화이트</button>
```

### 블러 버튼 (Glassmorphism)
```html
<button class="btnset btnset-blur-white" type="button">블러 화이트</button>
<button class="btnset btnset-blur-black" type="button">블러 블랙</button>
```

### 변형 클래스 조합
```html
<!-- 라운드형 -->
<button class="btnset btnset-primary btnset-round" type="button">라운드</button>

<!-- 크기 변형 -->
<button class="btnset btnset-primary btnset-lg" type="button">Large</button>
<button class="btnset btnset-primary" type="button">Medium (기본)</button>
<button class="btnset btnset-primary btnset-sm" type="button">Small</button>

<!-- 블록(전체 너비) -->
<button class="btnset btnset-primary btnset-block" type="button">블록 버튼</button>

<!-- 비활성 -->
<button class="btnset btnset-primary" disabled>비활성</button>
```

---

## 폼 컴포넌트

### 인풋 (Input)
```html
<!-- 기본 -->
<div class="inputset">
  <input type="text" class="inputset-input" placeholder="텍스트를 입력하세요">
</div>

<!-- 아이콘 포함 -->
<div class="inputset inputset-icon">
  <input type="text" class="inputset-input" placeholder="검색어 입력">
</div>

<!-- 비활성 -->
<div class="inputset">
  <input type="text" class="inputset-input" placeholder="비활성" disabled>
</div>

<!-- 오류 상태 -->
<div class="inputset inputset-error">
  <input type="text" class="inputset-input" value="잘못된 입력값">
  <span class="inputset-msg">올바른 값을 입력해주세요.</span>
</div>
```

### 체크박스 (Checkbox)
```html
<div class="checkset">
  <input type="checkbox" id="chk1" class="checkset-input">
  <label for="chk1" class="checkset-label">항목 선택</label>
</div>

<!-- 전체 선택 (indeterminate) -->
<div class="checkset checkset-all">
  <input type="checkbox" id="chkAll" class="checkset-input">
  <label for="chkAll" class="checkset-label">전체 선택</label>
</div>
```

### 라디오 (Radio)
```html
<div class="radioset">
  <input type="radio" id="rad1" name="radioGroup" class="radioset-input" checked>
  <label for="rad1" class="radioset-label">옵션 1</label>
</div>
<div class="radioset">
  <input type="radio" id="rad2" name="radioGroup" class="radioset-input">
  <label for="rad2" class="radioset-label">옵션 2</label>
</div>
```

### 셀렉트 (Select)
```html
<!-- 네이티브 셀렉트 -->
<div class="selectset">
  <select class="selectset-select">
    <option value="">선택하세요</option>
    <option value="1">옵션 1</option>
    <option value="2">옵션 2</option>
  </select>
  <span class="selectset-arrow"></span>
</div>

<!-- 커스텀 드롭다운 셀렉트 -->
<div class="selectset">
  <div class="selectset-area">
    <button class="btn selectset-toggle" type="button">선택하세요</button>
    <ul class="selectset-list">
      <li><button class="btn selectset-link" type="button">옵션 1</button></li>
      <li><button class="btn selectset-link on" type="button">옵션 2 (선택됨)</button></li>
    </ul>
  </div>
</div>

<!-- 사이즈 변형 -->
<div class="selectset selectset-lg">...</div>
<div class="selectset selectset-sm">...</div>
```

### 스위치 (Switch)
```html
<div class="switchset">
  <input type="checkbox" id="sw1" class="switchset-input">
  <label for="sw1" class="switchset-label">알림 받기</label>
</div>

<!-- 비활성 -->
<div class="switchset">
  <input type="checkbox" id="sw2" class="switchset-input" disabled>
  <label for="sw2" class="switchset-label">비활성 스위치</label>
</div>
```

---

## 콘텐츠 컴포넌트

### 카드 (Card)
```html
<!-- 기본 카드 -->
<div class="cardset">
  <a href="#" class="cardset-link">
    <div class="cardset-img">
      <img src="image.jpg" alt="카드 이미지">
    </div>
    <div class="cardset-body">
      <span class="cardset-badge p3">카테고리</span>
      <p class="cardset-tit h5">카드 제목</p>
      <p class="cardset-desc p2">카드 설명 텍스트입니다.</p>
    </div>
  </a>
</div>
```

### 텍스트 블록 (Textset)
```html
<div class="textset">
  <p class="textset-subtit p2">서브 타이틀</p>
  <p class="textset-tit h2">메인 제목</p>
  <p class="textset-desc p1">본문 설명 텍스트입니다.</p>
  <a href="#" class="textset-more more-arrow p1">더보기</a>
</div>
```

### 테이블 (Table)
```html
<div class="tableset">
  <table>
    <thead>
      <tr>
        <th>컬럼 1</th>
        <th>컬럼 2</th>
        <th>컬럼 3</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>데이터 1</td>
        <td>데이터 2</td>
        <td>데이터 3</td>
      </tr>
    </tbody>
  </table>
</div>
```

### 비디오 (Video)
```html
<!-- 기본 비디오 섹션 (PC: 63rem / Mobile: 43rem) -->
<div class="videoset">
  <video class="videoset-video" src="video.mp4" autoplay muted loop></video>
  <div class="videoset-body">
    <p class="videoset-subtit p1">서브 타이틀</p>
    <p class="videoset-tit h2">비디오 제목</p>
    <button class="videoset-play" type="button">
      <img src="play-icon.svg" alt="재생">
    </button>
  </div>
</div>

<!-- 배경 비디오 -->
<div class="video_bg">
  <iframe src="https://www.youtube.com/embed/VIDEO_ID?autoplay=1&mute=1" frameborder="0"></iframe>
</div>
```

---

## 상호작용 컴포넌트

### 아코디언 (Accordion)
```html
<div class="accordionset">
  <div class="accordionset-item">
    <button class="accordionset-btn" type="button">
      <span class="accordionset-tit p1">질문 제목</span>
    </button>
    <div class="accordionset-content">
      <p class="p1">답변 내용이 여기에 표시됩니다.</p>
    </div>
  </div>
  <div class="accordionset-item">
    <button class="accordionset-btn" type="button">
      <span class="accordionset-tit p1">두 번째 질문</span>
    </button>
    <div class="accordionset-content">
      <p class="p1">두 번째 답변 내용입니다.</p>
    </div>
  </div>
</div>
```

### 모달 (Modal)
```html
<!-- 트리거 버튼 -->
<button class="btnset btnset-primary" data-modal="modal-basic" type="button">모달 열기</button>

<!-- 기본 모달 (max-width: 80rem) -->
<div class="modalset" id="modal-basic">
  <div class="modalset-content">
    <div class="modalset-header">
      <p class="modalset-title h5">모달 제목</p>
      <button class="modalset-close" type="button"></button>
    </div>
    <div class="modalset-body">
      <p class="p1">모달 본문 내용입니다.</p>
    </div>
    <div class="modalset-footer">
      <button class="btnset btnset-line-light" data-modal-close type="button">취소</button>
      <button class="btnset btnset-primary" type="button">확인</button>
    </div>
  </div>
</div>

<!-- 사이즈 변형 -->
<!-- modalset-lg (92rem) / modalset-sm (56rem) / modalset-xs (40rem) / modalset-full -->

<!-- 알림 모달 (Confirm) -->
<div class="modalset modalset-confirm modalset-success" id="modal-confirm">
  <div class="modalset-content">
    <button class="modalset-close" type="button"></button>
    <div class="modalset-body">
      <div class="modalset-state"></div>
      <div>
        <p class="modalset-tit h5">성공하였습니다</p>
        <p class="modalset-text p1">작업이 완료되었습니다.</p>
      </div>
    </div>
  </div>
</div>
<!-- modalset-confirm + modalset-success / modalset-warning / modalset-error -->

<!-- 동영상 모달 -->
<div class="modalset modalset-video" id="modal-video">
  <div class="modalset-content">
    <button class="modalset-close" type="button"></button>
    <div class="modalset-body">
      <iframe src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allowfullscreen></iframe>
    </div>
  </div>
</div>

<!-- 다크 모달 -->
<div class="modalset modalset-dark" id="modal-dark">...</div>
```

---

## 네비게이션 컴포넌트

### 탭 (Tab)
```html
<!-- 기본 탭 -->
<div class="tabset">
  <ul class="tabset-list">
    <li class="tabset-item active">
      <button class="tabset-link" type="button">탭 1</button>
    </li>
    <li class="tabset-item">
      <button class="tabset-link" type="button">탭 2</button>
    </li>
    <li class="tabset-item">
      <button class="tabset-link" type="button">탭 3</button>
    </li>
  </ul>
  <div class="tabset-container">
    <div class="tabset-content active">탭 1 내용</div>
    <div class="tabset-content">탭 2 내용</div>
    <div class="tabset-content">탭 3 내용</div>
  </div>
</div>
```

### 드롭다운 (Dropdown)
```html
<div class="dropdownset">
  <button class="btnset btnset-primary dropdownset-toggle" type="button">메뉴</button>
  <ul class="dropdownset-menu">
    <li><a class="dropdownset-item" href="#">항목 1</a></li>
    <li><a class="dropdownset-item" href="#">항목 2</a></li>
    <li><hr class="dropdownset-divider"></li>
    <li><a class="dropdownset-item" href="#">항목 3</a></li>
  </ul>
</div>
```

### 페이지네이션 (Pagination)
```html
<nav class="paginationset">
  <button class="paginationset-prev" type="button">이전</button>
  <ul class="paginationset-list">
    <li class="paginationset-item">
      <button class="paginationset-btn" type="button">1</button>
    </li>
    <li class="paginationset-item active">
      <button class="paginationset-btn" type="button">2</button>
    </li>
    <li class="paginationset-item">
      <button class="paginationset-btn" type="button">3</button>
    </li>
  </ul>
  <button class="paginationset-next" type="button">다음</button>
</nav>
```

---

## 피드백 컴포넌트

### 뱃지 (Badge)
```html
<!-- 기본 뱃지 -->
<span class="badge badge-primary">Primary</span>
<span class="badge badge-secondary">Secondary</span>
<span class="badge badge-success">성공</span>
<span class="badge badge-danger">위험</span>
<span class="badge badge-warning">경고</span>
<span class="badge badge-info">안내</span>

<!-- 라인 뱃지 -->
<span class="badge badge-line-primary">라인 기본</span>
<span class="badge badge-line-danger">라인 위험</span>
<span class="badge badge-line-success">라인 성공</span>

<!-- 라운드 뱃지 -->
<span class="badge badge-primary badge-round">라운드</span>

<!-- 원형 뱃지 -->
<span class="badge badge-primary badge-circle">3</span>

<!-- 위치 고정 뱃지 (부모: position relative) -->
<div style="position:relative; display:inline-block;">
  <button class="btnset btnset-primary">알림</button>
  <span class="badge badge-primary badge-circle badge-top-right">5</span>
</div>

<!-- 사이즈 조정 -->
<span class="badge badge-primary badge-p2">소형 뱃지</span>
<span class="badge badge-primary badge-h6">대형 뱃지</span>
```

### 토스트 (Toast)
```html
<div class="toastset">
  <div class="toastset-item">
    <p class="toastset-text p2">저장되었습니다.</p>
    <button class="toastset-close" type="button"></button>
  </div>
</div>
```

### 툴팁 (Tooltip)
```html
<!-- 기본 (위쪽) -->
<button class="btnset btnset-primary" data-tooltip="툴팁 내용">마우스 오버</button>

<!-- 방향 지정 -->
<button data-tooltip="왼쪽 툴팁" data-tooltip-position="left">왼쪽</button>
<button data-tooltip="아래 툴팁" data-tooltip-position="bottom">아래</button>
<button data-tooltip="오른쪽 툴팁" data-tooltip-position="right">오른쪽</button>
```

---

## 이미지 & 미디어

```html
<!-- 이미지 박스 (기본 높이: 46rem) -->
<div class="imageset">
  <img class="imageset-img" src="image.jpg" alt="이미지 설명">
</div>
```

---

## 컴포넌트 구조 맵 (IA)

```
Temhakit
├── 유틸리티
│   ├── CSS 변수 (root)
│   ├── 색상 (Colors)
│   ├── 텍스트 유틸 (text_utils)
│   ├── 사이즈 (size)
│   └── 시각적으로 숨기기 (visually_hidden)
├── 콘텐츠
│   ├── 카드 (card)
│   ├── 텍스트 블록 (text)
│   ├── 테이블 (table)
│   └── 비디오 (video)
├── 폼
│   ├── 체크박스 (check)
│   ├── 인풋 (input)
│   ├── 라디오 (radio)
│   ├── 셀렉트 (select)
│   └── 스위치 (switch)
├── 상호작용
│   ├── 아코디언 (accordion)
│   ├── 버튼 (button)
│   └── 모달 (modal)
├── 네비게이션
│   ├── 드롭다운 (dropdown)
│   ├── 탭 (tab)
│   └── 페이지네이션 (pagination)
├── 레이아웃
│   └── 그리드 (grid)
└── 피드백
    ├── 뱃지 (badge)
    ├── 토스트 (toast)
    └── 툴팁 (tooltip)
```

---

## Claude Design 프롬프트 가이드

이 문서와 함께 사용할 때 아래 문장을 프롬프트 앞에 붙이세요.

> 아래는 Temhakit(템하키트) 디자인 시스템 스펙이다. 모든 컴포넌트는 이 가이드의 클래스명, 색상 변수, 타이포그래피 토큰을 정확히 사용해라. 폰트는 `--ff-ko1`(Noto Sans KR) 기본, 색상은 `--primary: #d91f29` / `--secondary: #333850`을 기준으로 하고, 컴포넌트 상위 카테고리(유틸리티/콘텐츠/폼/상호작용/네비게이션/레이아웃/피드백)를 유지하며 생성해라.

---

## 알려진 이슈

- `components/check.html` 등 일부 페이지에서 `./form.html` 링크 → **404** (파일 없음). 폼 개요는 `form_example.html` 샘플로 대체.
- 레이아웃 조각 파일(`temhakit_nav.html`, `_header.html`, `_footer.html`, `_toc.html`)은 JS로 런타임 주입되므로 별도 참조 필요.

---

*Templatehouse Design System — MIT License © 2025 Templatehouse*  
*Source: https://kit.temha.io | CSS: templatehouse.css (1627 lines)*
