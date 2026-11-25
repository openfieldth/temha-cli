# 그누보드 글쓰기/수정 블록 규칙 (Short)

글쓰기/수정 블록을 만들 때는 이 문서를 우선 적용한다.

> **페이지 구성 MUST**: 게시판 페이지(목록·상세·쓰기)도 맨 위에 **서브 비주얼 + LNB** 블록을 두고 그 아래에 이 게시판 블록을 둔다(`docs/temha-topic-lnb.md` 참고 — 서브 비주얼 + LNB, 사이트 전체에서 같은 블록). 서브 비주얼 없이 게시판만 있는 페이지를 만들지 않는다.

## MUST

- 루트: `{block}` > `.gnuboard[v-cloak]` > `.contents-container` > `.contents-inner`
- `.gnuboard` 필수 속성: `data-gb-table`, `data-gb-table-name`, `data-gb-list-link`, `data-gb-view-link`, `data-gb-write-link`, `data-gb-initial-status="write"`
- 글쓰기 영역: `v-gb-write=""`
- 수정 영역: `v-gb-edit=""`
- 글쓰기 데이터: `bw.*`
- 수정 데이터: `be.*`
- 기존 상세/첨부 데이터: `bs.normal_files`, `bs.images`
- 카테고리: `radioset-wrap` + `radioset`, `bw.ca_name` / `be.ca_name` 분리
- 글쓰기 에디터 id: `editor`
- 수정 에디터 id: `edit-editor`
- 제출: `@click="submitWrite"` / `@click="submitEdit"`
- 파일: `fileset` + `handleWriteFileChange` / `handleEditFileChange`
- **글 추가 필드 (wr_1~wr_10)**: 제목 입력과 **같은 구조**로, 쓰는 필드마다 `inputset`을 하나씩 둔다. 값은 `v-model="bw.wr_N"`(수정은 `be.wr_N`, `id` 접두 `w-`→`e-`). 라벨은 관리자 「게시판 설정 → 글 추가 필드」의 이름과 맞추고, 어떤 필드인지 주석을 단다. 필수 확인은 플러그인이 관리자 설정대로 한다.
  - 종류별 입력: 한 줄=`input type="text"`, 여러 줄=`textarea`, 날짜·숫자=`type="date|number"`
  - 셀렉트·라디오·체크박스의 보기는 하드코딩하지 말고 `gbExtraOptions('wr_N')`(관리자 보기 목록)으로 반복한다. 체크박스는 `gbExtraChecked`/`gbExtraToggle`.

```html
<!-- wr_2: 진료과 (셀렉트) -->
<div class="inputset inputset-lg">
  <label for="w-wr_2" class="form-tit p1">진료과</label>
  <select id="w-wr_2" class="inputset-input form-control" v-model="bw.wr_2">
    <option value="">선택하세요</option>
    <option v-for="o in gbExtraOptions('wr_2')" :key="o" :value="o">{{ o }}</option>
  </select>
</div>
<!-- wr_3: 학력/경력 (여러 줄) -->
<div class="inputset inputset-lg">
  <label for="w-wr_3" class="form-tit p1">학력/경력</label>
  <textarea id="w-wr_3" class="inputset-textarea form-control" v-model="bw.wr_3" placeholder="한 줄에 하나씩 입력하세요"></textarea>
</div>
<!-- wr_4: 진료 요일 (체크박스) -->
<div class="inputset inputset-lg">
  <p class="form-tit p1">진료 요일</p>
  <label v-for="o in gbExtraOptions('wr_4')" :key="o"><input type="checkbox" :checked="gbExtraChecked(bw, 'wr_4', o)" @change="gbExtraToggle(bw, 'wr_4', o)"> {{ o }}</label>
</div>
```

- JS: 내부 `.gnuboard` DOM에 `vue_gnuboard(el)` 호출
- 블록 검증이 `v-gb-list`를 요구하면 `v-if="false"` anchor만 추가
- 저장 후 블록 HTML/CSS/JS 파일을 다시 확인

## 금지

- `.gnuboard[v-cloak]`인데 JS 비워두기
- 일반 `<form action="">` submit만 두고 `submitWrite`/`submitEdit` 누락
- 글쓰기 UI 안에 실제 `v-gb-list` 목록을 숨겨 넣기
- 글쓰기/수정 라디오 `id`, `for`, `name` 중복
- `bs.files` 사용
