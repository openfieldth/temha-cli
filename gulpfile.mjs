import { deleteAsync as del } from 'del';
import gulp from 'gulp';
import path from 'path';
import fs from 'fs';
import browserSync from 'browser-sync';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';
import postcss from 'postcss';
const { series, watch } = gulp;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workspaceName = fs.existsSync('.temha_session.json')
  ? (() => {
      try {
        const session = JSON.parse(fs.readFileSync('.temha_session.json', 'utf8'));
        return session.member?.name ? `${session.member.name}-workspace` : 'workspace';
      } catch {
        return 'workspace';
      }
    })()
  : 'workspace';

const workspaceDir = path.join(__dirname, `${workspaceName}`);
const staticDir = path.join(__dirname, 'static');

const PROJECT_META_FILE = 'project.json';
const PAGE_META_FILE = 'page.json';
const BLOCK_META_FILE = 'block.json';

function migrateMetaJson(dir, type) {
  const oldPath = path.join(dir, 'meta.json');
  let newPath;
  if (type === 'project') newPath = path.join(dir, PROJECT_META_FILE);
  else if (type === 'page') newPath = path.join(dir, PAGE_META_FILE);
  else if (type === 'block') newPath = path.join(dir, BLOCK_META_FILE);
  else return;
  if (fs.existsSync(oldPath) && !fs.existsSync(newPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`[마이그레이션] meta.json → ${path.basename(newPath)}`);
  }
}

function getAllPages() {
  const projects = fs.readdirSync(workspaceDir)
    .filter(name => fs.existsSync(path.join(workspaceDir, name, PROJECT_META_FILE)));
  let pages = [];
  for (const project of projects) {
    const projectDir = path.join(workspaceDir, project);
    const pageDirs = fs.readdirSync(projectDir)
      .filter(name => fs.existsSync(path.join(projectDir, name, 'block_order.json')));
    for (const page of pageDirs) {
      pages.push({
        project,
        page,
        pageDir: path.join(projectDir, page),
        projectDir
      });
    }
  }
  return pages;
}

function replaceResourcePaths(str) {
  str = str.replace(/(\.\.\/)+resources\//g, '../resources/');
  str = str.replace(/(\.\.\/resources\/)(images|icons|video|css|js)\/\2\//g, '$1$2/');
  str = str.replace(/(\.\.\/resources\/)(images|icons|video|css|js)\/\2\//g, '$1$2/');
  str = str.replace(/\/+\//g, '/');
  str = str.replace(/(\.\.\/resources\/)\.\.\//g, '$1');

  return str;
}

function buildPreview(done) {
  console.log('[GULP][workspaceDir]', workspaceDir);
  if (!fs.existsSync(staticDir)) fs.mkdirSync(staticDir, { recursive: true });

  const dir1List = fs.readdirSync(workspaceDir);
  console.log('[GULP][dir1List]', dir1List);
  const projects = [];
  for (const dir1 of dir1List) {
    const dir1Path = path.join(workspaceDir, dir1);
    let isDir = false;
    let hasProjectJson = false;
    try {
      isDir = fs.lstatSync(dir1Path).isDirectory();
      hasProjectJson = fs.existsSync(path.join(dir1Path, PROJECT_META_FILE));
    } catch (e) {
      console.warn('[GULP][오류]', dir1Path, e.message);
    }
    console.log(`[GULP][폴더] ${dir1} | isDirectory: ${isDir} | project.json: ${hasProjectJson}`);
    if (isDir && hasProjectJson) {
      projects.push(dir1);
    }
  }
  console.log('[GULP][프로젝트 폴더]', projects);
  if (projects.length === 0) {
    console.warn('[GULP][경고] static에 복사할 프로젝트가 없습니다.');
    console.warn('💡 해결 방법: 먼저 `temha pull` 명령어로 프로젝트를 다운로드하세요.');
    done();
    return;
  }
  let allPages = [];
  for (const project of projects) {
    const projectDir = path.join(workspaceDir, project);
    const pageDirs = fs.readdirSync(projectDir)
      .filter(name => fs.existsSync(path.join(projectDir, name, 'block_order.json')));
    let projectPages = [];
    const projectName = project;
    for (const page of pageDirs) {
      const pageDir = path.join(projectDir, page);
      projectPages.push({ project: projectName, page, pageDir, projectDir });
      allPages.push({ project: projectName, page, pageDir, projectDir });
    }
    const pagelistHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${projectName} 페이지 리스트</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css">
</head>
<body>
  <div class="container py-5">
    <header>
      <h1>
        <span>${projectName}</span>
        <small class="text-muted">페이지 리스트</small>
      </h1>
    </header>
    <div class="mt-5">
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">페이지명</th>
            <th scope="col">링크 URL</th>
            <th scope="col">미리보기</th>
          </tr>
        </thead>
        <tbody>
          ${projectPages.map(p => `
          <tr>
            <td>${p.page}</td>
            <td><a href="./${p.page}/${p.page}.html" target="_blank">./${p.page}/${p.page}.html</a></td>
            <td><a href="./${p.page}/${p.page}.html" target="_blank" class="btn btn-outline-primary btn-sm">미리보기</a></td>
          </tr>`).join('')}
        </tbody>
      </table>
      <div class="mt-4">
        <a href="../../index.html">← 프로젝트 리스트로 돌아가기</a>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim();
    const staticProjectDir = path.join(staticDir, '프로젝트', projectName);
    fs.mkdirSync(staticProjectDir, { recursive: true });
    fs.writeFileSync(path.join(staticProjectDir, 'pagelist.html'), pagelistHtml, 'utf8');
  }

  const indexHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>오픈필드 프로젝트 리스트</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css">
  <style>
    body { padding: 2rem; }
    h1 { font-weight: bold; }
    .table { margin-top: 2rem; }
  </style>
</head>
<body>
  <h1>오픈필드 프로젝트 리스트</h1>
  <table class="table table-bordered">
    <thead>
      <tr>
        <th>프로젝트명</th>
        <th>프로젝트 보기</th>
      </tr>
    </thead>
    <tbody>
      ${projects.map(projectName => `
      <tr>
        <td>${projectName}</td>
        <td><a href="./프로젝트/${projectName}/pagelist.html" target="_blank" class="btn btn-primary btn-sm">프로젝트 보기</a></td>
      </tr>`).join('')}
    </tbody>
  </table>
</body>
</html>
  `.trim();
  fs.writeFileSync(path.join(staticDir, 'index.html'), indexHtml, 'utf8');

  for (const { project, page, pageDir, projectDir } of allPages) {
    const staticProjectDir = path.join(staticDir, '프로젝트', project);
    const staticPageDir = path.join(staticProjectDir, page);
    fs.mkdirSync(staticPageDir, { recursive: true });

    const resourceSrc = path.join(projectDir, 'resources');
    const resourceDest = path.join(staticProjectDir, 'resources');
    if (fs.existsSync(resourceSrc)) {
      copyDir(resourceSrc, resourceDest);
    }
    copyCommonResources(staticProjectDir);

    const order = JSON.parse(fs.readFileSync(path.join(pageDir, 'block_order.json'), 'utf8'));
    const blockMap = new Map(); // bid별로 최신 블록 추적
    let html = '';
    let js = '';
    
    for (const { block, section } of order) {
      const safeName = block.replace(/[<>:"/\\|?*]/g, '-');
      const blockDir = path.join(pageDir, section, safeName);
      
      migrateMetaJson(blockDir, 'block');
      const blockMetaPath = path.join(blockDir, BLOCK_META_FILE);
      let blockMeta = {};
      if (fs.existsSync(blockMetaPath)) {
        try {
          blockMeta = JSON.parse(fs.readFileSync(blockMetaPath, 'utf8'));
        } catch (e) {
          console.warn(`[GULP][경고] ${blockMetaPath} 파일 읽기 실패:`, e.message);
        }
      }
      
      const classtitle = blockMeta.name || safeName;
      const bid = blockMeta.bid || blockMeta.id || safeName;
      
      const blockHtmlFile = path.join(blockDir, `${safeName}.html`);
      const blockCssFile = path.join(blockDir, `${safeName}.css`);
      const blockJsFile = path.join(blockDir, `${safeName}.js`);
      const htmlExists = fs.existsSync(blockHtmlFile);
      const cssExists = fs.existsSync(blockCssFile);
      const jsExists = fs.existsSync(blockJsFile);
      
      console.log(`[GULP][블록] ${block} (classtitle: ${classtitle}, bid: ${bid}) → ${blockHtmlFile} | exists: ${htmlExists}`);
      
      if (htmlExists) {
        const content = fs.readFileSync(blockHtmlFile, 'utf8');
        if (!content.trim()) {
          console.warn(`[GULP][경고] ${blockHtmlFile} 파일이 비어있음!`);
        }
        html += '\n' + replaceResourcePaths(content);
      } else {
        console.warn(`[GULP][경고] ${blockHtmlFile} 파일이 존재하지 않음!`);
      }
      
      if (cssExists) {
        const cssCode = fs.readFileSync(blockCssFile, 'utf8');
        const processedCssCode = replaceResourcePaths(cssCode);
        blockMap.set(bid, {
          classtitle,
          bid,
          css: postcss.parse(processedCssCode),
          cssCode: processedCssCode
        });
      }
      
      if (jsExists) {
        js += '\n' + fs.readFileSync(blockJsFile, 'utf8');
      }
    }
    
    if (!html.trim()) {
      console.warn(`[GULP][경고] ${pageDir}의 모든 블록 html이 비어있음!`);
    }
    
    if (blockMap.size > 0) {
      const cssSummaryCode = generateUnifiedStyleCss(blockMap);
      fs.writeFileSync(path.join(staticPageDir, 'style.css'), cssSummaryCode, 'utf8');
    }
    if (js.trim()) fs.writeFileSync(path.join(staticPageDir, 'style.js'), js.trim(), 'utf8');
    const cssDir = path.join(resourceDest, 'css');
    const jsDir = path.join(resourceDest, 'js');
    const cssFiles = fs.existsSync(cssDir) ? fs.readdirSync(cssDir).filter(f => f.endsWith('.css')) : [];
    const jsFiles = fs.existsSync(jsDir) ? fs.readdirSync(jsDir).filter(f => f.endsWith('.js')) : [];
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
  ${cssFiles.map(f => `<link rel="stylesheet" href="../resources/css/${f}" />`).join('\n  ')}
  <link rel="stylesheet" href="./style.css" />
 
</head>
<body>
${html.trim()}
 ${jsFiles.map(f => `<script src="../resources/js/${f}"></script>`).join('\n  ')}
  <script src="./style.js"></script>
</body>
</html>
    `.trim();
    fs.writeFileSync(path.join(staticPageDir, `${page}.html`), headHtml, 'utf8');
  }
  done();
  (async () => {
    try {
      const hideTargets = [
        path.join(staticDir, '.projects'),
        path.join(staticDir, '프로젝트')
      ];
      for (const target of hideTargets) {
        if (fs.existsSync(target)) {
          if (process.platform === 'win32') {
            try {
              const { execSync } = await import('child_process');
              execSync(`attrib +h +s "${target}"`, { stdio: 'pipe' });
            } catch (e) {
              try {
                execSync(`powershell -Command "Set-ItemProperty -Path '${target}' -Name Attributes -Value ([System.IO.FileAttributes]::Hidden -bor [System.IO.FileAttributes]::System)"`, { stdio: 'pipe' });
              } catch (psError) {
              }
            }
          } else {
            try {
              const { execSync } = await import('child_process');
              execSync(`chmod 000 "${target}"`, { stdio: 'pipe' });
            } catch (e) {
            }
          }
        }
      }
    } catch (e) {
    }
  })();
  try {
    const vscodeDir = path.join(__dirname, '.vscode');
    const vscodeSettingsPath = path.join(vscodeDir, 'settings.json');
    if (!fs.existsSync(vscodeDir)) fs.mkdirSync(vscodeDir);
    let settings = {};
    if (fs.existsSync(vscodeSettingsPath)) {
      try {
        settings = JSON.parse(fs.readFileSync(vscodeSettingsPath, 'utf8'));
      } catch {}
    }
    if (!settings['files.exclude']) settings['files.exclude'] = {};
    settings['files.exclude']['**/static/.projects'] = true;
    settings['files.exclude']['**/static/프로젝트'] = true;
    fs.writeFileSync(vscodeSettingsPath, JSON.stringify(settings, null, 2));
    console.log('[GULP] VSCode files.exclude 설정 완료');
  } catch (e) {
    console.warn('[GULP][경고] VSCode files.exclude 자동화 실패:', e.message);
  }
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const file of fs.readdirSync(src)) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    if (fs.lstatSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      if (file.endsWith('.css')) {
        try {
          const cssContent = fs.readFileSync(srcPath, 'utf8');
          const processedCssContent = replaceResourcePaths(cssContent);
          fs.writeFileSync(destPath, processedCssContent, 'utf8');
        } catch (e) {
          console.warn(`[GULP][경고] CSS 파일 처리 실패: ${srcPath} - ${e.message}`);
          fs.copyFileSync(srcPath, destPath);
        }
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

function copyCommonResources(staticProjectDir) {
  const commonResourceDir = path.join(__dirname, 'resources-common');
  const destCssDir = path.join(staticProjectDir, 'resources', 'css');
  const destJsDir = path.join(staticProjectDir, 'resources', 'js');
  const filesToCopy = [
    { src: 'plugin.css', dest: destCssDir },
    { src: 'setting.css', dest: destCssDir },
    { src: 'plugin.js', dest: destJsDir },
    { src: 'setting.js', dest: destJsDir }
  ];
  for (const { src, dest } of filesToCopy) {
    const srcPath = path.join(commonResourceDir, src);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, path.join(dest, src));
    }
  }
}

const bs = browserSync.create();

function clean() {
  return del([`${staticDir}/**`, `!${staticDir}`]);
}
async function cleanWorkspace() {
  try {
    const sessionPath = path.join(__dirname, '.temha_session.json');
    if (!fs.existsSync(sessionPath)) {
      console.log('⚠️  세션 파일이 없습니다. 워크스페이스 정리를 건너뜁니다.');
      return;
    }

    const session = JSON.parse(fs.readFileSync(sessionPath, 'utf8'));
    if (!session.member?.project) {
      console.log('⚠️  세션에 프로젝트 정보가 없습니다. 워크스페이스 정리를 건너뜁니다.');
      return;
    }

    const myProjects = session.member.project;
    const validProjectIds = [...(myProjects.owner || []), ...(myProjects.editor || [])];
    
    if (validProjectIds.length === 0) {
      console.log('📝 소유하고 있는 프로젝트가 없습니다.');
      return;
    }

    console.log(`🔍 워크스페이스 정리 중... (유효한 프로젝트: ${validProjectIds.length}개)`);
    
    if (!fs.existsSync(workspaceDir)) {
      console.log('📁 워크스페이스 폴더가 없습니다.');
      return;
    }

    const localProjectDirs = fs.readdirSync(workspaceDir).filter(name => {
      const dirPath = path.join(workspaceDir, name);
      return fs.lstatSync(dirPath).isDirectory() && fs.existsSync(path.join(dirPath, PROJECT_META_FILE));
    });

    let removedCount = 0;
    for (const dirName of localProjectDirs) {
      const metaPath = path.join(workspaceDir, dirName, PROJECT_META_FILE);
      try {
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        if (meta?.projectId && !validProjectIds.includes(meta.projectId)) {
          console.log(`🗑️  서버에 없는 프로젝트 삭제: ${dirName}`);
          await del([path.join(workspaceDir, dirName)]);
          removedCount++;
        }
      } catch (e) {
        console.warn(`⚠️  프로젝트 메타 파일 읽기 실패: ${dirName} - ${e.message}`);
      }
    }

    if (removedCount > 0) {
      console.log(`✅ 워크스페이스 정리 완료: ${removedCount}개 프로젝트 삭제`);
    } else {
      console.log(`✅ 워크스페이스 정리 완료: 삭제할 프로젝트 없음`);
    }
  } catch (error) {
    console.warn(`⚠️  워크스페이스 정리 중 오류: ${error.message}`);
  }
}
function serve() {
  browserSync.init({
    server: {
      baseDir: staticDir,
    },
    startPath: "index.html",
    port: 3000,
    open: true,
    notify: false,
  });

  function getWatchedFiles(dir, extensions = ['.html', '.css', '.js']) {
    const files = [];
    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        try {
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            if (fs.existsSync(path.join(fullPath, 'block_order.json'))) {
              files.push(path.join(fullPath, 'block_order.json'));
            }
            files.push(...getWatchedFiles(fullPath, extensions));
          } else if (stat.isFile()) {
            const ext = path.extname(item);
            if (extensions.includes(ext)) {
              files.push(fullPath);
            }
          }
        } catch (err) {
          console.warn(`[GULP] 파일 접근 오류 (${fullPath}):`, err.message);
        }
      }
    } catch (err) {
      console.warn(`[GULP] 디렉토리 읽기 오류 (${dir}):`, err.message);
    }
    return files;
  }

  const watchedFiles = getWatchedFiles(workspaceDir);
  console.log(`[GULP] 감시할 파일 수: ${watchedFiles.length}`);

  watch(watchedFiles, { 
    ignoreInitial: false,
    events: ['add', 'change', 'unlink']
  }, series(buildPreview, (done) => {
      console.log('파일 변경 감지됨. 미리보기를 새로고침합니다...');
      browserSync.reload();
      done();
    })
  );
}

function beautifyCss(css) {
  return css.replace(/(\n\s*){2,}/g, '\n').trim();
}
function isEmptyRoot(root) {
  let isEmpty = true;
  root.walkRules(() => { isEmpty = false; return false; });
  root.walkDecls(() => { isEmpty = false; return false; });
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
  const mediaRules = new Map()
  const containerRules = new Map()
  const keyframesRules = new Map()
  const atRuleOrder = []

  const globalRules = new Map()

  root.walkRules((rule) => {
    const parent = rule.parent
    const isInMedia = parent.type === 'atrule' && parent.name === 'media'
    const isInContainer = parent.type === 'atrule' && parent.name === 'container'
    const mediaQuery = isInMedia ? parent.params : null
    const containerQuery = isInContainer ? parent.params : null
    const isInKeyframes = parent.type === 'atrule' && parent.name === 'keyframes'
    const keyframesQuery = isInKeyframes ? parent.params : null
    const selector = rule.selector

    if (isInMedia) {
      if (!mediaRules.has(mediaQuery)) {
        mediaRules.set(mediaQuery, new Map())
        atRuleOrder.push({ type: 'media', params: mediaQuery })
      }
      const selectorMap = mediaRules.get(mediaQuery)
      if (!selectorMap.has(selector)) {
        selectorMap.set(selector, [])
      }
      rule.nodes.forEach(decl => {
        if (decl.type === 'decl') {
          selectorMap.get(selector).push(decl.clone())
        }
      })
    } else if (isInContainer) {
      if (!containerRules.has(containerQuery)) {
        containerRules.set(containerQuery, new Map())
        atRuleOrder.push({ type: 'container', params: containerQuery })
      }
      const selectorMap = containerRules.get(containerQuery)
      if (!selectorMap.has(selector)) {
        selectorMap.set(selector, [])
      }
      rule.nodes.forEach(decl => {
        if (decl.type === 'decl') {
          selectorMap.get(selector).push(decl.clone())
        }
      })
    } else if (isInKeyframes) {
      if (!keyframesRules.has(keyframesQuery)) {
        keyframesRules.set(keyframesQuery, new Map())
        atRuleOrder.push({ type: 'keyframes', params: keyframesQuery })
      }
      const selectorMap2 = keyframesRules.get(keyframesQuery)
      if (!selectorMap2.has(selector)) {
        selectorMap2.set(selector, [])
      }
      rule.nodes.forEach(decl => {
        if (decl.type === 'decl') {
          selectorMap2.get(selector).push(decl.clone())
        }
      })
    } else {
      if (!globalRules.has(selector)) {
        globalRules.set(selector, [])
      }
      rule.nodes.forEach(decl => {
        if (decl.type === 'decl') {
          globalRules.get(selector).push(decl.clone())
        }
      })
    }
  })

  const removeDuplicateDeclarations = (declarations) => {
    const propMap = new Map()
    
    declarations.forEach(decl => {
      const key = `${decl.prop}${decl.important ? '!important' : ''}`
      propMap.set(key, decl)
    })
    
    return Array.from(propMap.values())
  }

  root.walkAtRules('media', atRule => { atRule.remove() })
  root.walkAtRules('container', atRule => { atRule.remove() })
  root.walkAtRules('keyframes', atRule => { atRule.remove() })
  root.walkRules(rule => {
    if (rule.parent.type !== 'atrule') {
      rule.remove()
    }
  })

  globalRules.forEach((declarations, selector) => {
    const uniqueDeclarations = removeDuplicateDeclarations(declarations)
    const rule = postcss.rule({ selector })
    uniqueDeclarations.forEach(decl => {
      rule.append(decl)
    })
    root.append(rule)
  })

  atRuleOrder.forEach(({ type, params }) => {
    if (type === 'keyframes' && keyframesRules.has(params)) {
      const keyframesRule = postcss.atRule({ name: 'keyframes', params })
      const selectorMap2 = keyframesRules.get(params)
      selectorMap2.forEach((declarations, selector) => {
        const uniqueDeclarations = removeDuplicateDeclarations(declarations)
        const rule = postcss.rule({ selector })
        uniqueDeclarations.forEach(decl => {
          rule.append(decl)
        })
        keyframesRule.append(rule)
      })
      root.append(keyframesRule)
    } else if (type === 'media' && mediaRules.has(params)) {
      const mediaRule = postcss.atRule({ name: 'media', params })
      const selectorMap = mediaRules.get(params)
      selectorMap.forEach((declarations, selector) => {
        const uniqueDeclarations = removeDuplicateDeclarations(declarations)
        const rule = postcss.rule({ selector })
        uniqueDeclarations.forEach(decl => {
          rule.append(decl)
        })
        mediaRule.append(rule)
      })
      root.append(mediaRule)
    } else if (type === 'container' && containerRules.has(params)) {
      const containerRule = postcss.atRule({ name: 'container', params })
      const selectorMap = containerRules.get(params)
      selectorMap.forEach((declarations, selector) => {
        const uniqueDeclarations = removeDuplicateDeclarations(declarations)
        const rule = postcss.rule({ selector })
        uniqueDeclarations.forEach(decl => {
          rule.append(decl)
        })
        containerRule.append(rule)
      })
      root.append(containerRule)
    }
  })
}
function diffCss(cssArray) {
  if (!Array.isArray(cssArray) || cssArray.length === 0) throw new Error('CSS array is required and must not be empty');
  const result = {
    common: postcss.root(),
    each: cssArray.map(item => ({ bid: item.bid, css: postcss.root() }))
  };
  const firstCss = cssArray[0].css;
  processRules(firstCss, cssArray, result);
  processAtRules(firstCss, cssArray, result);
  firstCss.walkAtRules('import', (atRule) => { result.common.prepend(atRule.clone()); });
  return result;
}
function processRules(firstCss, cssArray, result) {
  firstCss.walkRules((rule) => {
    if (rule.parent.type === 'atrule') return;
    const selector = rule.selector;
    let isCommon = true;
    const declMap = new Map();
    rule.walkDecls((decl) => {
      declMap.set(decl.prop, { value: decl.value, important: decl.important });
    });
    for (let i = 1; i < cssArray.length; i++) {
      let found = false;
      let matchingRule = null;
      cssArray[i].css.walkRules((compareRule) => {
        if (compareRule.parent.type === 'atrule') return;
        if (compareRule.selector === selector) {
          found = true;
          matchingRule = compareRule;
          return false;
        }
      });
      if (!found) { isCommon = false; break; }
      const commonDecls = new Map(declMap);
      matchingRule.walkDecls((decl) => {
        const prev = commonDecls.get(decl.prop);
        if (!prev || prev.value !== decl.value || prev.important !== decl.important) {
          commonDecls.delete(decl.prop);
        }
      });
      declMap.clear();
      commonDecls.forEach((value, prop) => { declMap.set(prop, value); });
    }
    if (isCommon && declMap.size > 0) {
      const commonRule = postcss.rule({ selector });
      declMap.forEach((obj, prop) => {
        commonRule.append(postcss.decl({ prop, value: obj.value, important: obj.important }));
      });
      result.common.append(commonRule);
      cssArray.forEach((item, index) => {
        item.css.walkRules((r) => {
          if (r.parent.type === 'atrule') return;
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
          if (r.parent.type === 'atrule') return;
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
          bid: bid,
          css: clonedCss,
          cssCode: css.toString()
        });
      } catch (e) {
        console.warn(`[GULP][경고] 블록 ${classtitle}의 CSS 처리 실패:`, e);
      }
    }
    
    let cssSummaryCode = '@charset "utf-8";\n';
    
    for (const [classtitle, blocks] of Object.entries(blockStyle)) {
      const areAllCssIdentical = checkIfAllCssIdentical(blocks);
      
      if (areAllCssIdentical && blocks.length > 0) {
        cssSummaryCode += `\n/* ${classtitle} */\n`;
        cssSummaryCode += beautifyCss(blocks[0].css.toString());
      } else {
        const diffResult = diffCss(blocks);
        cssSummaryCode += `\n/* ${classtitle} */\n`;
        cssSummaryCode += beautifyCss(diffResult.common.toString());
        
        for (const item of diffResult.each) {
          if (!isEmptyRoot(item.css)) {
            cssSummaryCode += `\n/* ${classtitle} [${item.bid}] */\n`;
            
            item.css.walkRules(rule => {
              rule.selector = rule.selector.replace(
                new RegExp(`\\.${escapeRegExp(classtitle)}(?![\\w-])`, 'g'),
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
    console.error('[GULP][오류] CSS 통합 생성 실패:', e);
    return '@charset "utf-8";\n/* CSS 생성 오류 */\n';
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function processAtRules(firstCss, cssArray, result) {
  firstCss.walkAtRules((atRule) => {
    const params = atRule.params;
    const name = atRule.name;
    let isCommon = true;
    const rulesMap = new Map();
    atRule.walkRules((rule) => {
      const selector = rule.selector;
      const declMap = new Map();
      rule.walkDecls((decl) => { declMap.set(decl.prop, decl.value); });
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
                commonDecls.forEach((value, prop) => { declMap.set(prop, value); });
              }
            });
            if (!foundRule) { rulesMap.delete(selector); }
          });
        }
      });
      if (!foundAtRule || rulesMap.size === 0) { isCommon = false; break; }
    }
    if (isCommon && rulesMap.size > 0) {
      const commonAtRule = postcss.atRule({ name, params });
      rulesMap.forEach((declMap, selector) => {
        const rule = postcss.rule({ selector });
        declMap.forEach((value, prop) => { rule.append(postcss.decl({ prop, value })); });
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
                if (hasRemaining) { remainingAtRule.append(remainingRule); }
              }
            });
            if (hasRemaining) { result.each[index].css.append(remainingAtRule); }
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

const build = series(clean, cleanWorkspace, buildPreview);

export { clean, cleanWorkspace };

export const temha = series(build, serve);
export const workspace = cleanWorkspace;
export default build; 