import { apiClient } from '@/lib/api/client'
import { LoginRequest, AuthResponse, User } from '@/lib/types/auth'

const AUTH_BASE = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8001/auth'

export async function login(credentials: LoginRequest): Promise<User> {
  // Faz login e obtém token
  const tokenData = await apiClient.post<AuthResponse>(`${AUTH_BASE}/login`, credentials)
  if (!tokenData.access_token) {
    throw { detail: 'Resposta de login inválida' }
  }

  // Salva token
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', tokenData.access_token)
  }

  // Busca dados do usuário atual
  const user = await apiClient.get<User>(`${AUTH_BASE}/me`)
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user))
  }
  return user
}

export async function logout(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
  }
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('user')
  if (!raw) return null
  try { return JSON.parse(raw) as User } catch { return null }
}
