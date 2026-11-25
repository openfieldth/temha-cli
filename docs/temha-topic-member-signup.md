# 회원가입 블록 규칙 (Short)

회원가입은 약관 단계와 가입 폼 단계를 분리한다.

## MUST

- 루트: `.signup-app`
- 필수 속성: `data-gb-login-link`, `data-gb-redirect`, `data-gb-initial-status="terms"`
- 약관 단계: `v-gb-terms=""`
- 가입 폼 단계: `v-gb-signup=""`
- 다음 버튼: `v-gb-btn-signup`
- 이전 버튼: `v-gb-btn-terms`
- 전체 동의: `agreeAll` + `@change="toggleAllAgree"`
- 개별 동의: `agreements.stipulation`, `agreements.privacy`
- **체크박스 정렬 MUST**: 키트 체크박스는 `.checkset` 영역의 **세로 가운데**(top:50%)에 그려진다. 그래서 `.checkset` 요소 자체에 `padding`·`border`·`margin-bottom`·`min-height`를 주면 체크박스가 글자보다 아래로 밀린다(전체 동의 줄의 단골 오류). 구분선·여백은 **바깥 감싸개**에 준다:
  ```html
  <div class="agree-all">  <!-- 여기에 padding-bottom·border-bottom -->
    <div class="checkset checkset-fill checkset-lg">
      <input id="xx-agree-all" class="checkset-input" type="checkbox" v-model="agreeAll" @change="toggleAllAgree">
      <label for="xx-agree-all" class="checkset-label h6">전체 약관에 동의합니다</label>
    </div>
  </div>
  ```
  글자를 크게(`h6` 등) 쓰는 줄은 체크박스도 `checkset-lg`로 키운다. `.checkset`에 붙은 클래스(예: `agree-all checkset`)로 여백 CSS를 주지 않는다.
- 체크박스: `<div class="checkset checkset-fill">` + `<input class="checkset-input">` + `<label class="checkset-label">` (스타일 클래스 `checkset-fill`/`checkset-line` 등 **필수** — 없으면 체크해도 체크 표시가 안 보임. `input-fill` 같은 클래스는 키트에 없음) + 고유 `id`/`for`
- 필드명: `signup_form.mb_id`, `mb_password`, `mb_password_re`, `mb_name`, `mb_nick`, `mb_email`
- 중복확인: `checkDuplicate('mb_id')`, `checkDuplicate('mb_nick')` — **버튼을 눌러 `validation.* === true`가 되어야 가입 버튼이 켜짐**
- 상태 표시: `validation.mb_id`, `validation.mb_nick` (미확인/사용가능/사용불가 문구를 UI에 표시)
- 비밀번호 안내: **영문+숫자 포함 8자 이상** (`signupPasswordIsValid`) + 확인 일치 메시지 실시간 표시
- 가입 버튼: `@click="handleSignup"` + `:disabled="!isEditor && !isFormValid"`
- **오류 안내 MUST**: 런타임은 오류를 `signupSubmitError`(한 줄)와 `signupFieldErrors.필드명`(칸별)에 넣기만 한다. 표시 줄이 없으면 가입이 실패해도 **아무 반응이 없다**(저장 시 검증 오류).
  ```html
  <!-- 각 입력칸 아래 (mb_name, mb_id, mb_password, mb_password_re, mb_nick, mb_email, mb_hp, mb_tel, mb_homepage, mb_zip, mb_addr1, mb_signature, mb_profile) -->
  <p v-if="signupFieldErrors.mb_email" class="help-text error">{{ signupFieldErrors.mb_email }}</p>
  <!-- 가입 버튼 위 -->
  <p v-if="signupSubmitError" class="help-text error">{{ signupSubmitError }}</p>
  ```
  input에는 `:class="{ 'input-error': !!signupFieldErrors.mb_email }"`를 함께 준다.
- 약관 다음 버튼: `v-gb-btn-signup` + `:disabled="!isEditor && !canProceedToSignup"`
- **조건부 필드 HTML을 반드시 포함** (`showHomepage`/`showTel`/`showHp`/`showAddr`/`showSignature`/`showProfile`/`showRecommend` + 수신동의). 화면에서 안 보이면 `v-if`로 숨겨질 뿐, **마크업을 통째로 빼면 안 됨**
- JS: 내부 `.signup-app` DOM에 `vue_gnulogin(el)` 호출
- 저장 후 블록 HTML/CSS/JS 파일을 다시 확인

## `isFormValid` — 가입하기가 안 켜질 때 (CRITICAL)

런타임(`temhagnu.js`)은 아래를 **모두** 만족해야 `isFormValid === true`다. 보이는 6칸만 채워도 버튼이 꺼져 있으면 대개 누락·규칙 불일치다.

1. `mb_id` / `mb_password` / `mb_password_re` / `mb_name` / `mb_nick` / `mb_email` 모두 입력
2. `signupPasswordIsValid(pw)` — **길이 8자 + 영문 1자 이상 + 숫자 1자 이상** (숫자만·영문만 불가)
3. 비밀번호 === 비밀번호 확인
4. `validation.mb_id === true` **그리고** `validation.mb_nick === true` (중복확인 버튼 필수)
5. 아이디 로컬 규칙: 3자 이상, `영문·숫자·_`만
6. 이메일 형식 유효
7. **서버 `memberConfig` 조건부 필수** — `showXxx && reqXxx`인 필드 값 존재  
   (예: `cf_req_hp`면 휴대폰을 입력해야 함. HTML에 `v-if="showHp"` 블록이 없으면 사용자는 입력할 칸이 없는데 검증만 실패 → **버튼이 영원히 꺼짐**)

### 자주 깨지는 AI 실수 vs 정상 템플릿

| 깨진 예 | 정상 |
|---------|------|
| 기본 6필드만 작성, `showHp` 등 조건부 블록 **삭제** | 조건부 블록을 `v-if`로 **항상 포함** (필수면 `*` + `:required="reqXxx"`) |
| 비밀번호 안내를 "8자 이상"만 표기 | "영문·숫자 포함 8자" + `signupPasswordIsValid` 메시지 |
| 라벨에 `*` 없음 | 항상 필수 `*`, 조건부 `v-if="reqXxx"`로 `*` |
| 수신동의·추천인 블록 생략 | 선택 블록도 포함 (`*` 없음) |
| 약관 「다음」에 `canProceedToSignup` 없음 | `:disabled="!isEditor && !canProceedToSignup"` |

## 라벨 — 필수 / 선택 구분 (MUST)

고객이 무엇을 채워야 하는지 라벨로 바로 구분한다. **라벨 없이 input만 두지 말 것.**

### 항상 필수 (라벨에 `*` 고정)

| 필드 | 라벨 예 |
|------|---------|
| `mb_name` | `이름 *` |
| `mb_id` | `아이디 *` (+ 중복확인) |
| `mb_password` | `비밀번호 *` (8자 이상 안내) |
| `mb_password_re` | `비밀번호 확인 *` |
| `mb_nick` | `닉네임 *` (+ 중복확인) |
| `mb_email` | `이메일 *` |

```html
<label for="signup-mb-id">아이디 <span class="req" aria-hidden="true">*</span></label>
```

### 조건부 필드 (`showXxx` / `reqXxx`)

서버 `memberConfig`에 따라 표시·필수 여부가 달라진다.

| 필드 | 표시 | 필수 |
|------|------|------|
| `mb_homepage` | `showHomepage` | `reqHomepage` |
| `mb_tel` | `showTel` | `reqTel` |
| `mb_hp` | `showHp` | `reqHp` |
| `mb_zip` / `mb_addr1` / `mb_addr2` | `showAddr` | `reqAddr` (`mb_addr2`는 보통 선택) |
| `mb_signature` | `showSignature` | `reqSignature` |
| `mb_profile` | `showProfile` | `reqProfile` |
| `mb_recommend` | `showRecommend` | 선택(필수 아님) |

```html
<div v-if="showHp">
  <label>휴대폰번호 <span v-if="reqHp" class="req">*</span></label>
  <input type="tel" v-model="signup_form.mb_hp" :required="reqHp">
</div>
```

- 조건부 **필수**일 때만 `*` 표시: `<span v-if="reqXxx">*</span>`
- 조건부 **선택**이면 `*` 없이 라벨만 (또는 `(선택)` 표기 가능)
- input에는 `:required="reqXxx"`를 함께 둔다

### 항상 선택 (수신 동의 — `*` 없음)

- `mb_sms` / `mb_mailling` / `mb_open` — `:true-value="1" :false-value="0"`
- 라벨에 `*`를 붙이지 않는다

## 고객 안내 (버튼이 꺼져 있을 때)

1. 아이디·닉네임 **중복확인**을 눌러 사용 가능인지
2. 비밀번호가 **영문+숫자 포함 8자**인지, 확인란과 일치하는지
3. `*` 필수·화면에 보이는 조건부 필수 칸을 모두 채웠는지

버튼 근처 안내 예: `가입하기는 필수(*)·중복확인·영문+숫자 비밀번호 조건이 모두 충족되면 활성화됩니다.`

## 금지

- `.signup-app`에 `vue_gnuboard(el)` 호출
- `.signup-app`인데 JS 비워두기
- 약관 체크박스를 일반 input만 나열하고 `checkset`/`label for` 누락
- `.checkset` 요소에 padding·border를 줘서(예: `<div class="agree-all checkset">` + `.agree-all{padding-bottom}`) 체크박스가 글자보다 아래로 내려감
- `checkset`에 스타일 클래스(`checkset-fill` 등) 없이 쓰거나, input에 키트에 없는 `input-fill` 클래스 사용
- `terms.privacy`를 `v-html`로 출력
- `signup_form.id`, `signup_form.password` 같은 임의 축약 필드명
- 회원가입 화면에 게시판용 `v-gb-list` anchor 추가
- **필수/선택 구분 없이 라벨만 나열하거나 `*` 누락**
- **조건부 `showXxx` 필드를 HTML에서 삭제** (기본 6칸만 두고 끝내기)
- 비밀번호를 “8자만”으로 안내하고 영문+숫자 규칙을 빼는 것
- 중복확인·비밀번호 조건 안내 없이 가입 버튼만 두고 끝내는 것
