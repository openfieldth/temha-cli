# Temha CLI

Temha CLI is a Node.js-based command-line tool that helps you manage Templatehouse (Temha) no-code web projects locally and sync changes back to the server after you edit code. You can edit Temha projects in VSCode and handle preview and server upload (push) in one workflow.

https://github.com/user-attachments/assets/9da0b17a-b365-4c8c-b8c5-2153a736963a

## 🔧 Deployment commands (development only)
> 💡 **These commands are only available in the development environment and cannot be used in the published CLI package.**

| Command | Description |
|--------|-------------|
| `npm run build` | Bundle the CLI and generate deployment artifacts (includes deploy-environment checks in dev) |
| `npm run deploy` | Build automatically and publish to the configured GitHub repository |



## 📦 Prerequisites
Temha CLI runs on Node.js.  
The following must be set up before you can use it normally.

### Node.js (v18 or higher recommended)
1. Open a terminal and check whether Node.js is installed:
```bash
$ node -v
```

2. If a version such as `v18.18.2` is shown, installation succeeded:
```bash
v18.18.2
```

### Installing Node.js

If Node.js is not installed, install it from the links below.

#### 📦 Windows
1. Go to the [Node.js download page](https://nodejs.org/en/download/)
2. Select the **LTS** release and download the `.msi` installer
3. Follow the installer (default options are recommended)
4. After installation, run `$ node -v` in the terminal to confirm

#### 🍎 macOS
1. From the [Node.js download page](https://nodejs.org/en/download/), download the LTS `.pkg` installer
2. Complete the installation
3. After installation, run `$ node -v` in the terminal to confirm



## 🚀 Getting started
1. Clone Temha CLI with Git:
```bash
https://github.com/openfieldth/temha-cli.git
```

2. Install Temha CLI in the project folder:
```bash
$ npm install
```
> 💡 After installation, a **short summary** is printed once in the terminal.

3. Install Gulp CLI globally for live preview in the browser:
```bash
$ npm install -g gulp-cli
```

4. Log in with your Templatehouse account to pull projects:
```bash
# If you use SNS sign-in, request a new password via password recovery before CLI login.
$ npm run login
```

5. Pull projects from the server (`pull`).

- **Option 1** — Pull all projects  
- **Options 2+** — Pull only the **individual project** shown in the list (project name and ID are displayed)

```bash
# Pull all projects or choose from the menu
$ npm run pull
```

```bash
# Pull one project only (example: project ID p1a2b3c4d5)
$ npm run pull -- p1a2b3c4d5
```

6. After editing locally, upload to the server (`push`).

- **Option 1** — Push all projects  
- **Options 2+** — Push only the **individual project** from the list

```bash
# Push all projects or choose from the menu
$ npm run push
```

```bash
# Push one project only (example: project ID p1a2b3c4d5)
$ npm run push -- p1a2b3c4d5
```

## 🌐 Preview build and live server
### Generate preview HTML for each project
Preview files are created under the `static/` folder.

```bash
$ gulp
```

### Run the preview server in the browser

```bash
# The browser opens automatically when you run this command.
$ gulp temha
```

To do the same without a global install (optional):

```bash
$ npx gulp
$ npx gulp temha
```

You can also run the same Gulp tasks with `npm run preview`, `npm run temha`, or `npm run serve`.

## 🗑️ Trash-related commands

Temha can **temporarily keep** deleted resources or projects,  
and you can **restore or permanently delete** them when needed.

> 💡 **Even if you delete page or project folders locally (or remove them with the `Delete` key) and then push,**  
> you can still find those items in the Temha editor **Trash** menu and restore them.

### Resource trash commands
| Command | Description |
|--------|-------------|
| `npm run trash:list` | List deleted resources |
| `npm run trash:restore` | Restore from resource trash |
| `npm run trash:empty` | Permanently empty resource trash |

### Project trash commands
| Command | Description |
|--------|-------------|
| `npm run project-trash:list` | List deleted projects |
| `npm run project-trash:restore` | Restore projects from trash |
| `npm run project-trash:empty` | Permanently empty project trash |

> ⚠️ If you delete a file or project by mistake, you can safely recover it with a `:restore` command.  
> ⚠️ Running `:empty` **permanently deletes** those items and they cannot be recovered.


## ⛔ Resource file notes (CSS/JS exclusions)
The local project `resources/` folder contains shared CSS, JS, and image assets.  
**Files with the following names are not pushed** to the server—please note.

### Files excluded from push
#### [CSS]
- `setting.css`
- `plugin.css`
- `style.css`

#### [JS]
- `setting.js`
- `plugin.js`
- `style.js`

> ⚠️ These are treated as **Temha system resources** and are not pushed with your project.  
> ⚠️ If you need customization, use a different filename or separate resources.  
> ⚠️ If system files are missing on the server, files from **resources-common** may be pushed automatically.  
> ⚠️ Do not modify or delete system files in that folder.


## 📐 Temha rules · AI authoring guide

When creating or editing block HTML/CSS/JS to match Temha conventions, use the **`docs/`** folder in this repo.  
(Same rules as Temha MCP `read_temha_rules()`, available **without** an MCP connection in Cursor and similar tools.)

**Feeding docs to the AI in Cursor**

- Attach **`@docs`** or **`@docs/temha-core.md`** in chat before you ask for changes.
- Add one or two topic files that match the task (avoid loading more than three topics at once).

| Entry | Purpose |
|--------|---------|
| [docs/temha-core.md](docs/temha-core.md) | Load order and topic selection (read first) |
| [docs/temha-ai-spec.md](docs/temha-ai-spec.md) | MCP tools and HTML/CSS/JS rule tables |
| [docs/temhakit-design-guide.md](docs/temhakit-design-guide.md) | Kit design system (`btnset`, `inputset`, etc.) |
| [docs/temha-topic-*.md](docs/) | Header/footer, swiper, forms, background, components, workflow |

> 💡 For Gnuboard blocks only, also see [Gnuboard integration guide](#-gnuboard-integration-guide) (`gnuboard-ai-guide.md`).

## 📋 Gnuboard integration guide

When editing Gnuboard board or member blocks (`gb5-board`, `g5_latest`, etc.), refer to the document below.  
It is a **single reference** for AI assistants (Cursor, etc.) to handle block HTML/JS correctly.

- **[docs/gnuboard-ai-guide.md](docs/gnuboard-ai-guide.md)** — Vue component structure, `data-gb-*` attributes, initialization patterns, common mistakes

> 💡 For Gnuboard-linked projects, the domain is saved in `project.json` on `pull`, and `data-gb-url` is applied automatically in the `gulp temha` preview.  
> Page URLs should match each folder’s `page.json` → `pageName` (e.g. `notice_list.html`).


### Bundled plugins (`resources-common`)

Source lives at [`resources-common/`](resources-common/) in this repo and is copied into each project’s `resources/` on preview/build.

- **`plugin.js`** — jQuery, Swiper, GSAP (+ ScrollTrigger, TextPlugin, ScrollToPlugin) · **`plugin.css`** — Swiper styles
- **`setting.js`** — AOS (includes `AOS.init()`) · **`setting.css`** — AOS styles

**Page JS load order** (`gulp preview`): `plugin.js` → `setting.js` → `temhagnu.js` → `templatehouse.js` → `{pageName}.style.js`

> 💡 **Not included**: Lenis, Locomotive Scroll, Mo.js, etc. Prefer **`data-aos` (AOS)** for scroll/reveal effects; do not add separate CDNs.

For the full table, examples, and AI implementation rules, see **[docs/temhakit-design-guide.md — Plugins & animation](docs/temhakit-design-guide.md#플러그인--애니메이션-resources-common)** (single reference; section title is in Korean).


## 🖼️ Resource path guide (images / video)
Temha projects support **two** ways to reference images and video.

### 1. Relative paths
```html
<!-- Image example -->
<img src="../../resources/images/img_01.jpg">

<!-- Icon example -->
<img src="../../resources/icons/img_01.svg">

<!-- Video example -->
<video src="../../resources/video/video.mp4" controls></video>
```

### 2. Absolute path
```html
<img src="/api/dn/[PROJECT_ID]/img_01.jpg">
```


## 📁 Project file structure

Docs: [docs/temha-core.md](docs/temha-core.md) (Temha rules · AI guide entry point)

### Local workspace
```plaintext
[username]-workspace/
├── [Project name (PROJECT_ID)]/
│   ├── [Page name (PAGE_ID)]/
│   │   ├── header/
│   │   ├── content/
│   │   │   └── [blockName]/
│   │   │       ├── blockName.html
│   │   │       ├── blockName.css
│   │   │       ├── blockName.js
│   │   │       └── block.json
│   │   ├── footer/
│   │   ├── block_order.json    # Block display order
│   │   └── page.json           # Page title and HTML filename
│   └── resources/
│   │   ├── css/
│   │   └── js/
│   │   ├── images/             # Images
│   │   └── icons/              # Icons
│   │   └── video/              # Video
│   │── pageOrder.json          # Page order
│   └── project.json            # Project title (Gnuboard domain when linked)
```
> 💡 Under `resources`, the **`icons`** and **`video`** folders appear on pull **only when** blocks in the project use those asset types.

## 🧰 Temha CLI command summary
| Command | Description |
|--------|-------------|
| `npm install` | Initial CLI install |
| `npm run login` | Log in to Temha |
| `npm run pull` | Menu: pull all or one project (interactive terminal) |
| `npm run pull -- [ID]` | Pull project `ID` only (no menu) |
| `npm run push` | Menu: push all or one project (interactive terminal) |
| `npm run push -- [ID]` | Upload project `ID` only (no menu) |
| `gulp` | Generate preview HTML |
| `gulp temha` | Run preview in the browser (live server) |
| `npm run preview` · `npm run temha` · `npm run serve` | Same Gulp tasks via npm |
| `npm run trash:list` | View resource trash |
| `npm run trash:restore` | Restore resources from trash |
| `npm run trash:empty` | Empty resource trash |
| `npm run project-trash:list` | View project trash |
| `npm run project-trash:restore` | Restore projects from trash |
| `npm run project-trash:empty` | Permanently empty project trash |


## ✍️ Example workflow
1. In VSCode, open `[username]-workspace/[projectName]/[pageName]/content/`
2. Edit the block `.html`, `.css`, and `.js` files you need
3. Run `gulp` to generate previews
4. Run `gulp temha` to check in the browser
5. When ready, run `npm run push` and pick a project from the menu, or `npm run push -- [PROJECT_ID]` to upload that project only

## 📄 License
Temha CLI is a companion tool for the Templatehouse web service.  
Use is permitted only for Templatehouse members and licensees.  
Copying, distribution, commercial use, or unauthorized API integration without prior consent is prohibited.

Questions: [Inquiry / suggestion page](https://temha.io/help/qna)

## 🤝 Contributing
If you are interested in the project, feel free to open a PR or Issue,  
or leave a comment on the [Inquiry / suggestion page](https://temha.io/help/qna) for a faster response.  
We welcome your feedback and contributions!
