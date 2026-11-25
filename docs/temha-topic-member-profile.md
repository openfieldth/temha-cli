# 회원 정보수정 블록 규칙 (Short)

정보수정은 `vue_gnuprofile`로 초기화한다.

## MUST

- 루트: `.profile-app`
- 필수 속성: `data-gb-login-link`, `data-gb-redirect`
- 비밀번호 확인 영역: `v-gb-password-check=""`
- 정보수정 영역: `v-gb-profile-edit=""`
- 이전 버튼: `v-gb-btn-password-check=""`
- 비밀번호 확인: `password_check_form.password`, `handlePasswordCheck`
- 프로필 폼: `profile_form.*`
- 닉네임 중복확인: `checkDuplicate('mb_nick')`
- 이미지 변경: `clickImageInput()`
- 이미지 삭제: `clickImageDelete()`
- 저장: `handleUpdateProfile`
- **오류 안내 MUST**: 런타임은 오류를 변수에 넣기만 하고 화면에 그리지 않는다. 표시 줄이 없으면 비밀번호가 틀려도 **아무 반응이 없다**(저장 시 검증 오류).
  ```html
  <!-- 비밀번호 확인 칸 아래 -->
  <input type="password" class="inputset-input form-control" v-model="password_check_form.password"
    :class="{ 'input-error': !!passwordCheckError }" @keyup.enter="handlePasswordCheck">
  <p v-if="passwordCheckError" class="help-text error">{{ passwordCheckError }}</p>

  <!-- 정보수정 영역 맨 위 또는 저장 버튼 위 -->
  <p v-if="profileSubmitError" class="help-text error">{{ profileSubmitError }}</p>
  <!-- 각 입력칸 아래 (mb_name, mb_nick, mb_email, mb_password, mb_password_re, mb_hp, mb_tel, mb_homepage, mb_zip, mb_addr1, mb_signature, mb_profile) -->
  <p v-if="profileFieldErrors.mb_email" class="help-text error">{{ profileFieldErrors.mb_email }}</p>
  <!-- 회원 이미지 아래 -->
  <p v-if="profileImageError" class="help-text error">{{ profileImageError }}</p>
  ```
- 새 비밀번호 변경 칸(`profile_password_form.mb_password` / `mb_password_re`)도 넣는다. 비우면 변경 안 함.
- 수신 동의 체크박스: `<div class="checkset checkset-fill">` + `<input class="checkset-input">` + `<label class="checkset-label">` (스타일 클래스 `checkset-fill`/`checkset-line` 등 **필수** — 없으면 체크해도 체크 표시가 안 보임. `input-fill` 같은 클래스는 키트에 없음) + 고유 `id`/`for`
- JS: 내부 `.profile-app` DOM에 `vue_gnuprofile(el)` 호출
- 저장 후 블록 HTML/CSS/JS 파일을 다시 확인

## 금지

- `.profile-app`에 `vue_gnuboard(el)` 또는 `vue_gnulogin(el)` 호출
- `.profile-app`인데 JS 비워두기
- `checkset`에 스타일 클래스(`checkset-fill` 등) 없이 쓰거나, input에 키트에 없는 `input-fill` 클래스 사용
- `$refs.imageInput.click()` 직접 호출
