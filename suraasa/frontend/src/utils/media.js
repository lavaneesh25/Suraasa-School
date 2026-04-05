export const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://127.0.0.1:8000/api')

const API_ORIGIN = API_BASE.replace(/\/api\/?$/, '')

export function resolveMediaUrl(url) {
  if (!url) return ''
  if (/^(?:https?:|data:|blob:)/i.test(url)) return url
  if (url.startsWith('//')) return window.location.protocol + url
  if (url.startsWith('/uploads/')) return `${API_ORIGIN}${url}`
  if (url.startsWith('/')) return url
  return `${API_ORIGIN}/${url}`
}
