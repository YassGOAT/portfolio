// src/services/api.ts
/* ===== Types partagés ===== */
export type Me = {
  id_user: number;
  name: string;
  email: string;
};

export type Cv = {
  id_cv: number;
  locale: string;
  file_url: string;
  is_active: 0 | 1;
  is_public: 0 | 1;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Project = {
  id_project: number;
  title: string;
  slug: string;
  short_desc?: string | null;
  cover_url?: string | null;
  created_at?: string | null;
  // champs utilisés dans Projects.tsx :
  github_url?: string | null;
  demo_url?: string | null;
};

export type Pres = {
  id_presentation: number;
  locale: string;
  headline?: string | null;
  content_md?: string | null;
};

export type Skill = {
  id_skill: number;
  name: string;
  category?: string | null;
  level?: number | null;
};

export type Cert = {
  id_certification: number;
  title: string;
  issuer?: string | null;
  issue_date?: string | null;
  credential_url?: string | null;
};

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

/* ===== util ===== */
async function json<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...init,
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

/* ===== Auth / session ===== */
export async function me(): Promise<Me | null> {
  // l’API renvoie { user: ... } ou { error: ... }
  const data = await json<{ user?: Me } | { error: string }>("/api/me");
  // @ts-ignore
  return (data as any).user ?? null;
}

export async function login(payload: {
  email: string;
  password: string;
}): Promise<Me> {
  const data = await json<{ user: Me }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.user;
}

export async function register(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<Me> {
  const data = await json<{ user: Me }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.user;
}

export async function updateProfile(payload: {
  name?: string;
  email?: string;
  password?: string;
}): Promise<Me> {
  const data = await json<{ user: Me }>("/api/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data.user;
}

/* ===== Ressources ===== */
export const cvs = (): Promise<Cv[]> => json<Cv[]>("/api/cvs");

export const projects = (): Promise<Project[]> =>
  json<Project[]>("/api/projects");

export const projectBySlug = (slug: string): Promise<Project> =>
  json<Project>(`/api/projects/${encodeURIComponent(slug)}`);

export const presentation = (locale = "fr"): Promise<Pres> =>
  json<Pres>(`/api/presentation?locale=${encodeURIComponent(locale)}`);

export const skills = (): Promise<Skill[]> => json<Skill[]>("/api/skills");
export const certifications = (): Promise<Cert[]> =>
  json<Cert[]>("/api/certifications");

export const sendContact = (payload: ContactPayload): Promise<{ ok: true }> =>
  json<{ ok: true }>("/api/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });

/* ===== Petit helper Markdown -> HTML (léger) =====
   suffisant pour du texte simple (titres, gras, italique, liens, lignes).
*/
export function mdToHtml(md?: string | null): string {
  if (!md) return "";
  let html = md;
  html = html.replace(/^### (.*)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.*)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.*)$/gm, "<h1>$1</h1>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, `<a href="$2" target="_blank" rel="noopener">$1</a>`);
  html = html.replace(/\n{2,}/g, "</p><p>");
  html = `<p>${html}</p>`;
  return html;
}

export default {
  me,
  login,
  register,
  updateProfile,
  cvs,
  projects,
  projectBySlug,
  presentation,
  skills,
  certifications,
  sendContact,
  mdToHtml,
};
