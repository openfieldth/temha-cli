# 그누보드 통합 검색·REST API (topic: gnuboard-search)

> 웹진·매거진·포털·기관 사이트의 **헤더 검색 → 검색 결과 페이지**, 인기 검색어, 많이 본 글 TOP N.
> 목록·상세·글쓰기 자체는 `docs/temha-topic-gnuboard-list.md` / `docs/temha-topic-gnuboard-view.md` / `docs/temha-topic-gnuboard-write.md` 참고.

## 1. 통합 검색 (헤더 검색 → 결과 페이지)

웹진·매거진·포털·기관 사이트처럼 **게시판이 여러 개인 사이트**에서 사용한다. 바인딩 라이브러리(`vue_gnuboard`)에는 통합 검색 기능이 없으므로 **블록 JS가 REST API를 직접 호출**한다. 반드시 **헤더 검색(§1-2) + 결과 페이지(§1-3)를 한 세트**로 만든다. 검색창만 만들고 결과 페이지가 없으면 실패로 본다.

### 1-1. 사전 조건 (MUST)

| 조건 | 확인 방법 | 안 되어 있을 때 |
|---|---|---|
| `<body data-gb-url>` 있음 | 호스팅 연결된 페이지면 자동 | 에디터·미연결 상태 → JS는 아무것도 하지 않고 HTML 예시 그대로 둔다 |
| 검색할 게시판의 **"전체 검색 사용"** 켜짐 | `GET {gb_url}api/v1/boards/{bo_table}` 응답의 `bo_use_search` = 1 | 사용자에게 안내: 그누보드 관리자 → 게시판관리 → 수정 → "전체 검색 사용" 체크. 꺼져 있으면 결과가 항상 0건 |
| 게시판 읽기 권한 | `bo_list_level`이 방문자 레벨 이하 | 회원 전용 게시판은 비회원 검색에 안 잡힘(정상) |

### 1-2. 헤더 검색 화면

헤더 블록 안에 검색 버튼 + 전체 화면 검색 레이어를 둔다. **입력창은 반드시 `<form>` 안**, 이름은 `stx`, 이동할 곳은 결과 페이지.

```html
<!-- 헤더 블록 안 (예: header-utils 옆) -->
<button type="button" class="search-open" aria-label="검색 열기"><i class="ff-ico ti-search2"></i></button>

<div class="header-search" hidden>
  <div class="header-search-wrap container-lg">
    <button type="button" class="search-close" aria-label="검색창 닫기"><i class="ff-ico ti-x-rect"></i></button>
    <h2 class="h2">궁금하신 키워드를 검색해보세요.</h2>
    <form class="search-form" action="./search.html" method="get" data-link-type="page" role="search">
      <div class="inputset inputset-lg">
        <label for="header-search-stx" class="blind">검색어</label>
        <input type="search" id="header-search-stx" name="stx" class="inputset-input form-control"
               minlength="2" required placeholder="궁금하신 내용을 키워드로 검색해 보세요.">
      </div>
      <button type="submit" class="search-btn" aria-label="검색"><i class="ff-ico ti-search2"></i></button>
    </form>
    <div class="reco-box">
      <h3 class="h6">인기 검색어</h3>
      <!-- 에디터·미연결 상태에서 보일 예시. 연결되면 JS가 실제 인기 검색어로 바꾼다 -->
      <ol class="reco-list">
        <li class="reco-item"><a href="./search.html?stx=%EA%B3%B5%EC%A7%80" data-link-type="page"><span class="reco-num">1</span><span>공지</span></a></li>
      </ol>
    </div>
  </div>
</div>
```

```javascript
(function () {
  $(function () {
    $(".블록클래스[id='실제bid']").each(function () {
      const $block = $(this);
      const rawUrl = String(document.body.getAttribute("data-gb-url") || "").trim();
      const gbUrl = rawUrl ? rawUrl.replace(/\/?$/, "/") : "";
      const $layer = $block.find(".header-search");
      const $form = $block.find(".search-form");
      const $reco = $block.find(".reco-list");

      // 열기/닫기
      function open() { $layer.prop("hidden", false); $("body").css("overflow", "hidden"); $form.find("input[name='stx']").trigger("focus"); }
      function close() { $layer.prop("hidden", true); $("body").css("overflow", ""); }
      $block.find(".search-open").on("click", open);
      $block.find(".search-close").on("click", close);
      $(document).on("keydown", function (e) { if (e.key === "Escape" && !$layer.prop("hidden")) close(); });

      // 2글자 미만 차단 (API가 422를 돌려줌)
      $form.on("submit", function (e) {
        const stx = $.trim($form.find("input[name='stx']").val() || "");
        if (stx.length < 2) { e.preventDefault(); alert("검색어는 두 글자 이상 입력하세요."); }
      });

      // 인기 검색어 — 연결 안 됐거나 결과가 없으면 HTML 예시 유지
      if (!gbUrl || !$reco.length) return;
      fetch(gbUrl + "api/v1/populars?days=7&limit=5")
        .then(function (r) { return r.ok ? r.json() : []; })
        .then(function (list) {
          if (!Array.isArray(list) || !list.length) return;
          const action = $form.attr("action") || "./search.html";
          $reco.empty();
          list.forEach(function (row, i) {
            const $a = $("<a>", { href: action + "?stx=" + encodeURIComponent(row.pp_word), "data-link-type": "page" });
            $a.append($("<span>", { "class": "reco-num", text: i + 1 }), $("<span>", { text: row.pp_word }));
            $("<li>", { "class": "reco-item" }).append($a).appendTo($reco);
          });
        })
        .catch(function () {});
    });
  });
})();
```

규칙:
- 헤더가 여러 페이지에 공통이면 `action`은 결과 페이지 파일명(`./search.html`) 하나로 통일.
- 인기 검색어 1~3위만 `--primary` 색 등 강조는 CSS로. 순위 숫자는 JS가 넣는다.
- 인기 검색어는 **실제 방문자 검색 기록**이다. 운영 초기에는 비어 있을 수 있으므로 HTML 예시(고정 키워드)를 지우지 않는다.

### 1-3. 검색 결과 페이지 (`search.html`)

새 페이지를 만들고 헤더·푸터는 공통 블록을 쓴다. 콘텐츠 블록 하나에 아래 구조를 넣는다.

```html
<div class="블록클래스" id="bid">
  <div class="contents-container container-md">
    <div class="contents-inner search-result"
         data-view-pattern="{table}-view.html"
         data-board-names='{"notice":"공지사항","free":"자유게시판"}'>
      <form class="search-form" action="./search.html" method="get" data-link-type="page" role="search">
        <label for="search-stx" class="blind">검색어</label>
        <input type="search" id="search-stx" name="stx" class="inputset-input form-control" minlength="2" required>
        <button type="submit" class="btnset btnset-primary">검색</button>
      </form>
      <p class="search-summary h5">‘<span class="search-keyword">검색어</span>’ 검색 결과 <strong class="search-total">0</strong>건</p>
      <ul class="search-tabs"></ul>
      <ul class="search-list">
        <!-- 에디터용 예시 1개. 연결되면 JS가 지우고 실제 결과로 채운다 -->
        <li class="search-item">
          <a class="search-link" href="./notice-view.html?wr_id=1&amp;bo_table=notice" data-link-type="page">
            <span class="search-board p2">공지사항</span>
            <strong class="search-tit h5">검색 결과 제목 예시</strong>
            <p class="search-desc p1">본문 요약이 두 줄까지 보입니다.</p>
            <span class="search-meta p2">작성자 · 2026-01-01</span>
          </a>
        </li>
      </ul>
      <p class="search-empty" hidden>검색 결과가 없습니다. 다른 검색어로 찾아보세요.</p>
      <nav class="search-paging" aria-label="검색 결과 페이지"></nav>
    </div>
  </div>
</div>
```

- `data-view-pattern`: 게시판별 상세 페이지 파일명 규칙. `{table}`이 `bo_table`로 바뀐다. 상세 페이지 이름이 규칙과 다르면 `data-view-links='{"notice":"news-view.html"}'`로 개별 지정(이 값이 우선).
- `data-board-names`: 탭·라벨에 보일 게시판 이름. 없으면 `bo_table`을 그대로 보여 준다.

```javascript
(function () {
  $(function () {
    $(".블록클래스[id='실제bid']").each(function () {
      const $block = $(this);
      const $root = $block.find(".search-result");
      const rawUrl = String(document.body.getAttribute("data-gb-url") || "").trim();
      const gbUrl = rawUrl ? rawUrl.replace(/\/?$/, "/") : "";
      if (!gbUrl || !$root.length) return; // 에디터·미연결: 예시 HTML 유지

      const PER_PAGE = 10;
      const q = new URLSearchParams(window.location.search);
      const stx = $.trim(q.get("stx") || "");
      const onetable = $.trim(q.get("onetable") || "");
      const page = Math.max(1, parseInt(q.get("page") || "1", 10) || 1);
      const names = $root.data("board-names") || {};
      const viewLinks = $root.data("view-links") || {};
      const viewPattern = $root.attr("data-view-pattern") || "{table}-view.html";
      const $list = $root.find(".search-list");
      const $tabs = $root.find(".search-tabs");
      const $paging = $root.find(".search-paging");
      const $empty = $root.find(".search-empty");

      $root.find("input[name='stx']").val(stx);
      $root.find(".search-keyword").text(stx);

      function boardName(t) { return names[t] || t; }
      function selfUrl(params) {
        const p = new URLSearchParams({ stx: stx });
        Object.keys(params).forEach(function (k) { if (params[k]) p.set(k, params[k]); });
        return "?" + p.toString();
      }
      function viewUrl(row) {
        const id = row.type === "comment" ? row.wr_parent : row.wr_id; // 댓글은 원글로
        const file = viewLinks[row.bo_table] || viewPattern.replace("{table}", row.bo_table);
        return "./" + file.replace(/^\.\//, "") + "?wr_id=" + encodeURIComponent(id) + "&bo_table=" + encodeURIComponent(row.bo_table);
      }
      function showEmpty(msg) { $list.empty(); $empty.text(msg).prop("hidden", false); $root.find(".search-total").text(0); }

      if (stx.length < 2) { showEmpty("검색어를 두 글자 이상 입력해 주세요."); return; }

      const api = new URLSearchParams({ stx: stx, page: page, per_page: PER_PAGE });
      if (onetable) api.set("onetable", onetable);

      fetch(gbUrl + "api/v1/search?" + api.toString())
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (!res.ok) { showEmpty((res.j && res.j.error && res.j.error.description) || "검색 중 문제가 발생했습니다."); return; }
          const d = res.j || {};
          const rows = d.search_results || [];
          const total = d.total_count || 0;
          $root.find(".search-total").text(total);

          // 탭: 전체 + 게시판별 개수
          $tabs.empty();
          const allCount = (d.board_list || []).reduce(function (a, b) { return a + (b.count || 0); }, 0);
          $("<li>").append($("<a>", { href: selfUrl({}), text: onetable ? "전체" : "전체 " + allCount, "class": onetable ? "" : "active" })).appendTo($tabs);
          (d.board_list || []).forEach(function (b) {
            $("<li>").append($("<a>", { href: selfUrl({ onetable: b.table }), text: boardName(b.table) + " " + b.count, "class": onetable === b.table ? "active" : "" })).appendTo($tabs);
          });

          // 목록 — 응답 문자열은 반드시 .text()로 (HTML 출력 금지)
          $list.empty();
          if (!rows.length) { $empty.prop("hidden", false); }
          else { $empty.prop("hidden", true); }
          rows.forEach(function (row) {
            const $a = $("<a>", { "class": "search-link", href: viewUrl(row), "data-link-type": "page" });
            $a.append($("<span>", { "class": "search-board p2", text: boardName(row.bo_table) + (row.type === "comment" ? " · 댓글" : "") }));
            $a.append($("<strong>", { "class": "search-tit h5", text: row.wr_subject }));
            if (row.wr_content) $a.append($("<p>", { "class": "search-desc p1", text: row.wr_content }));
            $a.append($("<span>", { "class": "search-meta p2", text: row.wr_name + " · " + String(row.wr_datetime || "").slice(0, 10) }));
            $("<li>", { "class": "search-item" }).append($a).appendTo($list);
          });

          // 페이지 번호 (최대 10개)
          $paging.empty();
          const last = d.total_page || 1;
          if (last > 1) {
            const start = Math.floor((page - 1) / 10) * 10 + 1;
            for (let n = start; n <= Math.min(last, start + 9); n++) {
              $("<a>", { href: selfUrl({ onetable: onetable, page: n }), text: n, "class": n === page ? "active" : "", "aria-current": n === page ? "page" : null }).appendTo($paging);
            }
          }
        })
        .catch(function () { showEmpty("검색 서버에 연결할 수 없습니다."); });
    });
  });
})();
```

결과 페이지 체크:
- [ ] 헤더 검색 `action`과 결과 페이지 파일명이 같은가
- [ ] 응답의 제목·내용·작성자를 `.text()`로만 넣었는가 (`.html()`·`innerHTML` 금지)
- [ ] 댓글 결과를 `wr_parent`로 링크했는가
- [ ] 게시판마다 상세 페이지가 실제로 있는가 (`data-view-pattern` 규칙 또는 `data-view-links`)
- [ ] 0건·2글자 미만·서버 오류 때 안내 문구가 보이는가
- [ ] `bo_use_search` 꺼진 게시판이 있으면 사용자에게 알렸는가

---

## 2. 블록에서 쓰는 그누보드 REST API 요약

주소는 모두 `{data-gb-url}api/v1/…` (예: `https://도메인/gnuboard/api/v1/search`). 아래는 **비회원도 호출 가능한 읽기 API**만 정리했다. 관리자·회원·토큰 API는 블록에서 직접 쓰지 않는다. 전체 문서: `{data-gb-url}api/docs/swagger-ui/`.

| 용도 | 요청 | 주요 파라미터 | 응답 핵심 |
|---|---|---|---|
| 통합 검색 | `GET /search` | `stx`(2글자↑) · `sfl`(기본 `wr_subject\|\|wr_content`) · `sop`(`and`/`or`) · `onetable` · `gr_id` · `page` · `per_page`(최대 100) | `board_list[{table,count}]` · `search_results[{type,bo_table,wr_id,wr_parent,wr_subject,wr_content,wr_name,wr_datetime}]` · `total_count` · `total_page` |
| 인기 검색어 | `GET /populars` | `days`(기본 3) · `limit`(기본 10, 최대 100) | `[{pp_word,count}]` 검색 많은 순. 없으면 `[]` |
| 게시판 글 목록 | `GET /boards/{bo_table}/writes` | `page` · `per_page` · `stx` · `sfl` · `sop` · `sca`(분류) · `sst`·`sod`(정렬) | `writes[]` · `total_records` · `total_pages` · `categories` |
| **많이 본 글 TOP N** | `GET /boards/{bo_table}/writes?sst=wr_hit&per_page=5` | `sst`: `wr_datetime`·`wr_hit`·`wr_good`·`wr_comment`·`wr_last` / `sod`: `asc`·`desc`(생략 시 desc) | 조회수 높은 순 |
| 글 상세 | `GET /boards/{bo_table}/writes/{wr_id}` | | 제목·본문(HTML)·첨부 |
| 게시판 설정 | `GET /boards/{bo_table}` | | `bo_subject` · `bo_use_search` · 권한 레벨 |

규칙:
- 목록·상세 화면은 가능하면 **바인딩(`v-gb-list` 등)을 쓰고**, REST 직접 호출은 바인딩에 없는 기능(통합 검색, 인기 검색어, 서버 정렬 TOP N)에만 쓴다.
- 직접 호출한 응답은 `.text()`로 출력한다. 상세 본문(`wr_content`)처럼 HTML이 필요한 곳은 바인딩의 `v-html`을 쓴다.
- `data-gb-url`이 없으면(에디터·미연결) 호출하지 말고 HTML 예시를 그대로 둔다.
