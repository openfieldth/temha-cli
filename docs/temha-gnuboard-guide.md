# 템하 그누보드 Vue 컴포넌트 — AI 통합 가이드

> **대상:** Claude, Cursor 등 AI 코딩 어시스턴트
> **목적:** 템하(Temha) 플랫폼의 그누보드 연동 Vue 컴포넌트를 HTML에서 올바르게 구현하기 위한 단일 참조 문서

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

**초기화 함수 혼동 금지 (MUST)**

| 화면 | 루트 | 호출 함수 | 잘못된 호출 시 증상 |
|------|------|-----------|--------------------|
| 로그인 | `.login-app` | `vue_gnulogin(el)` | 코드가 있어도 에디터 화면에 로그인 폼이 안 보임 |
| 회원가입/약관 | `.signup-app` | `vue_gnulogin(el)` | 약관/가입 단계 전환이 안 됨 |
| 아이디/비밀번호 찾기 | `.login-app` + `v-gb-find-password` | `vue_gnulogin(el)` | 이메일 입력 화면이 렌더링되지 않음 |
| 게시판 목록/상세/글쓰기/수정 | `.gnuboard` | `vue_gnuboard(el)` | `{{ }}` 변수 노출, 목록/상세/글쓰기 미동작 |
| 정보수정 | `.profile-app` | `vue_gnuprofile(el)` | 비밀번호 확인/정보수정 화면이 안 뜸 |

AI는 `vue_gnuboard`를 만능 초기화 함수처럼 쓰면 안 된다. 루트 클래스와 초기화 함수가 1:1로 맞아야 한다.

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

### 1-4-1. Vue 보간식 HTML 이스케이프 (MUST)

Vue mustache(`{{ }}`) 표현식을 HTML 속성/본문에 작성할 때 비교 연산자 `<`, `>`는 HTML 파서를 깨뜨릴 수 있으므로 반드시 `&lt;`, `&gt;`로 이스케이프한다.

특히 목록 번호, 조건부 라벨, 삼항 연산식에서 자주 발생한다. 이 규칙을 지키지 않으면 Vue 초기화가 실패하고 `v-cloak`이 풀리지 않아 블록이 통째로 보이지 않을 수 있다.

```html
<!-- 올바른 예 -->
<span>{{ idx + 1 &lt; 10 ? '0' + (idx + 1) : idx + 1 }}</span>

<!-- 금지 -->
<span>{{ idx + 1 < 10 ? '0' + (idx + 1) : idx + 1 }}</span>
```

체크:
- [ ] `{{ }}` 안에 `<` 또는 `>` 비교 연산자가 있으면 `&lt;` / `&gt;`로 바꿨는가
- [ ] `v-for` 목록 번호식, 조건부 텍스트, 삼항 연산식을 저장 전 확인했는가
- [ ] 화면이 통째로 안 보이면 `v-cloak`만 의심하지 말고 Vue 보간식 파싱 오류를 먼저 확인했는가

### 1-4-2. 화면 미출력 방지 Preflight (CRITICAL)

그누보드/회원 블록에서 **화면이 통째로 안 보이는 상태는 치명 오류**로 본다. AI는 저장 전 아래 항목을 반드시 확인한다.

| 점검 항목 | 실패 시 증상 | 필수 조치 |
|----------|-------------|----------|
| 루트와 초기화 함수 일치 | 폼/게시판이 렌더링되지 않음 | `.gnuboard` → `vue_gnuboard(el)`, `.login-app`/`.signup-app` → `vue_gnulogin(el)`, `.profile-app` → `vue_gnuprofile(el)` |
| 블록 JS 존재 | `v-cloak`이 풀리지 않거나 `{{ }}`가 그대로 보임 | IIFE + jQuery + `$(".블록클래스[id='실제bid']")` + 내부 루트 초기화 |
| Vue 보간식 파싱 | 화면 전체 공백, Vue 초기화 실패 | `{{ }}` 안의 `<`, `>`는 `&lt;`, `&gt;`로 이스케이프 |
| 목록/상세 변수 구분 | 데이터가 안 나오거나 잘못된 필드 노출 | 목록은 `br.writes`/`item.*`, 상세는 `bs.*`만 사용 |
| 상세 본문 출력 | 본문 HTML이 안 나오거나 텍스트로 깨짐 | `data-gb-tpl="wr_content"` + `v-html="bs.wr_content"` |
| 임의 fallback UI | 실제 목록 아래 불필요한 안내문 노출 | 목록 빈 상태는 `data-gb-list-empty`에 맡기고 임의 `notice-empty` 같은 안내문 금지 |
| 저장 후 검증 | 저장은 됐지만 실제 코드가 다르게 변형됨 | `get_block`으로 HTML/CSS/JS 재조회 후 필수 속성 재확인 |

저장 후 `get_block` 확인 필수:
- [ ] HTML에 `.gnuboard`/`.login-app`/`.signup-app`/`.profile-app` 루트가 남아 있는가
- [ ] JS가 비어 있지 않고 올바른 초기화 함수를 호출하는가
- [ ] `data-gb-tpl` 필드명이 실제 변수명(`wr_subject`, `wr_content` 등)과 일치하는가
- [ ] 목록 페이지네이션/상세 본문/글쓰기 에디터 같은 핵심 UI가 누락되지 않았는가
- [ ] MCP가 `data-gb-table` 값을 비우거나 바꿨다면 에디터 데이터 패널 연결 상태를 사용자에게 알려야 하는가

### 1-5. 템하 블록 골격 (MCP 필수 — 목록 연동)

가이드 §4의 `div.gnuboard`는 **Vue 루트**입니다. 템하 블록 안에서는 **반드시 `contents-container` 바깥**에 두세요.

**올바른 순서 (MUST)**

```
div.{블록클래스}#bid          ← 블록 최상단 (템하 규약)
  div.gnuboard[data-gb-*]   ← 그누보드 루트 (data 속성은 이 태그에만)
    div.contents-container
      div[v-gb-list]         ← 목록 디렉티브 (container 또는 inner에 1곳)
        div.contents-inner
          … 카드/슬라이드 …
```

**잘못된 예 (AI가 자주 만듦 — 저장 시 MCP가 거부)**

```
div.{블록클래스}
  div.contents-container
    div.contents-inner
      div.textset …
      div.gnuboard          ← ✗ contents-inner 안쪽 — 연동·에디터 미리보기 깨짐
```

**`div.gnuboard` 시작 태그 — 속성 선언 (값은 비워도 됨)**

| 속성 | AI 기본값 | 설명 |
|------|-----------|------|
| `data-gb-table` | `""` | 게시판 테이블 — **사용자가 에디터에서 지정** |
| `data-gb-table-name` | `""` | 게시판 표시명 |
| `data-gb-list-link` | `""` | 목록 페이지 (넣을 때만 `list.html`, pageId 금지) |
| `data-gb-view-link` | `""` | 상세 페이지 (`viewer.html` 등) |
| `data-gb-text-limit` | `50` 등 | 글자 수 제한 |
| `data-gb-initial-status` | `list` (선택) | 초기 화면 |

AI는 **`data-gb-table=""`** 처럼 속성만 두고 값은 비워 둡니다. `data-gb-list-link`에 값을 넣을 때 `mfxUmp0J63se` 같은 **pageId는 금지**.


### 1-5-1. 목록 블록 필수 세트 (MUST)

공지사항/뉴스 목록을 만들 때는 아래 구조가 한 세트로 들어가야 한다. 일부만 쓰면 `{{ item.wr_subject }}` 같은 Vue 보간 문법이 에디터/운영 화면에 그대로 노출될 수 있다.

```html
<div class="블록클래스" id="실제bid">
  <div class="gnuboard" data-gb-table="" data-gb-table-name="" data-gb-view-link="" data-gb-list-link="" data-gb-text-limit="250">
    <div class="contents-container container-lg" v-gb-list="" v-gb-list-row="4" v-gb-list-onload="true">
      <div class="contents-inner">
        <ol data-gb-list-empty="">
          <li v-for="(item, idx) in br.writes" :key="item.wr_id">
            <a :href="getViewLink(item.wr_id)" :data-gb-wr-id="item.wr_id">
              <strong data-gb-tpl="wr_subject">{{ item.wr_subject }}</strong>
              <p data-gb-tpl="wr_content">{{ item.wr_content }}</p>
            </a>
          </li>
        </ol>
        <div class="board-paging">
          <a href="javascript:void(0);" v-gb-list-first-show="" v-gb-list-btn-first="">처음</a>
          <a href="javascript:void(0);" v-gb-list-prev-show="" v-gb-list-btn-prev="">이전</a>
          <a href="javascript:void(0);" v-for="page in pagination.pages" :key="page"
             v-gb-list-btn-page="page" v-gb-list-page-active-class="'active'">{{ page }}</a>
          <a href="javascript:void(0);" v-gb-list-next-show="" v-gb-list-btn-next="">다음</a>
          <a href="javascript:void(0);" v-gb-list-last-show="" v-gb-list-btn-last="">마지막</a>
        </div>
      </div>
    </div>
  </div>
</div>
```

목록 필수 체크:
- [ ] 블록 최상단은 `class` + `id`만 가진 템하 래퍼인가
- [ ] `.gnuboard`가 `contents-container` 바깥에 있는가
- [ ] `data-gb-table`, `data-gb-table-name`, `data-gb-view-link`, `data-gb-list-link`가 `.gnuboard`에 있는가
- [ ] `v-gb-list`, `v-gb-list-row`, `v-gb-list-onload="true"`가 목록 컨테이너에 있는가
- [ ] 페이지네이션을 쓰면 `v-gb-list-page`, `pagination.pages`, `v-gb-list-btn-page`, `v-gb-list-page-active-class="'active'"`를 사용하는가
- [ ] 반복문이 `v-for="(item, idx) in br.writes"`를 사용하는가
- [ ] 목록 상세 링크가 `:href="getViewLink(item.wr_id)"`와 `:data-gb-wr-id="item.wr_id"`를 함께 가지는가
- [ ] 제목/내용 출력에 `data-gb-tpl="wr_subject"` / `data-gb-tpl="wr_content"`가 있는가
- [ ] 목록 화면에서 상세 변수 `bs.*`를 섞어 쓰지 않았는가
- [ ] Vue 보간식 안의 비교 연산자 `<`, `>`를 `&lt;`, `&gt;`로 이스케이프했는가
- [ ] 빈 목록 안내를 임의 HTML로 만들지 않고 `data-gb-list-empty`를 사용했는가

금지:
- `v-gb-list` 없이 `{{ item.wr_subject }}`만 작성
- 목록 블록에서 `bs.wr_subject`, `bs.wr_datetime` 같은 상세 화면 변수를 함께 출력
- `.gnuboard`를 `contents-inner` 내부에 배치
- MCP `update_block` 최상단 div에 `data-gb-*` 직접 작성
- `{{ idx + 1 < 10 ? ... }}`처럼 HTML 안에 `<` 비교 연산자를 그대로 작성
- `br.total_page > 1` 조건으로 페이지네이션 전체를 숨김
- `notice-empty`, `board-empty` 같은 임의 안내문을 실제 목록 아래에 고정 노출


### 1-5-2. 그누보드 초기화 JS (MCP 필수)

템하 블록에서 `.gnuboard`를 최상단 래퍼 내부에 배치한 경우, HTML 구조만으로 끝내지 않는다. 블록 JS에서 실제 `.gnuboard` DOM 요소를 찾아 `vue_gnuboard(el)`을 호출해야 목록/상세/글쓰기 Vue 디렉티브가 동작한다.

```javascript
(function () {
  $(function () {
    $(".블록클래스[id='실제bid']").each(function () {
      const el = $(this).find(".gnuboard")[0];
      if (el && typeof vue_gnuboard === "function") {
        vue_gnuboard(el);
      }
    });
  });
})();
```

초기화 JS 필수 체크:
- [ ] `.gnuboard` 루트가 있는 블록인가
- [ ] 블록 JS에서 `$(".블록클래스[id='실제bid']")`로 스코프를 잡았는가
- [ ] `.find(".gnuboard")[0]`로 DOM 요소를 전달했는가
- [ ] `typeof vue_gnuboard === "function"` 확인 후 `vue_gnuboard(el)`을 호출했는가
- [ ] selector 문자열이 아니라 DOM 요소 `el`을 넘겼는가
- [ ] `js: ""`로 비워 두지 않았는가

증상:
- `v-cloak` 때문에 목록 영역이 통째로 숨겨짐
- `{{ item.wr_subject }}`가 그대로 보임
- 게시글 데이터가 있어도 목록이 렌더링되지 않음
- 상세/글쓰기/회원 화면에서 코드만 있고 실제 에디터 화면이 비어 있음

### 1-5-3. 회원/게시판 세트 생성 Preflight (MUST)

게시판을 만들 때 "목록만" 만들지 않는다. 사용자가 공지사항/게시판/회원 기능을 요청하면 아래 페이지 연결을 먼저 설계하고 각 `data-gb-*` 링크를 맞춘다.

| 세트 | 필요한 페이지/블록 | 필수 링크/런타임 |
|------|-------------------|----------------|
| 공지사항 목록 | 목록 페이지 | `.gnuboard`, `v-gb-list`, `data-gb-view-link`, `data-gb-write-link`, `vue_gnuboard` |
| 공지사항 상세 | 상세 페이지 | `.gnuboard v-cloak=""`, `data-gb-initial-status="read"`, `data-gb-list-link`, `data-gb-write-link`, `vue_gnuboard` |
| 공지사항 글쓰기 | 글쓰기 페이지 | `.gnuboard v-cloak=""`, `data-gb-initial-status="write"`, `data-gb-list-link`, `data-gb-view-link`, `vue_gnuboard` |
| 로그인 | 로그인 페이지 | `.login-app`, `data-gb-signup-link`, `data-gb-find-password-link`, `data-gb-redirect`, `vue_gnulogin` |
| 회원가입 | 회원가입 페이지 | `.signup-app`, `data-gb-login-link`, `data-gb-redirect="가입완료.html"`, `vue_gnulogin` |
| 가입완료 | 완료 페이지 | 로그인 링크 `data-link-type="page"` |
| 아이디/비밀번호 찾기 | 찾기 페이지 | `.login-app data-gb-initial-status="find-password"`, `v-gb-find-password`, `vue_gnulogin` |
| 정보수정 | 정보수정 페이지 | `.profile-app`, `v-gb-password-check`, `v-gb-profile-edit`, `vue_gnuprofile` |

링크 규칙:
- 내부 페이지 링크는 `href="./page-name.html"` + `data-link-type="page"`를 함께 쓴다.
- 외부 URL은 `data-link-type="url"`, 전화는 `tel`, 이메일은 `email`, 파일은 `file`을 쓴다.
- `data-gb-*-link`에는 pageId가 아니라 실제 HTML 경로를 넣는다. 예: `notice-view.html`, `login.html`.

세트 생성 후 검증:
- [ ] `list_pages`로 목록/상세/글쓰기 페이지가 실제 생성됐는가
- [ ] `list_blocks`로 각 페이지의 header/content/footer 블록 위치가 맞는가
- [ ] `get_block`으로 각 블록의 HTML/CSS/JS를 다시 읽었는가
- [ ] 목록 → 상세 링크가 `getViewLink(item.wr_id)`를 사용해 `?wr_id=`를 전달하는가
- [ ] 상세/글쓰기 페이지가 직접 열렸을 때도 `v-cloak` 때문에 전체가 숨겨지지 않도록 JS 초기화가 있는가
- [ ] 게시판 데이터 연결값이 비어 있는 경우 사용자에게 에디터 데이터 패널 연결 필요성을 안내했는가

### 1-6. 목록 썸네일 (MUST)

게시글에 **첨부·본문 이미지가 있으면 목록에는 썸네일**로만 보여야 합니다. Unsplash/Pexels 더미·`item.wr_content` HTML을 `img src`로 쓰지 마세요.

| MUST | 금지 |
|------|------|
| `v-if="getListItemImage(item)"` | `src="https://images.unsplash.com/…"` (목록 항목마다 고정 URL) |
| `:src="getListItemImage(item)"` | `:src="item.wr_content"` / 본문 HTML 그대로 |
| `data-gb-tpl="wr_thumbnail"` | `data-gb-tpl` 없는 목록 img |
| `:data-gb-wr-id="item.wr_id"` (목록 `a` 또는 img 근처) | `data-gb-wr-id` 누락 |
| `class="cardset-img"` 등 템하 카드 figure 안 배치 | 본문 전체를 목록에 노출 |

**표준 썸네일 한 줄 (카드·슬라이드 공통)**

```html
<div class="cardset-figure">
  <img v-if="getListItemImage(item)"
       :src="getListItemImage(item)"
       :alt="item.wr_subject"
       class="cardset-img"
       data-gb-tpl="wr_thumbnail">
</div>
```

`getListItemImage(item)` 순서: **첨부 썸네일 → 본문 첫 img → 기본 이미지**.

**템하 + 목록 (카드) 예시**

```html
<div class="petaccessory-N5" id="OumP0j63aT">
  <div class="gnuboard"
    data-gb-table=""
    data-gb-table-name=""
    data-gb-list-link=""
    data-gb-view-link=""
    data-gb-text-limit="80"
    data-gb-initial-status="list">
    <div class="contents-container container-lg"
         v-gb-list=""
         v-gb-list-row="8"
         v-gb-list-page="5"
         v-gb-list-onload="true">
      <div class="contents-inner">
        <div class="textset">
          <h2 class="textset-tit h1">제목</h2>
        </div>
        <div class="cardset-wrap">
          <a class="cardset" :href="getViewLink(item.wr_id)"
             v-for="item in br.writes" :key="item.wr_id"
             :data-gb-wr-id="item.wr_id">
            <div class="cardset-figure">
              <img v-if="getListItemImage(item)"
                   :src="getListItemImage(item)"
                   :alt="item.wr_subject"
                   class="cardset-img"
                   data-gb-tpl="wr_thumbnail">
            </div>
            <div class="cardset-body">
              <strong class="cardset-tit h5" data-gb-tpl="wr_subject">{{item.wr_subject}}</strong>
              <p class="cardset-desc" data-gb-tpl="wr_content">{{item.wr_content}}</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
```

**JS (블록 클래스명으로 `vue_gnuboard` 호출)**

```javascript
(function () {
  $(function () {
    $(".petaccessory-N5").each(function () {
      const el = $(this).find(".gnuboard")[0];
      if (el) vue_gnuboard(el);
    });
  });
})();
```

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

### 회원가입/회원 세트 필수 체크 (CRITICAL)

회원가입·로그인·아이디/비밀번호 찾기·정보수정은 게시판처럼 `.gnuboard`로 초기화하지 않는다. 루트와 초기화 함수가 맞지 않으면 코드가 있어도 화면이 통째로 안 보이거나 약관 단계 전환이 동작하지 않는다.

| 화면 | 루트 | 초기화 함수 | 필수 화면 디렉티브 |
|------|------|------------|-------------------|
| 로그인 | `.login-app` | `vue_gnulogin(el)` | `v-gb-login` |
| 회원가입 | `.signup-app` | `vue_gnulogin(el)` | `v-gb-terms`, `v-gb-signup` |
| 아이디/비밀번호 찾기 | `.login-app` | `vue_gnulogin(el)` | `v-gb-find-password` |
| 정보수정 | `.profile-app` | `vue_gnuprofile(el)` | `v-gb-password-check`, `v-gb-profile-edit` |

저장 전 체크:
- [ ] 회원가입 루트가 `.signup-app`이고 `.gnuboard`를 섞지 않았는가
- [ ] 블록 JS에서 내부 `.signup-app` DOM 요소에 `vue_gnulogin(el)`을 호출하는가
- [ ] 약관 단계에 `v-gb-terms`, 가입 폼 단계에 `v-gb-signup`이 각각 있는가
- [ ] 다음 버튼에 `v-gb-btn-signup`, 이전 버튼에 `v-gb-btn-terms`가 있는가
- [ ] 전체 동의는 `agreeAll` + `@change="toggleAllAgree"`를 사용하고, 개별 약관은 `agreements.stipulation` / `agreements.privacy`를 사용했는가
- [ ] 체크박스는 `checkset` 구조와 고유한 `id`/`for`를 사용해 에디터와 실제 화면 모두 클릭 가능한가
- [ ] 가입 폼은 `signup_form.mb_id`, `mb_password`, `mb_password_re`, `mb_name`, `mb_nick`, `mb_email`처럼 실제 회원 필드명을 사용하는가
- [ ] 아이디/닉네임 중복 확인은 `checkDuplicate('mb_id')`, `checkDuplicate('mb_nick')`를 사용하고 `validation.mb_id` / `validation.mb_nick` 상태를 표시하는가
- [ ] 가입완료 페이지가 있으면 `data-gb-redirect`가 해당 페이지 경로를 가리키는가
- [ ] 저장 후 `get_block`으로 HTML/CSS/JS를 재조회해 JS가 비어 있지 않은지 확인했는가

금지:
- `.signup-app`에 `vue_gnuboard(el)` 호출
- 약관 체크박스를 일반 input만 나열하고 `checkset`/`label for` 연결을 누락
- `terms.privacy`를 `v-html`로 출력해 개인정보 약관 태그가 노출되게 작성
- `signup_form.id`, `signup_form.password`처럼 실제 필드명이 아닌 임의 축약 필드명 사용
- 회원가입 화면 안에 게시판용 `v-gb-list` validator anchor를 넣기

---

## 4. 목록 (List)

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
| `getListItemImage(item)` | **목록 썸네일 MUST** — 첨부 썸네일 → 본문 첫 img → 기본이미지. `v-if`+`:src`+`data-gb-tpl="wr_thumbnail"` 세트 |
| `br.writes` | 게시글 배열 |
| `br.total_records` | 전체 게시글 수 |

---

## 5. 상세보기 (Read)

### HTML 구조
```html
<div class="gnuboard" v-cloak=""
  data-gb-table="notice"
  data-gb-list-link="list.html"
  data-gb-write-link="write.html"
  data-gb-initial-status="read">

  <!-- URL에 ?wr_id=번호 필요 -->

  <h2 data-gb-tpl="wr_subject">{{ bs.wr_subject || "제목 [에디터에서 내용 볼 수 없음]" }}</h2>
  <p v-if="bs.wr_id">
    <span data-gb-tpl="wr_datetime">{{ bs.wr_datetime }}</span>
    <span data-gb-tpl="wr_name">{{ bs.wr_name }}</span>
    <span data-gb-tpl="wr_hit">조회 {{ bs.wr_hit }}</span>
  </p>
  <span v-if="bs.ca_name" data-gb-tpl="ca_name">{{ bs.ca_name }}</span>

  <!-- 추가 필드 -->
  <h4 v-if="bs.wr_1" data-gb-tpl="wr_1">{{ bs.wr_1 }}</h4>
  <a v-if="bs.wr_3" :href="bs.wr_3" target="_blank">관련 링크</a>

  <!-- 본문: 반드시 v-html 사용 -->
  <div v-if="bs.wr_id" data-gb-tpl="wr_content" v-html="bs.wr_content"></div>

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
    NEXT | <span data-gb-tpl="next_wr_subject">{{ bs.next_wr_subject }}</span>
    <span data-gb-tpl="next_wr_datetime">{{ bs.next_wr_datetime }}</span>
  </a>
  <a v-if="bs.prev_wr_subject" :href="'?wr_id=' + bs.prev_wr_id">
    PREV | <span data-gb-tpl="prev_wr_subject">{{ bs.prev_wr_subject }}</span>
    <span data-gb-tpl="prev_wr_datetime">{{ bs.prev_wr_datetime }}</span>
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

### 상세보기 필수 체크

- [ ] `.gnuboard` 루트에 `v-cloak=""`가 있는가
- [ ] `.gnuboard`에 `data-gb-list-link`, `data-gb-write-link`, `data-gb-initial-status="read"`가 있는가
- [ ] 블록 JS가 비어 있지 않고 내부 `.gnuboard` DOM 요소에 `vue_gnuboard(el)`을 호출하는가
- [ ] 제목 요소에 `data-gb-tpl="wr_subject"`가 있는가
- [ ] 작성자/날짜/조회수 요소에 `data-gb-tpl="wr_name"`, `data-gb-tpl="wr_datetime"`, `data-gb-tpl="wr_hit"`가 있는가
- [ ] 본문 요소가 `v-html="bs.wr_content"`와 `data-gb-tpl="wr_content"`를 함께 가지는가
- [ ] 이전글/다음글을 쓰면 `next_wr_subject`, `next_wr_datetime`, `prev_wr_subject`, `prev_wr_datetime`에 각각 `data-gb-tpl`이 있는가
- [ ] `data-gb-tpl`에 `subject`, `content`, `name`, `datetime`, `hit`처럼 축약 필드명을 쓰지 않았는가
- [ ] 상세 페이지를 `?wr_id=` 없이 직접 열어도 에디터용 빈 상태가 깨지지 않는가
- [ ] MCP validator가 `v-gb-list`를 요구하면 실제 UI가 아니라 `v-if="false"` 검증용 anchor만 추가했는가

---

## 6. 글쓰기/수정 (Write / Edit)

### 6-0. 템하 MCP 글쓰기 실전 규칙 (MUST)

글쓰기/수정 페이지는 목록·상세와 달리 에디터 선택 상태, Quill 에디터 초기화, 카테고리 라디오, 파일 업로드가 함께 동작한다. AI는 작성 전 아래 구조를 먼저 맞춘 뒤 디자인을 입힌다.

#### 필수 골격

- `.gnuboard` 루트에는 `v-cloak=""`, `data-gb-table`, `data-gb-table-name`, `data-gb-list-link`, `data-gb-view-link`, `data-gb-initial-status="write"`를 둔다.
- `.gnuboard`는 `contents-container` 바깥 루트이며, 내부는 `contents-container container-lg|md|sm` → `contents-inner` 순서로 작성한다.
- 실제 입력 UI는 `form-group` 안에 두고, 글쓰기 영역은 `v-gb-write=""`, 수정 영역은 `v-gb-edit=""`로 분리한다.
- 글쓰기 페이지의 JS는 반드시 내부 `.gnuboard` 요소에 `vue_gnuboard(el)`을 호출한다.
- 글쓰기 Quill 영역 id는 `editor`, 수정 Quill 영역 id는 `edit-editor`로 고정한다.
- 글쓰기 페이지에서 `v-gb-list`를 실제 UI로 함께 렌더링하지 않는다. 목록 루트가 섞이면 요소 선택 시 화면이 사라지거나 상태가 충돌할 수 있다.

#### 카테고리 라디오 표준

카테고리 선택은 일반 input 나열이 아니라 `radioset-wrap` + `radioset` 구조를 사용한다. write/edit의 `id`, `name`, `key`, `v-model`은 서로 분리한다.

```html
<div class="form-box" v-if="bi.bo_use_category && bi.bo_category_list">
  <fieldset class="inputset">
    <legend class="form-tit p1">분류</legend>
    <div class="radioset-wrap">
      <div class="radioset radioset-thumb thumb-round thumb-line thumb-icon"
        v-for="(cat, index) in bi.bo_category_list.split('|')"
        :key="'notice-write-cat-' + index">
        <input :id="'notice-write-cat-' + index" name="write-category"
          class="radioset-input" type="radio" :value="cat" v-model="bw.ca_name">
        <label :for="'notice-write-cat-' + index" class="radioset-label">{{ cat }}</label>
      </div>
    </div>
  </fieldset>
</div>
```

- 글쓰기: `v-model="bw.ca_name"`, `name="write-category"`, `id/key` prefix는 `write`.
- 수정: `v-model="be.ca_name"`, `name="edit-category"`, `id/key` prefix는 `edit`.
- 같은 페이지에 write/edit이 같이 있을 수 있으므로 `id`·`for`·`name` 중복을 금지한다.

#### 파일 업로드 표준

파일 input은 raw input만 두지 말고 템하 `fileset` 구조를 사용한다.

```html
<div class="form-box">
  <div class="fileset fileset-md fileset-label">
    <label for="notice-file-1" class="fileset-label">첨부파일</label>
    <input id="notice-file-1" class="fileset-input" type="file"
      :ref="'writeFile1'" @change="handleWriteFileChange(1, $event)">
    <button type="button" class="fileset-cancel" @click="clearFile('write', 1)">삭제</button>
  </div>
</div>
```

수정 화면의 기존 첨부파일은 `bs.normal_files`를 사용한다. `bs.files`는 사용하지 않는다.

#### MCP validator 우회가 필요한 경우

MCP 업데이트 validator가 상세/글쓰기 블록에도 `v-gb-list`/`v-gb-list-onload`를 요구하는 경우가 있다. 이때만 아래처럼 **렌더링되지 않는 검증용 anchor**를 둔다. 실제 목록 UI를 숨겨서 넣는 방식은 금지한다.

```html
<div class="notice-validator-list-anchor" v-if="false"
  v-gb-list="" v-gb-list-row="1" v-gb-list-onload="true"></div>
```

이 anchor는 validator 통과용이며 사용자 화면·에디터 선택 대상이 아니다. 실제 상세/글쓰기 UI와 같은 영역에서 상태를 공유하지 않게 한다.

금지:

- 실제 목록 UI를 `display:none` 또는 낮은 opacity로 숨겨서 함께 넣기
- write/edit/read 상태와 list 상태를 같은 가시 UI에 섞기
- 사용자가 선택 가능한 영역 안에 validator anchor를 배치하기

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

## 7. 프로필 수정 (Profile)

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

## 8. 공통 data-gb-* 속성 전체 목록

### body 레벨
| 속성 | 설명 |
|------|------|
| `data-gb-url` | 그누보드 서버 주소 (필수, body에 단 한 번) |

### 게시판 컴포넌트 (.gnuboard)
| 속성 | 설명 |
|------|------|
| `data-gb-table` | 게시판 테이블명 (템플릿·MCP는 `""` 가능, 사용자가 에디터에서 설정) |
| `data-gb-table-name` | 게시판 표시명 (`""` 가능) |
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

## 9. 자주 하는 실수 — 전체 요약

| 증상 | 원인 | 해결 |
|------|------|------|
| 에디터 버튼이 비활성화됨 | `!isEditor &&` 조건 누락 | `:disabled="!isEditor && !isFormValid"` 패턴 사용 |
| 첨부파일 목록 오류 | `bs.files` 사용 | `bs.normal_files` 로 변경 |
| 본문이 HTML 태그로 출력 | `v-html` 미사용 | `v-html="bs.wr_content"` 사용 |
| 목록 이미지 미표시 | `:data-gb-wr-id` 누락 | `:data-gb-wr-id="item.wr_id"` 추가 |
| 썸네일 대신 더미/본문 이미지 | Unsplash·`item.wr_content` 직접 사용 | §1-6 `getListItemImage(item)` + `wr_thumbnail` |
| 목록 내용이 HTML로 출력 | `data-gb-tpl` 누락 | `data-gb-tpl="wr_content"` 추가 |
| 목록이 안 나옴 | `v-gb-list-onload` 누락 | `v-gb-list-onload="true"` 추가 |
| 그누보드 목록이 통째로 안 보임 | `.gnuboard` HTML은 있지만 블록 JS에서 `vue_gnuboard(el)` 초기화 누락 | §1-5-2 초기화 JS 추가 |
| 그누보드 블록이 통째로 안 보이고 `v-cloak`이 풀리지 않음 | Vue 보간식 안의 `<`, `>` 비교 연산자를 HTML에 그대로 작성해 파싱 오류 발생 | `{{ idx + 1 &lt; 10 ? ... }}`처럼 `&lt;` / `&gt;`로 이스케이프 |
| 목록 아래에 불필요한 안내 문구가 같이 보임 | `notice-empty`, `board-empty` 같은 임의 fallback UI를 고정 렌더링 | 임의 empty UI 제거. 빈 목록은 `data-gb-list-empty`로 처리 |
| 페이지 번호가 안 보임 | `br.total_page > 1` 조건으로 pagination 전체를 숨기거나 `v-gb-list-btn-page` 누락 | `pagination.pages` + `v-gb-list-btn-page` + `v-gb-list-page-active-class` 사용 |
| 상세 페이지가 아무것도 안 보임 | `.gnuboard v-cloak`은 있는데 JS가 비어 있어 `vue_gnuboard(el)`이 실행되지 않음 | 상세 블록 JS에서 내부 `.gnuboard`에 `vue_gnuboard(el)` 호출 |
| 상세 제목/본문이 비거나 선택 필드가 안 잡힘 | `data-gb-tpl="subject"`/`content`처럼 축약 필드명 사용 | `wr_subject`, `wr_content`, `wr_name`, `wr_datetime`, `wr_hit`처럼 실제 필드명 사용 |
| MCP가 상세/쓰기 저장을 거부함 | validator가 `v-gb-list`를 요구하지만 상세/쓰기 UI에는 목록이 없음 | 실제 UI가 아닌 `v-if="false"` validator anchor만 추가 |
| 로그인/회원가입 코드가 있는데 화면에 안 나옴 | `.login-app`/`.signup-app`에 `vue_gnuboard(el)`을 호출함 | 로그인·회원가입·아이디/비번 찾기는 `vue_gnulogin(el)`, 정보수정은 `vue_gnuprofile(el)` |
| 상세 페이지에서 `{{ bs.wr_subject }}` 등이 순간 노출됨 | 상세 `.gnuboard` 루트에 `v-cloak=""` 누락 | §5 상세보기 예시처럼 `.gnuboard`에 `v-cloak=""` 추가 |
| 상세 필드가 에디터 데이터 패널에서 개별 선택되지 않음 | `bs.*` 출력 요소에 `data-gb-tpl` 누락 | 제목/메타/본문/이전·다음글 요소마다 `data-gb-tpl="필드명"` 추가 |
| Vue 보간 문법이 그대로 보임 | `.gnuboard`/`v-gb-list`/`br.writes` 목록 루트 누락 또는 `bs.*` 상세 변수 혼용 | §1-5-1 목록 블록 필수 세트로 재작성 |
| 연동 안 됨 / 가이드와 다름 | `.gnuboard`가 `contents-inner` 안에만 있음 | §1-5 골격: `.gnuboard`가 `contents-container` 바깥 |
| 목록 링크 오류 | `data-gb-list-link`에 pageId 입력 | `list.html` 등 **페이지 파일명** 사용 |
| 글쓰기 요소 선택 시 화면이 사라짐 | 실제 UI 안에 `v-gb-list`를 숨겨 넣거나 write/edit/list 상태가 섞임 | §6-0 구조 사용. validator가 요구할 때만 `v-if="false"` anchor 사용 |
| 글쓰기 분류가 선택되지 않음 | 라디오 `id/for/name` 중복 또는 `bw.ca_name`/`be.ca_name` 혼용 | §6-0 카테고리 라디오 표준 사용 |
| 글쓰기 파일 UI가 에디터에서 불안정함 | raw file input만 사용하거나 템하 파일 컴포넌트 구조 누락 | `fileset fileset-md fileset-label` 구조 사용 |
| 수정 시 기존 내용 미표시 | URL에 `?wr_id` 없음 | `write.html?wr_id=1` 형태로 접근 |
| 상세보기 데이터 없음 | URL에 `?wr_id` 없음 | `viewer.html?wr_id=1` 형태로 접근 |
| 에디터 두 화면 동시 표시 | 에디터 환경의 의도된 동작 | 정상 (운영에서는 하나만 표시) |
| 이미지 변경 버튼 동작 안 함 | `$refs.imageInput.click()` 직접 사용 | `clickImageInput()` 메서드 사용 |
| 개인정보 약관에 태그 노출 | `v-html` 사용 | `{{ terms.privacy }}` 텍스트 보간 사용 |
| 완료 후 이동 안 됨 | `data-gb-redirect` 또는 `data-gb-list-link` 누락 | 해당 속성 확인 및 추가 |
| 중복 확인 후 값 변경 시 재확인 불필요 | 자동 초기화됨 | 별도 처리 불필요 |
| 비회원 목록 이미지 미표시 | 읽기 권한 부족 | 관리자에서 "목록에서 내용보기" 활성화 |
