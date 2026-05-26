// gulpfile.js
import { deleteAsync as del } from "del";
import { execSync } from "child_process";
import gulp from "gulp";
import path3 from "path";
import fs3 from "fs";
import browserSync from "browser-sync";
import { fileURLToPath } from "url";
import { globSync } from "glob";
import postcss from "postcss";

// src/utils/gnuboard.js
import fs2 from "fs";
import path2 from "path";

// src/utils/api.js
import axios from "axios";
import FormData from "form-data";
async function getProjectDetails(projectId, cookies) {
  const url = `https://temha.io/api/projects/project/item.json?projectId=${projectId}&_=${(/* @__PURE__ */ new Date()).getTime()}`;
  const options = {
    withCredentials: true,
    headers: {
      "Cookie": cookies.join("; "),
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      "Origin": "https://temha.io",
      "Referer": "https://temha.io/",
      "X-Requested-With": "XMLHttpRequest"
    }
  };
  const res = await axios.get(url, options);
  return res.data;
}

// src/utils/project-id.js
import fs from "fs";
import path from "path";
import crypto from "crypto";
function decryptProjectId(encryptedId) {
  try {
    const key = crypto.scryptSync("temha-cli-secure-key-2024", "salt", 32);
    const parts = encryptedId.split(":");
    if (parts.length !== 2) return encryptedId;
    const iv = Buffer.from(parts[0], "hex");
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch {
    return encryptedId;
  }
}
function readHiddenProjectId(projectDir) {
  try {
    const hiddenPath = path.join(projectDir, ".project_id");
    if (!fs.existsSync(hiddenPath)) return null;
    const encryptedId = fs.readFileSync(hiddenPath, "utf8").trim();
    return decryptProjectId(encryptedId);
  } catch {
    return null;
  }
}
function extractProjectIdFromFolderName(folderName) {
  const match = folderName.match(/\(([^)]+)\)\s*$/);
  return match?.[1]?.trim() || null;
}

// src/utils/gnuboard.js
var PROJECT_META_FILE = "project.json";
var SESSION_FILE = ".temha_session.json";
var GNUBOARD_BLOCK_MARKERS = /v-gb-|vue_gnuboard|data-gb-|temhagnu|g5_|gb5-|class=["'][^"']*\bgnuboard\b/i;
function extractGnuboardDomain(project) {
  if (!project) return null;
  const gb = project.gnuboard ?? project.common?.gnuboard;
  const domain = gb?.domain?.trim();
  return domain || null;
}
function toGnuboardGbUrl(domain) {
  if (!domain) return null;
  const host = domain.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
  if (!host) return null;
  return `https://${host}/gnuboard/`;
}
function readProjectMeta(projectDir) {
  const metaPath = path2.join(projectDir, PROJECT_META_FILE);
  if (!fs2.existsSync(metaPath)) return null;
  try {
    return JSON.parse(fs2.readFileSync(metaPath, "utf8"));
  } catch {
    return null;
  }
}
function readGnuboardDomainFromMeta(projectDir) {
  const meta = readProjectMeta(projectDir);
  return meta?.gnuboard?.domain?.trim() || null;
}
function isGnuboardPreviewDisabled(projectDir) {
  const meta = readProjectMeta(projectDir);
  return meta?.gnuboard?.enabled === false;
}
function projectUsesGnuboardBlocks(projectDir) {
  const scanDir = (dir, depth = 0) => {
    if (depth > 12 || !fs2.existsSync(dir)) return false;
    let entries;
    try {
      entries = fs2.readdirSync(dir, { withFileTypes: true });
    } catch {
      return false;
    }
    for (const ent of entries) {
      const full = path2.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (ent.name === "node_modules" || ent.name === "resources") continue;
        if (scanDir(full, depth + 1)) return true;
      } else if (/\.(html|js)$/i.test(ent.name)) {
        try {
          if (GNUBOARD_BLOCK_MARKERS.test(fs2.readFileSync(full, "utf8"))) return true;
        } catch {
        }
      }
    }
    return false;
  };
  return scanDir(projectDir);
}
function cacheGnuboardDomain(projectDir, domain) {
  const metaPath = path2.join(projectDir, PROJECT_META_FILE);
  let meta = {};
  if (fs2.existsSync(metaPath)) {
    try {
      meta = JSON.parse(fs2.readFileSync(metaPath, "utf8"));
    } catch {
      meta = {};
    }
  }
  meta.gnuboard = { domain };
  fs2.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
}
async function resolveGnuboardGbUrl(projectDir) {
  if (isGnuboardPreviewDisabled(projectDir)) return null;
  const cachedDomain = readGnuboardDomainFromMeta(projectDir);
  if (cachedDomain) return toGnuboardGbUrl(cachedDomain);
  if (!projectUsesGnuboardBlocks(projectDir)) return null;
  const projectId = readHiddenProjectId(projectDir) || extractProjectIdFromFolderName(path2.basename(projectDir));
  if (!projectId) return null;
  const sessionPath = path2.join(process.cwd(), SESSION_FILE);
  if (!fs2.existsSync(sessionPath)) return null;
  let session;
  try {
    session = JSON.parse(fs2.readFileSync(sessionPath, "utf8"));
  } catch {
    return null;
  }
  const cookies = session.cookies;
  if (!Array.isArray(cookies) || cookies.length === 0) return null;
  try {
    const res = await getProjectDetails(projectId, cookies);
    const domain = extractGnuboardDomain(res?.data?.project);
    if (!domain) return null;
    cacheGnuboardDomain(projectDir, domain);
    return toGnuboardGbUrl(domain);
  } catch (e) {
    console.warn(`[GULP][\uADF8\uB204\uBCF4\uB4DC] API \uC870\uD68C \uC2E4\uD328 (${projectId}):`, e.message);
    return null;
  }
}

// gulpfile.js
var { series, watch } = gulp;
var __filename = fileURLToPath(import.meta.url);
var __dirname = path3.dirname(__filename);
var workspaceName = fs3.existsSync(".temha_session.json") ? (() => {
  try {
    const session = JSON.parse(fs3.readFileSync(".temha_session.json", "utf8"));
    return session.member?.name ? `${session.member.name}-workspace` : "workspace";
  } catch {
    return "workspace";
  }
})() : "workspace";
var workspaceDir = path3.join(__dirname, `${workspaceName}`);
var staticDir = path3.join(__dirname, "static");
var PROJECT_META_FILE2 = "project.json";
var PAGE_META_FILE = "page.json";
var BLOCK_META_FILE = "block.json";
function migrateMetaJson(dir, type) {
  const oldPath = path3.join(dir, "meta.json");
  let newPath;
  if (type === "project") newPath = path3.join(dir, PROJECT_META_FILE2);
  else if (type === "page") newPath = path3.join(dir, PAGE_META_FILE);
  else if (type === "block") newPath = path3.join(dir, BLOCK_META_FILE);
  else return;
  if (fs3.existsSync(oldPath) && !fs3.existsSync(newPath)) {
    fs3.renameSync(oldPath, newPath);
    console.log(`[\uB9C8\uC774\uADF8\uB808\uC774\uC158] meta.json \u2192 ${path3.basename(newPath)}`);
  }
}
function replaceResourcePaths(str) {
  if (!str) return str;
  str = str.replace(/(?:\.\.\/)+resources\//g, "./resources/");
  str = str.replace(/(\.\/resources\/)(images|icons|video|css|js)\/\2\//g, "$1$2/");
  str = str.replace(/(\.\/resources\/[^"')\s]*)\/{2,}/g, "$1/");
  str = str.replace(/(\.\/resources\/)\.\.\//g, "$1");
  return str;
}
function readPageHtmlFileName(pageDir, pageFolderFallback) {
  const metaPath = path3.join(pageDir, PAGE_META_FILE);
  if (fs3.existsSync(metaPath)) {
    try {
      const meta = JSON.parse(fs3.readFileSync(metaPath, "utf8"));
      const name = meta.pageName?.trim();
      if (name) {
        return name.toLowerCase().endsWith(".html") ? name : `${name}.html`;
      }
    } catch (e) {
      console.warn(`[GULP][\uACBD\uACE0] ${metaPath} \uC77D\uAE30 \uC2E4\uD328:`, e.message);
    }
  }
  return `${pageFolderFallback}.html`;
}
function pageStyleAssetBase(htmlFileName) {
  return htmlFileName.replace(/\.html$/i, "");
}
function bodyOpenTag(gnuboardGbUrl) {
  if (!gnuboardGbUrl) return "<body>";
  const escaped = gnuboardGbUrl.replace(/"/g, "&quot;");
  return `<body data-gb-url="${escaped}">`;
}
function safeRemoveDir(dirPath) {
  if (!fs3.existsSync(dirPath)) return;
  try {
    if (process.platform === "win32") {
      try {
        execSync(`attrib -h -s "${dirPath}" /s /d`, { stdio: "ignore" });
      } catch {
      }
    }
    fs3.rmSync(dirPath, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
  } catch (e) {
    console.warn(`[GULP][\uACBD\uACE0] \uD3F4\uB354 \uC0AD\uC81C \uC2A4\uD0B5: ${dirPath} (${e.message})`);
  }
}
function clearStaticDirAttributes(targetDir) {
  if (!fs3.existsSync(targetDir)) return;
  try {
    if (process.platform === "win32") {
      execSync(`attrib -h -s "${targetDir}" /s /d`, { stdio: "ignore" });
    } else {
      fs3.chmodSync(targetDir, 493);
    }
  } catch {
  }
}
async function buildPreview() {
  console.log("[GULP][workspaceDir]", workspaceDir);
  if (!fs3.existsSync(staticDir)) fs3.mkdirSync(staticDir, { recursive: true });
  const dir1List = fs3.readdirSync(workspaceDir);
  console.log("[GULP][dir1List]", dir1List);
  const projects = [];
  for (const dir1 of dir1List) {
    const dir1Path = path3.join(workspaceDir, dir1);
    let isDir = false;
    let hasProjectJson = false;
    try {
      isDir = fs3.lstatSync(dir1Path).isDirectory();
      hasProjectJson = fs3.existsSync(path3.join(dir1Path, PROJECT_META_FILE2));
    } catch (e) {
      console.warn("[GULP][\uC624\uB958]", dir1Path, e.message);
    }
    console.log(`[GULP][\uD3F4\uB354] ${dir1} | isDirectory: ${isDir} | project.json: ${hasProjectJson}`);
    if (isDir && hasProjectJson) {
      projects.push(dir1);
    }
  }
  console.log("[GULP][\uD504\uB85C\uC81D\uD2B8 \uD3F4\uB354]", projects);
  if (projects.length === 0) {
    console.warn("[GULP][\uACBD\uACE0] static\uC5D0 \uBCF5\uC0AC\uD560 \uD504\uB85C\uC81D\uD2B8\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.");
    console.warn("\u{1F4A1} \uD574\uACB0 \uBC29\uBC95: \uBA3C\uC800 `temha pull` \uBA85\uB839\uC5B4\uB85C \uD504\uB85C\uC81D\uD2B8\uB97C \uB2E4\uC6B4\uB85C\uB4DC\uD558\uC138\uC694.");
    return;
  }
  const gnuboardGbUrlByProject = /* @__PURE__ */ new Map();
  for (const projectName of projects) {
    const projectDir = path3.join(workspaceDir, projectName);
    try {
      const gbUrl = await resolveGnuboardGbUrl(projectDir);
      if (gbUrl) {
        gnuboardGbUrlByProject.set(projectName, gbUrl);
        console.log(`[GULP][\uADF8\uB204\uBCF4\uB4DC] ${projectName} \u2192 data-gb-url="${gbUrl}"`);
      }
    } catch (e) {
      console.warn(`[GULP][\uADF8\uB204\uBCF4\uB4DC] ${projectName} \uC870\uD68C \uC2E4\uD328:`, e.message);
    }
  }
  let allPages = [];
  for (const project of projects) {
    const projectDir = path3.join(workspaceDir, project);
    const pageDirs = fs3.readdirSync(projectDir).filter((name) => fs3.existsSync(path3.join(projectDir, name, "block_order.json")));
    let projectPages = [];
    const projectName = project;
    for (const page of pageDirs) {
      const pageDir = path3.join(projectDir, page);
      const htmlFileName = readPageHtmlFileName(pageDir, page);
      const pageEntry = { project: projectName, page, pageDir, projectDir, htmlFileName };
      projectPages.push(pageEntry);
      allPages.push(pageEntry);
    }
    const pagelistHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${projectName} \uD398\uC774\uC9C0 \uB9AC\uC2A4\uD2B8</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css">
</head>
<body>
  <div class="container py-5">
    <header>
      <h1>
        <span>${projectName}</span>
        <small class="text-muted">\uD398\uC774\uC9C0 \uB9AC\uC2A4\uD2B8</small>
      </h1>
    </header>
    <div class="mt-5">
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">\uD398\uC774\uC9C0\uBA85</th>
            <th scope="col">\uB9C1\uD06C URL</th>
            <th scope="col">\uBBF8\uB9AC\uBCF4\uAE30</th>
          </tr>
        </thead>
        <tbody>
          ${projectPages.map((p) => `
          <tr>
            <td>${p.page}</td>
            <td><a href="./${p.htmlFileName}" target="_blank">./${p.htmlFileName}</a></td>
            <td><a href="./${p.htmlFileName}" target="_blank" class="btn btn-outline-primary btn-sm">\uBBF8\uB9AC\uBCF4\uAE30</a></td>
          </tr>`).join("")}
        </tbody>
      </table>
      <div class="mt-4">
        <a href="../../index.html">\u2190 \uD504\uB85C\uC81D\uD2B8 \uB9AC\uC2A4\uD2B8\uB85C \uB3CC\uC544\uAC00\uAE30</a>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim();
    const staticProjectDir = path3.join(staticDir, "\uD504\uB85C\uC81D\uD2B8", projectName);
    fs3.mkdirSync(staticProjectDir, { recursive: true });
    for (const p of projectPages) {
      safeRemoveDir(path3.join(staticProjectDir, p.page));
    }
    fs3.writeFileSync(path3.join(staticProjectDir, "pagelist.html"), pagelistHtml, "utf8");
  }
  const indexHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>\uC624\uD508\uD544\uB4DC \uD504\uB85C\uC81D\uD2B8 \uB9AC\uC2A4\uD2B8</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css">
  <style>
    body { padding: 2rem; }
    h1 { font-weight: bold; }
    .table { margin-top: 2rem; }
  </style>
</head>
<body>
  <h1>\uC624\uD508\uD544\uB4DC \uD504\uB85C\uC81D\uD2B8 \uB9AC\uC2A4\uD2B8</h1>
  <table class="table table-bordered">
    <thead>
      <tr>
        <th>\uD504\uB85C\uC81D\uD2B8\uBA85</th>
        <th>\uD504\uB85C\uC81D\uD2B8 \uBCF4\uAE30</th>
      </tr>
    </thead>
    <tbody>
      ${projects.map((projectName) => `
      <tr>
        <td>${projectName}</td>
        <td><a href="./\uD504\uB85C\uC81D\uD2B8/${projectName}/pagelist.html" target="_blank" class="btn btn-primary btn-sm">\uD504\uB85C\uC81D\uD2B8 \uBCF4\uAE30</a></td>
      </tr>`).join("")}
    </tbody>
  </table>
</body>
</html>
  `.trim();
  fs3.writeFileSync(path3.join(staticDir, "index.html"), indexHtml, "utf8");
  const resourcesPreparedForProject = /* @__PURE__ */ new Set();
  for (const { project, page, pageDir, projectDir, htmlFileName } of allPages) {
    const gnuboardGbUrl = gnuboardGbUrlByProject.get(project) || null;
    const staticProjectDir = path3.join(staticDir, "\uD504\uB85C\uC81D\uD2B8", project);
    fs3.mkdirSync(staticProjectDir, { recursive: true });
    const resourceSrc = path3.join(projectDir, "resources");
    const resourceDest = path3.join(staticProjectDir, "resources");
    if (!resourcesPreparedForProject.has(project)) {
      if (fs3.existsSync(resourceSrc)) {
        copyDir(resourceSrc, resourceDest);
      }
      copyCommonResources(staticProjectDir);
      resourcesPreparedForProject.add(project);
    }
    const styleBase = pageStyleAssetBase(htmlFileName);
    const pageStyleCss = `${styleBase}.style.css`;
    const pageStyleJs = `${styleBase}.style.js`;
    const order = JSON.parse(fs3.readFileSync(path3.join(pageDir, "block_order.json"), "utf8"));
    const blockMap = /* @__PURE__ */ new Map();
    let html = "";
    let js = "";
    for (const { block, section } of order) {
      const safeName = block.replace(/[<>:"/\\|?*]/g, "-");
      const blockDir = path3.join(pageDir, section, safeName);
      migrateMetaJson(blockDir, "block");
      const blockMetaPath = path3.join(blockDir, BLOCK_META_FILE);
      let blockMeta = {};
      if (fs3.existsSync(blockMetaPath)) {
        try {
          blockMeta = JSON.parse(fs3.readFileSync(blockMetaPath, "utf8"));
        } catch (e) {
          console.warn(`[GULP][\uACBD\uACE0] ${blockMetaPath} \uD30C\uC77C \uC77D\uAE30 \uC2E4\uD328:`, e.message);
        }
      }
      const classtitle = blockMeta.classtitle || blockMeta.name || safeName;
      const bid = blockMeta.bid || blockMeta.id || safeName;
      const blockHtmlFile = path3.join(blockDir, `${safeName}.html`);
      const blockCssFile = path3.join(blockDir, `${safeName}.css`);
      const blockJsFile = path3.join(blockDir, `${safeName}.js`);
      const htmlExists = fs3.existsSync(blockHtmlFile);
      const cssExists = fs3.existsSync(blockCssFile);
      const jsExists = fs3.existsSync(blockJsFile);
      console.log(`[GULP][\uBE14\uB85D] ${block} (classtitle: ${classtitle}, bid: ${bid}) \u2192 ${blockHtmlFile} | exists: ${htmlExists}`);
      if (htmlExists) {
        const content = fs3.readFileSync(blockHtmlFile, "utf8");
        if (!content.trim()) {
          console.warn(`[GULP][\uACBD\uACE0] ${blockHtmlFile} \uD30C\uC77C\uC774 \uBE44\uC5B4\uC788\uC74C!`);
        }
        html += "\n" + replaceResourcePaths(content);
      } else {
        console.warn(`[GULP][\uACBD\uACE0] ${blockHtmlFile} \uD30C\uC77C\uC774 \uC874\uC7AC\uD558\uC9C0 \uC54A\uC74C!`);
      }
      if (cssExists) {
        const cssCode = fs3.readFileSync(blockCssFile, "utf8");
        const processedCssCode = replaceResourcePaths(cssCode);
        blockMap.set(bid, {
          classtitle,
          bid,
          css: postcss.parse(processedCssCode),
          cssCode: processedCssCode
        });
      }
      if (jsExists) {
        js += "\n" + replaceResourcePaths(fs3.readFileSync(blockJsFile, "utf8"));
      }
    }
    if (!html.trim()) {
      console.warn(`[GULP][\uACBD\uACE0] ${pageDir}\uC758 \uBAA8\uB4E0 \uBE14\uB85D html\uC774 \uBE44\uC5B4\uC788\uC74C!`);
    }
    if (blockMap.size > 0) {
      const cssSummaryCode = generateUnifiedStyleCss(blockMap);
      fs3.writeFileSync(path3.join(staticProjectDir, pageStyleCss), cssSummaryCode, "utf8");
    }
    if (js.trim()) fs3.writeFileSync(path3.join(staticProjectDir, pageStyleJs), js.trim(), "utf8");
    const cssDir = path3.join(resourceDest, "css");
    const jsDir = path3.join(resourceDest, "js");
    const cssFiles = fs3.existsSync(cssDir) ? fs3.readdirSync(cssDir).filter((f) => f.endsWith(".css")) : [];
    const jsLoadOrder = ["plugin.js", "setting.js", "temhagnu.js", "templatehouse.js", "common.js", "style.js"];
    const jsFiles = fs3.existsSync(jsDir) ? fs3.readdirSync(jsDir).filter((f) => f.endsWith(".js")).sort((a, b) => {
      const ia = jsLoadOrder.indexOf(a);
      const ib = jsLoadOrder.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    }) : [];
    const processedBodyHtml = replaceResourcePaths(html.trim());
    const headHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta http-equiv="imagetoolbar" content="no" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="format-detection" content="telephone=no" />
  <title>${page}</title>
  ${cssFiles.map((f) => `<link rel="stylesheet" href="./resources/css/${f}" />`).join("\n  ")}
  <link rel="stylesheet" href="./${pageStyleCss}" />
 
</head>
${bodyOpenTag(gnuboardGbUrl)}
${processedBodyHtml}
 ${jsFiles.map((f) => `<script src="./resources/js/${f}"></script>`).join("\n  ")}
  <script src="./${pageStyleJs}"></script>
</body>
</html>
    `.trim();
    fs3.writeFileSync(path3.join(staticProjectDir, htmlFileName), headHtml, "utf8");
    console.log(`[GULP][\uD398\uC774\uC9C0] ${page} \u2192 ${htmlFileName}`);
  }
  (async () => {
    try {
      const hideTargets = [
        path3.join(staticDir, ".projects"),
        path3.join(staticDir, "\uD504\uB85C\uC81D\uD2B8")
      ];
      for (const target of hideTargets) {
        if (fs3.existsSync(target)) {
          if (process.platform === "win32") {
            try {
              const { execSync: execSync2 } = await import("child_process");
              execSync2(`attrib +h +s "${target}"`, { stdio: "pipe" });
            } catch (e) {
              try {
                execSync(`powershell -Command "Set-ItemProperty -Path '${target}' -Name Attributes -Value ([System.IO.FileAttributes]::Hidden -bor [System.IO.FileAttributes]::System)"`, { stdio: "pipe" });
              } catch (psError) {
              }
            }
          } else if (process.platform === "darwin") {
            try {
              const { execSync: execSync2 } = await import("child_process");
              execSync2(`chflags hidden "${target}"`, { stdio: "pipe" });
            } catch (e) {
            }
          }
        }
      }
    } catch (e) {
    }
  })();
  try {
    const vscodeDir = path3.join(__dirname, ".vscode");
    const vscodeSettingsPath = path3.join(vscodeDir, "settings.json");
    if (!fs3.existsSync(vscodeDir)) fs3.mkdirSync(vscodeDir);
    let settings = {};
    if (fs3.existsSync(vscodeSettingsPath)) {
      try {
        settings = JSON.parse(fs3.readFileSync(vscodeSettingsPath, "utf8"));
      } catch {
      }
    }
    if (!settings["files.exclude"]) settings["files.exclude"] = {};
    settings["files.exclude"]["**/static/.projects"] = true;
    settings["files.exclude"]["**/static/\uD504\uB85C\uC81D\uD2B8"] = true;
    fs3.writeFileSync(vscodeSettingsPath, JSON.stringify(settings, null, 2));
    console.log("[GULP] VSCode files.exclude \uC124\uC815 \uC644\uB8CC");
  } catch (e) {
    console.warn("[GULP][\uACBD\uACE0] VSCode files.exclude \uC790\uB3D9\uD654 \uC2E4\uD328:", e.message);
  }
}
function copyDir(src, dest) {
  if (!fs3.existsSync(dest)) fs3.mkdirSync(dest, { recursive: true });
  for (const file of fs3.readdirSync(src)) {
    const srcPath = path3.join(src, file);
    const destPath = path3.join(dest, file);
    if (fs3.lstatSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      if (file.endsWith(".css")) {
        try {
          const cssContent = fs3.readFileSync(srcPath, "utf8");
          const processedCssContent = replaceResourcePaths(cssContent);
          fs3.writeFileSync(destPath, processedCssContent, "utf8");
        } catch (e) {
          console.warn(`[GULP][\uACBD\uACE0] CSS \uD30C\uC77C \uCC98\uB9AC \uC2E4\uD328: ${srcPath} - ${e.message}`);
          fs3.copyFileSync(srcPath, destPath);
        }
      } else {
        fs3.copyFileSync(srcPath, destPath);
      }
    }
  }
}
function copyCommonResources(staticProjectDir) {
  const commonResourceDir = path3.join(__dirname, "resources-common");
  const destCssDir = path3.join(staticProjectDir, "resources", "css");
  const destJsDir = path3.join(staticProjectDir, "resources", "js");
  const filesToCopy = [
    { src: "plugin.css", dest: destCssDir },
    { src: "setting.css", dest: destCssDir },
    { src: "plugin.js", dest: destJsDir },
    { src: "setting.js", dest: destJsDir }
  ];
  for (const { src, dest } of filesToCopy) {
    const srcPath = path3.join(commonResourceDir, src);
    if (fs3.existsSync(srcPath)) {
      fs3.copyFileSync(srcPath, path3.join(dest, src));
    }
  }
}
var bs = browserSync.create();
function clean() {
  for (const rel of [".projects", "\uD504\uB85C\uC81D\uD2B8"]) {
    clearStaticDirAttributes(path3.join(staticDir, rel));
  }
  return del([`${staticDir}/**`, `!${staticDir}`]);
}
async function cleanWorkspace() {
  try {
    const sessionPath = path3.join(__dirname, ".temha_session.json");
    if (!fs3.existsSync(sessionPath)) {
      console.log("\u26A0\uFE0F  \uC138\uC158 \uD30C\uC77C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uC6CC\uD06C\uC2A4\uD398\uC774\uC2A4 \uC815\uB9AC\uB97C \uAC74\uB108\uB701\uB2C8\uB2E4.");
      return;
    }
    const session = JSON.parse(fs3.readFileSync(sessionPath, "utf8"));
    if (!session.member?.project) {
      console.log("\u26A0\uFE0F  \uC138\uC158\uC5D0 \uD504\uB85C\uC81D\uD2B8 \uC815\uBCF4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uC6CC\uD06C\uC2A4\uD398\uC774\uC2A4 \uC815\uB9AC\uB97C \uAC74\uB108\uB701\uB2C8\uB2E4.");
      return;
    }
    const myProjects = session.member.project;
    const validProjectIds = [...myProjects.owner || [], ...myProjects.editor || []];
    if (validProjectIds.length === 0) {
      console.log("\u{1F4DD} \uC18C\uC720\uD558\uACE0 \uC788\uB294 \uD504\uB85C\uC81D\uD2B8\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.");
      return;
    }
    console.log(`\u{1F50D} \uC6CC\uD06C\uC2A4\uD398\uC774\uC2A4 \uC815\uB9AC \uC911... (\uC720\uD6A8\uD55C \uD504\uB85C\uC81D\uD2B8: ${validProjectIds.length}\uAC1C)`);
    if (!fs3.existsSync(workspaceDir)) {
      console.log("\u{1F4C1} \uC6CC\uD06C\uC2A4\uD398\uC774\uC2A4 \uD3F4\uB354\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.");
      return;
    }
    const localProjectDirs = fs3.readdirSync(workspaceDir).filter((name) => {
      const dirPath = path3.join(workspaceDir, name);
      return fs3.lstatSync(dirPath).isDirectory() && fs3.existsSync(path3.join(dirPath, PROJECT_META_FILE2));
    });
    let removedCount = 0;
    for (const dirName of localProjectDirs) {
      const metaPath = path3.join(workspaceDir, dirName, PROJECT_META_FILE2);
      try {
        const meta = JSON.parse(fs3.readFileSync(metaPath, "utf8"));
        if (meta?.projectId && !validProjectIds.includes(meta.projectId)) {
          console.log(`\u{1F5D1}\uFE0F  \uC11C\uBC84\uC5D0 \uC5C6\uB294 \uD504\uB85C\uC81D\uD2B8 \uC0AD\uC81C: ${dirName}`);
          await del([path3.join(workspaceDir, dirName)]);
          removedCount++;
        }
      } catch (e) {
        console.warn(`\u26A0\uFE0F  \uD504\uB85C\uC81D\uD2B8 \uBA54\uD0C0 \uD30C\uC77C \uC77D\uAE30 \uC2E4\uD328: ${dirName} - ${e.message}`);
      }
    }
    if (removedCount > 0) {
      console.log(`\u2705 \uC6CC\uD06C\uC2A4\uD398\uC774\uC2A4 \uC815\uB9AC \uC644\uB8CC: ${removedCount}\uAC1C \uD504\uB85C\uC81D\uD2B8 \uC0AD\uC81C`);
    } else {
      console.log(`\u2705 \uC6CC\uD06C\uC2A4\uD398\uC774\uC2A4 \uC815\uB9AC \uC644\uB8CC: \uC0AD\uC81C\uD560 \uD504\uB85C\uC81D\uD2B8 \uC5C6\uC74C`);
    }
  } catch (error) {
    console.warn(`\u26A0\uFE0F  \uC6CC\uD06C\uC2A4\uD398\uC774\uC2A4 \uC815\uB9AC \uC911 \uC624\uB958: ${error.message}`);
  }
}
function serve() {
  browserSync.init({
    server: {
      baseDir: staticDir
    },
    startPath: "index.html",
    port: 3e3,
    open: true,
    notify: false
  });
  function getWatchedFiles(dir, extensions = [".html", ".css", ".js"]) {
    const files = [];
    try {
      const items = fs3.readdirSync(dir);
      for (const item of items) {
        const fullPath = path3.join(dir, item);
        try {
          const stat = fs3.statSync(fullPath);
          if (stat.isDirectory()) {
            if (fs3.existsSync(path3.join(fullPath, "block_order.json"))) {
              files.push(path3.join(fullPath, "block_order.json"));
            }
            files.push(...getWatchedFiles(fullPath, extensions));
          } else if (stat.isFile()) {
            const ext = path3.extname(item);
            if (extensions.includes(ext)) {
              files.push(fullPath);
            }
          }
        } catch (err) {
          console.warn(`[GULP] \uD30C\uC77C \uC811\uADFC \uC624\uB958 (${fullPath}):`, err.message);
        }
      }
    } catch (err) {
      console.warn(`[GULP] \uB514\uB809\uD1A0\uB9AC \uC77D\uAE30 \uC624\uB958 (${dir}):`, err.message);
    }
    return files;
  }
  const watchedFiles = getWatchedFiles(workspaceDir);
  console.log(`[GULP] \uAC10\uC2DC\uD560 \uD30C\uC77C \uC218: ${watchedFiles.length}`);
  watch(
    watchedFiles,
    {
      ignoreInitial: false,
      events: ["add", "change", "unlink"]
    },
    series(buildPreview, (done) => {
      console.log("\uD30C\uC77C \uBCC0\uACBD \uAC10\uC9C0\uB428. \uBBF8\uB9AC\uBCF4\uAE30\uB97C \uC0C8\uB85C\uACE0\uCE68\uD569\uB2C8\uB2E4...");
      browserSync.reload();
      done();
    })
  );
}
function beautifyCss(css) {
  return css.replace(/(\n\s*){2,}/g, "\n").trim();
}
function isEmptyRoot(root) {
  let isEmpty = true;
  root.walkRules(() => {
    isEmpty = false;
    return false;
  });
  root.walkDecls(() => {
    isEmpty = false;
    return false;
  });
  return isEmpty;
}
function checkIfAllCssIdentical(cssArray) {
  if (!cssArray || cssArray.length <= 1) return true;
  const firstCssString = cssArray[0].css.toString().trim();
  for (let i = 1; i < cssArray.length; i++) {
    const currentCssString = cssArray[i].css.toString().trim();
    if (firstCssString !== currentCssString) return false;
  }
  return true;
}
function mergeCss(root) {
  const mediaRules = /* @__PURE__ */ new Map();
  const containerRules = /* @__PURE__ */ new Map();
  const keyframesRules = /* @__PURE__ */ new Map();
  const atRuleOrder = [];
  const globalRules = /* @__PURE__ */ new Map();
  root.walkRules((rule) => {
    const parent = rule.parent;
    const isInMedia = parent.type === "atrule" && parent.name === "media";
    const isInContainer = parent.type === "atrule" && parent.name === "container";
    const mediaQuery = isInMedia ? parent.params : null;
    const containerQuery = isInContainer ? parent.params : null;
    const isInKeyframes = parent.type === "atrule" && parent.name === "keyframes";
    const keyframesQuery = isInKeyframes ? parent.params : null;
    const selector = rule.selector;
    if (isInMedia) {
      if (!mediaRules.has(mediaQuery)) {
        mediaRules.set(mediaQuery, /* @__PURE__ */ new Map());
        atRuleOrder.push({ type: "media", params: mediaQuery });
      }
      const selectorMap = mediaRules.get(mediaQuery);
      if (!selectorMap.has(selector)) {
        selectorMap.set(selector, []);
      }
      rule.nodes.forEach((decl) => {
        if (decl.type === "decl") {
          selectorMap.get(selector).push(decl.clone());
        }
      });
    } else if (isInContainer) {
      if (!containerRules.has(containerQuery)) {
        containerRules.set(containerQuery, /* @__PURE__ */ new Map());
        atRuleOrder.push({ type: "container", params: containerQuery });
      }
      const selectorMap = containerRules.get(containerQuery);
      if (!selectorMap.has(selector)) {
        selectorMap.set(selector, []);
      }
      rule.nodes.forEach((decl) => {
        if (decl.type === "decl") {
          selectorMap.get(selector).push(decl.clone());
        }
      });
    } else if (isInKeyframes) {
      if (!keyframesRules.has(keyframesQuery)) {
        keyframesRules.set(keyframesQuery, /* @__PURE__ */ new Map());
        atRuleOrder.push({ type: "keyframes", params: keyframesQuery });
      }
      const selectorMap2 = keyframesRules.get(keyframesQuery);
      if (!selectorMap2.has(selector)) {
        selectorMap2.set(selector, []);
      }
      rule.nodes.forEach((decl) => {
        if (decl.type === "decl") {
          selectorMap2.get(selector).push(decl.clone());
        }
      });
    } else {
      if (!globalRules.has(selector)) {
        globalRules.set(selector, []);
      }
      rule.nodes.forEach((decl) => {
        if (decl.type === "decl") {
          globalRules.get(selector).push(decl.clone());
        }
      });
    }
  });
  const removeDuplicateDeclarations = (declarations) => {
    const propMap = /* @__PURE__ */ new Map();
    declarations.forEach((decl) => {
      const key = `${decl.prop}${decl.important ? "!important" : ""}`;
      propMap.set(key, decl);
    });
    return Array.from(propMap.values());
  };
  root.walkAtRules("media", (atRule) => {
    atRule.remove();
  });
  root.walkAtRules("container", (atRule) => {
    atRule.remove();
  });
  root.walkAtRules("keyframes", (atRule) => {
    atRule.remove();
  });
  root.walkRules((rule) => {
    if (rule.parent.type !== "atrule") {
      rule.remove();
    }
  });
  globalRules.forEach((declarations, selector) => {
    const uniqueDeclarations = removeDuplicateDeclarations(declarations);
    const rule = postcss.rule({ selector });
    uniqueDeclarations.forEach((decl) => {
      rule.append(decl);
    });
    root.append(rule);
  });
  atRuleOrder.forEach(({ type, params }) => {
    if (type === "keyframes" && keyframesRules.has(params)) {
      const keyframesRule = postcss.atRule({ name: "keyframes", params });
      const selectorMap2 = keyframesRules.get(params);
      selectorMap2.forEach((declarations, selector) => {
        const uniqueDeclarations = removeDuplicateDeclarations(declarations);
        const rule = postcss.rule({ selector });
        uniqueDeclarations.forEach((decl) => {
          rule.append(decl);
        });
        keyframesRule.append(rule);
      });
      root.append(keyframesRule);
    } else if (type === "media" && mediaRules.has(params)) {
      const mediaRule = postcss.atRule({ name: "media", params });
      const selectorMap = mediaRules.get(params);
      selectorMap.forEach((declarations, selector) => {
        const uniqueDeclarations = removeDuplicateDeclarations(declarations);
        const rule = postcss.rule({ selector });
        uniqueDeclarations.forEach((decl) => {
          rule.append(decl);
        });
        mediaRule.append(rule);
      });
      root.append(mediaRule);
    } else if (type === "container" && containerRules.has(params)) {
      const containerRule = postcss.atRule({ name: "container", params });
      const selectorMap = containerRules.get(params);
      selectorMap.forEach((declarations, selector) => {
        const uniqueDeclarations = removeDuplicateDeclarations(declarations);
        const rule = postcss.rule({ selector });
        uniqueDeclarations.forEach((decl) => {
          rule.append(decl);
        });
        containerRule.append(rule);
      });
      root.append(containerRule);
    }
  });
}
function diffCss(cssArray) {
  if (!Array.isArray(cssArray) || cssArray.length === 0) throw new Error("CSS array is required and must not be empty");
  const result = {
    common: postcss.root(),
    each: cssArray.map((item) => ({ bid: item.bid, css: postcss.root() }))
  };
  const firstCss = cssArray[0].css;
  processRules(firstCss, cssArray, result);
  processAtRules(firstCss, cssArray, result);
  firstCss.walkAtRules("import", (atRule) => {
    result.common.prepend(atRule.clone());
  });
  return result;
}
function processRules(firstCss, cssArray, result) {
  firstCss.walkRules((rule) => {
    if (rule.parent.type === "atrule") return;
    const selector = rule.selector;
    let isCommon = true;
    const declMap = /* @__PURE__ */ new Map();
    rule.walkDecls((decl) => {
      declMap.set(decl.prop, { value: decl.value, important: decl.important });
    });
    for (let i = 1; i < cssArray.length; i++) {
      let found = false;
      let matchingRule = null;
      cssArray[i].css.walkRules((compareRule) => {
        if (compareRule.parent.type === "atrule") return;
        if (compareRule.selector === selector) {
          found = true;
          matchingRule = compareRule;
          return false;
        }
      });
      if (!found) {
        isCommon = false;
        break;
      }
      const commonDecls = new Map(declMap);
      matchingRule.walkDecls((decl) => {
        const prev = commonDecls.get(decl.prop);
        if (!prev || prev.value !== decl.value || prev.important !== decl.important) {
          commonDecls.delete(decl.prop);
        }
      });
      declMap.clear();
      commonDecls.forEach((value, prop) => {
        declMap.set(prop, value);
      });
    }
    if (isCommon && declMap.size > 0) {
      const commonRule = postcss.rule({ selector });
      declMap.forEach((obj, prop) => {
        commonRule.append(postcss.decl({ prop, value: obj.value, important: obj.important }));
      });
      result.common.append(commonRule);
      cssArray.forEach((item, index) => {
        item.css.walkRules((r) => {
          if (r.parent.type === "atrule") return;
          if (r.selector === selector) {
            const remainingRule = postcss.rule({ selector });
            let hasRemaining = false;
            r.walkDecls((decl) => {
              const common = declMap.get(decl.prop);
              if (!common || common.value !== decl.value || common.important !== decl.important) {
                remainingRule.append(decl.clone({ important: decl.important }));
                hasRemaining = true;
              }
            });
            if (hasRemaining) {
              result.each[index].css.append(remainingRule);
            }
          }
        });
      });
    } else {
      cssArray.forEach((item, index) => {
        item.css.walkRules((r) => {
          if (r.parent.type === "atrule") return;
          if (r.selector === selector) {
            result.each[index].css.append(r.clone());
          }
        });
      });
    }
  });
}
function generateUnifiedStyleCss(blockMap) {
  try {
    const blockStyle = {};
    for (const [bid, blockInfo] of blockMap) {
      const { classtitle, css } = blockInfo;
      try {
        const clonedCss = css.clone();
        mergeCss(clonedCss);
        if (!blockStyle[classtitle]) {
          blockStyle[classtitle] = [];
        }
        blockStyle[classtitle].push({
          bid,
          css: clonedCss,
          cssCode: css.toString()
        });
      } catch (e) {
        console.warn(`[GULP][\uACBD\uACE0] \uBE14\uB85D ${classtitle}\uC758 CSS \uCC98\uB9AC \uC2E4\uD328:`, e);
      }
    }
    let cssSummaryCode = '@charset "utf-8";\n';
    for (const [classtitle, blocks] of Object.entries(blockStyle)) {
      const areAllCssIdentical = checkIfAllCssIdentical(blocks);
      if (areAllCssIdentical && blocks.length > 0) {
        cssSummaryCode += `
/* ${classtitle} */
`;
        cssSummaryCode += beautifyCss(blocks[0].css.toString());
      } else {
        const diffResult = diffCss(blocks);
        cssSummaryCode += `
/* ${classtitle} */
`;
        cssSummaryCode += beautifyCss(diffResult.common.toString());
        for (const item of diffResult.each) {
          if (!isEmptyRoot(item.css)) {
            cssSummaryCode += `
/* ${classtitle} [${item.bid}] */
`;
            item.css.walkRules((rule) => {
              rule.selector = rule.selector.replace(
                new RegExp(`\\.${escapeRegExp(classtitle)}(?![\\w-])`, "g"),
                `.${classtitle}[id='${item.bid}']`
              );
            });
            cssSummaryCode += beautifyCss(item.css.toString());
          }
        }
      }
    }
    return cssSummaryCode;
  } catch (e) {
    console.error("[GULP][\uC624\uB958] CSS \uD1B5\uD569 \uC0DD\uC131 \uC2E4\uD328:", e);
    return '@charset "utf-8";\n/* CSS \uC0DD\uC131 \uC624\uB958 */\n';
  }
}
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function processAtRules(firstCss, cssArray, result) {
  firstCss.walkAtRules((atRule) => {
    const params = atRule.params;
    const name = atRule.name;
    let isCommon = true;
    const rulesMap = /* @__PURE__ */ new Map();
    atRule.walkRules((rule) => {
      const selector = rule.selector;
      const declMap = /* @__PURE__ */ new Map();
      rule.walkDecls((decl) => {
        declMap.set(decl.prop, decl.value);
      });
      rulesMap.set(selector, declMap);
    });
    for (let i = 1; i < cssArray.length; i++) {
      let foundAtRule = false;
      cssArray[i].css.walkAtRules(name, (compareAtRule) => {
        if (compareAtRule.params === params) {
          foundAtRule = true;
          rulesMap.forEach((declMap, selector) => {
            let foundRule = false;
            compareAtRule.walkRules((compareRule) => {
              if (compareRule.selector === selector) {
                foundRule = true;
                const commonDecls = new Map(declMap);
                compareRule.walkDecls((decl) => {
                  if (commonDecls.has(decl.prop)) {
                    if (commonDecls.get(decl.prop) !== decl.value) {
                      commonDecls.delete(decl.prop);
                    }
                  }
                });
                declMap.clear();
                commonDecls.forEach((value, prop) => {
                  declMap.set(prop, value);
                });
              }
            });
            if (!foundRule) {
              rulesMap.delete(selector);
            }
          });
        }
      });
      if (!foundAtRule || rulesMap.size === 0) {
        isCommon = false;
        break;
      }
    }
    if (isCommon && rulesMap.size > 0) {
      const commonAtRule = postcss.atRule({ name, params });
      rulesMap.forEach((declMap, selector) => {
        const rule = postcss.rule({ selector });
        declMap.forEach((value, prop) => {
          rule.append(postcss.decl({ prop, value }));
        });
        commonAtRule.append(rule);
      });
      result.common.append(commonAtRule);
      cssArray.forEach((item, index) => {
        item.css.walkAtRules(name, (r) => {
          if (r.params === params) {
            const remainingAtRule = postcss.atRule({ name, params });
            let hasRemaining = false;
            r.walkRules((rule) => {
              const selector = rule.selector;
              const commonDecls = rulesMap.get(selector);
              if (commonDecls) {
                const remainingRule = postcss.rule({ selector });
                rule.walkDecls((decl) => {
                  if (!commonDecls.has(decl.prop) || commonDecls.get(decl.prop) !== decl.value) {
                    remainingRule.append(decl.clone());
                    hasRemaining = true;
                  }
                });
                if (hasRemaining) {
                  remainingAtRule.append(remainingRule);
                }
              }
            });
            if (hasRemaining) {
              result.each[index].css.append(remainingAtRule);
            }
          }
        });
      });
    } else {
      cssArray.forEach((item, index) => {
        item.css.walkAtRules(name, (r) => {
          if (r.params === params) {
            result.each[index].css.append(r.clone());
          }
        });
      });
    }
  });
}
var build = series(clean, cleanWorkspace, buildPreview);
var temha = series(build, serve);
var preview = build;
var servePreview = temha;
var workspace = cleanWorkspace;
var gulpfile_default = build;
export {
  clean,
  cleanWorkspace,
  gulpfile_default as default,
  preview,
  servePreview,
  temha,
  workspace
};
