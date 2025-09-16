import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '../lib/api'

export function usePresentation(locale='fr') {
  return useQuery({
    queryKey: ['presentations', locale],
    queryFn: async () => (await api.get(`/presentations`, { params: { locale } })).data
  })
}

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async () => (await api.get('/skills')).data
  })
}

export function useProjects(params: {page?:number; limit?:number; featured?:0|1; search?:string} = {}) {
  const { page=1, limit=9, featured, search } = params
  return useQuery({
    queryKey: ['projects', {page,limit,featured,search}],
    queryFn: async () => (await api.get('/projects', { params: { page, limit, featured, search } })).data
  })
}

export function useProjectBySlug(slug: string) {
  return useQuery({
    queryKey: ['project', slug],
    enabled: !!slug,
    queryFn: async () => (await api.get(`/projects/slug/${slug}`, { params: { include: 'images,skills' } })).data
  })
}

export function useCertifications() {
  return useQuery({
    queryKey: ['certifications'],
    queryFn: async () => (await api.get('/certifications')).data
  })
}

export function useCVs(active?: boolean) {
  return useQuery({
    queryKey: ['cvs', active],
    queryFn: async () => (await api.get('/cvs', { params: active ? { active: 1 } : {} })).data
  })
}

export function useSendContact() {
  return useMutation({
    mutationFn: async (payload: {name:string; email:string; message:string}) =>
      (await api.post('/contact', payload)).data
  })
}
