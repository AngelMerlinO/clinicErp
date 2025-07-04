const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * request()
 * @param {string} endpoint  – ej. '/pacientes'
 * @param {object} options   – { method, body, auth, ...custom }
 *   • auth=true  (por defecto)  → añade Authorization
 *   • auth=false               → NO añade Authorization (p. ej. /auth/login)
 */
async function request(endpoint, { method = 'GET', body, auth = true, ...custom } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  // ← Añadimos el token sólo si auth === true
  if (auth) {
    const token = localStorage.getItem('token');
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const config = { method, headers, ...custom };
  if (body) config.body = JSON.stringify(body);

  const res = await fetch(API_BASE + endpoint, config);

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload.message || res.statusText);
  }

  return res.status === 204 ? null : res.json();
}

export const api = {
  get:  (url, opts)          => request(url, opts),
  post: (url, body, opts={}) => request(url, { method: 'POST', body, ...opts }),
  put:  (url, body, opts={}) => request(url, { method: 'PUT',  body, ...opts }),
  del:  (url, opts)          => request(url, { method: 'DELETE', ...opts }),
};
