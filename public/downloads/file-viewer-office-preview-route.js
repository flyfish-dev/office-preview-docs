const OFFICE_EXTENSIONS = new Set([
  'doc',
  'docx',
  'ppt',
  'pptx',
  'xls',
  'xlsx',
  'xlsb'
]);

function getExtension(file) {
  const explicitType = [file.extension, file.ext, file.type]
    .map((value) => String(value || '').trim().toLowerCase().replace(/^\./, ''))
    .find((value) => /^[a-z0-9]+$/.test(value));
  if (explicitType) return explicitType;

  const name = String(file.name || file.filename || '');
  const lastDot = name.lastIndexOf('.');
  return lastDot >= 0 ? name.slice(lastDot + 1).toLowerCase() : '';
}

export function createOfficePreviewUrl({ viewerBase, filePath, type, name }) {
  const viewerUrl = new URL(viewerBase, window.location.origin);
  const fileUrl = new URL(filePath, viewerUrl);

  if (fileUrl.origin !== viewerUrl.origin) {
    throw new Error('Office Preview requires a same-origin file URL');
  }

  viewerUrl.search = new URLSearchParams({
    file: fileUrl.pathname + fileUrl.search,
    type,
    name: name || `document.${type}`
  }).toString();
  return viewerUrl.toString();
}

export function resolveFileViewerPreview(file, options = {}) {
  const extension = getExtension(file);
  const officePreviewEnabled = options.officePreviewEnabled !== false;

  if (!officePreviewEnabled || !OFFICE_EXTENSIONS.has(extension)) {
    return {
      renderer: 'legacy-file-viewer',
      file
    };
  }

  if (!file.officePreviewPath) {
    throw new Error('Missing the server-issued officePreviewPath');
  }

  return {
    renderer: 'office-preview-js',
    mode: 'iframe',
    url: createOfficePreviewUrl({
      viewerBase: options.officePreviewBaseUrl || '/office-preview/',
      filePath: file.officePreviewPath,
      type: extension,
      name: file.name || file.filename
    })
  };
}

export function mountResolvedPreview(container, route, legacyViewer) {
  if (route.renderer !== 'office-preview-js') {
    return legacyViewer.mount(container, route.file);
  }

  const frame = document.createElement('iframe');
  frame.className = 'office-preview-frame';
  frame.title = 'Office document preview';
  frame.src = route.url;
  frame.setAttribute('allow', 'clipboard-read; clipboard-write');
  container.replaceChildren(frame);

  return () => {
    frame.src = 'about:blank';
    frame.remove();
  };
}
