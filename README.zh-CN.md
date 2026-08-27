<div align="center">
  <img src="public/assets/office-preview-logo-dark.png" alt="Office Preview" width="420">

  # Office Preview 文档中心

  [![在线文档](https://img.shields.io/badge/docs-officejs--doc.pages.dev-167d5a)](https://officejs-doc.pages.dev)
  [![构建状态](https://github.com/flyfish-dev/office-preview-docs/actions/workflows/ci.yml/badge.svg)](https://github.com/flyfish-dev/office-preview-docs/actions/workflows/ci.yml)
  [![许可证](https://img.shields.io/badge/license-proprietary-374151)](LICENSE)

  Flyfish Office Preview 的产品文档、集成指南、部署参考和企业版浏览器本地签发台。

  [English](README.md) · **简体中文**
</div>

## 项目说明

本仓库是 Office Preview 在线文档站的源码，主要覆盖：

- DOC、DOCX、PPT、PPTX、XLS、XLSX、XLSB 接入；
- 单 Viewer 与综合 Demo 构建；
- 静态托管、Nginx、Docker 和 Cloudflare Pages 部署；
- 5 分钟独立预览页接入与现有 `file-viewer` Office 路由替换；
- 鉴权同源文件代理、iframe CSP 和灰度回滚；
- 运行许可证与企业分发许可证；
- 企业版浏览器本地子许可证签发；
- 生产验收、故障排查和交付清单。

在线签发台仅在浏览器本地执行，并且必须加载有效的企业分发许可证。
选择许可证文件不会把文件上传到服务器。

## 在线文档

[打开 Office Preview 文档中心](https://officejs-doc.pages.dev)

## 本地开发

环境要求：

- Node.js 20 或更高版本；
- npm 10 或更高版本。

```bash
npm ci
npm run dev
```

开发服务器默认监听 `http://127.0.0.1:5173`。

## 生产构建

```bash
npm --userconfig=/dev/null run build
```

静态产物输出到 `dist/`，生产构建默认关闭 Source Map。

## 目录结构

```text
src/
  main.jsx              文档应用和本地签发台界面
  registrarWasm.js      浏览器 WASM 加载和 API 适配
  styles.css            响应式文档样式
public/
  assets/               品牌和产品图片
  downloads/            集成示例与验收清单
  wasm/                 浏览器注册机运行时
scripts/
  verify-docs.mjs       内容、下载物和公开边界校验
```

## Cloudflare Pages

生产 Pages 项目标识为 `officejs-doc`。

```bash
npm run deploy:cloudflare
```

部署需要操作者环境中已配置 Cloudflare 权限。本仓库不保存任何访问凭证。

## 发布验收

发布前执行：

```bash
npm ci
npm run build
npm run verify
```

然后确认：

- 首页和全部主要章节可以正常访问；
- 桌面端和移动端不存在页面级横向溢出；
- 目录锚点和固定侧边导航正常；
- 代码高亮和集成示例下载正常；
- 在线签发台能加载有效企业 grant，并且只能在签名授权范围内签发；
- 浏览器控制台没有运行时错误。

## 安全与授权

这是文档站源码的公开仓库。仓库公开不代表 Office Preview 专有 Viewer、
注册机运行时或商业授权体系转为开源。具体条款请查看 [LICENSE](LICENSE)。

请勿在 Issue 或 Pull Request 中提交客户文档、许可证、企业 grant、签名材料
或其他保密信息。

## 相关链接

- [在线文档](https://officejs-doc.pages.dev)
- [在线 Demo](https://demo.flyfish.group)
- [免费本地验证产物](https://github.com/flyfish-dev/office-preview-js)
- [购买与交付](https://dev.flyfish.group/shop)
