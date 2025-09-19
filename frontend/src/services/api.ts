/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "";

async function req<T>(path: string, init: RequestInit = {}): Promise<T> {
  const r = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!r.ok) {
    let info = "";
    try {
      const j = await r.json();
      info = j?.error || j?.message || "";
    } catch {}
    throw new Error(info || `HTTP ${r.status}`);
  }
  // 204 ?
  if (r.status === 204) return undefined as unknown as T;
  return (await r.json()) as T;
}

/** -------- Types partagés -------- */

export type Me = { id_user: number; name: string; email: string } | null;
export type Session = Me;

export type Cv = {
  id_cv: number;
  locale: string | null;
  file_url: string;
  is_active: 0 | 1;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Project = {
  id_project: number;
  title: string;
  slug: string;
  short_desc?: string | null;
  cover_url?: string | null;
  is_featured?: 0 | 1;
  created_at?: string | null;
  // liens éventuels
  github_url?: string | null;
  demo_url?: string | null;
};

export type ProjectDetail = Project & {
  long_desc?: string | null;
  images?: Array<{ id_image: number; image_url: string; alt_text?: string | null }> | null;
  skills?: Array<{ id_skill: number; name: string }> | null;
};

export type Skill = { id_skill: number; name: string; category?: string | null; level?: number | null };
export type Certification = {
  id_certification: number;
  title: string;
  issuer?: string | null;
  issue_date?: string | null;
  credential_url?: string | null;
};

export type Presentation = { locale: string; headline?: string | null; content_md?: string | null };

export type ContactPayload = { name: string; email: string; subject: string; message: string };

/** -------- API -------- */

export const me = () => req<{ user: Me }>("/api/auth/me").then((x) => x.user);

export const login = (p: { email: string; password: string }) =>
  req<{ user: Me }>("/api/auth/login", { method: "POST", body: JSON.stringify(p) });

export const register = (p: { name: string; email: string; password: string }) =>
  req<{ user: Me }>("/api/auth/register", { method: "POST", body: JSON.stringify(p) });

export const logout = () => req<void>("/api/auth/logout", { method: "POST" });

export const updateProfile = (p: { name?: string }) =>
  req<{ user: Me }>("/api/auth/profile", { method: "PUT", body: JSON.stringify(p) });

export const cvs = () => req<Cv[]>("/api/cvs");

export const projects = () => req<Project[]>("/api/projects");

export const projectBySlug = (slug: string) =>
  req<ProjectDetail>(`/api/projects/${encodeURIComponent(slug)}`);

export const skills = () => req<Skill[]>("/api/skills");

export const certifications = () => req<Certification[]>("/api/certifications");

export const presentation = (locale = "fr") =>
  req<Presentation>(`/api/presentation/${encodeURIComponent(locale)}`);

export const sendContact = (p: ContactPayload) =>
  req<{ ok: true }>("/api/contact", { method: "POST", body: JSON.stringify(p) });

/** rendu Markdown côté client (simple) */
export function mdToHtml(md?: string | null): string {
  if (!md) return "";
  return md
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/^\s*$/gm, "")
    .replace(/^(.+)$/gm, "<p>$1</p>");
}
