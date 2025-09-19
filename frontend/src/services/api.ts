// src/services/api.ts

/* ---------- Base URL ---------- */
const BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

/* ---------- Types ---------- */
export type Me = { id_user: number; name: string; email: string };

export type Cv = {
  id_cv: number;
  locale: string;
  file_url: string;
  is_active: 0 | 1;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Skill = {
  id_skill: number;
  name: string;
  category?: string | null;
  level?: number | null;
};

export type Certification = {
  id_certification: number;
  title: string;
  issuer?: string | null;
  issue_date?: string | null;    // YYYY-MM-DD (ou null)
  credential_url?: string | null;
};

export type Project = {
  id_project: number;
  title: string;
  slug: string;
  short_desc?: string | null;
  cover_url?: string | null;
  created_at?: string | null;
  is_featured?: 0 | 1;
};

export type ProjectImage = { id_image: number; image_url: string; alt_text?: string | null };

export type ProjectDetail = Project & {
  long_desc?: string | null;
  github_url?: string | null;
  demo_url?: string | null;
  images?: ProjectImage[];
  skills?: Skill[];
};

export type Presentation = {
  id_presentation: number;
  locale: string;
  headline?: string | null;
  content_md?: string | null;
};

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  // si jamais tu utilises un captcha côté back :
  captchaToken?: string;
};

export type OkResponse = { ok: true };

/* ---------- HTTP helper ---------- */
async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/* ---------- FONCTIONS (exports nommés) ---------- */
export async function presentation(locale = "fr") {
  return http<Presentation>(`/api/presentation?locale=${encodeURIComponent(locale)}`);
}

export async function cvs() {
  return http<Cv[]>(`/api/cvs`);
}

export async function skills() {
  return http<Skill[]>(`/api/skills`);
}

export async function certifications() {
  return http<Certification[]>(`/api/certifications`);
}

export async function projects() {
  return http<Project[]>(`/api/projects`);
}

export async function projectBySlug(slug: string) {
  return http<ProjectDetail>(`/api/projects/${encodeURIComponent(slug)}`);
}

export async function me() {
  return http<Me>(`/api/me`);
}

export async function login(payload: { email: string; password: string }) {
  return http<Me>(`/api/login`, { method: "POST", body: JSON.stringify(payload) });
}

export async function register(payload: { name: string; email: string; password: string }) {
  return http<Me>(`/api/register`, { method: "POST", body: JSON.stringify(payload) });
}

export async function updateProfile(payload: { name?: string }) {
  return http<Me>(`/api/profile`, { method: "PUT", body: JSON.stringify(payload) });
}

export async function logout() {
  return http<OkResponse>(`/api/logout`, { method: "POST" });
}

export async function sendContact(payload: ContactPayload) {
  return http<OkResponse>(`/api/contact`, { method: "POST", body: JSON.stringify(payload) });
}

/* ---------- Utilitaire Markdown ---------- */
export function mdToHtml(md?: string | null) {
  if (!md) return "";
  return md
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
}

/* ---------- Export par défaut (compatible import api from …) ---------- */
const api = {
  presentation,
  cvs,
  skills,
  certifications,
  projects,
  projectBySlug,
  me,
  login,
  register,
  updateProfile,
  logout,
  sendContact,
  mdToHtml,
};

export default api;
