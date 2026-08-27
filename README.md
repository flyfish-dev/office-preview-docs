<div align="center">
  <img src="public/assets/office-preview-logo-dark.png" alt="Office Preview" width="420">

  # Office Preview Documentation

  [![Website](https://img.shields.io/badge/docs-officejs--doc.pages.dev-167d5a)](https://officejs-doc.pages.dev)
  [![Build](https://github.com/flyfish-dev/office-preview-docs/actions/workflows/ci.yml/badge.svg)](https://github.com/flyfish-dev/office-preview-docs/actions/workflows/ci.yml)
  [![License](https://img.shields.io/badge/license-proprietary-374151)](LICENSE)

  Product documentation, integration guides, deployment references, and the
  browser-local enterprise license issuer for Flyfish Office Preview.

  **English** · [简体中文](README.zh-CN.md)
</div>

## Overview

This repository contains the source for the public Office Preview documentation
site. It covers:

- DOC, DOCX, PPT, PPTX, XLS, XLSX, and XLSB integration;
- standalone viewer and integrated demo builds;
- static hosting, Nginx, Docker, and Cloudflare Pages deployment;
- five-minute static-page integration and migration from an existing `file-viewer` Office implementation;
- authenticated same-origin file proxying, iframe CSP, and rollback guidance;
- runtime licenses and enterprise distribution grants;
- browser-local enterprise child-license issuance;
- production verification, troubleshooting, and delivery checklists.

The browser issuer performs its work locally and requires a valid enterprise
distribution grant. Selecting a grant does not upload that file to a server.

## Online Documentation

[Open the documentation site](https://officejs-doc.pages.dev)

## Local Development

Requirements:

- Node.js 22 or later;
- npm 10 or later.

```bash
npm ci
npm run dev
```

The development server listens on `http://127.0.0.1:5173` by default.

## Production Build

```bash
npm --userconfig=/dev/null run build
```

The static output is written to `dist/`. Source maps are disabled for the
production build.

## Project Structure

```text
src/
  main.jsx              Documentation application and local issuer UI
  registrarWasm.js      Browser WASM loader and API adapter
  styles.css            Responsive documentation styles
public/
  assets/               Brand and product media
  downloads/            Integration examples and checklists
  wasm/                 Browser registrar runtime
scripts/
  verify-docs.mjs       Content, download, and disclosure guard
```

## Cloudflare Pages

The production Pages project is `officejs-doc`.

```bash
npm run deploy:cloudflare
```

Publishing requires authorized Cloudflare credentials in the operator
environment. No credentials are stored in this repository.

## Validation

Before publishing:

```bash
npm ci
npm run build
npm run verify
```

Then verify:

- the homepage and all major sections return successfully;
- desktop and mobile layouts have no page-wide horizontal overflow;
- navigation anchors and the fixed side navigation remain usable;
- code highlighting and downloadable integration examples work;
- the browser issuer loads a valid enterprise grant and issues within its
  signed scope;
- the browser console contains no runtime errors.

## Security And Licensing

This is a public source repository for the documentation website. Publication
does not make the proprietary Office Preview viewers, registrar runtime, or
commercial licensing system open source. See [LICENSE](LICENSE) for terms.

Do not submit customer documents, license files, grants, signing material, or
other confidential information in issues or pull requests.

## Links

- [Documentation](https://officejs-doc.pages.dev)
- [Online demo](https://demo.flyfish.group)
- [Free local verification build](https://github.com/flyfish-dev/office-preview-js)
- [Purchase and delivery](https://dev.flyfish.group/shop)
