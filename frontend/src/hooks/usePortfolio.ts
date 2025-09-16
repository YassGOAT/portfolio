import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'

// ⚠️ Avec "verbatimModuleSyntax", les types doivent être importés en type-only
import type { AxiosError } from 'axios'
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

// ✅ plus de "any" : on tape import.meta.env correctement
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: { 'Content-Type': 'application/json' }
})

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
    queryFn: async () => {
      const { data } = await api.get<Skill[]>('/skills')
      return data
    }
  })
}

export function useProjects(params: { page?: number; limit?: number; featured?: 0 | 1; search?: string } = {}) {
  const { page = 1, limit = 9, featured, search } = params
  return useQuery<ProjectsPage>({
    queryKey: ['projects', { page, limit, featured, search }],
    queryFn: async () => {
      const { data } = await api.get<ProjectsPage>('/projects', {
        params: { page, limit, featured, search }
      })
      return data
    }
  })
}

export function useProjectBySlug(slug: string) {
  return useQuery<ProjectDetail>({
    queryKey: ['project', slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data } = await api.get<ProjectDetail>(`/projects/slug/${slug}`, {
        params: { include: 'images,skills' }
      })
      return data
    }
  })
}

export function useCertifications() {
  return useQuery<Certification[]>({
    queryKey: ['certifications'],
    queryFn: async () => {
      const { data } = await api.get<Certification[]>('/certifications')
      return data
    }
  })
}

export function useCVs(active?: boolean) {
  return useQuery<CV[]>({
    queryKey: ['cvs', active],
    queryFn: async () => {
      const { data } = await api.get<CV[]>('/cvs', { params: active ? { active: 1 } : {} })
      return data
    }
  })
}

export function useSendContact() {
  return useMutation<ContactResponse, AxiosError<{ error: string }>, ContactPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post<ContactResponse>('/contact', payload)
      return data
    }
  })
}
