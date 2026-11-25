# 헤더 로그인 상태 블록 규칙 (Short)

헤더/공통 네비게이션에서 **로그인 전/후 UI를 분기**할 때 사용한다. 로그인 페이지가 아니다.

로그인을 만들면 **헤더도 반드시 같이 고친다.** 로그인/회원가입 페이지만 만들고 헤더 분기를 빼면, 로그인해도 버튼이 바뀌지 않는다.

## MUST

- 루트: 헤더 블록 내부에 회원 UI를 감싸는 **`div.gnu-member[v-cloak]`** (`.gnuboard` 클래스 쓰지 않음 — 게시판 목록 검증 대상이 아님)
- 초기화: 헤더 블록 JS에서 그 DOM에 **`vue_gnuheader(el)`** 호출.  
  **`vue_gnuboard` 금지** — 게시판용 런타임에는 `user`·`profileImage`·`handleLogout`이 **없어서** 로그인하면 로그인 후 메뉴(정보수정·로그아웃)가 그려지지 않는다(2026-11-18 실사이트 확인). `vue_gnulogin`도 금지.
- **비로그인 / 로그인 UI를 둘 다** 둔다. 한쪽만 두면 전환이 안 된다.
- 비로그인(또는 에디터 미리보기): `v-if="gbShowHeaderLoggedOutUi"`  
  → 로그인·회원가입 링크
- 로그인(또는 에디터 미리보기): `v-if="gbShowHeaderLoggedInUi"`  
  → 프로필 이미지·회원명·정보수정·로그아웃
- `v-cloak=""`은 루트 `div.gnu-member`에 둔다 (Vue 마운트 전 `{{ }}`·양쪽 메뉴가 잠깐 보이는 것 방지)
- `gbShowHeaderLoggedOutUi` = `!isLoggedIn || 에디터`  
  `gbShowHeaderLoggedInUi` = `isLoggedIn || 에디터`  
  (에디터에서도 양쪽 UI를 디자인할 수 있게 런타임이 제공하는 계산값. **`isLoggedIn`만 써도 되지만, 헤더는 위 두 변수를 권장**)
- 프로필 이미지: `:src="profileImage"`
- 회원 이름: `{{ user.mb_name || user.mb_nick }}` (`vue_gnuheader`가 로그인 시 `user`를 채움. `userInfo` 아님)
- 로그아웃: `@click="handleLogout"` (단순 `href` 로그아웃 금지)
- 정보수정 링크: `href="./profile.html"` + `data-link-type="page"`  
  **`javascript:void(0)` 금지** — 페이지가 안 열림
- 로그인/회원가입 링크도 내부 페이지면 `data-link-type="page"`
- 헤더 GNB: `header-gnblink` / 2뎁스 `header-sublist` 등 기존 헤더 규칙 유지
- 저장 후 블록 HTML/CSS/JS 파일을 다시 확인 · 헤더는 공통으로 자동 적용(사용자에게 요청 안 함)

## 최소 예시

```html
<li class="member-area">
  <div class="gnu-member" v-cloak="">
    <!-- 비로그인 -->
    <ul class="user-menu" v-if="gbShowHeaderLoggedOutUi">
      <li><a href="./login.html" data-link-type="page">로그인</a></li>
      <li><a href="./signup.html" data-link-type="page">회원가입</a></li>
    </ul>
    <!-- 로그인 후 -->
    <ul class="user-menu" v-if="gbShowHeaderLoggedInUi">
      <li class="member">
        <img :src="profileImage" alt="프로필">
        <span>{{ user.mb_name || user.mb_nick }}</span>
      </li>
      <li><a href="./profile.html" data-link-type="page">정보수정</a></li>
      <li><button type="button" @click="handleLogout">로그아웃</button></li>
    </ul>
  </div>
</li>
```

```js
// 헤더 블록 JS (IIFE + 블록 스코프)
(function () {
  $(function () {
    $(".header-N1[id='실제bid']").each(function () {
      const el = $(this).find(".gnu-member")[0];
      if (el && typeof vue_gnuheader === "function") vue_gnuheader(el);
    });
  });
})();
```

## 로그인해도 UI가 안 바뀔 때

1. 헤더에 `.gnu-member` + **`vue_gnuheader(el)`**가 있는가 (`vue_gnuboard`면 로그인 후 메뉴가 안 그려짐)
2. `gbShowHeaderLoggedOutUi` / `gbShowHeaderLoggedInUi` **양쪽**이 있는가 (로그인 후 블록만 있으면 안 됨)
3. 정보수정이 `javascript:void(0)`이 아니라 `./profile.html` + `data-link-type="page"`인가
4. 프로필 페이지(`.profile-app` + `vue_gnuprofile`)가 실제로 있는가
5. 헤더를 페이지마다 또 만들지 않았는가(공통 자동 적용)

## 금지

- 헤더에 `.login-app` / `.signup-app` / `.profile-app` 또는 `vue_gnulogin` / `vue_gnuprofile`
- 헤더 회원 영역에 `.gnuboard` + `vue_gnuboard` (게시판 런타임 — 회원 메뉴 변수 없음)
- 회원 영역 JS 비워두기
- 로그인 후 UI만 넣고 비로그인 UI 생략
- 정보수정 `href="javascript:void(0)"`
- `data-gb-url` 직접 입력
- 내부 페이지 링크에 `data-link-type="page"` 누락
