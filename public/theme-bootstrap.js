(() => {
  const storageKey = 'officejs-doc:theme';
  let theme = '';

  try {
    theme = window.localStorage.getItem(storageKey) || '';
  } catch {
    // Continue with the system preference when storage is unavailable.
  }

  if (theme !== 'dark' && theme !== 'light') {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
})();
