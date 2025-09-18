// src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL;

/* ---------- Types shared across pages ---------- */
export type Cv = {
  id_cv: number;
  id_user: number;
  label: string | null;
  locale: string;
  file_url: string;
  is_active: 0 | 1;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id_project: number;
  title: string;
  slug: string;
  short_desc?: string | null;
  cover_url?: string | null;
  is_featured: 0 | 1;
  created_at: string;
};

export type ProjectDetail = {
  id_project: number;
  title: string;
  slug: string;
  long_desc?: string | null;
  cover_url?: string | null;
  github_url?: string | null;
  demo_url?: string | null;
  images?: Array<{ id_image: number; image_url: string; alt_text?: string | null }>;
  skills?: Array<{ id_skill: number; name: string; category?: string | null; level?: number | null }>;
};

export type Skill = { id_skill: number; name: string; category?: string | null; level?: number | null };

export type Cert = {
  id_certification: number;
  title: string;
  issuer?: string | null;
  issue_date?: string | null;
  credential_url?: string | null;
};

export type Presentation = {
  id_presentation: number;
  locale: string;
  headline?: string | null;
  content_md?: string | null;
};

export type Me = {
  id_user: number;
  name: string;
  email: string;
  role: "admin" | "visitor";
  bio?: string | null;
  photo_url?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  other_links?: any;
};

/* ---------- Tiny helpers ---------- */
async function get<T>(path: string): Promise<T> {
  const r = await fetch(`${API_URL}${path}`, { credentials: "include" });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
async function post<T>(path: string, body: any, opts: RequestInit = {}): Promise<T> {
  const r = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    body: JSON.stringify(body),
    ...opts,
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
async function put<T>(path: string, body: any, opts: RequestInit = {}): Promise<T> {
  const r = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    body: JSON.stringify(body),
    ...opts,
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
async function del<T>(path: string): Promise<T> {
  const r = await fetch(`${API_URL}${path}`, { method: "DELETE", credentials: "include" });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

/* ---------- API surface (typed) ---------- */
export const api = {
  // Auth / profile
  me: () => get<{ user: Me }>("/api/auth/me"),
  login: (email: string, password: string) => post("/api/auth/login", { email, password }),
  register: (name: string, email: string, password: string) =>
    post("/api/auth/register", { name, email, password }),
  logout: () => del("/api/auth/logout"),
  updateProfile: (payload: Partial<Me>) => put("/api/users/me", payload),

  // CVs
  cvs: () => get<Cv[]>("/api/cvs"),
  createCv: (form: FormData) =>
    fetch(`${API_URL}/api/cvs`, { method: "POST", body: form, credentials: "include" }).then(async (r) => {
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    }),
  updateCv: (id: number, form: FormData) =>
    fetch(`${API_URL}/api/cvs/${id}`, { method: "PUT", body: form, credentials: "include" }).then(async (r) => {
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    }),
  deleteCv: (id: number) => del(`/api/cvs/${id}`),
  setActiveCv: (id: number) => post(`/api/cvs/${id}/activate`, {}),

  // Projects
  projects: () => get<Project[]>("/api/projects"),
  projectBySlug: (slug: string) => get<ProjectDetail>(`/api/projects/${slug}`),

  // Skills
  skills: () => get<Skill[]>("/api/skills"),

  // Certifications
  certifications: () => get<Cert[]>("/api/certifications"),

  // Presentations
  presentation: (locale = "fr") => get<Presentation>(`/api/presentations?locale=${locale}`),

  // Contact (include subject)
  sendContact: (data: { name: string; email: string; subject?: string; message: string }) =>
    post("/api/contacts", data),
};

export default api; // <- if you prefer default import
