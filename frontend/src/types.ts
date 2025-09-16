export interface Presentation {
  id_presentation: number;
  id_user: number;
  locale: string;
  headline: string | null;
  content_md: string | null;
  updated_at: string; // ISO datetime
}

export interface Skill {
  id_skill: number;
  name: string;
  category: string | null;
  level: number | null;
}

export interface Project {
  id_project: number;
  id_user: number;
  title: string;
  slug: string;
  short_desc: string | null;
  cover_url: string | null;
  github_url: string | null;
  demo_url: string | null;
  is_featured: 0 | 1;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectImage {
  id_image: number;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
}

export interface ProjectDetail extends Project {
  long_desc: string | null;
  images?: ProjectImage[];
  skills?: Skill[];
}

export interface ProjectsPage {
  data: Project[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Certification {
  id_certification: number;
  id_user: number;
  title: string;
  issuer: string | null;
  issue_date: string | null;   // "YYYY-MM-DD" (ou null)
  expire_date: string | null;  // idem
  credential_id: string | null;
  credential_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CV {
  id_cv: number;
  id_user: number;
  label: string | null;
  locale: string;
  file_url: string;
  is_active: 0 | 1;
  created_at: string;
  updated_at: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  id_message: number;
  status: 'received' | string;
}