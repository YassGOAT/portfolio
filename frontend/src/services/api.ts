const API_URL = import.meta.env.VITE_API_URL;

// ==== Helpers ====
async function get<T>(path: string): Promise<T> {
  const r = await fetch(`${API_URL}${path}`, { credentials: 'include' });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

async function post<T>(path: string, body: any, opts: RequestInit = {}): Promise<T> {
  const r = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    body: JSON.stringify(body),
    ...opts
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

async function put<T>(path: string, body: any, opts: RequestInit = {}): Promise<T> {
  const r = await fetch(`${API_URL}${path}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    body: JSON.stringify(body),
    ...opts
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

async function del<T>(path: string): Promise<T> {
  const r = await fetch(`${API_URL}${path}`, { method: 'DELETE', credentials: 'include' });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

// ==== Endpoints ====
export const api = {
  // Auth
  me: () => get<{ user: any }>('/api/auth/me'),
  login: (email: string, password: string) => post('/api/auth/login', { email, password }),
  register: (name: string, email: string, password: string) => post('/api/auth/register', { name, email, password }),
  logout: () => del('/api/auth/logout'),

  // Users
  users: () => get('/api/users'),

  // CVs
  cvs: () => get('/api/cvs'),
  createCv: (form: FormData) =>
    fetch(`${API_URL}/api/cvs`, { method: 'POST', body: form, credentials: 'include' }).then(r => r.json()),
  updateCv: (id: number, form: FormData) =>
    fetch(`${API_URL}/api/cvs/${id}`, { method: 'PUT', body: form, credentials: 'include' }).then(r => r.json()),
  deleteCv: (id: number) => del(`/api/cvs/${id}`),

  // Projects
  projects: () => get('/api/projects'),
  projectBySlug: (slug: string) => get(`/api/projects/${slug}`),

  // Skills
  skills: () => get('/api/skills'),

  // Certifications
  certifications: () => get('/api/certifications'),

  // Presentations
  presentation: (locale: string) => get(`/api/presentations?locale=${locale}`),

  // Contact
  sendContact: (data: { name: string; email: string; message: string }) => post('/api/contacts', data),
};
