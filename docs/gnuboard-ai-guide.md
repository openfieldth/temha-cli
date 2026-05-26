# 템하 그누보드 Vue 컴포넌트 — AI 통합 가이드

> **대상:** Claude, Cursor 등 AI 코딩 어시스턴트
> **목적:** 템하(Temha) 플랫폼의 그누보드 연동 Vue 컴포넌트를 HTML에서 올바르게 구현하기 위한 단일 참조 문서
> **목록·상세:** 메인 블록+모달(§4-1) vs 갤러리형 다페이지+`list-modal.js`(§4-2) — **§4에서 먼저 방식을 선택**할 것

### Temha CLI에서의 참고 사항

| 항목 | CLI 동작 |
|------|----------|
| `data-gb-url` | `gulp` / `gulp temha` 미리보기 빌드 시, 그누보드 연동 프로젝트의 `<body>`에 자동 주입 (`project.json` 또는 API의 도메인 사용) |
| 페이지 HTML 파일명 | 각 페이지 폴더의 `page.json` → `pageName` (예: `notice_list.html`) |
| 미리보기 리소스 경로 | 생성된 HTML에서는 `./resources/...` 기준 (워크스페이스 블록 원본은 `../resources/...`일 수 있음) |
| 페이지 간 링크 | `data-gb-list-link`, `data-gb-view-link` 등은 `pageName`과 동일한 파일명을 사용 |

---

## 1. 공통 규칙 (모든 컴포넌트에 적용)

### 1-1. 서버 URL 선언
```html
<body data-gb-url="https://your-server.com/gnuboard/">
```
- `data-gb-url`은 **`<body>` 태그에 단 한 번만** 선언. 하위 컴포넌트가 자동 참조.

### 1-2. 초기화 함수 목록

| 컴포넌트 | 초기화 함수 | 루트 클래스 |
|----------|-------------|-------------|
| 로그인 | `vue_gnulogin(el)` | `.login-app` |
| 회원가입 | `vue_gnulogin(el)` | `.signup-app` |
| 목록/글쓰기/수정/상세 | `vue_gnuboard(el)` | `.gnuboard` |
| 프로필 수정 | `vue_gnuprofile(el)` | `.profile-app` |

```javascript
// 공통 초기화 패턴 (클래스명만 바꿔서 재사용)
(function() {
  $(function() {
    $(".내블록클래스").each(function() {
      const $gnu = $(this).find(".gnuboard"); // 또는 .login-app 등
      if ($gnu.length) vue_gnuboard($gnu[0]); // DOM 요소 직접 전달 (selector 문자열 불가)
    });
  });
})();
```

### 1-3. 에디터 환경 패턴 (isEditor)
에디터 미리보기에서는 `env === 'editor'`이며, 이때 화면 전환 영역이 동시에 표시되고 버튼이 항상 활성화되어야 한다.

```html
<!-- 버튼 비활성화 조건에 항상 !isEditor && 를 앞에 붙인다 -->
<button :disabled="!isEditor && !isFormValid">제출</button>
<button :disabled="!isEditor && !canProceedToSignup">다음</button>
```

### 1-4. 화면 전환 디렉티브 (status 기반)
에디터에서는 모든 영역이 동시 표시되고, 실제 운영에서는 `status`에 따라 하나만 표시된다.

---

## 2. 로그인 (Login)

### HTML 구조
```html
<div class="login-app"
  data-gb-signup-link="register.html"
  data-gb-find-password-link="find.html"
  data-gb-redirect="list.html"
  data-gb-initial-status="login">

  <div v-if="alert.show" :class="alert.type">{{ alert.message }}</div>

  <input type="text" v-model="login_form.username" :disabled="loading" placeholder="아이디">
  <input type="password" v-model="login_form.password" :disabled="loading"
    @keyup.enter="handleLogin" placeholder="비밀번호">
  <input type="checkbox" v-model="login_form.rememberMe"> 아이디 저장

  <a :href="getFindPasswordLink()">비밀번호 찾기</a>
  <button :disabled="loading" @click="handleLogin">로그인</button>
  <a :href="getSignupLink()">회원가입</a>
</div>
```

### 핵심 속성/변수

| 항목 | 설명 |
|------|------|
| `data-gb-redirect` | 로그인 성공 후 이동 경로. 이미 로그인 상태이면 자동 리다이렉트 |
| `login_form.username` | 아이디 |
| `login_form.password` | 비밀번호 |
| `login_form.rememberMe` | 아이디 저장 체크박스 |
| `loading` | 요청 중 여부 (true이면 입력/버튼 비활성) |
| `alert.show / .message / .type` | 오류 메시지 표시 (`success` / `error`) |
| `handleLogin()` | 로그인 실행 |
| `getSignupLink()` | 회원가입 링크 반환 |
| `getFindPasswordLink()` | 비밀번호 찾기 링크 반환 |

---

## 3. 회원가입 (Signup)

### HTML 구조
```html
<div class="signup-app"
  data-gb-login-link="login.html"
  data-gb-initial-status="terms">

  <!-- 약관 동의 단계 -->
  <div v-gb-terms>
    <input type="checkbox" v-model="agreeAll" @change="toggleAllAgree">
    <input type="checkbox" v-model="agreements.stipulation">
    <div v-html="terms.stipulation"></div>       <!-- 약관: v-html 사용 -->
    <input type="checkbox" v-model="agreements.privacy">
    <div>{{ terms.privacy }}</div>               <!-- 개인정보: 텍스트 보간 사용 -->
    <a :href="getLoginLink()">취소</a>
    <button type="button" v-gb-btn-signup :disabled="!isEditor && !canProceedToSignup">다음</button>
  </div>

  <!-- 회원가입 폼 단계 -->
  <div v-gb-signup>
    <input type="text" v-model="signup_form.mb_name" placeholder="이름">

    <!-- 아이디 중복 확인 -->
    <input type="text" v-model="signup_form.mb_id" :class="{ error: validation.mb_id === false }">
    <button @click="checkDuplicate('mb_id')" :disabled="!signup_form.mb_id">중복 확인</button>
    <p v-if="validation.mb_id === true" class="success">✓ 사용 가능합니다.</p>
    <p v-if="validation.mb_id === false" class="error">✗ 이미 사용 중입니다.</p>

    <input type="password" v-model="signup_form.mb_password" placeholder="비밀번호 (8자 이상)">
    <p v-if="signup_form.mb_password && signup_form.mb_password.length < 8" class="error">8자 이상이어야 합니다.</p>

    <input type="password" v-model="signup_form.mb_password_re" placeholder="비밀번호 확인">
    <p v-if="signup_form.mb_password_re && signup_form.mb_password !== signup_form.mb_password_re" class="error">비밀번호가 일치하지 않습니다.</p>

    <!-- 닉네임 중복 확인 -->
    <input type="text" v-model="signup_form.mb_nick" :class="{ error: validation.mb_nick === false }">
    <button @click="checkDuplicate('mb_nick')" :disabled="!signup_form.mb_nick">중복 확인</button>

    <input type="text" v-model="signup_form.mb_email" placeholder="이메일">

    <!-- 조건부 필드 (서버 설정에 따라 표시) -->
    <div v-if="showHomepage"><input type="url" v-model="signup_form.mb_homepage" :required="reqHomepage"></div>
    <div v-if="showTel"><input type="tel" v-model="signup_form.mb_tel" :required="reqTel"></div>
    <div v-if="showHp"><input type="tel" v-model="signup_form.mb_hp" :required="reqHp"></div>
    <template v-if="showAddr">
      <input type="text" v-model="signup_form.mb_zip" :required="reqAddr">
      <input type="text" v-model="signup_form.mb_addr1" :required="reqAddr">
      <input type="text" v-model="signup_form.mb_addr2">
    </template>
    <div v-if="showSignature"><input type="text" v-model="signup_form.mb_signature" :required="reqSignature"></div>
    <div v-if="showProfile"><textarea v-model="signup_form.mb_profile" :required="reqProfile"></textarea></div>
    <div v-if="showRecommend"><input type="text" v-model="signup_form.mb_recommend"></div>

    <!-- 수신 동의 (0/1 매핑) -->
    <input type="checkbox" v-model="signup_form.mb_sms" :true-value="1" :false-value="0"> SMS 수신
    <input type="checkbox" v-model="signup_form.mb_mailling" :true-value="1" :false-value="0"> 메일링
    <input type="checkbox" v-model="signup_form.mb_open" :true-value="1" :false-value="0"> 정보공개

    <button type="button" v-gb-btn-terms>이전 단계로</button>
    <button type="button" :disabled="!isEditor && !isFormValid" @click="handleSignup">가입완료</button>
  </div>
</div>
```

### 핵심 변수/디렉티브

| 항목 | 설명 |
|------|------|
| `v-gb-terms` / `v-gb-signup` | 약관/폼 단계 영역 전환 |
| `v-gb-btn-signup` / `v-gb-btn-terms` | 단계 전환 버튼 |
| `agreeAll` + `@change="toggleAllAgree"` | 전체 동의 |
| `agreements.stipulation` / `.privacy` | 개별 약관 동의 여부 |
| `canProceedToSignup` | 두 약관 모두 동의 시 true |
| `validation.mb_id` / `.mb_nick` | null: 미확인 / true: 사용가능 / false: 사용불가 |
| `checkDuplicate('mb_id')` | 중복 확인 실행 |
| `isFormValid` | 가입 버튼 활성화 조건 (모든 필수 필드 + 중복 확인 완료) |
| `showXxx` / `reqXxx` | 서버 설정 기반 조건부 표시/필수 계산 속성 |

---

## 4. 목록·상세 연동 — 제작 방식 (AI 필독)

그누보드 목록·상세는 **요구사항에 따라 아래 두 방식 중 하나**를 선택한다. 혼동하지 말 것: **방식 B의 모달도 `view.html` 파일을 AJAX로 불러오지 않는다.** 상세 API(JSON)만 호출해 모달 DOM을 채운다.

### 4-1. 방식 A — 메인(랜딩) 페이지 블록 + 목록 API + 모달 상세

**용도:** 홈·소개 등 **단일 페이지** 안에 “최신 작업”, “공지 일부”처럼 **게시판 일부만 노출**하고, 카드 클릭 시 **같은 페이지에서 레이어(모달)로 상세**를 보여 줄 때.

| 항목 | 내용 |
|------|------|
| 페이지 구성 | 목록 전용 `*_list.html` / 상세 전용 `*_view.html` **없이** 메인 블록만으로 구현 가능 |
| 목록 데이터 | 블록 HTML에 `v-gb-list` + `vue_gnuboard` → `br.writes` |
| 상세 표시 | **별도 상세 페이지로 이동하지 않음** (기본 UX). `fetch` → `GET …/api/v1/boards/{bo_table}/writes/{wr_id}` → 모달에 제목·이미지·본문 등 채움 |
| `data-gb-view-link` | SEO·접근성·에디터용으로 **선언은 권장** (`getViewLink`용). 카드 클릭 시 JS에서 `preventDefault`로 페이지 이동 차단 |
| 모달 마크업 | Vue 템플릿이 **아닌** 순수 HTML (`modalset` 등) + 블록 전용 JS |
| 블록 JS | `openfield-works-N1.js`처럼 블록 폴더에 구현 → `gulp` 시 `index.style.js`에 합쳐짐 |

**구현 체크리스트**

1. 블록 폴더에 **`블록명-N1.html` / `.css` / `.js` 세트** (§4-3)
2. `.gnuboard`에 `data-gb-table`, `data-gb-list-link`(보통 `index.html`), `data-gb-view-link`(선택)
3. `v-gb-list` + `v-gb-list-onload="true"` + 카드에 `:href="getViewLink(item.wr_id)"` + `:data-gb-wr-id="item.wr_id"`
4. 모달 HTML(§4-1) + 블록 JS(§4-1) — `closest('a.my-block-card[data-gb-wr-id]')`와 카드 클래스 **일치**
5. `vue_gnuboard(gnuRoot)` 초기화
6. **CSS:** 프로젝트 `templatehouse.css` 로드 필수 (`modalset` / `modalset-active`). 블록 CSS는 레이아웃·크기만
7. Swiper 사용 시 `preventClicks: false`, `preventClicksPropagation: false`

**CLI 참고 구현:** `템하-workspace/…/content/openfield-works-N1/`

#### 방식 A — 블록 HTML 최소 골격 (목록 + 모달)

§5 목록 규칙과 합쳐 아래처럼 **한 블록 파일**로 만든다. 루트 클래스(`my-block-N1`)는 JS의 `querySelectorAll`·카드 선택자와 동일하게 맞출 것.

```html
<div class="my-block-N1">
  <div class="gnuboard"
    data-gb-table="gallery"
    data-gb-list-link="index.html"
    data-gb-view-link="gallery_view.html">

    <div v-gb-list="" v-gb-list-row="12" v-gb-list-page="5" v-gb-list-onload="true">
      <a class="my-block-card card"
         v-for="item in br.writes"
         :key="item.wr_id"
         :href="getViewLink(item.wr_id)"
         :data-gb-wr-id="item.wr_id">
        <img v-if="getListItemImage(item)"
             :src="getListItemImage(item)"
             :alt="item.wr_subject"
             data-gb-tpl="wr_thumbnail">
        <strong data-gb-tpl="wr_subject">{{ item.wr_subject }}</strong>
      </a>
      <p v-if="br.writes && br.writes.length === 0 && !isGbEditorEnv">등록된 글이 없습니다.</p>
    </div>

    <!-- §4-1 모달 HTML 붙여 넣기 -->
  </div>
</div>
```

#### 방식 A — 모달 HTML 예시 (블록 안, Vue 바인딩 없음)

```html
<!-- 블록 .gnuboard 안, v-gb-list 아래 -->
<div class="modalset modalset-dark modalset-full my-block-modal" id="my-block-modal">
  <div class="modalset-content my-block-modal-panel">
    <div class="modalset-header">
      <p class="modalset-title h4" id="my-block-modal-title">제목</p>
      <button type="button" class="modalset-close" id="my-block-modal-close">
        <span class="blind">닫기</span>
      </button>
    </div>
    <div class="modalset-body">
      <figure class="imageset" id="my-block-modal-figure" hidden>
        <img class="imageset-img" id="my-block-modal-img" alt="">
      </figure>
      <!-- 필요 시 본문 영역 추가. 갤러리 이미지 1장만 쓸 때는 figure만 두어도 됨 -->
    </div>
  </div>
</div>
```

#### 방식 A — 블록 JS 예시 (`my-block-N1.js`)

> `gulp` 빌드 시 페이지 `index.style.js`에 합쳐진다. **별도 `list-modal.js` 첨부 없이** 블록 폴더에 이 파일을 두면 된다.

```javascript
(function () {
  var clickBound = false;

  function getModalEls() {
    return {
      overlay: document.getElementById('my-block-modal'),
      title: document.getElementById('my-block-modal-title'),
      figure: document.getElementById('my-block-modal-figure'),
      img: document.getElementById('my-block-modal-img'),
    };
  }

  function getGbConfig(gnuRoot) {
    return {
      gbUrl: (document.body && document.body.getAttribute('data-gb-url')) || '',
      boTable: (gnuRoot && gnuRoot.getAttribute('data-gb-table')) || '',
    };
  }

  function openModal() {
    var m = getModalEls();
    if (!m.overlay) return;
    m.overlay.classList.add('modalset-active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    var m = getModalEls();
    if (!m.overlay) return;
    m.overlay.classList.remove('modalset-active');
    document.body.style.overflow = '';
  }

  function getDetailImageSrc(bs) {
    if (!bs) return '';
    if (bs.wr_content && typeof bs.wr_content === 'string') {
      var match = bs.wr_content.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (match && match[1]) return match[1].trim();
    }
    if (bs.images && bs.images[0] && bs.images[0].original) {
      return String(bs.images[0].original).trim();
    }
    return '';
  }

  function openDetail(wrId, cfg) {
    var m = getModalEls();
    if (!m.overlay || !wrId) return;
    openModal();
    if (m.title) m.title.textContent = '불러오는 중…';
    if (m.figure) m.figure.hidden = true;

    var apiUrl =
      cfg.gbUrl.replace(/\/?$/, '/') +
      'api/v1/boards/' +
      encodeURIComponent(cfg.boTable) +
      '/writes/' +
      encodeURIComponent(String(wrId));
    var headers = {};
    var token = localStorage.getItem('gb_access_token');
    if (token) headers.Authorization = 'Bearer ' + token;

    fetch(apiUrl, { headers: headers })
      .then(function (res) {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then(function (bs) {
        if (m.title) m.title.textContent = bs.wr_subject || '';
        var src = getDetailImageSrc(bs);
        if (m.img && m.figure && src) {
          m.img.src = src;
          m.img.alt = bs.wr_subject || '';
          m.figure.hidden = false;
        }
      })
      .catch(function (err) {
        console.error('[my-block]', err);
        if (m.title) m.title.textContent = '오류';
      });
  }

  function onCardClick(evt) {
    var card = evt.target && evt.target.closest
      ? evt.target.closest('a.my-block-card[data-gb-wr-id]')
      : null;
    if (!card) return;
    var gnuRoot = card.closest('.gnuboard');
    if (!gnuRoot) return;
    evt.preventDefault();
    evt.stopPropagation();
    var wrId = card.getAttribute('data-gb-wr-id');
    if (!wrId) return;
    openDetail(wrId, getGbConfig(gnuRoot));
  }

  function bindModalClose() {
    document.addEventListener('click', function (evt) {
      if (evt.target.closest('#my-block-modal-close')) {
        evt.preventDefault();
        closeModal();
        return;
      }
      var overlay = evt.target.closest('#my-block-modal');
      if (overlay && evt.target === overlay) closeModal();
    }, true);
  }

  function initBlock(blockEl) {
    var gnuRoot = blockEl.querySelector('.gnuboard');
    if (gnuRoot && typeof vue_gnuboard === 'function' && !gnuRoot.__vue__) {
      vue_gnuboard(gnuRoot);
    }
  }

  function boot() {
    if (!clickBound) {
      clickBound = true;
      document.addEventListener('click', onCardClick, true);
    }
    bindModalClose();
    document.querySelectorAll('.my-block-N1').forEach(initBlock);
  }

  if (typeof $ === 'function') $(boot);
  else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
```

---

### 4-2. 방식 B — 갤러리형 다페이지(목록·상세·쓰기) + 목록 블록 패키지(`list-modal.js`)

**용도:** 공지·갤러리·뉴스처럼 **목록 / 상세 / 글쓰기·수정을 각각 별도 HTML 페이지**로 운영할 때. 템하 프로젝트에 `gallery_list.html`, `gallery_view.html`, `gallery_write.html` 등 **페이지 단위**로 구성.

| 항목 | 내용 |
|------|------|
| 페이지 구성 | `page.json`의 `pageName` 기준으로 목록·상세·쓰기 페이지 **각각 생성** (가이드 §5 목록, §6 상세, §7 글쓰기·수정 참고) |
| 목록 페이지 | `v-gb-list` + Vue 템플릿으로 그리드·페이지네이션 |
| 상세 페이지 | `data-gb-initial-status="read"` + `?wr_id=` → `bs` 바인딩, `v-html="bs.wr_content"` 등 (**전체 화면 상세**) |
| 목록에서 모달 상세 (선택) | 목록 페이지에 모달 HTML + **`list-modal.js` 패턴**을 목록 블록 JS에 포함해 전달. 클릭 시 **상세 API(JSON)** 로 모달만 채움 → **`view.html` AJAX 로드 아님** |
| 패키지 전달 | 배포 예제 `gnuboard-gallery-modal/list-modal.js` 내용을 **목록 블록의 `*-N1.js`** 에 넣어 블록 단위로 제공 (파일명은 블록에 맞게 변경 가능) |

**예제 파일 세트 (저장소·배포용)**

| 파일 | 역할 |
|------|------|
| `list.html` | 목록 + 모달 마크업, `v-gb-list` |
| `list-modal.js` | 목록 클릭 → API → 모달 (**목록 블록 `*-N1.js`에 포함**) |
| `view.html` | **독립 상세 페이지** (`?wr_id=`, Vue read) |

> **저장소 경로:** `docs/examples/gnuboard-gallery-modal/` (`list-modal.js` 포함). Desktop 예제와 동일 패턴.

**CLI 참고:** `gallery_list.html` + `gallery_view.html`. 목록 블록에 모달을 쓰면 `gb5-board-N2.js` 등에 아래 스크립트를 넣는다.

#### 방식 B — 목록 카드 HTML (모달용)

```html
<a class="card"
   v-for="item in br.writes"
   :key="item.wr_id"
   :href="getViewLink(item.wr_id)"
   :data-gb-wr-id="item.wr_id">
  <img v-if="getListItemImage(item)" :src="getListItemImage(item)" :alt="item.wr_subject">
  <strong data-gb-tpl="wr_subject">{{ item.wr_subject }}</strong>
</a>
```

`button.card` 대신 `<a>`를 써도 되나, **반드시 `data-gb-wr-id`** 와 JS의 `closest('.card[data-gb-wr-id]')` 선택자가 일치해야 한다.

#### 방식 B — 모달 HTML 예시 (`.gnuboard` 안)

```html
<div id="gb-modal-overlay" class="gb-overlay" style="display:none;">
  <div class="gb-dialog" role="dialog" aria-modal="true">
    <div class="gb-dialog-head">
      <h2 id="gb-modal-subject">제목</h2>
      <button type="button" class="gb-close" id="gb-modal-close" aria-label="닫기">×</button>
    </div>
    <div class="gb-dialog-body">
      <p id="gb-modal-meta" style="display:none;"></p>
      <div id="gb-modal-content" class="gb-empty ql-editor">불러오는 중…</div>
      <p style="margin-top:1rem;">
        <a id="gb-modal-view-link" href="#" target="_blank" rel="noopener" style="display:none;">
          view.html에서 열기
        </a>
      </p>
    </div>
  </div>
</div>
```

`gb-overlay` / `gb-dialog` 스타일은 **목록 블록 CSS에 반드시 포함**한다. 최소 CSS는 §4-5 또는 `docs/examples/gnuboard-gallery-modal/modal-overlay.min.css` 참고.

#### 방식 B — 블록 HTML 최소 골격 (목록 페이지용)

```html
<div class="gb-board-list-N1">
  <div class="gnuboard"
    data-gb-table="gallery"
    data-gb-table-name="갤러리"
    data-gb-list-link="gallery_list.html"
    data-gb-view-link="gallery_view.html"
    data-gb-text-limit="80">

    <div v-gb-list="" v-gb-list-row="12" v-gb-list-page="5" v-gb-list-onload="true">
      <!-- §4-2 카드 + 페이지네이션(§5 참고) -->
      <a class="card" v-for="item in br.writes" :key="item.wr_id"
         :href="getViewLink(item.wr_id)" :data-gb-wr-id="item.wr_id">…</a>
    </div>

    <!-- §4-2 모달 HTML -->
  </div>
</div>
```

**상세 전용 페이지**(`gallery_view.html`)는 §6. 목록에서 모달만 쓸 때도 `data-gb-view-link`와 모달 안 “전용 상세 열기” 링크 파일명을 **동일하게** 둔다.

#### 방식 B — `list-modal.js` 전체 (목록 블록 JS에 그대로 넣거나 ID만 수정)

아래는 `docs/examples/gnuboard-gallery-modal/list-modal.js` 와 동일하다. **AI는 이 패턴으로 블록 `*-N1.js`를 작성**한다. 사용자가 Desktop 예제를 첨부하지 않아도 이 가이드만으로 구현 가능하다.

```javascript
(function () {
  function getModalEls() {
    return {
      overlay: document.getElementById('gb-modal-overlay'),
      subjectEl: document.getElementById('gb-modal-subject'),
      metaEl: document.getElementById('gb-modal-meta'),
      contentEl: document.getElementById('gb-modal-content'),
      viewLinkEl: document.getElementById('gb-modal-view-link'),
    };
  }

  function closeModal() {
    var m = getModalEls();
    if (m.overlay) m.overlay.style.display = 'none';
  }

  function openModal() {
    var m = getModalEls();
    if (m.overlay) m.overlay.style.display = 'flex';
  }

  function handleCardClick(e, rootEl, gbUrl, boTable, accessToken) {
    var target = e && e.target ? (e.target.nodeType === 1 ? e.target : e.target.parentElement) : null;
    var card = target && target.closest ? target.closest('.card[data-gb-wr-id]') : null;
    if (!card) return;
    if (e.preventDefault) e.preventDefault();

    var wrId = card.getAttribute('data-gb-wr-id');
    if (!wrId) return;

    var m = getModalEls();
    if (!m.overlay || !m.subjectEl || !m.contentEl) return;

    openModal();
    m.subjectEl.textContent = '불러오는 중...';
    if (m.metaEl) m.metaEl.style.display = 'none';
    m.contentEl.textContent = '불러오는 중…';
    if (m.viewLinkEl) m.viewLinkEl.style.display = 'none';

    var apiUrl =
      gbUrl.replace(/\/?$/, '/') +
      'api/v1/boards/' +
      encodeURIComponent(boTable) +
      '/writes/' +
      encodeURIComponent(String(wrId));
    var headers = {};
    if (accessToken) headers.Authorization = 'Bearer ' + accessToken;

    fetch(apiUrl, { headers: headers })
      .then(function (res) {
        if (!res.ok) throw new Error('상세 API 오류: ' + res.status);
        return res.json();
      })
      .then(function (bs) {
        m.subjectEl.textContent = bs.wr_subject || '제목';
        if (bs.wr_id) {
          if (m.metaEl) {
            m.metaEl.textContent =
              (bs.wr_datetime || '') + ' · ' + (bs.wr_name || '') + ' · 조회 ' + (bs.wr_hit || 0);
            m.metaEl.style.display = 'block';
          }
          m.contentEl.className = 'ql-editor';
          m.contentEl.innerHTML = bs.wr_content || '<p>본문이 없습니다.</p>';
          if (m.viewLinkEl && rootEl) {
            var viewPage =
              (rootEl.getAttribute('data-gb-view-link') || 'view.html').replace(/^\.\//, '');
            m.viewLinkEl.href = viewPage + (viewPage.indexOf('?') >= 0 ? '&' : '?') + 'wr_id=' + bs.wr_id;
            m.viewLinkEl.style.display = 'inline';
          }
        }
      })
      .catch(function (err) {
        console.error(err);
        m.contentEl.textContent = '상세 로드 중 오류가 발생했습니다.';
      });
  }

  function boot() {
    var rootEl = document.querySelector('.gnuboard');
    if (!rootEl) return;
    var gbUrl = (document.body && document.body.getAttribute('data-gb-url')) || '';
    var boTable = rootEl.getAttribute('data-gb-table') || '';
    var accessToken = localStorage.getItem('gb_access_token') || '';

    document.addEventListener('click', function (evt) {
      if (evt.target.closest('#gb-modal-close')) {
        evt.preventDefault();
        closeModal();
        return;
      }
      var overlay = evt.target.closest('#gb-modal-overlay');
      if (overlay && evt.target === overlay) closeModal();
    }, true);

    document.addEventListener('click', function (evt) {
      handleCardClick(evt, rootEl, gbUrl, boTable, accessToken);
    }, true);

    if (typeof vue_gnuboard === 'function' && !rootEl.__vue__) {
      vue_gnuboard(rootEl);
    }
  }

  if (typeof $ === 'function') $(boot);
  else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
```

`viewLinkEl.href`는 `.gnuboard`의 `data-gb-view-link`(예: `gallery_view.html`)를 사용한다(위 예시 JS 반영).

#### 방식 B — 모달 CSS 최소 (블록 CSS에 포함)

```css
.gb-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 1.6rem;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.55);
}
.gb-dialog {
  display: flex;
  flex-direction: column;
  width: min(100%, 80rem);
  max-height: min(90vh, 120rem);
  overflow: hidden;
  background: #fff;
  border-radius: 1rem;
}
.gb-dialog-body {
  flex: 1;
  min-height: 0;
  padding: 1.6rem;
  overflow: auto;
}
.gb-dialog-body img {
  max-width: 100%;
  height: auto;
}
```

전체 스니펫: `docs/examples/gnuboard-gallery-modal/modal-overlay.min.css`

---

### 4-3. 블록 JavaScript — AI 작성 규칙

| 규칙 | 설명 |
|------|------|
| **파일 위치** | `content/블록명/블록명-N1.js` (블록 HTML·CSS와 같은 폴더) |
| **빌드** | Temha CLI `gulp` 시 해당 페이지 `index.style.js`에 자동 합침. `<script src="./list-modal.js">` 별도 태그 **불필요** |
| **의존성** | 페이지에 `resources/js/temhagnu.js`(또는 빌드된 동일 스크립트) + Vue 2 + (에디터 본문 시) Quill |
| **초기화** | `vue_gnuboard(gnuRoot)` — 목록 API. 모달 상세는 **추가 `fetch`**, `vm.read()`만으로 모달 채우지 않음 |
| **클릭** | `document.addEventListener('click', …, true)` 캡처 위임 — Vue 재렌더 후에도 동작 |
| **상세 API** | `GET {data-gb-url}api/v1/boards/{data-gb-table}/writes/{wr_id}` + 선택 `Authorization: Bearer` |
| **금지** | `view.html` / `gallery_view.html` **HTML을 AJAX·load로 삽입** |

---

### 4-5. 이 문서만으로 AI 구현 가능한가? (검증)

**질문:** Desktop `examples` 첨부 없이 `gnuboard-ai-guide.md`만 보고 **목록 + 모달(방식 A·B)** 을 만들 수 있는가?

**답:** **가능하다.** 단, 아래 표의 **모든 행**을 만족해야 하며, §4만 보고 §5·§6을 생략하면 목록·상세 규칙이 빠진다.

| 구분 | 방식 A (메인 블록 + 모달) | 방식 B (목록 페이지 + 모달) |
|------|---------------------------|-----------------------------|
| 이 문서 §4 | 모달 HTML·JS·목록 골격·체크리스트 | 모달 HTML·JS·CSS·목록 골격 |
| 이 문서 §5 | `v-gb-list`, `data-gb-tpl`, `getListItemImage` 등 **필수** | 동일 + 페이지네이션 |
| 이 문서 §6 | 메인만 쓸 때 **생략 가능** | `*_view.html` 전체 상세 페이지 만들 때 **필수** |
| 프로젝트 리소스 | `temhagnu.js`, Vue 2, Quill(본문 HTML), **`templatehouse.css`**(방식 A modalset) | `temhagnu.js`, Vue 2, Quill, **블록 CSS에 gb-overlay**(§4-2) |
| CLI | `gulp` / `gulp temha`로 `data-gb-url`·`index.style.js` 합침 | 동일 |
| 별도 첨부 | 불필요 (`docs/examples/gnuboard-gallery-modal/` 참고 가능) | 불필요 |

**문서에 없어서 AI가 알아서 해야 하는 것 (정상 범위)**

- 블록 **디자인·레이아웃·Swiper** 등 프로젝트별 UI
- 갤러리 **원본 이미지 URL** 추출(썸네일 제외) — 필요 시 `openfield-works-N1.js` 참고
- `page.json` / `block_order.json` 등 **페이지·블록 등록** (Temha CLI 워크스페이스 규칙)

**이 문서만으로 부족한 경우**

- 글쓰기·수정·댓글 → §7 이후 참고
- 로그인·회원가입 → §2·§3
- `view.html` / `gallery_view.html` **HTML을 fetch·load로 모달에 삽입** → 금지, §4와 무관한 잘못된 요구

---

### 4-4. 방식 선택 요약

| 구분 | 방식 A (메인 블록 + 모달) | 방식 B (다페이지 게시판) |
|------|---------------------------|---------------------------|
| 대표 페이지 | `index.html` 한 장 안 블록 | `*_list.html`, `*_view.html`, `*_write.html` |
| 상세 UX | 같은 페이지 **모달** (기본) | **상세 전용 페이지** (기본). 목록+모달은 선택 |
| 상세 데이터 로드 | `fetch` JSON API | 상세 페이지: Vue `read` / 모달: `fetch` JSON API |
| `view.html` AJAX | **사용 안 함** | **사용 안 함** |
| JS 패키지 | 블록 전용 JS (예: `openfield-works-N1.js`) | 목록 블록에 `list-modal.js` 패턴 포함 가능 |
| `data-gb-view-link` | 있어도 클릭은 막고 모달 (일반적) | 실제 상세 페이지로 이동·링크 공유 |

**AI 작업 시:** 사용자가 “메인에 최신글 + 팝업”이면 **방식 A**, “게시판 목록/상세/쓰기 페이지 만들어 달라”면 **방식 B**. 둘 다 필요하면 메인 블록(방식 A)과 `gallery_view.html`(방식 B)을 **같은 `data-gb-table`** 로 두되, 역할을 문서화할 것.

---

## 5. 목록 (List)

### HTML 구조
```html
<div class="gnuboard"
  data-gb-table="notice"
  data-gb-table-name="공지사항"
  data-gb-list-link="list.html"
  data-gb-view-link="viewer.html"
  data-gb-text-limit="50">

  <div v-gb-list=""
       v-gb-list-row="10"
       v-gb-list-page="5"
       v-gb-list-onload="true">

    <p>총 {{br.total_records}}개</p>

    <!-- 검색 -->
    <input type="text" v-model="filter.stx" @keyup.enter="search" placeholder="검색어">
    <button @click="search">검색</button>

    <!-- 게시글 목록 — data-gb-wr-id 필수 -->
    <a :href="getViewLink(item.wr_id)"
       v-for="item in br.writes" :key="item.wr_id"
       :data-gb-wr-id="item.wr_id">

      <img v-if="getListItemImage(item)" :src="getListItemImage(item)"
           :alt="item.wr_subject" data-gb-tpl="wr_thumbnail">
      <span v-if="item.ca_name" data-gb-tpl="ca_name">{{item.ca_name}}</span>
      <strong data-gb-tpl="wr_subject">{{item.wr_subject}}</strong>
      <p data-gb-tpl="wr_content">{{item.wr_content}}</p>
      <p v-if="item.wr_1" data-gb-tpl="wr_1">{{item.wr_1}}</p>
      <span data-gb-tpl="wr_name">{{item.wr_name}}</span>
      <span data-gb-tpl="wr_datetime">{{item.wr_datetime}}</span>
      <span data-gb-tpl="wr_hit">{{item.wr_hit}}</span>
    </a>

    <!-- 페이지네이션 -->
    <a v-gb-list-first-show="" v-gb-list-btn-first="">처음</a>
    <a v-gb-list-prev-show="" v-gb-list-btn-prev="">이전</a>
    <a v-for="page in pagination.pages" v-gb-list-btn-page="page"
       v-gb-list-page-active-class="'active'">{{page}}</a>
    <a v-gb-list-next-show="" v-gb-list-btn-next="">다음</a>
    <a v-gb-list-last-show="" v-gb-list-btn-last="">마지막</a>

    <a v-if="canWrite" :href="getWriteLink()">글쓰기</a>
  </div>
</div>
```

### 핵심 규칙

| 규칙 | 설명 |
|------|------|
| `data-gb-tpl="필드명"` | `{{item.필드명}}`과 **항상 함께** 사용 (데이터 동기화) |
| `:data-gb-wr-id="item.wr_id"` | 이미지 로드에 필수. 누락 시 썸네일 미표시 |
| `v-gb-list-onload="true"` | 페이지 로드 시 자동 목록 조회. 누락 시 목록 안 나옴 |
| `data-gb-text-limit="50"` | 내용 글자 수 제한. `.gnuboard`에 선언하면 전체 적용 |
| `getListItemImage(item)` | 썸네일 반환 함수 (첨부이미지 → 본문img → 기본이미지 순) |
| `br.writes` | 게시글 배열 |
| `br.total_records` | 전체 게시글 수 |

---

## 6. 상세보기 (Read)

### HTML 구조
```html
<div class="gnuboard"
  data-gb-table="notice"
  data-gb-list-link="list.html"
  data-gb-write-link="write.html"
  data-gb-initial-status="read">

  <!-- URL에 ?wr_id=번호 필요 -->

  <h2>{{ bs.wr_subject }}</h2>
  <p v-if="bs.wr_id">{{ bs.wr_datetime }} | {{ bs.wr_name }} | 조회 {{ bs.wr_hit }}</p>
  <span v-if="bs.ca_name">{{ bs.ca_name }}</span>

  <!-- 추가 필드 -->
  <h4 v-if="bs.wr_1">{{ bs.wr_1 }}</h4>
  <a v-if="bs.wr_3" :href="bs.wr_3" target="_blank">관련 링크</a>

  <!-- 본문: 반드시 v-html 사용 -->
  <div v-if="bs.wr_id" v-html="bs.wr_content"></div>

  <!-- 첨부파일 -->
  <ul v-if="bs.normal_files && bs.normal_files.length > 0">
    <li v-for="file in bs.normal_files" :key="file.bf_no">
      <span>{{ file.bf_source }} ({{ formatFileSize(file.bf_filesize) }})</span>
      <a :href="file.bf_file">다운로드</a>
    </li>
  </ul>

  <!-- 이미지 갤러리 -->
  <ul v-if="bs.images && bs.images.length > 0">
    <li v-for="(file, index) in bs.images" :key="index">
      <a :href="file.original" target="_blank">
        <img :src="file.thumbnail" :alt="file.filename">
      </a>
    </li>
  </ul>

  <!-- 이전글/다음글 -->
  <a v-if="bs.next_wr_subject" :href="'?wr_id=' + bs.next_wr_id">
    NEXT | {{ bs.next_wr_subject }}
  </a>
  <a v-if="bs.prev_wr_subject" :href="'?wr_id=' + bs.prev_wr_id">
    PREV | {{ bs.prev_wr_subject }}
  </a>

  <!-- 하단 버튼 -->
  <a :href="getListLink()">목록보기</a>
  <template v-if="canEdit || canGuestEdit">
    <a :href="getEditLink(bs.wr_id)">수정</a>
    <button @click="deleteWrite">삭제</button>
  </template>

  <!-- 댓글 -->
  <div v-for="comment in comments" :key="comment.wr_id">
    <strong>{{ comment.wr_name }}</strong>
    <span>{{ comment.wr_datetime }}</span>
    <div v-html="comment.save_content"></div>
  </div>
  <input v-if="!isLoggedIn" v-model="commentForm.wr_name" placeholder="이름" type="text">
  <input v-if="!isLoggedIn" v-model="commentForm.wr_password" placeholder="비밀번호" type="password">
  <textarea v-model="commentForm.wr_content" placeholder="댓글 내용"></textarea>
  <button v-if="canComment || canGuestComment" @click="submitComment">댓글 등록</button>
</div>
```

### 핵심 변수

| 항목 | 설명 |
|------|------|
| `bs` 객체 | 상세보기 데이터. `bs.wr_id` 존재 시 데이터 로드 완료 |
| `bs.wr_content` | HTML 포함. **반드시 `v-html`** |
| `bs.normal_files` | 첨부파일 배열 (`bs.files` 사용 금지) |
| `bs.images` | 이미지 갤러리 배열 (`original`, `thumbnail`, `filename`) |
| `bs.next_wr_id/subject/datetime` | 다음글 정보 |
| `bs.prev_wr_id/subject/datetime` | 이전글 정보 |
| `canEdit` | 로그인 + 본인 글 |
| `canGuestEdit` | 비회원 작성 글 |
| `formatFileSize(bytes)` | bytes → KB/MB 자동 변환 내장 함수 |

---

## 7. 글쓰기/수정 (Write / Edit)

### HTML 구조
```html
<div class="gnuboard"
  data-gb-table="notice"
  data-gb-list-link="list.html"
  data-gb-view-link="viewer.html"
  data-gb-initial-status="write"
  data-gb-extra-fields-required="wr_2,wr_3"
  data-gb-privacy-required
  data-gb-privacy-field="wr_9"
  data-gb-privacy-alert="개인정보 수집에 동의해 주세요."
  data-gb-extra-required-alert="필수 항목을 모두 입력해 주세요.">

  <!-- 글쓰기 화면 (status === 'write') -->
  <div v-gb-write>
    <!-- 카테고리 -->
    <div v-if="bi.bo_use_category && bi.bo_category_list">
      <div v-for="(cat, index) in bi.bo_category_list.split('|')" :key="index">
        <input :id="'write-cat-' + index" name="write-category" type="radio"
               :value="cat" v-model="bw.ca_name">
        <label :for="'write-cat-' + index">{{ cat }}</label>
      </div>
    </div>

    <!-- 비로그인 -->
    <input v-if="!isLoggedIn" type="text" v-model="bw.wr_name" placeholder="이름">
    <input v-if="!isLoggedIn" type="password" v-model="bw.wr_password" placeholder="비밀번호">

    <input type="text" v-model="bw.wr_subject" placeholder="제목">

    <!-- 추가 필드 (wr_1~wr_10) -->
    <input type="text" v-model="bw.wr_1" placeholder="추가 필드 1">
    <select v-model="bw.wr_3"><option value="">선택</option></select>
    <!-- 개인정보 동의 체크박스: true-value="Y" 필수 -->
    <input type="checkbox" v-model="bw.wr_9" :true-value="'Y'" :false-value="''"> 개인정보 동의

    <!-- 첨부파일 -->
    <div v-for="i in bi.bo_upload_count" :key="i">
      <input type="file" :ref="'writeFile' + i" @change="handleWriteFileChange(i, $event)">
      <button type="button" @click="clearFile('write', i)">취소</button>
    </div>

    <!-- 본문 에디터: id="editor" 고정 -->
    <div id="editor" style="height: 200px;"></div>

    <a :href="getListLink()">취소</a>
    <button @click="submitWrite">작성완료</button>
  </div>

  <!-- 수정 화면 (URL에 ?wr_id=번호 필요) -->
  <div v-gb-edit>
    <!-- 카테고리: name="edit-category", id="edit-cat-" 로 구분 -->
    <div v-if="bi.bo_use_category && bi.bo_category_list">
      <div v-for="(cat, index) in bi.bo_category_list.split('|')" :key="index">
        <input :id="'edit-cat-' + index" name="edit-category" type="radio"
               :value="cat" v-model="be.ca_name">
        <label :for="'edit-cat-' + index">{{ cat }}</label>
      </div>
    </div>

    <input v-if="!isLoggedIn" type="password" v-model="be.wr_password" placeholder="작성 시 비밀번호">
    <input type="text" v-model="be.wr_subject" placeholder="제목">

    <input type="text" v-model="be.wr_1">

    <!-- 기존 첨부파일: bs.normal_files 사용 (bs.files 금지) -->
    <ul v-if="bs.normal_files && bs.normal_files.length > 0">
      <li v-for="file in bs.normal_files" :key="file.bf_no">
        <span>{{ file.bf_source }} ({{ formatFileSize(file.bf_filesize) }})</span>
        <button type="button" @click="deleteFile(file.bf_no)">삭제</button>
      </li>
    </ul>

    <!-- 새 첨부파일 -->
    <div v-for="i in bi.bo_upload_count" :key="i">
      <input type="file" :ref="'editFile' + i" @change="handleEditFileChange(i, $event)">
      <button type="button" @click="clearFile('edit', i)">취소</button>
    </div>

    <!-- 수정 에디터: id="edit-editor" 고정 -->
    <div id="edit-editor" style="min-height: 200px;"></div>

    <a :href="getListLink()">취소</a>
    <button @click="submitEdit">수정완료</button>
  </div>
</div>
```

### 핵심 변수/규칙

| 항목 | 설명 |
|------|------|
| `bw` 객체 | 글쓰기 폼 데이터 |
| `be` 객체 | 수정 폼 데이터 (mounted 시 `bs`에서 자동 복사) |
| `bs` 객체 | 기존 게시글 데이터 |
| `bi` 객체 | 게시판 설정 (`bi.bo_upload_count`, `bi.bo_use_category` 등) |
| `bw.wr_1`~`bw.wr_10` | 여분 필드. `submitWrite()` 시 자동 전송 |
| `be.wr_1`~`be.wr_10` | 수정 여분 필드. `submitEdit()` 시 자동 전송 |
| `id="editor"` | 글쓰기 Quill 에디터 고정 id |
| `id="edit-editor"` | 수정 Quill 에디터 고정 id |
| `bs.normal_files` | 기존 첨부파일 배열 (`bs.files` 사용 금지) |
| `deleteFile(bf_no)` | 삭제 목록에 추가 (저장 시 일괄 처리) |
| `data-gb-extra-fields-required` | 필수 여분 필드 목록 (쉼표 구분) |
| `data-gb-privacy-required` | 개인정보 동의 필드 필수 검사 활성화 |
| `data-gb-privacy-field` | 동의 필드명 (기본: `wr_9`) |

### submitWrite/submitEdit 내부 순서
1. 필수 항목(`wr_subject`, `wr_content`) 검사
2. 비로그인 이름·비밀번호 검사
3. `data-gb-*` 추가 필드·개인정보 동의 검사 (`gbCheckFormCustomRequired`)
4. 게스트 토큰 발급 (비로그인)
5. 파일 삭제 (수정 시) → 게시글 POST/PUT → 파일 업로드
6. 이동 (`getListLink()` / `getViewLink(wr_id)`)

---

## 8. 프로필 수정 (Profile)

### HTML 구조
```html
<div class="profile-app"
  data-gb-login-link="login.html"
  data-gb-redirect="index.html">

  <!-- 비밀번호 확인 화면 -->
  <div v-gb-password-check="">
    <input type="password" v-model="password_check_form.password"
      @keyup.enter="handlePasswordCheck" placeholder="비밀번호">
    <input type="submit" value="확인" @click="handlePasswordCheck">
  </div>

  <!-- 프로필 수정 화면 -->
  <div v-gb-profile-edit="">
    <!-- 프로필 이미지 -->
    <img :src="profileImage" alt="프로필 이미지">
    <input type="file" ref="imageInput" accept="image/*" @change="handleImageChange" class="blind">
    <button type="button" @click="clickImageInput">이미지 변경</button>
    <button type="button" @click="clickImageDelete"
      v-if="isEditor || profile_form.mb_image_path || imagePreview">이미지 삭제</button>

    <!-- 아이디 (변경 불가) -->
    <input type="text" v-model="profile_form.mb_id" disabled="">

    <!-- 이름 -->
    <input type="text" v-model="profile_form.mb_name" required="">

    <!-- 닉네임 중복 확인 -->
    <input type="text" v-model="profile_form.mb_nick"
      :class="{ error: validation.mb_nick === false }">
    <button @click="checkDuplicate('mb_nick')"
      :disabled="!isEditor && (!profile_form.mb_nick || profile_form.mb_nick === original_profile.mb_nick)">
      중복확인
    </button>
    <p v-if="validation.mb_nick === true" class="success">✓ 사용 가능합니다.</p>
    <p v-if="validation.mb_nick === false" class="error">✗ 이미 사용 중입니다.</p>

    <!-- 이메일 -->
    <input type="email" v-model="profile_form.mb_email" required="">

    <!-- 성별 -->
    <select v-model="profile_form.mb_sex">
      <option value="">선택 안함</option>
      <option value="m">남성</option>
      <option value="f">여성</option>
    </select>

    <!-- 조건부 필드 -->
    <div v-if="showHp"><input type="tel" v-model="profile_form.mb_hp" :required="reqHp"></div>
    <div v-if="showTel"><input type="tel" v-model="profile_form.mb_tel" :required="reqTel"></div>
    <div v-if="showHomepage"><input type="url" v-model="profile_form.mb_homepage" :required="reqHomepage"></div>
    <template v-if="showAddr">
      <input type="text" v-model="profile_form.mb_zip" :required="reqAddr">
      <input type="text" v-model="profile_form.mb_addr1" :required="reqAddr">
      <input type="text" v-model="profile_form.mb_addr2">
    </template>
    <div v-if="showRecommend"><input type="text" v-model="profile_form.mb_recommend" disabled=""></div>
    <div v-if="showSignature"><input type="text" v-model="profile_form.mb_signature" :required="reqSignature"></div>
    <div v-if="showProfile"><textarea v-model="profile_form.mb_profile" :required="reqProfile"></textarea></div>

    <!-- 수신 동의 -->
    <input type="checkbox" v-model="profile_form.mb_mailling" :true-value="1" :false-value="0"> 이메일 수신
    <input type="checkbox" v-model="profile_form.mb_sms" :true-value="1" :false-value="0"> SMS 수신
    <input type="checkbox" v-model="profile_form.mb_open" :true-value="1" :false-value="0"> 정보공개

    <!-- 버튼 -->
    <button type="button" v-gb-btn-password-check="">← 비밀번호 확인으로</button>
    <button type="submit" :disabled="!isEditor && !isFormValid" @click="handleUpdateProfile">프로필 수정</button>
  </div>
</div>
```

### 핵심 규칙

| 항목 | 설명 |
|------|------|
| `v-gb-password-check` / `v-gb-profile-edit` | 화면 전환 디렉티브 |
| `v-gb-btn-password-check` | 비밀번호 확인 화면으로 돌아가기 버튼 |
| `password_check_form.password` | 비밀번호 확인 입력값 |
| `profile_form.*` | 프로필 수정 폼 데이터 |
| `original_profile.mb_nick` | 기존 닉네임 (동일하면 중복확인 불필요) |
| `profileImage` | 미리보기 또는 현재 이미지 URL (computed) |
| `clickImageInput()` | 이미지 변경 — **반드시 이 메서드 사용** (`$refs.imageInput.click()` 직접 사용 금지) |
| `clickImageDelete()` | 이미지 삭제 — **반드시 이 메서드 사용** |
| `handleUpdateProfile()` | 저장 실행 (이미지 처리 → 프로필 PUT → 리다이렉트) |

---

## 9. 공통 data-gb-* 속성 전체 목록

### body 레벨
| 속성 | 설명 |
|------|------|
| `data-gb-url` | 그누보드 서버 주소 (필수, body에 단 한 번) |

### 게시판 컴포넌트 (.gnuboard)
| 속성 | 설명 |
|------|------|
| `data-gb-table` | 게시판 테이블명 |
| `data-gb-table-name` | 게시판 표시명 |
| `data-gb-list-link` | 목록 페이지 경로 |
| `data-gb-view-link` | 상세보기 페이지 경로 |
| `data-gb-write-link` | 글쓰기 페이지 경로 |
| `data-gb-initial-status` | 초기 상태 (`list`/`read`/`write`/`edit`) |
| `data-gb-text-limit` | 목록 내용 글자 수 제한 |
| `data-gb-extra-fields-required` | 필수 여분 필드 (쉼표 구분, `wr_1`~`wr_10`) |
| `data-gb-write-extra-required` | 글쓰기 전용 필수 여분 필드 |
| `data-gb-edit-extra-required` | 수정 전용 필수 여분 필드 |
| `data-gb-extra-required-alert` | 여분 필드 검사 실패 시 alert 문구 |
| `data-gb-privacy-required` | 개인정보 동의 필수 (글쓰기+수정) |
| `data-gb-write-privacy-required` | 글쓰기 전용 개인정보 동의 필수 |
| `data-gb-edit-privacy-required` | 수정 전용 개인정보 동의 필수 |
| `data-gb-privacy-field` | 동의 필드명 (기본: `wr_9`) |
| `data-gb-privacy-alert` | 개인정보 동의 실패 시 alert 문구 |

### 회원 컴포넌트
| 속성 | 설명 |
|------|------|
| `data-gb-login-link` | 로그인 페이지 경로 |
| `data-gb-signup-link` | 회원가입 페이지 경로 |
| `data-gb-find-password-link` | 비밀번호 찾기 페이지 경로 |
| `data-gb-redirect` | 완료 후 이동 경로 |
| `data-gb-initial-status` | 초기 상태 |

---

## 10. 자주 하는 실수 — 전체 요약

| 증상 | 원인 | 해결 |
|------|------|------|
| 에디터 버튼이 비활성화됨 | `!isEditor &&` 조건 누락 | `:disabled="!isEditor && !isFormValid"` 패턴 사용 |
| 첨부파일 목록 오류 | `bs.files` 사용 | `bs.normal_files` 로 변경 |
| 본문이 HTML 태그로 출력 | `v-html` 미사용 | `v-html="bs.wr_content"` 사용 |
| 목록 이미지 미표시 | `:data-gb-wr-id` 누락 | `:data-gb-wr-id="item.wr_id"` 추가 |
| 목록 내용이 HTML로 출력 | `data-gb-tpl` 누락 | `data-gb-tpl="wr_content"` 추가 |
| 목록이 안 나옴 | `v-gb-list-onload` 누락 | `v-gb-list-onload="true"` 추가 |
| 수정 시 기존 내용 미표시 | URL에 `?wr_id` 없음 | `write.html?wr_id=1` 형태로 접근 |
| 상세보기 데이터 없음 | URL에 `?wr_id` 없음 | `viewer.html?wr_id=1` 형태로 접근 |
| 에디터 두 화면 동시 표시 | 에디터 환경의 의도된 동작 | 정상 (운영에서는 하나만 표시) |
| 이미지 변경 버튼 동작 안 함 | `$refs.imageInput.click()` 직접 사용 | `clickImageInput()` 메서드 사용 |
| 개인정보 약관에 태그 노출 | `v-html` 사용 | `{{ terms.privacy }}` 텍스트 보간 사용 |
| 완료 후 이동 안 됨 | `data-gb-redirect` 또는 `data-gb-list-link` 누락 | 해당 속성 확인 및 추가 |
| 중복 확인 후 값 변경 시 재확인 불필요 | 자동 초기화됨 | 별도 처리 불필요 |
| 비회원 목록 이미지 미표시 | 읽기 권한 부족 | 관리자에서 "목록에서 내용보기" 활성화 |
| 모달이 안 열리거나 페이지만 이동 | `preventDefault`·클릭 위임 누락, Swiper가 클릭 차단 | §4-1·§4-2 패턴, `preventClicks: false` 확인 |
| `view.html`을 AJAX로 넣으려 함 | 잘못된 이해 | 상세는 **API JSON**만 사용. `view.html`은 **별도 전체 페이지** (§4) |
| 모달에 썸네일만 보임 | `images[0].thumbnail` 우선 사용 | 본문 `wr_content` / `images[].original` 우선 (§4-1 참고) |
