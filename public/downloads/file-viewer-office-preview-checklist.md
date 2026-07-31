# file-viewer Office Preview JS 接入验收清单

## 基础信息

- 项目名称：
- 部署域名：
- Office Preview JS 版本：
- license 文件版本：
- 验收日期：

## 路由与权限

- [ ] 原 file-viewer 登录态、文件权限、下载鉴权保持不变。
- [ ] doc、docx、ppt、pptx、xls、xlsx、xlsb 已分流到 Office Preview JS。
- [ ] PDF、图片、视频、文本和其他格式仍走原 file-viewer。
- [ ] 文件 URL 使用同源代理或短期签名地址。
- [ ] 未授权文件无法通过预览页绕过业务权限。

## 静态资源

- [ ] `/office-preview/` 返回应用首页。
- [ ] `/office-preview/office-preview-license.json` 返回正式授权文件。
- [ ] `/office-preview/wasm/office-parser-core.wasm` 返回 200。
- [ ] WASM 响应类型为 `application/wasm` 或可被浏览器正确加载的二进制内容。
- [ ] 主要 assets、字体、图片和样例文件无 404。

## 渲染体验

- [ ] Word、PowerPoint、Excel 至少各验证一个真实业务文件。
- [ ] 大 Excel 文件首屏加载、上下滚动和横向滚动流畅。
- [ ] 预览容器高度、滚动条和移动端体验符合业务系统要求。
- [ ] 异常状态提示清晰，不泄露内部实现细节。

## 灰度与回滚

- [ ] 生产切换前已完成灰度环境对比。
- [ ] 配置开关可以快速切回旧 Office 预览实现。
- [ ] 上线记录包含构建版本、license、部署地址和验收截图。
