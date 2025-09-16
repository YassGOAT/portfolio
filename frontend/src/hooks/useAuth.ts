import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/http'
import type { AxiosError } from 'axios'
import type { Presentation } from '../types'

type PublicUser = { id_user: number; name: string; email: string; role: 'admin' | 'visitor' }

export function useMe() {
  return useQuery<{ user: PublicUser }>({
    queryKey: ['me'],
    queryFn: async () => (await api.get('/auth/me')).data,
    retry: false
  })
}

export function useRegister() {
  const qc = useQueryClient()
  return useMutation<
    { user: PublicUser; token: string },
    AxiosError<{ error: string }>,
    { name: string; email: string; password: string }
  >({
    mutationFn: async (payload) => (await api.post('/auth/register', payload)).data,
    onSuccess: ({ token }) => {
      localStorage.setItem('token', token)
      qc.invalidateQueries({ queryKey: ['me'] })
    }
  })
}

export function useLogin() {
  const qc = useQueryClient()
  return useMutation<
    { user: PublicUser; token: string },
    AxiosError<{ error: string }>,
    { email: string; password: string }
  >({
    mutationFn: async (payload) => (await api.post('/auth/login', payload)).data,
    onSuccess: ({ token }) => {
      localStorage.setItem('token', token)
      qc.invalidateQueries({ queryKey: ['me'] })
    }
  })
}

export function logout() {
  localStorage.removeItem('token')
}
export function useUpdatePresentation() {
  const qc = useQueryClient()          
  return useMutation<
    Presentation,
    AxiosError<{ error: string }>,
    Presentation
  >({
    mutationFn: async (payload) => (await api.put('/presentation', payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['presentation'] })
    }
  })
}