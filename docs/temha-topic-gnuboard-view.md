# 그누보드 상세 블록 규칙 (Short)

상세 블록을 만들 때는 이 문서를 우선 적용한다.

> **페이지 구성 MUST**: 게시판 페이지(목록·상세·쓰기)도 맨 위에 **서브 비주얼 + LNB** 블록을 두고 그 아래에 이 게시판 블록을 둔다(`docs/temha-topic-lnb.md` 참고 — 서브 비주얼 + LNB, 사이트 전체에서 같은 블록). 서브 비주얼 없이 게시판만 있는 페이지를 만들지 않는다.

## MUST

- 루트: `{block}` > `.gnuboard[v-cloak]` > `.contents-container` > `.contents-inner`
- `.gnuboard` 필수 속성: `data-gb-table`, `data-gb-table-name`, `data-gb-list-link`, `data-gb-write-link`, `data-gb-initial-status="read"`
- 상세 **페이지**를 쓰는 경우 공통 헤더·푸터가 자동으로 나온다(따로 만들지 않음) (목록의 `data-gb-view-link`가 이 페이지를 가리켜야 함). 목록 팝업만 쓰면 이 상세 페이지는 생략 가능.
- URL에 `?wr_id=`가 있어야 실제 상세 데이터가 로드된다.
- 제목: `data-gb-tpl="wr_subject"` + `{{ bs.wr_subject || "제목 [에디터에서 내용 볼 수 없음]" }}`
- 메타: `data-gb-tpl="wr_name"`, `data-gb-tpl="wr_datetime"`, `data-gb-tpl="wr_hit"`
- 본문은 `v-html="bs.wr_content"`만 쓴다. **`data-gb-tpl="wr_content"`를 같이 붙이면 플러그인이 본문을 글자만 남기고 덮어써 본문 이미지가 사라진다.**
- 본문 **MUST (에디터 빈 화면 대응)**: 에디터에는 실데이터가 없어 `데이터가 없습니다` 텍스트만 나오면 안 됨. 아래 패턴 고정.

```html
<div v-if="bs.wr_id" v-html="bs.wr_content"></div>
<div v-else class="read-content-empty p2">
  <img src="https://temha.io/_tobe/images/board_content.png" alt="" />
</div>
```

```css
.{블록명} .read-content-empty { text-align: center; }
.{블록명} .read-content-empty img { max-width: 100%; height: auto; }
```

- **글 추가 필드 (wr_1~wr_10)**: 작성자·작성일과 **같은 형식**으로 필드마다 원하는 자리에 놓는다: `<span data-gb-tpl="wr_N">{{ bs.wr_N }}</span>`. 값이 빌 수 있으면 감싸는 요소에 `v-if="bs.wr_N"`(빈 제목 방지). 체크박스 여러 개는 런타임이 "내과, 외과"로 바꿔 준다. 여러 줄 값을 목록으로 보여 줄 때는 `gbExtraLines(bs,'wr_N')`. 어떤 필드인지 주석을 단다.

```html
<!-- wr_2: 진료과 -->
<span v-if="bs.wr_2" class="view-badge" data-gb-tpl="wr_2">{{ bs.wr_2 }}</span>
<!-- wr_3: 학력/경력 (여러 줄) -->
<div v-if="bs.wr_3" class="view-sec">
  <h4>학력/경력</h4>
  <ul><li v-for="t in gbExtraLines(bs,'wr_3')" :key="t">{{ t }}</li></ul>
</div>
```

- 필드들이 같은 모양으로 나열되는 정보표(사양·행사 정보 등)만 자동 묶음 `gbExtraList(bs)`를 쓴다. 같은 필드를 자동 묶음과 개별 배치에 **중복으로 넣지 않는다.**

```html
<dl v-if="gbExtraList(bs).length" class="read-extra">
  <template v-for="x in gbExtraList(bs)">
    <dt :key="'t-' + x.key">{{ x.label }}</dt>
    <dd :key="'d-' + x.key">{{ x.value }}</dd>
  </template>
</dl>
```

- 첨부파일: `bs.normal_files` 사용. `bs.files` 금지
- 이미지: `bs.images` 사용
- 이전/다음: `next_wr_subject`, `next_wr_datetime`, `prev_wr_subject`, `prev_wr_datetime`
- 댓글 **MUST (수정·삭제)**: 댓글 목록을 넣으면 각 댓글에 수정·삭제 버튼과 수정 입력창을 함께 넣는다. 비밀번호 확인(비회원 댓글)은 플러그인이 알아서 묻는다.

```html
<div v-for="comment in comments" :key="comment.wr_id" class="comment-item">
  <strong>{{ comment.wr_name }}</strong> <span>{{ comment.wr_datetime }}</span>
  <template v-if="editingCommentId === comment.wr_id">
    <textarea v-model="editingCommentContent"></textarea>
    <button type="button" @click="submitEditComment(comment)">저장</button>
    <button type="button" @click="cancelEditComment">취소</button>
  </template>
  <template v-else>
    <div v-html="comment.save_content"></div>
    <div v-if="canManageComment(comment)" class="comment-actions">
      <button type="button" @click="startEditComment(comment)">수정</button>
      <button type="button" @click="deleteComment(comment)">삭제</button>
    </div>
  </template>
</div>
```

- JS: 내부 `.gnuboard` DOM에 `vue_gnuboard(el)` 호출
- 블록 검증이 `v-gb-list`를 요구하면 실제 UI가 아닌 `v-if="false"` anchor만 추가
- 저장 후 블록 HTML/CSS/JS 파일을 다시 확인

## 금지

- `data-gb-tpl="subject"`, `"content"`, `"name"`, `"datetime"`, `"hit"` 같은 축약 필드명
- `.gnuboard[v-cloak]`인데 JS 비워두기
- 상세 본문을 `{{ bs.wr_content }}`로 출력
- 본문을 `v-html`만 두고 `v-else` + `board_content.png` 생략 (에디터에 「데이터가 없습니다」만 노출)
- 실제 목록 UI를 상세 화면에 숨겨 넣기
- 댓글 등록(`submitComment`)만 넣고 수정·삭제(`startEditComment`·`deleteComment`) 빼기 — 저장 시 오류
