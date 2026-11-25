# LNB(서브 메뉴 / 로컬 네비) — AI MCP MUST

> **LNB·서브메뉴·서브페이지 네비 작업 전 필수**  
> `read_temha_rules({ topic: "lnb" })` 를 **먼저** 읽고, 아래 MUST를 지킨 뒤에만 `create_block` / `update_block` 한다.  
> topic 없이 LNB HTML을 추측·임의 작성 **금지**.

---

## 0. 전제 (개발자 규칙 — 절대)

LNB는 **독립 메뉴가 아니다.**  
헤더 GNB(`ul.header-gnblist`)를 기준으로 에디터/템플릿이 **메뉴를 찾아 LNB를 다시 그린다.**

| 조건 | 규칙 |
|------|------|
| **헤더 필수** | 같은 프로젝트/페이지에 헤더가 있고, **`ul.header-gnblist`** 가 있어야 LNB가 동작한다 |
| **메뉴 원본** | 메뉴 이름·목록·페이지 연결은 **헤더 메뉴**에서 수정. LNB에서만 새 메뉴 체계를 만들지 않는다 |
| **area** | LNB는 **`area="content"`** 만 (헤더/푸터 area 금지) |
| **배치** | 보통 **서브 비주얼(서브페이지 상단) 블록 안**에 `lnb-container`로 포함 |

헤더에 `header-gnblist`가 없으면 → **먼저** `read_temha_rules({ topic: "header-footer" })` 로 헤더를 고친 뒤 LNB를 만든다.

---

## 1. MUST — `li`가 꼭 필요한 곳 (3곳)

메뉴 **항목**은 반드시 `<li>` + 지정 class. `div`/`span`으로 항목 대체 **절대 금지**.

| # | 부모 | 필수 `li` | 역할 |
|---|------|-----------|------|
| ① | `ul.lnb-depth1-list` | **`li.lnb-depth1-item`** | 1뎁스(헤더 GNB 1뎁스에 대응) |
| ② | `ul.lnb-depth1-sublist` | **`li.lnb-item`** | 1뎁스 아래 2뎁스(헤더 `header-sublist`에 대응) |
| ③ | `ul.lnb-list` | **`li.lnb-item`** | 현재 위치용 2뎁스 목록(depth2 드롭다운) |

현재 페이지 항목에는 `active` + `is-active` 를 해당 `li`에 둔다.

---

## 2. MUST — 태그 / class 골격 (빠지면 에디터·토글 깨짐)

```
.lnb-container
  └─ .lnb-inner
       └─ nav.lnb.lnb-type-dropdown
            ├─ .lnb-home
            │    └─ a.lnb-home-link > span
            ├─ .lnb-depth1
            │    ├─ .lnb-title
            │    │    └─ button.lnb-depth1-toggle > span + i(chevron)
            │    └─ ul.lnb-depth1-list
            │         └─ li.lnb-depth1-item
            │              ├─ a.lnb-depth1-link > span
            │              └─ ul.lnb-depth1-sublist   ← 하위 있을 때만
            │                   └─ li.lnb-item
            │                        └─ a.lnb-link > span
            └─ .lnb-depth2
                 ├─ button.lnb-depth2-toggle > span + i(chevron)
                 └─ ul.lnb-list
                      └─ li.lnb-item
                           └─ a.lnb-link > span
```

### `li`가 **아닌** 것 (바꾸면 안 됨)

| 요소 | 태그 | class |
|------|------|--------|
| 홈 | `div` + `a` | `lnb-home`, `lnb-home-link` |
| 1뎁스 래퍼 / 타이틀 | `div` | `lnb-depth1`, `lnb-title` |
| 1뎁스 토글 | **`button type="button"`** | `lnb-depth1-toggle` |
| 2뎁스 래퍼 | `div` | `lnb-depth2` |
| 2뎁스 토글 | **`button type="button"`** | `lnb-depth2-toggle` |

토글을 `a`나 `li`로 쓰지 않는다. `aria-expanded="false"` 유지.

---

## 3. MUST — 링크·텍스트

- 링크 안 텍스트는 **`span`으로 감싼다** (`header-gnblink`와 동일 습관).
- 내부 페이지: `href="./page-name.html"` + **`data-link-type="page"`**.
- 1뎁스 링크 class: `lnb-depth1-link` (+ 타이포 `p2` 등 kit 클래스 가능).
- 2뎁스 링크 class: **`lnb-link`** (+ `p2` 가능).
- chevron 아이콘: `i` + kit 아이콘 클래스 (예: `ff-ico ti-chevron-rect-down-sm p3`), `aria-hidden="true"`.

### AI가 **넣지 말 것** (에디터/시스템이 채움)

- `data-lnb-menu-key`, `data-lnb-page-key`, `data-lnb-menu-bound`, `data-lnb-auto-resolved`, `data-lnb-manual` 등 **임의 숫자 키**
- 헤더에 없는 메뉴명을 LNB에만 새로 발명

골격 HTML만 넣고, 메뉴 연결은 **헤더 `header-gnblist` + 에디터 LNB 패널**에 맡긴다.

---

## 4. 필수 골격 HTML (복붙 기준 — 더미 메뉴)

서브 비주얼 등 **content 블록**의 `contents-inner` 안에 아래를 포함한다.

```html
<div class="lnb-container">
  <div class="lnb-inner">
    <nav class="lnb lnb-type-dropdown">
      <div class="lnb-home">
        <a class="lnb-home-link" href="/" data-link-type="page">
          <span>H</span>
        </a>
      </div>
      <div class="lnb-depth1">
        <div class="lnb-title">
          <button type="button" class="lnb-depth1-toggle" aria-expanded="false">
            <span>1뎁스 메뉴</span>
            <i class="ff-ico ti-chevron-rect-down-sm p3" aria-hidden="true"></i>
          </button>
        </div>
        <ul class="lnb-depth1-list">
          <li class="lnb-depth1-item">
            <a class="lnb-depth1-link p2" href="./page.html" data-link-type="page">
              <span>1뎁스 메뉴</span>
            </a>
            <ul class="lnb-depth1-sublist" hidden>
              <li class="lnb-item">
                <a class="lnb-link p2" href="./sub.html" data-link-type="page">
                  <span>2뎁스 메뉴</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="lnb-depth2">
        <button type="button" class="lnb-depth2-toggle" aria-expanded="false">
          <span>2뎁스 메뉴</span>
          <i class="ff-ico ti-chevron-rect-down-sm p3" aria-hidden="true"></i>
        </button>
        <ul class="lnb-list">
          <li class="lnb-item active is-active">
            <a class="lnb-link p2" href="./sub.html" data-link-type="page">
              <span>2뎁스 메뉴</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</div>
```

하위가 없는 1뎁스면 `ul.lnb-depth1-sublist`는 생략 가능.  
2뎁스가 전혀 없으면 depth2 블록도 생략 가능하나, **서브페이지 LNB 기본형은 depth1+depth2 골격**을 권장.

---

## 5. JS (드롭다운) — 셀렉터 MUST

블록 JS는 IIFE + 블록 스코프. 아래 셀렉터가 DOM에 있어야 한다.

- `.lnb`, `.lnb-depth1`, `.lnb-depth2`
- `.lnb-depth1-toggle`, `.lnb-depth2-toggle`
- `.lnb-depth1-list`, `.lnb-list` (`active` 토글)
- `.lnb-depth1-link`, `.lnb-list .lnb-link`

토글 클릭 시 해당 list에 `active`, `aria-expanded` 갱신. 바깥 클릭 시 닫기.

---

## 6. 금지

- `header-gnblist` 없는 헤더인데 LNB만 생성
- 메뉴 항목을 `div`/`span`만으로 나열 (`li.lnb-depth1-item` / `li.lnb-item` 누락)
- `lnb-depth1-toggle` / `lnb-depth2-toggle` 를 `a` 또는 `li`로 작성
- `ul.lnb-depth1-list` / `ul.lnb-list` 없이 링크만 나열
- LNB를 `area="header"` 또는 `area="footer"`에 생성
- `data-lnb-*-key` 임의 숫자 생성
- topic `lnb` 미로드 상태로 LNB 마크업 작성

---

## 7. Preflight 체크리스트

- [ ] `read_temha_rules({ topic: "lnb" })` 를 읽었는가
- [ ] 헤더에 **`ul.header-gnblist`** 가 있는가 (없으면 header-footer 먼저)
- [ ] `area="content"` 인가
- [ ] `lnb-container` > `lnb-inner` > `nav.lnb.lnb-type-dropdown` 인가
- [ ] `lnb-home` / `lnb-depth1` / `lnb-depth2` 골격이 있는가
- [ ] 1뎁스 항목이 **`li.lnb-depth1-item`** 인가
- [ ] 2뎁스 항목이 **`li.lnb-item`** 인가 (`lnb-depth1-sublist` + `lnb-list`)
- [ ] 토글이 **`button.lnb-depth1-toggle` / `button.lnb-depth2-toggle`** 인가
- [ ] 내부 링크에 `data-link-type="page"` 가 있는가
- [ ] 임의 `data-lnb-*-key`를 넣지 않았는가

---

## 8. 헤더 ↔ LNB 대응 (참고)

| 헤더 | LNB |
|------|-----|
| `ul.header-gnblist` > `li.header-gnbitem` | `ul.lnb-depth1-list` > `li.lnb-depth1-item` |
| `ul.header-sublist` > `li.header-subitem` | `ul.lnb-depth1-sublist` / `ul.lnb-list` > `li.lnb-item` |
| `header-gnblink` / `header-sublink` | `lnb-depth1-link` / `lnb-link` |
