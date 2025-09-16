import { useMutation, useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { api } from '../lib/http'

import type {
  CV,
  Certification,
  ContactPayload,
  ContactResponse,
  Presentation,
  ProjectDetail,
  ProjectsPage,
  Skill
} from '../types'

export function usePresentation(locale: string = 'fr') {
  return useQuery<Presentation[]>({
    queryKey: ['presentations', locale],
    queryFn: async () => {
      const { data } = await api.get<Presentation[]>('/presentations', { params: { locale } })
      return data
    }
  })
}

export function useSkills() {
  return useQuery<Skill[]>({
    queryKey: ['skills'],
    queryFn: async () => (await api.get<Skill[]>('/skills')).data
  })
}

export function useProjects(params: { page?: number; limit?: number; featured?: 0 | 1; search?: string } = {}) {
  const { page = 1, limit = 9, featured, search } = params
  return useQuery<ProjectsPage>({
    queryKey: ['projects', { page, limit, featured, search }],
    queryFn: async () =>
      (await api.get<ProjectsPage>('/projects', { params: { page, limit, featured, search } })).data
  })
}

export function useProjectBySlug(slug: string) {
  return useQuery<ProjectDetail>({
    queryKey: ['project', slug],
    enabled: !!slug,
    queryFn: async () =>
      (await api.get<ProjectDetail>(`/projects/slug/${slug}`, { params: { include: 'images,skills' } })).data
  })
}

export function useCertifications() {
  return useQuery<Certification[]>({
    queryKey: ['certifications'],
    queryFn: async () => (await api.get<Certification[]>('/certifications')).data
  })
}

export function useCVs(active?: boolean) {
  return useQuery<CV[]>({
    queryKey: ['cvs', active],
    queryFn: async () => (await api.get<CV[]>('/cvs', { params: active ? { active: 1 } : {} })).data
  })
}

export function useSendContact() {
  return useMutation<ContactResponse, AxiosError<{ error: string }>, ContactPayload>({
    mutationFn: async (payload) => (await api.post<ContactResponse>('/contact', payload)).data
  })
}
export function usePortfolio() {
  return useQuery<{
    presentation: Presentation[]
    skills: Skill[]
    projects: ProjectsPage
    certifications: Certification[]
    cvs: CV[] | null
  }>({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const [presentation, skills, projects, certifications, cvs] = await Promise.all([ 
        api.get<Presentation[]>('/presentations', { params: { locale: 'fr' } }),
        api.get<Skill[]>('/skills'),
        api.get<ProjectsPage>('/projects', { params: { page: 1, limit: 3, featured: 1 } }),
        api.get<Certification[]>('/certifications'),
        api.get<CV[]>('/cvs', { params: { active: 1 } })
      ])  
      return {
        presentation: presentation.data,
        skills: skills.data,
        projects: projects.data,
        certifications: certifications.data,
        cvs: cvs.data
      }
    }
  })
}