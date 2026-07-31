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
  const explicitType = String(file.type || file.ext || '').trim().toLowerCase();
  if (explicitType) return explicitType.replace(/^\./, '');

  const name = String(file.name || file.filename || '');
  const lastDot = name.lastIndexOf('.');
  return lastDot >= 0 ? name.slice(lastDot + 1).toLowerCase() : '';
}

function toPreviewUrl(baseUrl, file, ext) {
  const params = new URLSearchParams({
    file: file.previewUrl || file.url,
    type: ext,
    name: file.name || file.filename || `document.${ext}`,
    preview: ext
  });

  return `${baseUrl.replace(/\/$/, '')}/?${params.toString()}`;
}

export function resolveFileViewerPreview(file, options = {}) {
  const ext = getExtension(file);

  if (!OFFICE_EXTENSIONS.has(ext)) {
    return {
      renderer: 'legacy-file-viewer',
      url: file.legacyPreviewUrl || file.previewUrl || file.url
    };
  }

  return {
    renderer: 'office-preview-js',
    mode: 'iframe',
    url: toPreviewUrl(options.officePreviewBaseUrl || '/office-preview', file, ext)
  };
}

export function encodeFileUrlForSingleEntryMode(fileUrl) {
  const bytes = new TextEncoder().encode(fileUrl);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
