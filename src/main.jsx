import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import nginx from 'highlight.js/lib/languages/nginx';
import yaml from 'highlight.js/lib/languages/yaml';
import {
  AlertCircle,
  ArrowUpRight,
  BadgeCheck,
  BookOpenText,
  Boxes,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Code2,
  Copy,
  Download,
  ExternalLink,
  FileArchive,
  FileCheck2,
  FileCode2,
  FileSpreadsheet,
  FileText,
  GitBranch,
  Globe2,
  KeyRound,
  Laptop,
  Layers3,
  LifeBuoy,
  Link2,
  LockKeyhole,
  MonitorCheck,
  Moon,
  PackageCheck,
  PlayCircle,
  Rocket,
  ScrollText,
  Search,
  Save,
  ShieldCheck,
  ShoppingCart,
  Sun,
  TerminalSquare,
  UploadCloud,
  Workflow,
  X
} from 'lucide-react';
import { loadRegistrarWasm, parseWasmResult } from './registrarWasm';
import './styles.css';

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('css', css);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('nginx', nginx);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('yml', yaml);

const codeLanguageAliases = {
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  css: 'css',
  javascript: 'javascript',
  js: 'javascript',
  json: 'json',
  nginx: 'nginx',
  yaml: 'yaml',
  yml: 'yaml'
};

const siteVersion = '2026.08';
const registrarVersion = 'v0.1.4';
const brandAssets = {
  logoDark: '/assets/office-preview-logo-dark.webp',
  logoLight: '/assets/office-preview-logo-light.webp',
  mark: '/assets/office-preview-mark.webp'
};

const navGroups = [
  {
    label: '开始',
    items: [
      { id: 'overview', title: '总览' },
      { id: 'architecture', title: '架构与运行链路' },
      { id: 'editions', title: '版本与交付模式' }
    ]
  },
  {
    label: '开发部署',
    items: [
      { id: 'quickstart', title: '5 分钟接入' },
      { id: 'integration', title: '集成方式与接口' },
      { id: 'file-viewer-migration', title: 'file-viewer 快速集成' },
      { id: 'source-build', title: '源码构建' },
      { id: 'deploy', title: '部署实施' }
    ]
  },
  {
    label: '授权交付',
    items: [
      { id: 'license-model', title: '授权模型' },
      { id: 'local-issuer', title: '本地签发台' },
      { id: 'enterprise-registrar', title: '企业授权工具' },
      { id: 'shop-delivery', title: '自动交付' }
    ]
  },
  {
    label: '验收运维',
    items: [
      { id: 'verification', title: '上线验收' },
      { id: 'troubleshooting', title: '常见问题' },
      { id: 'handover', title: '交付清单' }
    ]
  }
];

const sectionIds = navGroups.flatMap((group) => group.items.map((item) => item.id));

const links = {
  demo: 'https://demo.flyfish.group',
  product: 'https://product.flyfish.group',
  shop: 'https://dev.flyfish.group/shop',
  publicRepo: 'https://github.com/flyfish-dev/office-preview-js',
  registrarRelease: `https://github.com/flyfish-dev/office-preview-enterprise-registrar/releases/tag/${registrarVersion}`
};

const featureRows = [
  ['doc', '.doc', 'Word 97-2003 文档'],
  ['docx', '.docx', 'Word Open XML 文档'],
  ['ppt', '.ppt', 'PowerPoint 97-2003 演示文稿'],
  ['pptx', '.pptx', 'PowerPoint Open XML 演示文稿'],
  ['xls', '.xls', 'Excel 97-2003 工作簿'],
  ['xlsx', '.xlsx', 'Excel Open XML 工作簿'],
  ['xlsb', '.xlsb', 'Excel Binary Workbook'],
  ['virtual-excel', '大表能力', '海量单元格虚拟滚动与视窗加载']
];

const editionRows = [
  {
    edition: '免费体验',
    audience: '售前评估、本地验证',
    repos: 'flyfish-dev/office-preview-js 公开静态产物',
    license: '仅演示域名与本地验证',
    delivery: '不含源码，不授予商业部署权'
  },
  {
    edition: '个人版',
    audience: '个人学习、非商业验证',
    repos: '按订单开通单 viewer 或综合源码仓',
    license: 'runtime license，commercialUse=false',
    delivery: '适用于个人学习和非商业评估'
  },
  {
    edition: '商业版',
    audience: '单项目商业部署',
    repos: '合同内 viewer 源码仓和必要 demo 仓',
    license: 'office-preview-license-v2，绑定域名和功能',
    delivery: '默认单域名单部署，按合同扩展'
  },
  {
    edition: '企业版',
    audience: '集团、多项目、私有化交付',
    repos: '综合 demo、viewer 源码仓、企业注册机 release 仓',
    license: '运行授权或 registrar grant',
    delivery: '可受限分发子授权，额度和域名受 grant 约束'
  }
];

const repoRows = [
  ['office-preview-js', 'Public', '免费体验与本地验证静态产物，不含源码'],
  ['office-render-demo', 'Private', '综合 demo、样例、license runtime、快捷构建脚本'],
  ['docx-viewer', 'Private', 'DOCX viewer 源码'],
  ['msdoc-viewer', 'Private', 'DOC viewer 源码'],
  ['ppt-viewer', 'Private', 'PPT viewer 源码'],
  ['pptx-viewer', 'Private', 'PPTX viewer 源码'],
  ['excel-viewer', 'Private', 'Excel viewer 源码'],
  ['hucre', '按需开通', 'Excel 底层解析依赖，Excel 源码构建需要'],
  ['office-preview-enterprise-registrar', 'Private', '企业授权工具 release 分发']
];

const customerSteps = [
  {
    title: '准备源码与授权',
    text: '按购买套餐开通 GitHub 仓库；下载或复制订单中发放的 license 文件。'
  },
  {
    title: '放置工作区',
    text: '综合包把各 viewer 仓放在同一父目录；单 viewer 只克隆对应仓库。'
  },
  {
    title: '构建产物',
    text: '先构建 viewer，再构建 demo；构建会检查 license、WASM runtime 和必要资源。'
  },
  {
    title: '部署静态目录',
    text: '把 dist 发布到 Cloudflare Pages、Nginx、对象存储或企业内网静态服务器。'
  },
  {
    title: '上线验收',
    text: '用正式授权域名访问，逐项验证格式、授权范围、WASM 加载和异常提示。'
  }
];

const integrationModes = [
  {
    mode: '独立预览页',
    scene: '已有业务系统，需要最快完成 Office 预览',
    route: '完整部署静态产物，由业务系统以新页或 iframe 打开预览 URL。文件通过预览站点同源地址提供。',
    effort: '低'
  },
  {
    mode: 'file-viewer 路由替换',
    scene: '已有 file-viewer，保留非 Office 预览和平台能力',
    route: '在应用路由层优先识别 Office 后缀，挂载独立预览页；PDF、图片、视频、压缩包继续走原 renderer。',
    effort: '中'
  },
  {
    mode: '源码级原生集成',
    scene: '购买源码，需要统一工具栏、主题和生命周期',
    route: '以 office-render-demo 为集成基线，使用实际交付的 viewer API 建立项目适配层并按格式懒加载。',
    effort: '高'
  }
];

const integrationBoundaries = [
  ['业务系统负责', '文件列表、登录态、下载鉴权、文件 URL 签名、非 Office 格式预览、审计日志。'],
  ['Office Preview JS 负责', 'Office 文件解析、授权校验、WASM 加载、DOC/DOCX/PPT/PPTX/XLS/XLSX/XLSB 渲染。'],
  ['最小接口契约', 'file、type、name；preview 可选。file 必须解析为预览页面自身 origin 下的 HTTP(S) 地址。'],
  ['上线前必须确认', 'license 域名、WASM MIME、父页面 CSP、预览页 frame-ancestors、文件同源代理、真实文件和回滚入口。']
];

const previewParameterRows = [
  ['file', '是', '预览站点同源的文件 URL，可为相对路径。生产建议使用一次性或短时效代理路径。'],
  ['type', '建议', '不带点号的格式，例如 docx、pptx、xlsx。缺省时根据 name 或 URL 推断。'],
  ['name', '建议', '展示文件名，同时作为格式识别兜底，例如 合同审批.docx。'],
  ['preview', '否', '兼容参数，可与 type 相同；新接入以 type 为准。']
];

const deploymentTopologyRows = [
  ['同域同路径', 'https://app.example.com/office-preview/', '改造最少；文件代理、Cookie 与 iframe 策略最容易统一。', '优先推荐'],
  ['独立预览域名', 'https://preview.example.com/', '隔离更清晰；需要同时配置 license、frame-ancestors、主应用 frame-src 与文件服务 CORS。', '企业部署'],
  ['源码直接集成', '业务前端 bundle 内', '适合深度定制；需按交付 API 管理 viewer、Worker、WASM、字体与生命周期。', '源码客户']
];

const fileViewerMigrationSteps = [
  {
    title: '保留现有平台边界',
    text: '保留 file-viewer 的登录态、文件列表、权限、下载、分享、审计以及 PDF、图片、媒体等非 Office renderer。'
  },
  {
    title: '完整部署 Office Preview',
    text: '将正式构建产物完整发布到固定目录，例如 /office-preview/，不要拆分或改写 assets、wasm 的相对结构。'
  },
  {
    title: '提供同源文件代理',
    text: '业务服务在鉴权后返回短时效文件路径，并由预览站点反向代理为同源 URL，例如 /office-files/{ticket}。'
  },
  {
    title: '在应用层分流 Office',
    text: 'doc、docx、ppt、pptx、xls、xlsx、xlsb 优先进入 Office Preview iframe；其他文件继续交给现有 file-viewer。'
  },
  {
    title: '补齐浏览器策略',
    text: '同源嵌入保持 frame-ancestors self；跨域嵌入时精确配置主应用 frame-src 与预览站点 frame-ancestors。'
  },
  {
    title: '灰度验收并保留回滚',
    text: '用格式矩阵和真实业务文件验证后再切生产，保留一个配置开关恢复旧 Office renderer。'
  }
];

const fileViewerAcceptanceItems = [
  '原 file-viewer 的登录态、文件权限、下载鉴权不被绕过。',
  'Office 文件进入 Office Preview JS，非 Office 文件仍走原预览链路。',
  'doc/docx/ppt/pptx/xls/xlsx/xlsb 后缀识别和 MIME 兜底规则一致。',
  'file 参数最终解析到预览站点自身 origin，未把第三方任意 URL 直接交给预览页。',
  'WASM、license、assets、samples 或业务文件路径均返回 200。',
  '桌面端与移动端的 iframe 高度、滚动、触控缩放和错误提示符合业务系统体验。',
  '灰度开关可一键切回旧 Office 预览实现。'
];

const fileViewerDownloadSamples = [
  {
    title: '整合 demo 说明',
    file: 'file-viewer-office-preview-integration-demo.md',
    href: '/downloads/file-viewer-office-preview-integration-demo.md',
    text: '完整说明 file-viewer 接入路径、文件职责和最小代码。'
  },
  {
    title: '路由分流示例',
    file: 'file-viewer-office-preview-route.js',
    href: '/downloads/file-viewer-office-preview-route.js',
    text: '将 Office 后缀分流到 Office Preview JS，其他格式继续走原 file-viewer。'
  },
  {
    title: 'Nginx 子路径示例',
    file: 'file-viewer-office-preview-nginx.conf',
    href: '/downloads/file-viewer-office-preview-nginx.conf',
    text: '静态部署 Office Preview JS，并保留 WASM MIME、缓存和 History fallback。'
  },
  {
    title: 'Docker Compose 示例',
    file: 'file-viewer-office-preview-docker-compose.yml',
    href: '/downloads/file-viewer-office-preview-docker-compose.yml',
    text: '基于历史 Docker 交付方式抽象出的通用本地运行模板。'
  },
  {
    title: '迁移验收清单',
    file: 'file-viewer-office-preview-checklist.md',
    href: '/downloads/file-viewer-office-preview-checklist.md',
    text: '按权限、路由、授权、资源、体验和回滚逐项检查。'
  }
];

const fileViewerCodePaths = [
  [
    '文件类型路由',
    '应用层',
    'Office 后缀优先返回 office-preview，其他类型继续返回原 file-viewer renderer。'
  ],
  [
    '预览容器',
    '业务组件层',
    '以 iframe 挂载独立预览页，销毁或切换文件时同步替换 src，避免多个 viewer 实例残留。'
  ],
  [
    '文件鉴权',
    '业务服务端',
    '校验当前用户与文件权限，生成短时效 ticket；不要把内部存储地址或永久下载地址放进页面参数。'
  ],
  [
    '同源文件代理',
    'Nginx / 网关',
    '将 /office-files/{ticket} 转发到业务下载接口，使 file 参数与预览页面保持同 origin。'
  ],
  [
    '预览静态目录',
    '部署层',
    '完整发布 index.html、assets、wasm、license；WASM 使用 application/wasm。'
  ],
  [
    '浏览器策略',
    '主应用 + 预览站点',
    '精确配置 frame-src、frame-ancestors、connect-src 与字体网关；不要使用宽泛的 * 代替部署清单。'
  ],
  [
    '灰度开关',
    '运行配置',
    '例如 officePreviewEnabled；关闭后回到原 Office renderer，不影响其他格式。'
  ],
  [
    '源码级适配层',
    '可选',
    '只有需要统一工具栏或生命周期时才使用；以实际交付仓 API 为准，不从公开示例猜测包名。'
  ]
];

const fileViewerIntegrationChecklist = [
  '在 file-viewer 应用路由层完成分流，不改它的 core 匹配逻辑。',
  'Office 后缀规则优先于通用二进制或文本兜底 renderer。',
  '业务系统先鉴权，再生成一次性或短时效文件代理 URL。',
  'iframe 只使用固定、受信任的预览基址，不能接受用户传入的任意 runtime 地址。',
  '卸载组件时清空 iframe，切换文件时取消旧请求，避免内存和 Worker 残留。',
  '上线前使用 doc/docx/ppt/pptx/xls/xlsx/xlsb 逐类回归，并加入至少一个大表样例。'
];

const registrarSteps = [
  '飞鱼交付企业分发许可证 office-preview-registrar.lic。',
  '企业客户下载对应平台的闭源注册机 release 包。',
  '企业授权工具读取许可证，按交付范围生成子项目运行授权。',
  '企业为下游项目签发 office-preview-license.json。',
  '子项目部署 runtime license；viewer 在浏览器端完成授权校验。',
  '本地签发记录会保存分发历史；多项目分发建议结合在线签发台统一操作。'
];

const verificationItems = [
  '正式域名能访问应用首页，静态资源无 404。',
  'public/office-preview-license.json 被复制到 dist 根路径并返回 200。',
  'wasm/office-parser-core.wasm 返回 application/wasm 或二进制内容。',
  '购买的 Word、PowerPoint、Excel 格式均可正常预览。',
  '超出授权范围的格式能给出明确提示。',
  '浏览器控制台无授权、WASM、资源 MIME、frame-ancestors 或同源策略错误。',
  '大 Excel 文件滚动平滑，行列宽高、边框、溢出规则符合预期。',
  '私有部署环境已备份 license、构建版本和交付记录。'
];

const troubleshootingRows = [
  ['授权域名不匹配', '当前 location.origin 不在 allowedOrigins 中。', '重新签发包含正式域名的 runtime license 或 registrar grant。'],
  ['WASM 加载失败', '静态服务器 MIME、路径或缓存配置错误。', '确认 wasm/office-parser-core.wasm 存在，并返回二进制内容。'],
  ['iframe 显示空白', '预览页 frame-ancestors 或主应用 frame-src 未允许对方 origin。', '同源部署保持 self；跨域部署时在双方 CSP 中加入精确 origin。'],
  ['文件地址被拒绝', 'file 参数解析到另一个 origin，独立预览页不会读取该地址。', '通过预览域名下的同源代理提供文件，或使用源码交付约定的安全桥接方案。'],
  ['构建找不到 viewer', '源码仓没有放在约定相对目录。', '按 office-workspace 布局克隆 viewer 仓，或调整 package.json file 依赖。'],
  ['Excel 大文件卡死', '未启用 virtual-excel 能力或没有走虚拟滚动渲染。', '确认 license 包含 virtual-excel，并使用最新 excel-viewer 构建。'],
  ['注册机超额', 'grant 的 maxIssuedLicenses 已耗尽。', '联系飞鱼扩容或改用在线签发服务。'],
  ['本地签发记录异常', '浏览器本地记录缺失、损坏或与当前 grant 不一致。', '导入正确备份，或重新使用在线签发台生成新的交付记录。']
];

const handoverItems = [
  ['客户资料', '客户主体、联系人、GitHub 账号、授权域名、合同格式范围。'],
  ['仓库权限', '确认源码仓 read 权限已开通，未赠送未购买 viewer。'],
  ['授权文件', 'runtime license 或 registrar grant 文件、有效期、features、origins。'],
  ['构建记录', '源码 commit、viewer 构建版本、demo 构建版本、部署地址。'],
  ['验收截图', 'Word、PowerPoint、Excel 样例与至少一个客户真实文件。'],
  ['售后边界', '域名变更、额度扩容、注册机补发、license 重新签发流程。']
];

const defaultIssuerForm = {
  holder: '',
  origins: '',
  maxDeployments: '1',
  validDays: '',
  licenseId: ''
};

function LocalIssuer() {
  const [api, setApi] = useState(null);
  const [apiStatus, setApiStatus] = useState('loading');
  const [apiError, setApiError] = useState('');
  const [grantText, setGrantText] = useState('');
  const [grantFileName, setGrantFileName] = useState('');
  const [grantInfo, setGrantInfo] = useState(null);
  const [ledgerText, setLedgerText] = useState('');
  const [ledgerInfo, setLedgerInfo] = useState(null);
  const [form, setForm] = useState(defaultIssuerForm);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [licenseText, setLicenseText] = useState('');
  const [issuePayload, setIssuePayload] = useState(null);
  const [issuerError, setIssuerError] = useState('');
  const [issuerMessage, setIssuerMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    loadRegistrarWasm()
      .then((loadedApi) => {
        if (!alive) return;
        setApi(loadedApi);
        setApiStatus('ready');
      })
      .catch((error) => {
        if (!alive) return;
        setApiStatus('error');
        setApiError(error.message || String(error));
      });
    return () => {
      alive = false;
    };
  }, []);

  async function handleGrantFile(file) {
    if (!file || !api) return;
    setIssuerError('');
    setIssuerMessage('');
    setLicenseText('');
    setIssuePayload(null);
    try {
      const text = await readFile(file);
      const info = parseWasmResult(api.inspectGrant(text));
      const storageKey = getLedgerKey(info.grantId);
      const savedLedger = window.localStorage.getItem(storageKey);
      const activeLedger = savedLedger || parseWasmResult(api.emptyLedger()).ledger;
      const activeLedgerInfo = parseWasmResult(api.inspectLedger(text, activeLedger));
      setGrantText(text);
      setGrantFileName(file.name);
      setGrantInfo(info);
      setLedgerText(activeLedger);
      setLedgerInfo(activeLedgerInfo);
      setSelectedFeatures(info.features || []);
      setForm(defaultIssuerForm);
      setIssuerMessage(savedLedger ? '已加载本机保存的签发记录。' : '企业分发许可证已加载。');
    } catch (error) {
      setGrantText('');
      setGrantInfo(null);
      setLedgerText('');
      setLedgerInfo(null);
      setSelectedFeatures([]);
      setIssuerError(toFriendlyError(error));
    }
  }

  async function handleLedgerFile(file) {
    if (!file || !api || !grantText || !grantInfo) return;
    setIssuerError('');
    setIssuerMessage('');
    try {
      const text = await readFile(file);
      const info = parseWasmResult(api.inspectLedger(grantText, text));
      setLedgerText(text);
      setLedgerInfo(info);
      window.localStorage.setItem(getLedgerKey(grantInfo.grantId), text);
      setIssuerMessage('签发记录已导入并保存到本机浏览器。');
    } catch (error) {
      setIssuerError(toFriendlyError(error));
    }
  }

  async function issueLicense() {
    if (!api || !grantText || !grantInfo) {
      setIssuerError('请先上传企业分发许可证。');
      return;
    }
    setBusy(true);
    setIssuerError('');
    setIssuerMessage('');
    try {
      const request = {
        grant: grantText,
        ledger: ledgerText,
        holder: form.holder,
        origins: splitInput(form.origins),
        features: selectedFeatures,
        maxDeployments: Number(form.maxDeployments || 1),
        validDays: Number(form.validDays || 0),
        licenseId: form.licenseId.trim()
      };
      const result = parseWasmResult(api.issue(JSON.stringify(request)));
      const nextLedgerInfo = parseWasmResult(api.inspectLedger(grantText, result.ledger));
      setLicenseText(result.license);
      setIssuePayload(result.payload);
      setLedgerText(result.ledger);
      setLedgerInfo(nextLedgerInfo);
      window.localStorage.setItem(getLedgerKey(grantInfo.grantId), result.ledger);
      setIssuerMessage('运行授权已生成，可下载并放入 viewer 应用。');
    } catch (error) {
      setIssuerError(toFriendlyError(error));
    } finally {
      setBusy(false);
    }
  }

  function toggleFeature(feature) {
    setSelectedFeatures((current) => (
      current.includes(feature)
        ? current.filter((item) => item !== feature)
        : [...current, feature]
    ));
  }

  const canIssue = apiStatus === 'ready' && grantInfo && !busy;
  const ledgerUsage = ledgerInfo && grantInfo
    ? `${ledgerInfo.issued} / ${grantInfo.unlimitedIssuedLicenses ? '无限' : grantInfo.maxIssuedLicenses}`
    : '-';

  return (
    <div className="issuer-shell">
      <div className="issuer-status-row">
        <StatusPill state={apiStatus} label={apiStatus === 'ready' ? '本地签发模块已就绪' : apiStatus === 'loading' ? '正在加载本地签发模块' : '本地签发模块加载失败'} />
        <span>文件在浏览器内处理，不需要上传到服务器。</span>
      </div>

      {apiError ? <InlineAlert tone="error" text={apiError} /> : null}

      <div className="issuer-grid">
        <div className="issuer-panel">
          <h3>1. 上传企业分发许可证</h3>
          <p>选择企业版交付中获得的 `office-preview-registrar.lic`。</p>
          <FileDrop
            icon={UploadCloud}
            label={grantFileName || '选择 office-preview-registrar.lic'}
            accept=".lic,.json,application/json,text/plain"
            disabled={!api}
            onFile={handleGrantFile}
          />

          {grantInfo ? (
            <div className="grant-summary">
              <SummaryItem label="客户" value={grantInfo.holder || '-'} />
              <SummaryItem label="Grant ID" value={grantInfo.grantId} />
              <SummaryItem label="可签发数" value={ledgerUsage} />
              <SummaryItem label="域名范围" value={formatOriginScope(grantInfo.allowedOrigins)} />
              <SummaryItem label="单授权域名数" value={grantInfo.maxOriginsPerLicense} />
              <SummaryItem label="单授权部署数" value={grantInfo.maxDeploymentsPerLicense} />
              <SummaryItem label="有效期" value={grantInfo.expiresAt || '按授权文件'} />
            </div>
          ) : null}

          <h3>2. 可选：导入签发记录</h3>
          <p>换电脑或换浏览器时，可导入之前导出的记录文件。</p>
          <FileDrop
            icon={FileCheck2}
            label="导入 office-preview-issuer-ledger.json"
            accept=".json,application/json,text/plain"
            disabled={!grantInfo}
            onFile={handleLedgerFile}
          />
        </div>

        <div className="issuer-panel">
          <h3>3. 填写子项目授权</h3>
          <div className="field-grid">
            <label>
              授权对象
              <input
                value={form.holder}
                onChange={(event) => setForm({ ...form, holder: event.target.value })}
                placeholder="例如：客户 A 生产环境"
              />
            </label>
            <label>
              最大部署数
              <input
                type="number"
                min="1"
                value={form.maxDeployments}
                onChange={(event) => setForm({ ...form, maxDeployments: event.target.value })}
              />
            </label>
            <label>
              有效天数
              <input
                type="number"
                min="0"
                value={form.validDays}
                onChange={(event) => setForm({ ...form, validDays: event.target.value })}
                placeholder="留空使用默认值"
              />
            </label>
            <label>
              自定义授权 ID
              <input
                value={form.licenseId}
                onChange={(event) => setForm({ ...form, licenseId: event.target.value })}
                placeholder="可选"
              />
            </label>
          </div>

          <label className="wide-field">
            授权 Origin
            <textarea
              rows={4}
              value={form.origins}
              onChange={(event) => setForm({ ...form, origins: event.target.value })}
              placeholder={'https://app.example.com\nhttps://*.tenant.example.com\nhttp://localhost:*\n*'}
            />
          </label>
          {grantInfo?.allowedOrigins?.includes('*') ? (
            <p className="field-hint">
              当前企业分发许可证允许签发具体域名、端口通配、子域通配、应用容器 Origin 和企业全域 `*`。
            </p>
          ) : null}

          <div className="feature-picker">
            <p>授权功能</p>
            <div>
              {(grantInfo?.features || []).map((feature) => (
                <label key={feature}>
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(feature)}
                    onChange={() => toggleFeature(feature)}
                  />
                  <span>{feature}</span>
                </label>
              ))}
            </div>
          </div>

          <button className="issuer-action" type="button" disabled={!canIssue} onClick={issueLicense}>
            <KeyRound size={18} />
            {busy ? '正在签发...' : '生成运行授权'}
          </button>
        </div>
      </div>

      {issuerError ? <InlineAlert tone="error" text={issuerError} /> : null}
      {issuerMessage ? <InlineAlert tone="success" text={issuerMessage} /> : null}

      {licenseText ? (
        <div className="issuer-result">
          <div>
            <p className="panel-title">生成结果</p>
            <h3>{issuePayload?.licenseId || 'office-preview-license.json'}</h3>
            <p>把运行授权部署为 `public/office-preview-license.json`，再按正式流程构建发布。</p>
          </div>
          <div className="issuer-downloads">
            <button type="button" onClick={() => downloadText('office-preview-license.json', licenseText, 'application/json')}>
              <Download size={17} />
              下载运行授权
            </button>
            <button type="button" onClick={() => downloadText('office-preview-issuer-ledger.json', ledgerText, 'application/json')}>
              <Save size={17} />
              导出签发记录
            </button>
          </div>
          <CodeBlock language="json">{licenseText}</CodeBlock>
        </div>
      ) : null}
    </div>
  );
}

function StatusPill({ state, label }) {
  return (
    <span className={`status-pill ${state}`}>
      {state === 'ready' ? <CheckCircle2 size={15} /> : state === 'error' ? <AlertCircle size={15} /> : <TerminalSquare size={15} />}
      {label}
    </span>
  );
}

function InlineAlert({ tone, text }) {
  return (
    <div className={`inline-alert ${tone}`}>
      {tone === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
      <span>{text}</span>
    </div>
  );
}

function FileDrop({ icon: Icon, label, accept, disabled, onFile }) {
  return (
    <label className={`file-drop ${disabled ? 'disabled' : ''}`}>
      <Icon size={22} />
      <span>{label}</span>
      <input
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={(event) => onFile(event.target.files?.[0])}
      />
    </label>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file);
  });
}

function splitInput(value) {
  return value
    .split(/[\n,，\t]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getLedgerKey(grantId) {
  return `officejs-doc:issuer-ledger:${grantId}`;
}

function formatOriginScope(origins) {
  if (!Array.isArray(origins) || origins.length === 0) return '-';
  return origins.includes('*') ? '企业全域 (*)' : origins.join(', ');
}

function useNearViewport(rootMargin = '900px 0px') {
  const ref = useRef(null);
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    if (isNear) return undefined;
    const element = ref.current;
    if (!element) return undefined;

    if (!('IntersectionObserver' in window)) {
      setIsNear(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsNear(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isNear, rootMargin]);

  return [ref, isNear];
}

function LazyMount({ children, minHeight = 260, label = '内容将在滚动到此处时加载' }) {
  const [ref, isNear] = useNearViewport('1200px 0px');

  return (
    <div ref={ref} className="lazy-mount" style={{ minHeight: isNear ? undefined : minHeight }}>
      {isNear ? children : (
        <div className="lazy-mount-placeholder">
          <TerminalSquare size={18} />
          <span>{label}</span>
        </div>
      )}
    </div>
  );
}

function downloadText(filename, text, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function toFriendlyError(error) {
  const message = String(error?.message || error || '操作失败');
  const lower = message.toLowerCase();

  if (lower.includes('grant content is required') || lower.includes('expected office-preview-registrar-grant-v1')) {
    return '请选择企业分发许可证文件。';
  }
  if (lower.includes('licensekind is not registrar-grant') || lower.includes('runtime-license')) {
    return '当前文件不是企业分发许可证，请选择企业版交付中的分发许可证。';
  }
  if (lower.includes('seal') || lower.includes('verification failed') || lower.includes('unexpected')) {
    return '许可证校验未通过，请确认文件完整且来自正式交付。';
  }
  if (lower.includes('quota exhausted')) {
    return '当前授权额度已用完，请联系管理员处理。';
  }
  if (lower.includes('origin') && (lower.includes('exceeds') || lower.includes('not covered') || lower.includes('not allowed'))) {
    return '输入的域名超出当前授权范围，请检查域名或联系管理员处理。';
  }
  if (lower.includes('feature') && (lower.includes('not covered') || lower.includes('not allowed') || lower.includes('empty'))) {
    return '选择的功能超出当前授权范围，请调整后重试。';
  }
  if (lower.includes('holder is required')) {
    return '请填写授权对象。';
  }
  if (lower.includes('validdays') || lower.includes('outlive') || lower.includes('expired')) {
    return '授权有效期超出当前可用范围，请调整有效天数后重试。';
  }
  if (lower.includes('ledger')) {
    return '签发记录无法读取，请导入正确的记录文件或重新加载企业分发许可证。';
  }

  return message;
}

function App() {
  const [activeId, setActiveId] = useState('overview');
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
  );

  useEffect(() => {
    document.title = 'Office Preview 文档中心';
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'dark' ? '#090d0b' : '#f5f8f6'
    );
    try {
      window.localStorage.setItem('officejs-doc:theme', theme);
    } catch {
      // Theme persistence is optional when storage is unavailable.
    }
  }, [theme]);

  useEffect(() => {
    let frame = 0;

    const updateActiveSection = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const marker = window.innerWidth <= 980 ? 152 : 112;
        const atPageEnd =
          window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
        let nextId = sectionIds[0];

        for (const id of sectionIds) {
          const section = document.getElementById(id);
          if (!section || section.getBoundingClientRect().top > marker) break;
          nextId = id;
        }

        if (atPageEnd) nextId = sectionIds[sectionIds.length - 1];
        setActiveId((current) => (current === nextId ? current : nextId));
      });
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection, { passive: true });
    window.addEventListener('hashchange', updateActiveSection);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
      window.removeEventListener('hashchange', updateActiveSection);
    };
  }, []);

  const filteredNav = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return navGroups;
    return navGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.title.toLowerCase().includes(keyword) || item.id.includes(keyword))
      }))
      .filter((group) => group.items.length);
  }, [query]);

  return (
    <div className="app-shell">
      <TopBar
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
      />
      <MobileNav groups={filteredNav} activeId={activeId} />
      <aside className="side-nav" aria-label="文档目录">
        <a className="brand" href="#overview" aria-label="Office Preview 文档首页">
          <img
            className="brand-logo"
            src={theme === 'dark' ? brandAssets.logoLight : brandAssets.logoDark}
            alt="Office Preview"
            decoding="async"
          />
        </a>

        <label className="nav-search">
          <Search size={16} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索章节"
            aria-label="搜索章节"
          />
          {query ? (
            <button type="button" onClick={() => setQuery('')} aria-label="清空搜索">
              <X size={14} />
            </button>
          ) : null}
        </label>

        <nav>
          {filteredNav.map((group) => (
            <div className="nav-group" key={group.label}>
              <p>{group.label}</p>
              {group.items.map((item) => (
                <a key={item.id} href={`#${item.id}`} className={activeId === item.id ? 'active' : ''}>
                  <ChevronRight size={14} aria-hidden="true" />
                  <span>{item.title}</span>
                </a>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <main className="content">
        <Hero />
        <Section id="overview" kicker="Overview" title="一个交付、授权、实施都可落地的 Office 预览体系">
          <div className="lead-grid">
            <div>
              <p className="lead">
                Office Preview 是一套浏览器端多格式 Office 文档预览方案，覆盖 DOC、DOCX、PPT、PPTX、XLS、XLSX、XLSB
                与大表虚拟滚动。核心交付由 viewer 源码、综合 demo、WASM 授权运行时、license 文件和企业分发工具组成。
              </p>
              <p>
                本文档面向开发、交付、实施、运维和企业客户，完整说明如何开发调试、构建部署、授权发放、开通源码仓库、企业内部分发以及上线验收。
              </p>
            </div>
            <div className="signal-panel">
              <p className="panel-title">当前交付基线</p>
              <ul className="check-list compact">
                <li><CheckCircle2 size={17} />综合 demo: office-render-demo</li>
                <li><CheckCircle2 size={17} />授权格式: office-preview-license-v2</li>
                <li><CheckCircle2 size={17} />企业 grant: office-preview-registrar-grant-v1</li>
                <li><CheckCircle2 size={17} />注册机 release: {registrarVersion}</li>
              </ul>
            </div>
          </div>

          <div className="format-strip" aria-label="支持格式">
            {featureRows.slice(0, 7).map(([feature, ext]) => (
              <span key={feature}>{ext}</span>
            ))}
            <span>大表虚拟滚动</span>
          </div>
        </Section>

        <Section id="architecture" kicker="Architecture" title="架构与运行链路">
          <div className="architecture-grid">
            <div className="architecture-copy">
              <p>
                前端应用加载授权文件和 WASM runtime，按文件类型懒加载对应 viewer。授权运行时负责校验域名、功能范围和部署信息，viewer
                按授权范围完成解析与渲染。
              </p>
              <div className="flow-line">
                {[
                  ['用户文件', FileArchive],
                  ['本地授权校验', ShieldCheck],
                  ['格式解析模型', Code2],
                  ['DOM / Canvas / SVG 渲染', MonitorCheck]
                ].map(([label, Icon]) => (
                  <div className="flow-node" key={label}>
                    <Icon size={22} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <figure className="media-frame">
              <img src="/assets/office-hero-banner.webp" alt="Office Preview 多格式文档预览展示" loading="lazy" decoding="async" />
            </figure>
          </div>

          <div className="cards three">
            <InfoCard icon={Laptop} title="纯前端部署" text="静态资源可部署到 Cloudflare Pages、Nginx、对象存储或企业内网，不依赖后端转换服务。" />
            <InfoCard icon={LockKeyhole} title="本地授权校验" text="运行授权绑定域名、功能、部署数和商业范围，便于客户在合同范围内稳定部署。" />
            <InfoCard icon={Layers3} title="分级源码交付" text="demo 负责集成和样例，viewer 源码按购买范围单独开通，便于按需实施。" />
          </div>
        </Section>

        <Section id="editions" kicker="Editions" title="版本、仓库与交付模式">
          <Table
            columns={['版本', '适用对象', '仓库范围', '授权方式', '交付边界']}
            rows={editionRows.map((row) => [row.edition, row.audience, row.repos, row.license, row.delivery])}
          />

          <h3>仓库分工</h3>
          <Table columns={['仓库', '可见性', '用途']} rows={repoRows} />
        </Section>

        <Section id="quickstart" kicker="Quick Start" title="5 分钟完成第一次接入">
          <p className="lead">
            先选择交付形态，再开始写代码。公开成品用于本地评估；正式项目部署订单交付的构建产物与许可证；购买源码后再使用综合工作区进行二次开发。
          </p>

          <div className="cards three route-cards">
            <InfoCard icon={PlayCircle} title="先看效果" text="运行 office-preview-js 公开成品，验证浏览器、网络和目标文件，不作为生产授权包。" />
            <InfoCard icon={Link2} title="最快接入" text="把正式静态产物部署到 /office-preview/，业务系统通过新页或 iframe 打开预览 URL。" />
            <InfoCard icon={Code2} title="源码集成" text="使用 office-render-demo 和合同内 viewer 仓，建立项目适配层并执行全链路构建。" />
          </div>

          <h3>1. 本地确认成品可运行</h3>
          <CodeBlock language="bash">{`git clone https://github.com/flyfish-dev/office-preview-js.git
cd office-preview-js
python3 -m http.server 5178 --bind 127.0.0.1

# 打开 http://127.0.0.1:5178/ 后上传本地 Office 文件验证`}</CodeBlock>

          <h3>2. 正式项目准备四项内容</h3>
          <Table
            columns={['内容', '部署位置', '验收方式']}
            rows={[
              ['完整静态构建产物', '/office-preview/ 或独立预览域名', 'index.html、assets、wasm 均返回 200'],
              ['office-preview-license.json', '静态产物根目录', '当前预览 origin 在授权范围内'],
              ['同源文件代理', '/office-files/{短时 ticket}', 'file 参数与预览页面 origin 相同'],
              ['浏览器安全策略', '主应用与预览站点响应头', 'iframe 可显示且控制台无 CSP 错误']
            ]}
          />

          <h3>3. 打开第一个业务文件</h3>
          <CodeBlock language="text">{`/office-preview/?file=%2Foffice-files%2FeyJ...&type=docx&name=%E5%90%88%E5%90%8C.docx`}</CodeBlock>
          <p>
            上例中的 <code>file</code> 是预览域名下的相对路径。业务服务应先校验当前用户是否有权读取文件，再生成短时效 ticket；预览页不应收到对象存储永久地址或任意第三方 URL。
          </p>

          <h3>4. 综合源码包工作区</h3>
          <CodeBlock language="text">{`office-workspace/
  office-render-demo/
  docx-viewer/
  msdoc-viewer/
  ppt-viewer/
  pptx-viewer/
  excel-viewer/
  hucre/`}</CodeBlock>

          <CodeBlock language="bash">{`cd office-render-demo
npm --userconfig=/dev/null install
npm --userconfig=/dev/null run build:all
npm --userconfig=/dev/null run preview`}</CodeBlock>
        </Section>

        <Section id="integration" kicker="Integration" title="集成方式、URL 接口与部署拓扑">
          <p className="lead">
            最稳妥的边界是：业务系统负责身份、权限与文件访问，Office Preview 负责授权校验、解析和渲染。两者通过一个固定预览入口和一个短时效同源文件地址连接。
          </p>

          <Table
            columns={['接入方式', '适用场景', '实施路线', '改造量']}
            rows={integrationModes.map((row) => [row.mode, row.scene, row.route, row.effort])}
          />

          <h3>推荐运行链路</h3>
          <div className="flow-line">
            {[
              ['用户请求预览', FileText],
              ['服务端校验权限', ShieldCheck],
              ['签发同源短时路径', Link2],
              ['预览页解析渲染', MonitorCheck]
            ].map(([label, Icon]) => (
              <div className="flow-node" key={label}>
                <Icon size={22} />
                <span>{label}</span>
              </div>
            ))}
          </div>

          <h3>系统边界</h3>
          <Table columns={['范围', '说明']} rows={integrationBoundaries} />

          <h3>部署拓扑怎么选</h3>
          <Table columns={['模式', '示例', '特点', '建议']} rows={deploymentTopologyRows} />

          <h3>预览 URL 参数</h3>
          <Table columns={['参数', '必填', '说明']} rows={previewParameterRows} />

          <h3>统一生成预览地址</h3>
          <CodeBlock language="js">{`const OFFICE_TYPES = new Set(['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'xlsb']);

export function createOfficePreviewUrl({ viewerBase, filePath, type, name }) {
  const normalizedType = String(type || '').replace(/^\\./, '').toLowerCase();
  if (!OFFICE_TYPES.has(normalizedType)) throw new Error('Unsupported Office type');

  const viewerUrl = new URL(viewerBase, window.location.origin);
  const fileUrl = new URL(filePath, viewerUrl);
  if (fileUrl.origin !== viewerUrl.origin) {
    throw new Error('Office Preview requires a same-origin file URL');
  }

  viewerUrl.search = new URLSearchParams({
    file: fileUrl.pathname + fileUrl.search,
    type: normalizedType,
    name: name || \`document.\${normalizedType}\`
  }).toString();
  return viewerUrl.toString();
}`}</CodeBlock>

          <h3>iframe 容器</h3>
          <CodeBlock language="js">{`const iframe = document.createElement('iframe');
iframe.className = 'office-preview-frame';
iframe.title = file.name || 'Office document preview';
iframe.loading = 'eager';
iframe.allow = 'clipboard-read; clipboard-write';
iframe.src = createOfficePreviewUrl({
  viewerBase: '/office-preview/',
  filePath: file.previewPath,
  type: file.extension,
  name: file.name
});
container.replaceChildren(iframe);`}</CodeBlock>

          <CodeBlock language="css">{`.office-preview-frame {
  display: block;
  width: 100%;
  height: min(82vh, 960px);
  min-height: 560px;
  border: 0;
  background: #f5f7fa;
}`}</CodeBlock>

          <div className="notice">
            <ShieldCheck size={20} />
            <p>
              独立预览页会拒绝读取其他 origin 的 file 地址。CORS 放行并不能替代同源要求；请将业务下载接口反向代理到预览站点，或采用正式源码交付中约定的安全桥接方案。
            </p>
          </div>

          <h3>跨域 iframe 的三处配置</h3>
          <Table
            columns={['位置', '必须配置', '示例']}
            rows={[
              ['许可证', '允许预览页面自身 origin', 'https://preview.example.com'],
              ['主应用 CSP', 'frame-src 允许预览 origin', "frame-src 'self' https://preview.example.com"],
              ['预览站点 CSP', 'frame-ancestors 允许主应用 origin', "frame-ancestors 'self' https://app.example.com"]
            ]}
          />
          <p>
            某些企业交付还包含 <code>runtime-config.json</code> 与父子页面消息握手。只有交付包明确提供该文件时才配置 <code>allowedParentOrigins</code>，并使用不带路径的精确 origin；标准独立预览页不需要自行创建这份配置。
          </p>
        </Section>

        <Section id="file-viewer-migration" kicker="Migration" title="file-viewer 快速集成：只替换 Office 路由">
          <p className="lead">
            典型改造方式是“保留 file-viewer 的平台能力，只替换 Office 文件渲染器”。这样改造范围清晰，非 Office
            格式不受影响，出现问题时也能通过配置快速回滚。
          </p>

          <div className="cards three">
            <InfoCard
              icon={FileArchive}
              title="保留原平台"
              text="文件列表、目录、权限、下载、分享、审计和非 Office 格式预览继续由 file-viewer 承担。"
            />
            <InfoCard
              icon={PackageCheck}
              title="替换 Office 路由"
              text="doc、docx、ppt、pptx、xls、xlsx、xlsb 进入 Office Preview JS，避免同时维护两套 Office 渲染。"
            />
            <InfoCard
              icon={ShieldCheck}
              title="统一授权部署"
              text="Office Preview JS 的 license、WASM、assets 独立部署，域名和功能范围按正式授权文件校验。"
            />
          </div>

          <h3>迁移步骤</h3>
          <div className="step-list">
            {fileViewerMigrationSteps.map((step, index) => (
              <div className="step-row" key={step.title}>
                <span>{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>

          <h3>需要改动的边界</h3>
          <p>
            快速路线不修改 file-viewer core，也不把 Office viewer 打进原应用 bundle。只在业务应用层新增一个 Office 分流规则和 iframe 容器，部署与回滚都更容易控制。
          </p>
          <Table columns={['改动项', '所在层', '接入说明']} rows={fileViewerCodePaths} />

          <h3>第一处改动：Office 路由优先分流</h3>
          <CodeBlock language="js">{`const OFFICE_EXTENSIONS = new Set([
  'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'xlsb'
]);

export function resolvePreviewRoute(file, config) {
  const ext = String(file.extension || file.name?.split('.').pop() || '')
    .replace(/^\\./, '')
    .toLowerCase();

  if (!config.officePreviewEnabled || !OFFICE_EXTENSIONS.has(ext)) {
    return { kind: 'legacy', file };
  }

  const url = createOfficePreviewUrl({
    viewerBase: config.officePreviewBaseUrl,
    filePath: file.officePreviewPath,
    type: ext,
    name: file.name
  });
  return { kind: 'office-preview', url, name: file.name };
}`}</CodeBlock>

          <h3>第二处改动：挂载并正确销毁 iframe</h3>
          <CodeBlock language="js">{`export function mountPreview(container, route, legacyViewer) {
  if (route.kind !== 'office-preview') {
    return legacyViewer.mount(container, route.file);
  }

  const frame = document.createElement('iframe');
  frame.className = 'office-preview-frame';
  frame.title = route.name || 'Office document preview';
  frame.src = route.url;
  frame.setAttribute('allow', 'clipboard-read; clipboard-write');
  container.replaceChildren(frame);

  return () => {
    frame.src = 'about:blank';
    frame.remove();
  };
}`}</CodeBlock>

          <h3>第三处改动：服务端签发文件路径</h3>
          <CodeBlock language="js">{`// 伪代码：必须在服务端完成权限校验
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
    officePreviewPath: \`/office-files/\${ticket}\`
  });
});`}</CodeBlock>

          <h3>接入检查点</h3>
          <div className="qa-grid">
            {fileViewerIntegrationChecklist.map((item) => (
              <div className="qa-item" key={item}>
                <Check size={17} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <h3>Nginx：静态预览页与同源文件代理</h3>
          <CodeBlock language="nginx">{`# 将 dist 完整复制到 /srv/www/office-preview/
root /srv/www;

location = /office-preview {
  return 301 /office-preview/;
}

location /office-preview/ {
  try_files $uri $uri/ /office-preview/index.html;
}

location /office-files/ {
  proxy_pass http://file-service/internal/preview/;
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-Proto $scheme;
  proxy_set_header X-Real-IP $remote_addr;
}

location ~* \\.wasm$ {
  types {
    application/wasm wasm;
  }
  default_type application/wasm;
}`}</CodeBlock>

          <h3>Docker 静态运行示例</h3>
          <p>
            历史 Docker 镜像交付中的核心思路可以复用为通用部署模板：构建产物仍是静态目录，容器只负责提供 Nginx
            访问、WASM MIME、缓存策略和入口回退。
          </p>
          <CodeBlock language="yaml">{`services:
  office-preview:
    image: nginx:1.27-alpine
    ports:
      - "8080:80"
    volumes:
      - ./dist:/usr/share/nginx/html:ro
      - ./file-viewer-office-preview-nginx.conf:/etc/nginx/conf.d/default.conf:ro`}</CodeBlock>

          <h3>示例文件下载</h3>
          <SampleDownloads items={fileViewerDownloadSamples} />

          <div className="notice">
            <Code2 size={20} />
            <p>
              需要把 Office viewer 直接注册为 file-viewer 原生 renderer 时，请使用源码交付包内的实际适配层和 API 文档。公开文档不写死内部包名，避免版本升级后客户复制过期接口。
            </p>
          </div>

          <h3>验收清单</h3>
          <div className="qa-grid">
            {fileViewerAcceptanceItems.map((item) => (
              <div className="qa-item" key={item}>
                <Check size={17} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="notice warn">
            <AlertCircle size={20} />
            <p>
              不建议在 file-viewer 中继续维护旧 Office 渲染逻辑和新 Office Preview JS 的双实现。灰度期保留回滚开关即可，生产稳定后应收敛到一条 Office 预览链路。
            </p>
          </div>
        </Section>

        <Section id="source-build" kicker="Build" title="源码构建规则">
          <div className="cards two">
            <InfoCard
              icon={PackageCheck}
              title="综合 demo 构建"
              text="适合购买 Office 综合预览或企业版客户。demo 会通过相对路径构建合同内 viewer，并统一加载 license 与 WASM runtime。"
            />
            <InfoCard
              icon={FileCode2}
              title="单 viewer 构建"
              text="适合只购买 DOCX、DOC、PPT、PPTX 或 Excel 的项目。单 viewer 商品只开通对应源码仓和对应 feature。"
            />
          </div>

          <h3>单 viewer 示例</h3>
          <CodeBlock language="bash">{`# DOCX Viewer
cd docx-viewer
npm --userconfig=/dev/null install
npm run build

# Excel Viewer 需要 excel-viewer + hucre
cd excel-viewer
npm --userconfig=/dev/null install
npm run build`}</CodeBlock>

          <h3>综合 viewer 全链路构建</h3>
          <CodeBlock language="bash">{`# 各 viewer 与 office-render-demo 必须位于同一父目录
cd office-render-demo
npm --userconfig=/dev/null install
npm --userconfig=/dev/null run build:all

# 只发布构建后的 dist/
npm --userconfig=/dev/null run preview`}</CodeBlock>

          <div className="notice">
            <ShieldCheck size={20} />
            <p>
              构建产物必须包含正式授权文件和 WASM runtime；客户交付包只保留运行、构建和验收所需内容，临时文件和环境配置不进入交付仓。
            </p>
          </div>
        </Section>

        <Section id="deploy" kicker="Deploy" title="部署实施">
          <div className="step-list">
            {customerSteps.map((step, index) => (
              <div className="step-row" key={step.title}>
                <span>{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>

          <h3>部署目录检查</h3>
          <CodeBlock language="text">{`dist/
  index.html
  assets/
  wasm/office-parser-core.wasm
  office-preview-license.json
  samples/              # 可选，生产可替换为业务入口`}</CodeBlock>

          <h3>Cloudflare Pages 部署</h3>
          <CodeBlock language="bash">{`npm run build
npm --userconfig=/dev/null exec --yes --package=wrangler@4.101.0 -- \\
  wrangler pages deploy dist --project-name <your-office-preview-project>`}</CodeBlock>

          <h3>Nginx 最小响应要求</h3>
          <CodeBlock language="nginx">{`types {
  application/wasm wasm;
}

location = /office-preview/office-preview-license.json {
  alias /srv/office-preview/dist/office-preview-license.json;
  add_header Cache-Control "no-store" always;
}

location /office-preview/assets/ {
  alias /srv/office-preview/dist/assets/;
  add_header Cache-Control "public, max-age=31536000, immutable" always;
}`}</CodeBlock>

          <div className="notice warn">
            <AlertCircle size={20} />
            <p>
              不要只替换 index.html 或单个 JavaScript 文件。每次发布应使用同一次构建产生的完整 dist，确保入口、分块、Worker、WASM 与样式哈希一致。
            </p>
          </div>
        </Section>

        <Section id="license-model" kicker="License" title="授权模型">
          <div className="cards two">
            <InfoCard
              icon={KeyRound}
              title="运行授权"
              text="office-preview-license-v2。部署到 public/office-preview-license.json，viewer 在运行时读取并完成授权校验。"
            />
            <InfoCard
              icon={ScrollText}
              title="企业分发许可证"
              text="office-preview-registrar-grant-v1。用于企业授权分发流程，可在正式签名的功能、全域或指定域名、额度和有效期范围内生成企业子项目运行授权。"
            />
          </div>

          <h3>Feature 与格式映射</h3>
          <Table columns={['Feature', '文件类型', '说明']} rows={featureRows} />

          <h3>Origin 规则</h3>
          <Table
            columns={['写法', '说明']}
            rows={[
              ['https://preview.example.com', '精确匹配生产域名'],
              ['http://127.0.0.1:*', '允许本地任意端口，也匹配无端口'],
              ['http://localhost:*', '本地开发任意端口'],
              ['https://*.example.com', '允许根域名及其所有子域名'],
              ['*', '仅企业版可使用；全域企业 grant 可签发全域或任意具体 Origin 子授权'],
              ['app://localhost:*', '桌面或移动容器 origin']
            ]}
          />
        </Section>

        <Section id="local-issuer" kicker="Browser Issuer" title="在线本地签发台">
          <p className="lead">
            企业客户可以在网页中完成许可证分发：选择企业分发许可证，填写子项目域名和功能范围，在浏览器内生成运行授权。
            文件不需要上传到服务器，适合实施现场、售后补发和多项目分发。全域、子域通配和应用容器 Origin
            均以已上传分发许可证中的正式授权范围为准。
          </p>
          <LazyMount minHeight={620} label="本地签发台将在滚动到此处时加载">
            <LocalIssuer />
          </LazyMount>
        </Section>

        <Section id="enterprise-registrar" kicker="Enterprise" title="企业授权分发">
          <p className="lead">
            企业版客户需要给多个下游项目、多个私有化环境或动态租户签发授权时，可以使用企业授权分发工具。分发能力以合同、订单和
            企业分发许可证中的授权范围为准。
          </p>

          <div className="flow-vertical">
            {registrarSteps.map((step, index) => (
              <div className="flow-vertical-item" key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>

          <h3>下载与校验</h3>
          <CodeBlock language="bash">{`# macOS / Linux
shasum -a 256 -c checksums.txt
tar -xzf office-preview-registrar_0.1.4_darwin_arm64.tar.gz
cd office-preview-registrar_0.1.4_darwin_arm64
./office-preview-registrar version

# Windows PowerShell
Expand-Archive .\\office-preview-registrar_0.1.4_windows_amd64.zip
cd .\\office-preview-registrar_0.1.4_windows_amd64
.\\office-preview-registrar.exe version`}</CodeBlock>

          <h3>签发子项目运行授权</h3>
          <CodeBlock language="bash">{`office-preview-registrar inspect-grant --grant office-preview-registrar.lic

office-preview-registrar issue \\
  --grant office-preview-registrar.lic \\
  --holder "客户应用 A" \\
  --origin "https://app.example.com" \\
  --feature docx \\
  --feature xlsx \\
  --max-deployments 1 \\
  --valid-days 365 \\
  --out office-preview-license.json

office-preview-registrar verify --file office-preview-license.json
office-preview-registrar ledger --grant office-preview-registrar.lic`}</CodeBlock>

          <div className="notice warn">
            <LockKeyhole size={20} />
            <p>
              `office-preview-registrar.lic` 用于企业授权分发；生成出的
              `office-preview-license.json` 才是部署到 viewer 应用的运行授权。
            </p>
          </div>
        </Section>

        <Section id="shop-delivery" kicker="Automation" title="飞鱼小铺自动交付流程">
          <div className="delivery-grid">
            {[
              ['订单支付', ShoppingCart],
              ['开通 GitHub 仓库', GitBranch],
              ['签发 license / grant', KeyRound],
              ['写入订单交付记录', ClipboardCheck],
              ['客户构建部署', Rocket]
            ].map(([label, Icon]) => (
              <div className="delivery-node" key={label}>
                <Icon size={22} />
                <span>{label}</span>
              </div>
            ))}
          </div>

          <h3>商品配置原则</h3>
          <ul className="check-list">
            <li><CheckCircle2 size={18} />源码类商品同时勾选“开通源码仓库”和“授权发放”。</li>
            <li><CheckCircle2 size={18} />单 viewer 商品只开通对应源码仓，features 只能包含对应格式。</li>
            <li><CheckCircle2 size={18} />Excel 商品需要同时开通 excel-viewer 和 hucre。</li>
            <li><CheckCircle2 size={18} />企业分发商品按合同额度生成企业分发许可证。</li>
            <li><CheckCircle2 size={18} />公开体验仓只用于演示和本地验证，不承诺源码或商业部署权。</li>
          </ul>

          <h3>授权发放参数模板</h3>
          <CodeBlock language="json">{`{
  "deliveryActions": ["GIT_REPOSITORY_ACCESS", "LICENSE"],
  "licenseDelivery": {
    "licenseKind": "runtime-license",
    "product": "office-preview",
    "edition": "commercial",
    "holder": "客户公司名称",
    "allowedOrigins": ["https://preview.customer.com"],
    "features": ["doc", "docx", "ppt", "pptx", "xls", "xlsx", "xlsb", "virtual-excel"],
    "maxDeployments": 1,
    "commercialUse": true
  }
}`}</CodeBlock>

          <h3>企业分发许可证模板</h3>
          <CodeBlock language="json">{`{
  "deliveryActions": ["GIT_REPOSITORY_ACCESS", "LICENSE"],
  "licenseDelivery": {
    "licenseKind": "registrar-grant",
    "product": "office-preview",
    "edition": "enterprise",
    "holder": "客户公司名称",
    "allowedOrigins": ["*"],
    "features": ["doc", "docx", "ppt", "pptx", "xls", "xlsx", "xlsb", "virtual-excel"],
    "maxIssuedLicenses": 100,
    "maxOriginsPerLicense": 8,
    "maxDeploymentsPerLicense": 8,
    "childValidDays": 365,
    "commercialUse": true
  }
}`}</CodeBlock>
        </Section>

        <Section id="verification" kicker="QA" title="上线验收清单">
          <div className="qa-grid">
            {verificationItems.map((item) => (
              <div className="qa-item" key={item}>
                <Check size={17} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <h3>回归建议</h3>
          <p>
            每次上线应至少覆盖 Word、PowerPoint、Excel 三类真实客户文件和 demo 样例文件。Excel 大文件需要额外验证首屏加载、上下滚动冗余、列宽行高、边框、单元格溢出文字与边框遮挡规则。
          </p>
        </Section>

        <Section id="troubleshooting" kicker="Support" title="常见问题与处理">
          <Table columns={['问题', '常见原因', '处理方式']} rows={troubleshootingRows} />
        </Section>

        <Section id="handover" kicker="Handover" title="交付清单">
          <div className="handover-list">
            {handoverItems.map(([title, text]) => (
              <div className="handover-item" key={title}>
                <BadgeCheck size={20} />
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="final-panel">
            <div>
              <p className="eyebrow">Production Rule</p>
              <h3>交付前必须形成闭环</h3>
              <p>
                仓库权限、license 内容、构建产物、正式域名、真实文件验收、交付记录和售后边界必须一致。任何一项不一致，都先停止交付，修正后重新验收。
              </p>
            </div>
            <a href={links.shop} className="button dark" target="_blank" rel="noreferrer">
              <ShoppingCart size={18} />
              打开飞鱼小铺
            </a>
          </div>
        </Section>
      </main>

      <RightRail />
    </div>
  );
}

function TopBar({ theme, onToggleTheme }) {
  const dark = theme === 'dark';
  const toggleLabel = dark ? '切换到浅色模式' : '切换到深色模式';

  return (
    <header className="top-bar">
      <a
        className="top-link"
        href={links.demo}
        target="_blank"
        rel="noreferrer"
        aria-label="在线 Demo"
        title="在线 Demo"
      >
        <PlayCircle size={17} />
        <span>在线 Demo</span>
      </a>
      <a
        className="top-link"
        href={links.publicRepo}
        target="_blank"
        rel="noreferrer"
        aria-label="免费验证仓"
        title="免费验证仓"
      >
        <FileCode2 size={17} />
        <span>免费验证仓</span>
      </a>
      <a
        className="top-link primary"
        href={links.shop}
        target="_blank"
        rel="noreferrer"
        aria-label="购买与开通"
        title="购买与开通"
      >
        <ShoppingCart size={17} />
        <span>购买与开通</span>
      </a>
      <button
        className="theme-toggle"
        type="button"
        onClick={onToggleTheme}
        aria-label={toggleLabel}
        aria-pressed={dark}
        title={toggleLabel}
      >
        {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
      </button>
    </header>
  );
}

function MobileNav({ groups, activeId }) {
  const detailsRef = useRef(null);

  return (
    <details className="mobile-toc" ref={detailsRef}>
      <summary>
        <BookOpenText size={17} aria-hidden="true" />
        <span>文档导航</span>
        <strong>{groups.flatMap((group) => group.items).find((item) => item.id === activeId)?.title || '总览'}</strong>
      </summary>
      <nav aria-label="移动端文档目录">
        {groups.flatMap((group) => group.items).map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={activeId === item.id ? 'active' : ''}
            onClick={() => detailsRef.current?.removeAttribute('open')}
          >
            {item.title}
          </a>
        ))}
      </nav>
    </details>
  );
}

function Hero() {
  return (
    <section className="doc-hero" id="top">
      <div className="hero-copy">
        <img className="hero-brand-mark" src={brandAssets.mark} alt="" aria-hidden="true" decoding="async" />
        <p className="eyebrow">OFFICE PREVIEW / DELIVERY GUIDE</p>
        <h1>Office Preview 文档中心</h1>
        <p>
          从 5 分钟接入、file-viewer 替换、鉴权文件代理到生产部署与授权交付，按一条可验证的路径把项目真正跑通。
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#quickstart">
            <Rocket size={18} />
            开始接入
          </a>
          <a className="button" href="#enterprise-registrar">
            <KeyRound size={18} />
            企业授权流程
          </a>
        </div>
      </div>
      <div className="hero-status" aria-label="文档状态">
        <span>Docs {siteVersion}</span>
        <span>7 种 Office 格式</span>
        <span>集成、部署、验收一体</span>
      </div>
    </section>
  );
}

function RightRail() {
  return (
    <aside className="right-rail" aria-label="实施速查">
      <div className="rail-card">
        <p className="rail-label">关键文件</p>
        <ul>
          <li><FileText size={15} />office-preview-license.json</li>
          <li><Boxes size={15} />office-parser-core.wasm</li>
          <li><ScrollText size={15} />office-preview-registrar.lic</li>
        </ul>
      </div>

      <div className="rail-card">
        <p className="rail-label">常用入口</p>
        <RailLink href={links.demo} label="在线 Demo" />
        <RailLink href={links.product} label="产品介绍" />
        <RailLink href={links.registrarRelease} label="注册机 Release" />
      </div>

      <div className="rail-card accent">
        <p className="rail-label">交付范围</p>
        <p>交付内容以合同、订单、仓库权限和授权文件为准；客户侧只需关注构建、部署和验收材料。</p>
      </div>
    </aside>
  );
}

function RailLink({ href, label }) {
  return (
    <a className="rail-link" href={href} target="_blank" rel="noreferrer">
      <Link2 size={15} />
      <span>{label}</span>
      <ArrowUpRight size={14} />
    </a>
  );
}

function Section({ id, kicker, title, children }) {
  return (
    <section className="doc-section" id={id}>
      <p className="eyebrow">{kicker}</p>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function InfoCard({ icon: Icon, title, text }) {
  return (
    <article className="info-card">
      <div className="card-icon">
        <Icon size={22} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function Table({ columns, rows }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${row[0]}-${rowIndex}`}>
              {row.map((cell, index) => (
                <td key={`${rowIndex}-${columns[index]}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SampleDownloads({ items }) {
  return (
    <div className="download-grid">
      {items.map((item) => (
        <a className="download-card" href={item.href} download key={item.file}>
          <Download size={20} aria-hidden="true" />
          <div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <span>{item.file}</span>
          </div>
        </a>
      ))}
    </div>
  );
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function highlightCode(code, language) {
  const normalizedLanguage = codeLanguageAliases[String(language || '').toLowerCase()];

  if (!normalizedLanguage || !hljs.getLanguage(normalizedLanguage)) {
    return escapeHtml(code);
  }

  try {
    return hljs.highlight(code, {
      language: normalizedLanguage,
      ignoreIllegals: true
    }).value;
  } catch {
    return escapeHtml(code);
  }
}

function CodeBlock({ children, language }) {
  const [copied, setCopied] = useState(false);
  const code = String(children).trim();
  const [codeBlockRef, shouldHighlight] = useNearViewport('900px 0px');
  const highlightedCode = useMemo(
    () => (shouldHighlight ? highlightCode(code, language) : escapeHtml(code)),
    [code, language, shouldHighlight]
  );

  async function copyCode() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    }
  }

  return (
    <div className="code-block" ref={codeBlockRef}>
      <div className="code-head">
        <span><TerminalSquare size={15} />{language}</span>
        <button type="button" onClick={copyCode}>
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <pre>
        <code
          className={`hljs language-${language || 'text'}`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
