# 문의·입력 폼 — 템플릿 개발 가이드

> 출처: 「페이지 템플릿 제작 방법」v1.0 **p.21~25 (입력폼 요소)** + `temha-ai-spec.md`  
> 에디터는 **`form-group` 기준**으로 필드 추가·제목·필수·개인정보 동의를 제어합니다.

### MUST vs 자유 작성

| 구분 | 내용 |
|------|------|
| **MUST** | 블록 골격, `form-group` > `form` > `form-box`, 컴포넌트 class(`inputset`, `checkset`, `radioset`, `selectset`, `fileset`, `btnset`) |
| **자유** | 필드 개수·순서, `inputset-line` / `inputset-lg` 등 스타일, 블록별 레이아웃 CSS |
| **금지** | `form-box` 없이 input만 나열, `btnset` 외 버튼 전용 CSS, GET 제출 |

---

## 1. 블록 골격 (MUST)

```html
<div class="블록명">
  <div class="contents-container container-md">
    <div class="form-group">
      <form
        action="https://api.imbackend.com/fn/v1/form.form"
        method="POST"
        target="_blank"
        data-form-title="문의 폼"
      >
        <!-- form-box 반복 -->
        <div class="form-btn">
          <button type="submit" class="btnset btnset-primary btnset-sm">문의하기</button>
        </div>
      </form>
    </div>
  </div>
</div>
```

| 항목 | 규칙 |
|------|------|
| 최상위 | `.블록명` (예: `contact-N1`, `form-N1`) |
| 컨테이너 | `contents-container` + `container-md` / `lg` / `sm` |
| 제어 기준 | **`form-group`** — 에디터가 이 안의 `form-box`를 필드 단위로 추가·삭제 |
| `form` | `method="POST"`, `action` 필수, `target="_blank"` 권장 |
| `data-form-title` | 폼 식별명 (PDF·에디터) |
| 제출 버튼 | `form-btn` 안, `type="submit"`, **`btnset`** (`template.css`) |

---

## 2. 에디터 제어 규칙 (PDF p.22)

| 번호 | 제어판 동작 | HTML/CSS |
|------|-------------|----------|
| 1 | 필드 **제목 노출** | `<h6 class="form-tit h6">제목</h6>` |
| 2 | **필수** 표시 | 제목 안 `<span>*</span>` — 해제 시 span 제거 |
| 3 | 필드 **유형** 변경 | 아래 §3~5 패턴 중 해당 블록으로 교체 |
| 4 | 필드 **추가** | `<div class="form-box">…</div>` 블록 추가 |
| 5 | **개인정보 수집동의** ON | `contents-agree` 영역 삽입 (OFF 시 삭제) |
| 5-1 | 「자세히 보기」 | `btnset-link modal-privacy-btn` → `modal-privacy` 레이어 |

개인정보 레이어(블록 또는 페이지 공통):

```html
<div class="sample-modal modal-privacy">
  <!-- 개인정보 처리방침 본문 -->
</div>
```

---

## 3. 한 줄 입력 · 이메일 · 연락처 (PDF p.23)

**에디터형**(제목이 input 위 — 권장):

```html
<div class="form-box">
  <h6 class="form-tit h6">이름<span>*</span></h6>
  <div class="inputset inputset-line inputset-lg">
    <input
      type="text"
      class="inputset-input form-control"
      data-form-field="이름"
      placeholder="이름을 입력해주세요."
      aria-label="이름"
      required
    />
  </div>
</div><!--//form-box-->
```

| 유형 | `input` type |
|------|----------------|
| 일반 텍스트 | `text` |
| 이메일 | `email` |
| 연락처 | `tel` |

**라인 라벨형**(제목이 input 아래 — 간단 문의폼):

```html
<div class="form-box">
  <div class="inputset inputset-line">
    <input type="text" id="name" class="inputset-input form-control" required />
    <label for="name" class="form-tit">이름</label>
  </div>
</div>
```

- `id` / `for` 쌍은 블록 안에서 **유일**해야 함.

---

## 4. 라디오 · 체크박스 (PDF p.22~23)

### 체크박스(복수 선택, 예: 분야)

```html
<div class="form-box">
  <div class="contents-check">
    <h6 class="form-tit h6">분야<span>*</span></h6>
    <div class="checkset-wrap">
      <div class="checkset">
        <input id="field-1" class="checkset-input input-fill" type="checkbox" value="" checked />
        <label class="checkset-label" for="field-1"></label>
        <span class="checkset-text">Project</span>
      </div>
      <div class="checkset">
        <input id="field-2" class="checkset-input input-fill" type="checkbox" value="" />
        <label class="checkset-label" for="field-2"></label>
        <span class="checkset-text">Portfolio</span>
      </div>
    </div>
  </div>
</div>
```

### 라디오

```html
<div class="form-box">
  <h6 class="form-tit h6">성별<span>*</span></h6>
  <div class="radioset-wrap">
    <div class="radioset">
      <input id="radio-1" name="gender" class="radioset-input input-line" type="radio" value="" checked />
      <label class="radioset-label" for="radio-1"></label>
      <span class="radioset-text">남자</span>
    </div>
    <div class="radioset">
      <input id="radio-2" name="gender" class="radioset-input input-line" type="radio" value="" />
      <label class="radioset-label" for="radio-2"></label>
      <span class="radioset-text">여자</span>
    </div>
  </div>
</div>
```

**기타(직접입력)** 옵션: `radioset-text` 안에 `input.form-control` 추가 (PDF p.23).

---

## 5. 셀렉트 · 날짜/시간 · 파일 (PDF p.24)

### 셀렉트

```html
<div class="form-box">
  <h6 class="form-tit h6">직업 선택<span>*</span></h6>
  <div class="selectset selectset-lg">
    <select class="selectset-select" aria-label="직업 선택">
      <option selected>직업 선택</option>
      <option value="옵션1">옵션명</option>
    </select>
    <span class="selectset-arrow"></span>
  </div>
</div>
```

### 날짜 + 시간 (`row gutter-2`)

```html
<div class="form-box">
  <h6 class="form-tit h6">날짜 및 시간<span>*</span></h6>
  <div class="row gutter-2">
    <div class="col">
      <div class="inputset inputset-date">
        <input type="date" class="inputset-input form-control" placeholder="날짜 선택" aria-label="날짜" />
      </div>
    </div>
    <div class="col">
      <div class="inputset inputset-time">
        <input type="time" class="inputset-input form-control" placeholder="시간 선택" aria-label="시간" />
      </div>
    </div>
  </div>
</div>
```

### 파일 첨부

```html
<div class="form-box">
  <h6 class="form-tit h6">첨부 파일<span>*</span></h6>
  <div class="fileset fileset-lg fileset-label">
    <div class="fileset-body">
      <label class="fileset-label">
        <div class="fileset-group">
          <input type="file" class="fileset-input" />
          <button type="button" class="fileset-cancel"></button>
        </div>
        <span class="btnset btnset-line-secondary btnset-lg fileset-upload">파일 첨부하기</span>
      </label>
    </div>
  </div>
</div>
```

---

## 6. 텍스트 영역(문의 내용)

```html
<div class="form-box">
  <h6 class="form-tit h6">문의 내용<span>*</span></h6>
  <div class="inputset">
    <textarea
      id="message"
      name="문의 내용"
      class="inputset-textarea form-control"
      data-form-field="문의 내용"
      placeholder="문의 내용을 입력해주세요."
      required
    ></textarea>
  </div>
</div>
```

라인 스타일: `inputset inputset-line` 래핑.

---

## 7. 개인정보 동의 · 제출 (PDF p.22)

```html
<div class="contents-agree">
  <div class="checkset">
    <input id="agree-1" class="checkset-input input-fill" type="checkbox" value="" checked />
    <label class="checkset-label" for="agree-1"></label>
    <span class="checkset-text">개인정보 수집동의</span>
  </div>
  <a href="javascript:void(0);" class="btnset btnset-link modal-privacy-btn">자세히 보기</a>
</div>

<div class="form-btn">
  <button type="submit" class="btnset btnset-primary btnset-sm">문의하기</button>
</div>
```

---

## 8. 제출 성공 모달 (PDF p.25)

문의 접수 후 안내용. `data-modal-id`와 버튼/닫기 `data-modal-close` 연동.

```html
<div
  class="modalset modalset-xs modalset-dark modalset-confirm modalset-success"
  data-modal-id="form-success-modal"
>
  <div class="modalset-content">
    <button type="button" class="modalset-close" data-modal-close="modalset"></button>
    <div class="modalset-body">
      <div class="modalset-state modalset-success"></div>
      <div class="modalset-textarea">
        <p class="modalset-text">
          성공적으로 메시지가 접수 되었으며,<br />
          빠른 시일 내에 연락드리겠습니다.<br />
          감사합니다.
        </p>
        <button type="button" class="btnset btnset-sm btnset-line-light" data-modal-close="modalset">
          확인
        </button>
      </div>
    </div>
  </div>
</div>
```

| 클래스 | 의미 |
|--------|------|
| `modalset-success` | 성공 |
| `modalset-warning` | 경고 |
| `modalset-error` | 오류 |

---

## 9. 기본 문의폼 예시 (이름·이메일·내용)

에디터 필드 확장 전 **최소 3필드** 템플릿. §3 라인 라벨형 + §7 제출.

```html
<div class="form-N1">
  <div class="contents-container container-md">
    <div class="form-group">
      <form
        target="_blank"
        action="https://api.imbackend.com/fn/v1/form.form"
        method="POST"
        data-form-title="문의 폼"
      >
        <div class="form-box">
          <div class="inputset inputset-line">
            <input type="text" id="name" class="inputset-input form-control" required />
            <label for="name" class="form-tit">이름</label>
          </div>
        </div>
        <div class="form-box">
          <div class="inputset inputset-line">
            <input type="email" id="email" class="inputset-input form-control" required />
            <label for="email" class="form-tit">이메일</label>
          </div>
        </div>
        <div class="form-box">
          <div class="inputset">
            <textarea id="message" class="inputset-textarea form-control" required></textarea>
            <label for="message" class="form-tit">문의내용</label>
          </div>
        </div>
        <div class="form-btn">
          <button type="submit" class="btnset btnset-primary btnset-sm">문의하기</button>
        </div>
      </form>
    </div>
  </div>
</div>
```

필드·동의·성공 모달이 필요하면 §2~8 패턴을 `form-box` 단위로 추가합니다.

---

## 10. 개발 체크리스트

- [ ] `form-group` > `form` > `form-box` 구조인가
- [ ] `method="POST"`, `action="https://api.imbackend.com/fn/v1/form.form"` 인가
- [ ] 입력마다 `form-box`로 감쌌는가
- [ ] `inputset-input form-control` / `inputset-textarea form-control` 사용했는가
- [ ] 제출 버튼이 `form-btn` + `btnset` 인가
- [ ] 개인정보 동의 사용 시 `contents-agree` + `modal-privacy` 있는가
- [ ] 에디터 제어 필드는 `h6.form-tit` + `data-form-field` (해당 시) 인가
- [ ] checkbox/radio `id`·`for`·`name`이 유일한가
