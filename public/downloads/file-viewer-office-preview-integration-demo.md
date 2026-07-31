# file-viewer 集成 Office Preview JS 示例

本文档用于指导已有 file-viewer 项目替换 Office 渲染实现。目标是保留 file-viewer 的文件列表、权限、下载、PDF、图片、视频、压缩包等能力，只替换 Office 文件的 renderer。

## 推荐目录

```text
file-viewer/
  apps/<viewer-app>/
    src/
      main.ts
      office-preview-renderer.ts
      office-preview-license.ts
      preview-url.ts
      styles.css
    public/
      office-preview-license.json
      wasm/
        office-parser-core.wasm
    vite.config.ts
    package.json
```

## 改动路径

| 路径 | 说明 |
| --- | --- |
| `apps/<viewer-app>/src/main.ts` | 创建 `mountViewer` 控制器，注册 Office Preview renderer，并继续注册原 PDF、图片、视频、压缩包 renderer。 |
| `apps/<viewer-app>/src/office-preview-renderer.ts` | 新增 Office renderer plugin，声明 Office 后缀和对应 handler。 |
| `apps/<viewer-app>/src/office-preview-license.ts` | 新增授权加载和 WASM 门禁，向各 Office viewer 返回 licenseToken。 |
| `apps/<viewer-app>/src/preview-url.ts` | 解析业务文件 URL，可使用 `?url=<Base64URL>` 或业务系统已有的签名 URL。 |
| `apps/<viewer-app>/src/styles.css` | 增加 Office shell、居中、Excel 高度和移动端样式。 |
| `apps/<viewer-app>/vite.config.ts` | 配置 worker、WASM、viewer 包别名和本地开发 fallback。 |
| `apps/<viewer-app>/public/office-preview-license.json` | 放置正式运行授权。 |
| `apps/<viewer-app>/public/wasm/office-parser-core.wasm` | 放置授权 runtime。 |

## main.ts 最小接入

```ts
import { mountViewer } from '@file-viewer/web';
import { pdfRenderer } from '@file-viewer/renderer-pdf';
import { imageRenderer } from '@file-viewer/renderer-image';
import { officePreviewRenderer } from './office-preview-renderer';
import { resolvePreviewUrl, resolveFilenameFromUrl } from './preview-url';

const viewerElement = document.querySelector<HTMLDivElement>('#viewer');
if (!viewerElement) throw new Error('Missing #viewer');

const controller = mountViewer(viewerElement, {}, {
  fetchFile: fetchRemoteFile,
  onError(error) {
    console.error(error);
  },
});

const rendererPlugins = [
  officePreviewRenderer,
  pdfRenderer,
  imageRenderer,
];

await controller.load({
  url: resolvePreviewUrl(),
  filename: resolveFilenameFromUrl(),
  options: {
    theme: 'light',
    rendererMode: 'replace',
    builtinRenderers: 'none',
    renderers: rendererPlugins,
    toolbar: false,
    search: true,
  },
});

async function fetchRemoteFile({ url, signal }: { url: string; signal?: AbortSignal }) {
  const targetUrl = new URL(url, window.location.href);
  const response = await fetch(targetUrl, {
    signal,
    cache: 'no-store',
    credentials: targetUrl.origin === window.location.origin ? 'include' : 'omit',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.status}`);
  }

  const blob = await response.blob();
  return new File([blob], resolveFilenameFromUrl(response.url), {
    type: blob.type || 'application/octet-stream',
  });
}
```

## Office renderer 要点

1. `definitions` 中声明 Office 后缀，Office renderer 放在 renderer 列表前面。
2. 每个 handler 先调用 `getOfficeViewerLicenseToken(type)`。
3. DOCX/PPTX/Excel 等较重 viewer 使用动态 import。
4. Excel 必须使用 worker 和虚拟滚动参数，避免大文件阻塞 UI 线程。
5. 压缩包内 Office 文件预览时，nested viewer 复用同一组 renderer plugins。

## 运行方式

```bash
pnpm install
pnpm --filter <viewer-app-package-name> build
pnpm --filter <viewer-app-package-name> preview
```

访问示例：

```text
/?url=<Base64URL encoded HTTP(S) file URL>
```

## 验收

- [ ] doc、docx、ppt、pptx、xls、xlsx、xlsb 全部命中 Office Preview renderer。
- [ ] PDF、图片、视频、压缩包仍使用原 file-viewer renderer。
- [ ] `office-preview-license.json` 返回 200。
- [ ] `wasm/office-parser-core.wasm` 返回 200。
- [ ] Excel 大文件滚动流畅。
- [ ] 压缩包内 Office 文件可以正常嵌套预览。
