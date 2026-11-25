# 회원 로그인/아이디찾기 블록 규칙 (Short)

로그인과 아이디/비밀번호 찾기는 `vue_gnulogin`으로 초기화한다.

## 회원 세트 — 로그인만 만들지 말 것 (MUST)

사용자가 “로그인 만들어줘”라고 하면 아래를 **한 세트로** 만들고 링크를 맞춘다.

| 페이지 | 루트 / 런타임 | 비고 |
|--------|---------------|------|
| 로그인 | `.login-app` + `vue_gnulogin` | `data-gb-signup-link`, `data-gb-find-password-link`, `data-gb-redirect` |
| 회원가입 | `.signup-app` + `vue_gnulogin` | `docs/temha-topic-member-signup.md` 참고 |
| 가입완료 | 일반 완료 페이지 | 로그인 링크 `data-link-type="page"` · 회원가입 `data-gb-redirect`가 여기로 |
| 아이디/비밀번호 찾기 | `.login-app` + `data-gb-initial-status="find-password"` + `v-gb-find-password` | |
| 정보수정(프로필) | `.profile-app` + `vue_gnuprofile` | `docs/temha-topic-member-profile.md` 참고 |
| **헤더 로그인 전/후** | 헤더 안 `.gnu-member[v-cloak]` + **`vue_gnuheader`** (`vue_gnuboard` 금지) | `docs/temha-topic-header-login.md` 참고 — **빠지면 로그인해도 메뉴가 안 바뀜** |

**아이디/비밀번호 찾기 페이지 MUST** — 로그인 페이지를 만들면 찾기 페이지도 따로 만든다(예: `member_findpw`). 로그인의 `data-gb-find-password-link`는 **그 페이지 주소**(예: `member_findpw.html`)여야 한다. 로그인 페이지 자신(`login.html`)을 넣으면 안 된다. 없거나 링크가 틀리면 배포가 막힌다.

```html
<div class="login-app" data-gb-login-link="login.html" data-gb-initial-status="find-password">
  <div class="contents-container container-md">
    <div class="contents-inner">
      <div class="textset">
        <h2 class="textset-tit h1">아이디/비밀번호 찾기</h2>
        <p class="textset-desc">회원가입 시 등록하신 이메일 주소를 입력해 주세요. 해당 이메일로 아이디와 비밀번호 정보를 보내드립니다.</p>
      </div>
      <div v-gb-find-password="">
        <div class="form-group">
          <div class="inputset">
            <label for="find-id-email" class="form-tit blind">이메일</label>
            <input id="find-id-email" v-model="find_password_form.email" type="email" class="inputset-input form-control" placeholder="이메일을 입력해주세요." required="">
          </div>
          <div class="form-btn">
            <button type="button" class="btnset btnset-primary btnset-lg btnset-block" @click="sendFindPasswordEmail()">인증메일 보내기</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```
- JS는 로그인과 같이 `vue_gnulogin(el)`. 결과 안내는 런타임이 알림창으로 띄운다.
- 서브 비주얼(LNB 포함)·헤더·푸터도 다른 회원 페이지와 똑같이 둔다.

세트 검증:
- [ ] 위 페이지가 실제로 있는가
- [ ] 로그인 ↔ 회원가입 ↔ 찾기 ↔ 프로필 링크/`data-gb-*-link`가 실제 HTML 경로인가
- [ ] 헤더에 `gbShowHeaderLoggedOutUi` / `gbShowHeaderLoggedInUi` 양쪽이 있는가
- [ ] 헤더 정보수정 → `./profile.html` + `data-link-type="page"`, 로그아웃 → `handleLogout`

## 로그인 블록 MUST

- 로그인 루트: `.login-app`
- 로그인 필수 속성: `data-gb-signup-link`, `data-gb-find-password-link`, `data-gb-redirect`, `data-gb-initial-status="login"`
- 로그인 영역: `v-gb-login=""`
- 아이디/비밀번호 찾기 루트: `.login-app`
- 찾기 필수 속성: `data-gb-initial-status="find-password"`
- 찾기 영역: `v-gb-find-password=""`
- 아이디: `login_form.username`
- 비밀번호: `login_form.password`
- 아이디 저장: `login_form.rememberMe`
- 로그인 버튼: `@click="handleLogin"`
- **로그인 실패 안내 MUST**: 런타임은 실패 문구를 `alert.message`에 넣기만 하고 화면에 그리지 않는다. 비밀번호 칸 아래에 표시 줄이 없으면 비밀번호가 틀려도 **아무 반응이 없다**(저장 시 검증 오류).
  ```html
  <div class="inputset inputset-icon icon-right">
    <div class="inputset-wrap">
      <input type="password" class="inputset-input form-control" v-model="login_form.password"
        :class="{ 'input-error': loginPasswordInputError }" @input="clearLoginPasswordErrorOnInput" @keyup.enter="handleLogin">
      <i class="ff-ico ti-exclamation-circle"></i>
    </div>
    <p v-if="loginPasswordInputError" class="help-text error">{{ alert.message }}</p>
  </div>
  ```
- 회원가입 링크: `:href="getSignupLink()"`
- 찾기 링크: `:href="getFindPasswordLink()"`
- JS: 내부 `.login-app` DOM에 `vue_gnulogin(el)` 호출
- 저장 후 블록 HTML/CSS/JS 파일을 다시 확인

## SNS 로그인 (네이버·카카오·구글·페이스북)

로그인 블록에는 SNS 버튼 4개를 **모두** 넣는다. 실제 노출은 런타임이 관리자(`/admin` → 기본환경설정 → 소셜로그인)에서 켠 제공자만 남기고 나머지는 숨긴다. 켠 게 없으면 영역 전체가 숨는다.

```html
<div class="sns-link" data-gb-social-wrap>
  <div class="link-title"><span class="p1">SNS 계정 로그인</span></div>
  <div class="link-wrap">
    <a href="javascript:void(0)" class="btnset btnset-line-light btnset-block btnset-icon ico-kakao" data-gb-social="kakao">카카오 로그인</a>
    <a href="javascript:void(0)" class="btnset btnset-line-light btnset-block btnset-icon ico-naver" data-gb-social="naver">네이버 로그인</a>
    <a href="javascript:void(0)" class="btnset btnset-line-light btnset-block btnset-icon ico-google" data-gb-social="google">구글 로그인</a>
    <a href="javascript:void(0)" class="btnset btnset-line-light btnset-block btnset-icon ico-facebook" data-gb-social="facebook">페이스북 로그인</a>
  </div>
  <div data-gb-social-register></div>
</div>
```

- SNS 영역은 반드시 `.login-app` **안**(`v-gb-login` 영역 안)에 둔다. 밖에 두면 동작하지 않는다.
- 버튼마다 `data-gb-social="naver|kakao|google|facebook"` 필수. 감싸는 요소에 `data-gb-social-wrap`.
- `data-gb-social-register`(선택): 처음 SNS로 온 사람의 닉네임 가입 폼이 들어갈 자리. 없으면 SNS 영역 바로 앞에 그려진다.
  - 런타임이 `<form class="gb-social-register-form">`(제목 `.gb-social-register-title` + `.inputset-input` + `.btnset`)을 넣는다. 간격은 공통 CSS가 주지만 **글자색은 블록 CSS에서** 배경에 맞춰 준다(어두운 배경이면 `.블록명 .gb-social-register-form .gb-social-register-title { color: var(--white); }`). 가입 실패는 런타임이 알림창으로 띄운다.
- 로그인 실패 안내 줄(`{{ alert.message }}`)은 배경 위에서 **잘 보이는 빨간색**(밝은 배경 `var(--danger)`, 어두운 배경 `#ff6b6b` + 옅은 빨간 바탕)으로 준다. 글자 기본색(p2)에 묻히면 안 된다.
- 아이콘은 템하 공통 CSS가 `ico-kakao|ico-naver|ico-google|ico-facebook` 클래스(+`btnset-icon`)로 제공한다. **블록 CSS에 아이콘 이미지를 넣지 않는다.**
- 에디터에서는 4개가 모두 보인다(편집용). 고객에게 "관리자에서 켠 SNS만 사이트에 보인다"고 안내한다.

## 금지

- `.login-app`에 `vue_gnuboard(el)` 호출
- `.login-app`인데 JS 비워두기
- 실제 링크에 `data-link-type` 누락
- 로그인 페이지만 만들고 가입완료·찾기·정보수정·헤더 분기를 생략
- SNS 버튼을 `.login-app` 밖 별도 블록에 두기
- SNS 버튼 `href`에 소셜 로그인 URL을 직접 넣거나 `onclick` 직접 작성
