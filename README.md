# Temha CLI

템하 CLI는 템플릿하우스(Templatehouse)의 노코드 웹 프로젝트를 로컬에서 관리하고, 코드 수정 후 실시간으로 다시 동기활 수 있도록 도와주는 
Node.js 기반의 CLI도구 입니다. VSCode에서 템하 프로젝트를 직접 수정하고, 미리보기와 서버 반영(push)까지 한 번에 처리할 수 있습니다.

https://github.com/user-attachments/assets/9da0b17a-b365-4c8c-b8c5-2153a736963a


## 📦 사전 준비 사항 
Temha CLI는 Node.js 기반으로 동작합니다.  
아래 환경이 준비되어 있어야 정상적으로 사용할 수 있습니다.

### Node.js (버전 18 이상 권장)
1. 터미널을 열고 Node.js가 설치되어 있는지 확인합니다:
```bash
$ node -v
```

2. 아래와 같이 v18.18.2 등 버전이 표시되면 정상 설치된 상태입니다:
```bash
v18.18.2
```
### Node.js 설치 방법

Node.js가 설치되어 있지 않은 경우 아래 링크에서 설치해 주세요:  
#### 📦 Windows
1. [Node.js 다운로드 페이지](https://nodejs.org/ko/download/)로 이동합니다
2. "LTS 버전"을 선택하고 `.msi` 파일을 다운로드합니다
3. 설치 마법사의 안내에 따라 설치를 진행합니다 (기본 옵션 권장)
4. 설치 완료 후 터미널에서 `$ node -v` 명령어로 정상 설치 여부를 확인합니다:
   
#### 🍎 macOS
1. [Node.js 다운로드 페이지](https://nodejs.org/ko/download/)에서 LTS 버전의 .pkg 파일을 다운로드합니다
2. 설치 마법사에 따라 설치를 완료합니다
3. 설치 완료 후 터미널에서 `$ node -v` 명령어로 정상 설치 여부를 확인합니다:



## 🚀 시작하기
1.  GIT클론을 통해 Temha CLI를 불러오세요.
```bash
https://github.com/openfieldth/temha-cli.git
```

2. 프로젝트 폴더에서 Temha CLI를 설치해 주세요.
```bash
$ npm install
```
> 💡 설치가 끝나면 터미널에 **안내 요약**이 한 번 출력됩니다.

3. 브라우저 라이브로 미리보기를 위해 Gulp CLI를 전역으로 설치해주세요.
```bash
$ npm install -g gulp-cli
```

4. 불러올 프로젝트를 위해 Templatehouse의 계정으로 로그인 합니다.
```bash
# SNS로그인 유저일 경우, 비밀번호 찾기를 통해 새 비밀번호를 발급 받아주셔야 합니다.
$ npm run login
```

5. 프로젝트를 서버에서 불러옵니다 (`pull`).

- **1번** — 전체 프로젝트 불러오기  
- **2번 이후** — 목록에 나온 **개별 프로젝트**만 불러오기 (프로젝트 이름과 ID가 함께 표시됩니다)

```bash
# 전체 프로젝트 및 특정 프로젝트 불러오기
$ npm run pull
```

```bash
# 특정 프로젝트만 불러오기 (예: 프로젝트 ID가 p1a2b3c4d5일 경우)
$ npm run pull -- p1a2b3c4d5
```

6. 로컬에서 수정한 뒤, 서버에 반영합니다 (`push`).

- **1번** — 전체 프로젝트 올리기  
- **2번 이후** — 목록의 **개별 프로젝트**만 올리기

```bash
# 전체 프로젝트 및 특정 프로젝트 올리기
$ npm run push
```

```bash
# 특정 프로젝트만 올로기 (예: 프로젝트 ID가 p1a2b3c4d5일 경우)
$ npm run push -- p1a2b3c4d5
```

## 🌐 미리보기 파일 생성과 실행 (Live Server)
### 각 프로젝트의 HTML 미리보기 자동 생성
`static/` 폴더에 미리보기용 파일이 만들어집니다.

```bash
$ gulp
```

### 미리보기 서버를 브라우저에서 실행

```bash
# 명령 입력 시 브라우저가 자동으로 열립니다.
$ gulp temha
```

전역 설치 없이 같은 작업을 하려면(선택):

```bash
$ npx gulp
$ npx gulp temha
```

 또는 `npm run preview` / `npm run temha`(또는 `npm run serve`) 도 같은 Gulp 태스크를 실행합니다.

## 🗑️ 휴지통 기능 관련 명령어

템하는삭제된 리소스 또는 프로젝트를 **임시로 보관**하고,   
필요 시 **복원 또는 완전 삭제**할 수 있는 휴지통 기능을 제공합니다.
> 💡 **로컬에서 페이지 폴더 또는 프로젝트 폴더를 직접 삭제하거나 `Delete` 키로 제거후 Push하더라도**,  
> 템하 에디터 내 '휴지통' 메뉴에서 해당 항목을 확인하고 복원할 수 있습니다.

### 리소스 휴지통 관련 명령어
| 명령어 | 설명 |
|--------|------|
| `npm run trash:list` | 삭제된 리소스 목록 확인 |
| `npm run trash:restore` | 리소스 휴지통에서 복원 |
| `npm run trash:empty` | 리소스 휴지통 완전 비우기 |

### 프로젝트 휴지통 관련 명령어
| 명령어 | 설명 |
|--------|------|
| `npm run project-trash:list` | 삭제된 프로젝트 목록 확인 |
| `npm run project-trash:restore` | 프로젝트 휴지통에서 복원 |
| `npm run project-trash:empty` | 프로젝트 휴지통 완전 비우기 |

> ⚠️ 파일 또는 프로젝트를 실수로 삭제했을 경우, `:restore`  명령어로 안전하게 복원할 수 있습니다.  
> ⚠️ 단 `:empty` 명령어 실행 시 해당 항목은 **영구 삭제**되며 복구할 수 없습니다.  
 

## ⛔ 리소스 파일 주의사항 (CSS/JS 제외 항목)
로컬 프로젝트의 `resources/` 폴더 내에는 공통으로 사용되는 CSS/JS/이미지 리소스가 포함됩니다.   
다음과 같은 **특정 이름을 가진 파일은 서버에 push되지 않으니 주의**해 주세요.

### push 제외 대상 파일
#### [CSS 리스트]
- `setting.css`
- `plugin.css`
- `style.css`

#### [JS 리스트]
- `setting.js`
- `plugin.js`
- `style.js`
  
> ⚠️ 위 파일들은 Temha **시스템 리소스로 간주되어,** 프로젝트로 push되지 않습니다.  
> ⚠️ 커스터마이징이 필요한 경우, 다른 파일명으로 작성하거나 별도 리소스로 분리해 주세요.  
> ⚠️ 서버에 시스템 파일이 존재하지 않는 경우, **resources-common** 폴더 내 시스템 파일이 자동으로 push됩니다.  
> ⚠️ 해당 폴더 내 시스템 파일은 수정하거나 삭제하지 마세요.

### 기본 플러그인 (`resources-common`)

소스는 저장소 루트 [`resources-common/`](resources-common/) 이며, 미리보기·빌드 시 프로젝트 `resources/`로 복사됩니다.

- **`plugin.js`** — jQuery, Swiper, GSAP(+ ScrollTrigger, TextPlugin, ScrollToPlugin) · **`plugin.css`** — Swiper 스타일
- **`setting.js`** — AOS (`AOS.init()` 포함) · **`setting.css`** — AOS 스타일

**페이지 JS 로드 순서** (`gulp preview`): `plugin.js` → `setting.js` → `temhagnu.js` → `templatehouse.js` → `{페이지명}.style.js`

> 💡 **포함되지 않음**: Lenis, Locomotive Scroll, Mo.js 등. 스크롤·등장 연출은 **`data-aos`(AOS)** 를 우선하고, 별도 CDN 추가는 하지 마세요.

상세 표·예제·AI 구현 규칙은 **[docs/temhakit-design-guide.md — 플러그인 & 애니메이션]
(docs/temhakit-design-guide.md#플러그인--애니메이션-resources-common)** (단일 참조 문서)를 보세요.

## 📐 템하 규약 · AI 작업 가이드

블록 HTML/CSS/JS를 템하 규칙에 맞게 작성·수정할 때는 저장소 **`docs/`** 폴더를 참고하세요.  
(Temha MCP `read_temha_rules()`와 동일한 규약을 로컬에 두었습니다. **MCP 연결 없이** Cursor 등에서도 사용할 수 있습니다.)

**Cursor에서 AI에게 넘기기**

- 채팅에 **`@docs`** 또는 **`@docs/temha-core.md`** 를 첨부한 뒤 작업을 요청하세요.
- 작업 종류에 맞는 topic 문서를 1~2개 더 첨부하면 됩니다. (한 번에 3개 topic 초과는 피하세요.)

| 시작점 | 용도 |
|--------|------|
| [docs/temha-core.md](docs/temha-core.md) | 규약 로드 순서·topic 선택 (먼저 읽기) |
| [docs/temha-ai-spec.md](docs/temha-ai-spec.md) | MCP 도구·HTML/CSS/JS 규칙 표 |
| [docs/temhakit-design-guide.md](docs/temhakit-design-guide.md) | kit 디자인 시스템 (`btnset`, `inputset` 등) |
| [docs/temha-topic-*.md](docs/) | 헤더/푸터, 스와이퍼, 폼, 배경, 컴포넌트, workflow 등 |

> 💡 그누보드 연동 블록만 다룰 때는 아래 [그누보드 연동 가이드](#-그누보드-연동-가이드)의 `gnuboard-ai-guide.md`를 추가로 참고하세요.

## 📋 그누보드 연동 가이드

그누보드 게시판·회원 블록(`gb5-board`, `g5_latest` 등)을 수정할 때는 아래 문서를 참고하세요.  
AI(Cursor 등)가 블록 HTML/JS를 올바르게 다루도록 정리한 **단일 참조 문서**입니다.

- **[docs/gnuboard-ai-guide.md](docs/gnuboard-ai-guide.md)** — Vue 컴포넌트 구조, `data-gb-*` 속성, 초기화 패턴, 자주 하는 실수

> 💡 그누보드 연동 프로젝트는 `pull` 시 `project.json`에 도메인이 저장되며, `gulp temha` 미리보기에서 `data-gb-url`이 자동 적용됩니다.  
> 페이지 URL은 각 폴더의 `page.json` → `pageName` (예: `notice_list.html`)과 맞춰 주세요.


## 🖼️ 리소스 파일 경로 작성 가이드 (이미지/비디오)
Temha 프로젝트에서는 이미지 및 영상 리소스를 참조할 때 **두 가지 경로 방식**을 사용할 수 있습니다.  

### 1. 상대 경로 방식
```html
<!-- 이미지 예시 -->
<img src="../../resources/images/img_01.jpg">

<!-- 아이콘 예시 -->
<img src="../../resources/icon/img_01.svg">

<!-- 비디오 예시 -->
<video src="../../resources/video/video.mp4" controls></video>
```

### 2. 절대 경로 방식 
```html
<img src="/api/dn/[프로젝트ID]/img_01.jpg">
```


## 📁 프로젝트 파일 구조

문서: [docs/temha-core.md](docs/temha-core.md) (템하 규약 · AI 가이드 진입점)

### 로컬 작업 디렉터리
```plaintext
[템하]-workspace/
├── [프로젝트명 (프로젝트 ID)]/
│   ├── [페이지명 (페이지 ID)]/
│   │   ├── header/ 
│   │   ├── content/
│   │   │   └── [blockName]/
│   │   │       ├── blockName.html
│   │   │       ├── blockName.css
│   │   │       ├── blockName.js
│   │   │       └── block.json 
│   │   ├── footer/
│   │   ├── block_order.json    # 블록 나열 순서 정의
│   │   └── page.json           # 페이지명, 페이지 html파일명 정의
│   └── resources/
│   │   ├── css/
│   │   └── js/
│   │   ├── images/             # 이미지 폴더
│   │   └── icons/              # 아이콘 폴더
│   │   └── video/              # 비디오 폴더
│   │── pageOrder.json          # 페이지 나열 순서 정의
│   └── project.json            # 프로젝트명 정의
```
> 💡 **`resources` 의 `icons`, `video` 폴더는 사용한 블록에 해당 리소스가**,  
> 포함된 경우에만 pull시 자동으로 노출됩니다.  

## 🧰 Temha CLI 주요 명령어 요약
| 명령어 | 설명 |
|--------|------|
| `npm install` | CLI 초기 설치 |
| `npm run login` | 템하 계정 로그인 |
| `npm run pull` | 번호 선택: 전체 불러오기 또는 개별 프로젝트 (대화형 터미널) |
| `npm run pull -- [ID]` | 메뉴 없이 해당 ID 프로젝트만 불러오기 |
| `npm run push` | 번호 선택: 전체 올리기 또는 개별 프로젝트 (대화형 터미널) |
| `npm run push -- [ID]` | 메뉴 없이 해당 ID 프로젝트만 업로드 |
| `gulp` | 미리보기 HTML 생성 |
| `gulp temha` | 브라우저에서 미리보기 실행 (라이브 서버) |
| `npm run preview` · `npm run temha` · `npm run serve` | 위와 동일한 Gulp를 npm으로 실행할 때 |
| `npm run trash:list` | 리소스 휴지통 목록 보기 |
| `npm run trash:restore` | 휴지통에 있는 리소스 복원 |
| `npm run trash:empty` | 리소스 휴지통 비우기 |
| `npm run project-trash:list` | 프로젝트 휴지통 목록 보기 |
| `npm run project-trash:restore` | 프로젝트 휴지통에서 복원 |
| `npm run project-trash:empty` | 프로젝트 휴지통 완전히 비우기 |


## ✍️ 프로젝트 수정 예시
1. VSCode에서 `[사용자명]-workspace/[프로젝트명]/[페이지명]/content/` 경로로 이동
2. 원하는 블록의 `.html`, `.css`, `.js` 파일 수정
3. 수정 후 `gulp`로 미리보기 생성
4. `gulp temha` 명령어로 브라우저에서 확인
5. 문제없으면 `npm run push`로 메뉴에서 프로젝트를 고르거나, `npm run push -- [프로젝트ID]`로 해당 프로젝트만 업로드

## 📄 라이선스
Temha CLI는 Templatehouse 웹 서비스와 연동되는 전용 도구입니다.  
본 도구는 Templatehouse의 회원 및 라이선스 사용자에 한해 사용을 허가하며,  
별도의 사전 동의 없이 복제, 배포, 상업적 사용, 또는 API 무단 연동은 금지됩니다.

문의: [문의/제안 페이지](https://temha.io/help/qna)

## 🤝 기여하기
프로젝트에 관심 있는 분들께서는 언제든지 PR이나 Issue를 남겨주시거나,  
빠른 응답을 원하신다면 [🔗 문의/제안 페이지](https://temha.io/help/qna)를 통해 코멘트를 남겨주세요.  
여러분의 의견과 기여를 진심으로 환영합니다!

