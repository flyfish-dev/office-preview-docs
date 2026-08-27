import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const source = await readFile(path.join(root, 'src/main.jsx'), 'utf8');
const themeBootstrap = await readFile(path.join(root, 'public/theme-bootstrap.js'), 'utf8');
const requiredSections = [
  'overview',
  'architecture',
  'editions',
  'quickstart',
  'integration',
  'file-viewer-migration',
  'source-build',
  'deploy',
  'license-model',
  'local-issuer',
  'enterprise-registrar',
  'shop-delivery',
  'verification',
  'troubleshooting',
  'handover'
];

for (const section of requiredSections) {
  assert(source.includes(`id="${section}"`), `Missing documentation section: ${section}`);
}

for (const phrase of [
  '5 分钟完成第一次接入',
  'file-viewer 快速集成',
  'Office Preview requires a same-origin file URL',
  'allowedParentOrigins',
  'frame-ancestors',
  'build:all'
]) {
  assert(source.includes(phrase), `Missing integration guidance: ${phrase}`);
}

for (const phrase of [
  "document.documentElement.dataset.theme",
  "window.localStorage.setItem('officejs-doc:theme'",
  "window.addEventListener('scroll', updateActiveSection",
  "target.scrollIntoView({ block: 'start' })",
  "window.setTimeout(syncInitialHash, 180)",
  "className=\"theme-toggle\""
]) {
  assert(source.includes(phrase), `Missing navigation or theme behavior: ${phrase}`);
}

assert(
  themeBootstrap.includes("window.matchMedia('(prefers-color-scheme: dark)')"),
  'Theme bootstrap must honor the system preference'
);
assert(
  themeBootstrap.includes("window.localStorage.getItem(storageKey)"),
  'Theme bootstrap must restore the saved preference'
);
await access(path.join(root, 'public/assets/office-preview-logo-light.webp'));
await access(path.join(root, 'public/assets/office-preview-logo-dark.webp'));
if (await exists(path.join(root, 'dist'))) {
  await access(path.join(root, 'dist/theme-bootstrap.js'));
}

for (const staleExample of [
  '@office-preview/docx-viewer',
  '@office-preview/excel-viewer',
  "--project-name officejs-doc`"
]) {
  assert(!source.includes(staleExample), `Stale or unverified example remains: ${staleExample}`);
}

const downloads = [
  'file-viewer-office-preview-route.js',
  'file-viewer-office-preview-nginx.conf',
  'file-viewer-office-preview-docker-compose.yml',
  'file-viewer-office-preview-checklist.md',
  'file-viewer-office-preview-integration-demo.md'
];

for (const file of downloads) {
  await access(path.join(root, 'public/downloads', file));
  if (await exists(path.join(root, 'dist'))) {
    await access(path.join(root, 'dist/downloads', file));
  }
}

const nginx = await readFile(
  path.join(root, 'public/downloads/file-viewer-office-preview-nginx.conf'),
  'utf8'
);
assert(nginx.includes('application/wasm'), 'Nginx example must configure WASM MIME');
assert(
  nginx.includes('/office-preview/office-preview-license.json'),
  'Nginx example must disable caching for the deployed license path'
);
assert(nginx.includes('/office-files/'), 'Nginx example must include the same-origin file proxy');

const publicText = await Promise.all(
  downloads.map((file) => readFile(path.join(root, 'public/downloads', file), 'utf8'))
);
const safetyScan = [source, ...publicText].join('\n');
for (const forbidden of ['cfat_', 'office-preview-wasm-seal-2026-06.secret.json']) {
  assert(!safetyScan.includes(forbidden), `Sensitive marker found in public documentation: ${forbidden}`);
}

console.log(`Documentation verification passed: ${requiredSections.length} sections, ${downloads.length} downloads.`);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}
