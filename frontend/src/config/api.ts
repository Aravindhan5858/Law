const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

const apiOrigin = configuredApiUrl
  ? (/^https?:\/\//i.test(configuredApiUrl)
      ? configuredApiUrl
      : `https://${configuredApiUrl}`)
      .replace(/\/$/, '')
  : '';

export const API_BASE_URL = apiOrigin.endsWith('/api')
  ? apiOrigin
  : `${apiOrigin}/api`;

export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL?.trim()
  || (apiOrigin ? apiOrigin.replace(/\/api$/, '') : window.location.origin);
