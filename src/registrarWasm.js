let runtimePromise;

export async function loadRegistrarWasm() {
  if (runtimePromise) {
    return runtimePromise;
  }

  runtimePromise = (async () => {
    await loadScript('/wasm/wasm_exec.js');
    if (!window.Go) {
      throw new Error('WASM runtime 初始化失败');
    }
    const go = new window.Go();
    const response = await fetch('/wasm/office-preview-registrar.wasm', {
      cache: 'force-cache'
    });
    if (!response.ok) {
      throw new Error(`WASM 加载失败: HTTP ${response.status}`);
    }
    const bytes = await response.arrayBuffer();
    const { instance } = await WebAssembly.instantiate(bytes, go.importObject);
    go.run(instance);
    await waitForApi();
    return window.OfficePreviewRegistrarWasm;
  })();

  return runtimePromise;
}

function loadScript(src) {
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('WASM runtime 脚本加载失败'));
    document.head.appendChild(script);
  });
}

async function waitForApi() {
  for (let i = 0; i < 80; i += 1) {
    if (window.OfficePreviewRegistrarWasm) {
      return;
    }
    await new Promise((resolve) => window.setTimeout(resolve, 25));
  }
  throw new Error('本地签发模块启动超时');
}

export function parseWasmResult(raw) {
  const result = JSON.parse(raw);
  if (!result.ok) {
    throw new Error(result.error || '操作失败');
  }
  return result;
}
