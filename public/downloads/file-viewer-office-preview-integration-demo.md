# file-viewer 快速集成 Office Preview

本文档适用于已有 file-viewer 或自研文件预览平台的项目。推荐做法是保留现有平台能力，只替换 Office 文件的预览路由。

## 1. 集成边界

原系统继续负责：

- 登录、文件列表、目录、分享和审计；
- 文件读取权限与下载鉴权；
- PDF、图片、视频、文本、压缩包等非 Office 格式；
- 向前端签发短时效预览 ticket。

Office Preview 负责：

- DOC、DOCX、PPT、PPTX、XLS、XLSX、XLSB 解析与渲染；
- 运行许可证校验；
- 对应 Worker、WASM、字体与静态资源加载。

## 2. 推荐部署

```text
https://app.example.com/                   主业务系统
https://app.example.com/office-preview/    Office Preview 静态产物
https://app.example.com/office-files/...   鉴权后的同源文件代理
```

这一路线改造量最小。若使用独立预览域名，还需要同时配置许可证、主应用 `frame-src`、预览站点 `frame-ancestors` 与文件服务 CORS。

## 3. 文件路由

```js
import {
  resolveFileViewerPreview,
  mountResolvedPreview
} from './file-viewer-office-preview-route.js';

let destroyCurrentPreview = null;

export function openFile(file) {
  destroyCurrentPreview?.();

  const route = resolveFileViewerPreview(file, {
    officePreviewEnabled: window.__APP_CONFIG__.officePreviewEnabled,
    officePreviewBaseUrl: '/office-preview/'
  });

  destroyCurrentPreview = mountResolvedPreview(
    document.querySelector('#viewer'),
    route,
    legacyFileViewer
  );
}
```

`file.officePreviewPath` 必须由业务服务端返回，例如：

```json
{
  "name": "项目合同.docx",
  "extension": "docx",
  "officePreviewPath": "/office-files/eyJmaWxlSWQiOiIxMjMifQ"
}
```

## 4. 服务端签发短时路径

```js
app.post('/api/files/:id/preview-ticket', requireLogin, async (req, res) => {
  const file = await files.findById(req.params.id);
  await permissions.assertCanRead(req.user, file);

  const ticket = await previewTickets.issue({
    userId: req.user.id,
    fileId: file.id,
    version: file.version,
    expiresInSeconds: 300
  });

  res.json({
    name: file.name,
    extension: file.extension,
    officePreviewPath: `/office-files/${ticket}`
  });
});
```

ticket 应绑定当前用户、单一文件和不可变版本。不要把对象存储永久地址、内部服务地址或任意用户输入 URL 直接传给预览页。

## 5. 预览容器样式

```css
.office-preview-frame {
  display: block;
  width: 100%;
  height: min(82vh, 960px);
  min-height: 560px;
  border: 0;
  background: #f5f7fa;
}

@media (max-width: 720px) {
  .office-preview-frame {
    height: calc(100dvh - 56px);
    min-height: 480px;
  }
}
```

## 6. 部署文件

完整复制同一次构建生成的目录：

```text
dist/
  index.html
  assets/
  wasm/office-parser-core.wasm
  office-preview-license.json
```

不要只替换入口或某个 JavaScript 分块。许可证文件建议 `Cache-Control: no-store`，带哈希的静态资源可长期缓存，WASM 必须返回 `application/wasm`。

## 7. 回滚

将 Office 分流开关放在只读运行配置中：

```js
window.__APP_CONFIG__ = Object.freeze({
  officePreviewEnabled: true,
  officePreviewBaseUrl: '/office-preview/'
});
```

灰度期间关闭 `officePreviewEnabled` 即可回到旧 Office renderer，其他格式不受影响。

## 8. 验收

使用随附的 `file-viewer-office-preview-checklist.md`，至少完成：

- 七种 Office 后缀的分流验证；
- Word、PowerPoint、Excel 真实文件验证；
- 大 Excel 首屏与连续滚动验证；
- 桌面端、移动端与连续切换文件验证；
- License、WASM、CSP、同源文件代理和控制台检查；
- 灰度开关回滚验证。

需要原生 renderer 级集成时，请使用源码交付包内的实际 API 和适配层，不要根据公开示例猜测内部包名。
