# file-viewer 接入 Office Preview 验收清单

## 基础信息

- 项目名称：
- 主应用 origin：
- 预览页面 origin：
- Office Preview 构建版本：
- 许可证编号：
- 验收日期：

## 路由与权限

- [ ] file-viewer 的登录态、文件权限、下载鉴权和审计保持不变。
- [ ] doc、docx、ppt、pptx、xls、xlsx、xlsb 已分流到 Office Preview。
- [ ] PDF、图片、视频、文本、压缩包和其他格式仍走原 file-viewer。
- [ ] 业务服务端在签发预览 ticket 前校验当前用户的文件读取权限。
- [ ] file 参数最终解析到预览页面自身 origin。
- [ ] ticket 短时有效，并绑定用户、文件和不可变版本。
- [ ] 未授权文件不能通过预览页面绕过业务权限。

## 静态资源与浏览器策略

- [ ] `/office-preview/` 返回应用首页。
- [ ] `office-preview-license.json` 返回正式授权文件且不使用长期缓存。
- [ ] `wasm/office-parser-core.wasm` 返回 200，Content-Type 为 `application/wasm`。
- [ ] JavaScript、CSS、Worker、字体和图片无 404。
- [ ] 当前预览 origin 在 license 授权范围内。
- [ ] 主应用 `frame-src` 与预览站点 `frame-ancestors` 使用一致的精确 origin。
- [ ] 浏览器控制台无授权、CSP、MIME、跨域或混合内容错误。

## 渲染体验

- [ ] Word、PowerPoint、Excel 至少各验证一个真实业务文件。
- [ ] 大 Excel 文件首屏加载、上下滚动和横向滚动流畅。
- [ ] 桌面端 iframe 高度稳定，无页面级横向溢出。
- [ ] 移动端滚动、双指缩放和方向切换可用。
- [ ] 连续切换多个文件后，无残留 iframe、Worker 或明显内存增长。
- [ ] 异常状态提示清晰，不暴露内部地址和完整签名参数。

## 灰度与回滚

- [ ] 生产切换前完成新旧 Office 预览对比。
- [ ] 配置开关可快速切回旧 Office renderer。
- [ ] 上线记录包含源码版本、构建版本、许可证、部署地址和验收证据。
