# 그누보드 목록 블록 규칙 (Short)

목록 블록을 만들 때는 이 문서를 우선 적용한다. 긴 통합 문서보다 아래 MUST를 먼저 지킨다.

> **페이지 구성 MUST**: 게시판 페이지(목록·상세·쓰기)도 맨 위에 **서브 비주얼 + LNB** 블록을 두고 그 아래에 이 게시판 블록을 둔다(`docs/temha-topic-lnb.md` 참고 — 서브 비주얼 + LNB, 사이트 전체에서 같은 블록). 서브 비주얼 없이 게시판만 있는 페이지를 만들지 않는다.

## MUST — 유형 먼저 결정 (시안에 명시)

Temha 게시판은 **두 유형**이다. 시안·구현 **전에** 고르고, 시안에 「게시판형」또는 「갤러리형」을 **명시**한다.

| 유형 | 언제 | 구현 |
|------|------|------|
| **게시판형** | 텍스트 중심(공지/뉴스/QnA) | 목록 → **별도 상세 페이지**. 같은 단계에서 상세 페이지까지 만든다(헤더·푸터는 공통 자동 적용) |
| **갤러리형** | 이미지 중심(포토 갤러리) | 상세는 **목록 블록 안 view-modal** (`.content-view` + `v-gb-view-modal`). 별도 상세 페이지 없음 |

## MUST

- 루트: `{block}` > `.gnuboard` > `.contents-container` > `.contents-inner`
- `.gnuboard`는 `contents-container` 바깥에 둔다.
- **목록 `.gnuboard`에도 `v-cloak=""` MUST** — 없으면 새로고침·첫 진입 때 데이터를 불러오기 전 `{{ br.total_records }}`, `{{ item.wr_subject }}` 같은 코드가 잠깐 보인다. (`temhagnu.css`의 `[v-cloak]{display:none}`가 Vue 마운트 전까지 숨김. **자동 보정을 기대하지 말고 블록에 직접 넣는다.**) 목록 일부만 감쌀 때도 `{{ }}`가 들어간 영역 바깥 요소에 `v-cloak`을 둔다.
- `.gnuboard` 필수 속성: `data-gb-table`, `data-gb-table-name`, `data-gb-list-link`, `data-gb-view-link`, `data-gb-write-link`, `data-gb-initial-status="list"`
- 목록 컨테이너 필수: `v-gb-list=""`, `v-gb-list-row`, `v-gb-list-onload="true"`, `v-gb-list-page`
- 반복문: `v-for="(item, idx) in br.writes"`
- **상세 연결 (유형에 맞게 하나 — 소유자 규칙)**
  - **게시판형(A)**: `data-gb-view-link="notice-view.html"` + 해당 페이지에 `.gnuboard data-gb-initial-status="read"` 블록. 상세 페이지에도 공통 헤더·푸터가 자동으로 나온다. 목록 링크는 `:href="getViewLink(item.wr_id)"` + `:data-gb-wr-id="item.wr_id"`
  - **갤러리형(B)**: `data-gb-view-link=""` + 같은 `.gnuboard` 안에 `v-gb-view-modal` + `.content-view`. 썸네일 `getListItemImage(item)`. 글 클릭 `@click.prevent="openViewModal(item.wr_id)"`. 닫기 `closeViewModal` / Esc / aria
- 제목/내용: `data-gb-tpl="wr_subject"`, `data-gb-tpl="wr_content"`
- **글 추가 필드 (wr_1~wr_10)**: 제목·작성일과 **같은 형식**으로 카드·행 안 원하는 자리에 놓는다: `<span data-gb-tpl="wr_N">{{ item.wr_N }}</span>`. 값이 빌 수 있으면 `v-if="item.wr_N"`. 체크박스 여러 개는 런타임이 "내과, 외과"로 바꿔 준다. 어떤 필드인지 주석을 단다. 갤러리 팝업 상세는 `docs/temha-topic-gnuboard-view.md` 규칙(`bs.wr_N`)을 따른다.

```html
<!-- wr_2: 진료과 -->
<span v-if="item.wr_2" class="cardset-cate p2" data-gb-tpl="wr_2">{{ item.wr_2 }}</span>
```

- 같은 모양으로 나열만 하면 되는 경우에만 자동 묶음 `gbExtraList(item)`를 쓴다. 개별 배치와 중복 금지.

```html
<ul v-if="gbExtraList(item).length" class="list-extra">
  <li v-for="x in gbExtraList(item)" :key="x.key"><span>{{ x.label }}</span> {{ x.value }}</li>
</ul>
```
- 페이지네이션: `pagination.pages` + `v-gb-list-btn-page` + `v-gb-list-page-active-class="'active'"`
- 빈 목록: 임의 안내문을 고정 노출하지 말고 `data-gb-list-empty` 사용
- JS: 내부 `.gnuboard` DOM에 `vue_gnuboard(el)` 호출 (+ 갤러리형 Esc 닫기)
- 저장 후 블록 HTML/CSS/JS 파일을 다시 확인

### 골격 A — 게시판형 (상세 페이지)

```html
<!-- 목록 블록 -->
<div class="notice-list-N1">
  <div class="gnuboard" v-cloak="" data-gb-table="" data-gb-table-name=""
       data-gb-list-link="notice-list.html" data-gb-view-link="notice-view.html"
       data-gb-write-link="notice-write.html" data-gb-initial-status="list">
    <div class="contents-container container-lg" v-gb-list="" v-gb-list-row="10"
         v-gb-list-page="5" v-gb-list-onload="true">
      <div class="contents-inner">
        <a v-for="(item, idx) in br.writes" :key="item.wr_id"
           :href="getViewLink(item.wr_id)" :data-gb-wr-id="item.wr_id">
          <strong data-gb-tpl="wr_subject">{{ item.wr_subject }}</strong>
        </a>
      </div>
    </div>
  </div>
</div>

<!-- notice-view.html 페이지: (공통 헤더/푸터 자동) + 아래 상세 블록 -->
<div class="notice-view-N1">
  <div class="gnuboard" v-cloak="" data-gb-table="" data-gb-table-name=""
       data-gb-list-link="notice-list.html" data-gb-view-link="notice-view.html"
       data-gb-write-link="notice-write.html" data-gb-initial-status="read">
    <div class="contents-container container-lg">
      <div class="contents-inner">
        <h2 data-gb-tpl="wr_subject">{{ bs.wr_subject }}</h2>
        <div v-if="bs.wr_id" v-html="bs.wr_content"></div>
        <div v-else class="read-content-empty p2">
          <img src="https://temha.io/_tobe/images/board_content.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</div>
```

### 골격 B — 갤러리형 (목록 내 view-modal, 완전본)

에디터 런타임 기준: `temhagnu.js`의 `v-gb-view-modal` / `openViewModal`·`closeViewModal`·`.content-view-prev|next`, `preview-board-nav.js`의 갤러리 판별. 썸네일·`bs.images`는 목록/상세 가이드.

```html
<div class="gallery-list-N1">
  <div class="gnuboard" v-cloak=""
    data-gb-table="" data-gb-table-name=""
    data-gb-list-link="gallery.html" data-gb-view-link=""
    data-gb-write-link="" data-gb-initial-status="list" data-gb-text-limit="80">
    <div class="contents-container container-lg"
         v-gb-list="" v-gb-list-row="8" v-gb-list-page="5" v-gb-list-onload="true">
      <div class="contents-inner">
        <div class="textset"><h2 class="textset-tit h2">갤러리</h2></div>
        <div class="cardset-wrap" data-gb-list-empty="">
          <a class="cardset" href="javascript:void(0);"
             v-for="(item, idx) in br.writes" :key="item.wr_id"
             :data-gb-wr-id="item.wr_id" @click.prevent="openViewModal(item.wr_id)">
            <div class="cardset-figure">
              <img v-if="getListItemImage(item)" :src="getListItemImage(item)"
                   :alt="item.wr_subject" class="cardset-img" data-gb-tpl="wr_thumbnail">
            </div>
            <div class="cardset-body">
              <strong class="cardset-tit h5" data-gb-tpl="wr_subject">{{ item.wr_subject }}</strong>
            </div>
          </a>
        </div>
        <div class="pagiset">
          <a href="javascript:void(0);" class="pagiset-ctrl" v-gb-list-first-show="" v-gb-list-btn-first="">처음</a>
          <a href="javascript:void(0);" class="pagiset-ctrl" v-gb-list-prev-show="" v-gb-list-btn-prev="">이전</a>
          <a href="javascript:void(0);" class="pagiset-link" v-for="page in pagination.pages" :key="page"
             v-gb-list-btn-page="page" v-gb-list-page-active-class="'active'">{{ page }}</a>
          <a href="javascript:void(0);" class="pagiset-ctrl" v-gb-list-next-show="" v-gb-list-btn-next="">다음</a>
          <a href="javascript:void(0);" class="pagiset-ctrl" v-gb-list-last-show="" v-gb-list-btn-last="">마지막</a>
        </div>
      </div>
    </div>
    <div class="content-view" v-gb-view-modal="" data-gb-view-modal-display="flex"
         role="dialog" aria-modal="true" aria-labelledby="gallery-list-N1-view-title" tabindex="-1">
      <div class="content-view-dim" data-gb-action="closeViewModal" aria-hidden="true"></div>
      <div class="content-view-panel">
        <button type="button" class="btnset btnset-icon content-view-close"
                data-gb-action="closeViewModal" aria-label="닫기">
          <span class="ff-ico ti-x" aria-hidden="true"></span>
        </button>
        <button type="button" class="btnset btnset-icon content-view-prev"
                data-gb-view-modal-prev="" aria-label="이전 글">
          <span class="ff-ico ti-arrow-left" aria-hidden="true"></span>
        </button>
        <button type="button" class="btnset btnset-icon content-view-next"
                data-gb-view-modal-next="" aria-label="다음 글">
          <span class="ff-ico ti-arrow-right" aria-hidden="true"></span>
        </button>
        <div class="content-view-body">
          <h2 id="gallery-list-N1-view-title" class="h3" data-gb-tpl="wr_subject">{{ bs.wr_subject }}</h2>
          <p class="content-view-meta" data-gb-tpl="wr_datetime">{{ bs.wr_datetime }}</p>
          <div class="content-view-article" v-html="bs.wr_content"></div>
          <ul class="content-view-images" v-if="bs.images && bs.images.length > 0">
            <li v-for="(file, index) in bs.images" :key="index">
              <a :href="file.original" target="_blank" rel="noopener">
                <img :src="file.thumbnail" :alt="file.filename || bs.wr_subject">
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
```

```javascript
(function () {
  $(function () {
    $(".gallery-list-N1[id='실제bid']").each(function () {
      var $block = $(this);
      var el = $block.find(".gnuboard")[0];
      if (el && typeof vue_gnuboard === "function") vue_gnuboard(el);
      var escNs = "keydown.galleryViewModal" + this.id;
      $(document).off(escNs).on(escNs, function (e) {
        if (e.key !== "Escape" && e.keyCode !== 27) return;
        var vm = el && el.__vue__;
        if (vm && vm.viewModalOpen && typeof vm.closeViewModal === "function") {
          vm.closeViewModal();
        }
      });
    });
  });
})();
```

CSS는 Temha Kit 변수·`rem`만 (HEX 금지).

## 금지

- 시안에 유형(게시판형/갤러리형)을 안 밝히고 목록만 만들기
- `data-gb-view-link=""` 인데 팝업 상세(`v-gb-view-modal` / `.content-view`)도 없음 → 글 클릭이 깨짐 (저장 검증 거부)
- 목록에서 `bs.*` 상세 변수 사용 (팝업 `.content-view` 안은 예외로 `bs.*` 허용)
- `{{ idx + 1 < 10 ? ... }}` 처럼 raw `<`/`>` 사용. 반드시 `&lt;`/`&gt;`
- `br.total_page > 1` 조건으로 pagination 전체 숨김
- `notice-empty`, `board-empty` 같은 고정 fallback UI
- `.gnuboard`를 `.contents-inner` 안에 넣기

## 게시판 연결 (템플릿 작성자)

게시판 연결은 Temha 에디터 **DataConnect**에서 설정한다. CLI 미리보기에서는 `project.json` 도메인 기준으로 gulp가 `<body data-gb-url>`을 주입한다.

1. 그누보드가 설치·연동된 뒤에만 `.gnuboard`에 `data-gb-table` / `data-gb-table-name`을 채운다. 템플릿 단계에서는 빈 값(`""`)으로 두고 에디터에서 연결해도 된다.
2. 정적 HTML만 있고 `.gnuboard`가 없으면 게시판 연동 완료로 보지 않는다.
3. **관리자 URL 구분**
   - 고객 기본: `https://{domain}/admin` (템하 관리자)
   - 전문가 요청 시에만: `https://{domain}/gnuboard/adm/` (그누보드 오리지널)
4. 「도메인 관리에서 설치」·고객에게 `/gnuboard/adm/`만 안내 같은 **잘못된 UI 가이드를 만들지 않는다.**
