import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiError } from '@/lib/types/api'

// Get base URL based on environment
const getBaseURL = () => {
  // Server-side: always use absolute URL
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
  }
  
  // Client-side
  if (process.env.NODE_ENV === 'production') {
    // Production (Docker): use absolute URL to access backend directly
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
  }
  
  // Development: use relative URL for Next.js proxy
  return '/api/v1'
}

// Configuração base do cliente HTTP
class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: getBaseURL(),
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    // Interceptor para requisições
    this.client.interceptors.request.use(
      (config) => {
        // Adiciona o token de autenticação automaticamente se disponível
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('access_token')
          if (token && !config.headers['Authorization']) {
            config.headers['Authorization'] = `Bearer ${token}`
          }
        }
        
        // Log da requisição em desenvolvimento
        if (process.env.NODE_ENV === 'development') {
          console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`)
          if (config.data) {
            console.log('📦 [Request Data]', config.data)
          }
          if (config.headers['Authorization']) {
            console.log('🔐 [Auth Token]', 'Present')
          }
        }
        return config
      },
      (error) => {
        console.error('❌ [Request Error]', error)
        return Promise.reject(error)
      }
    )

    // Interceptor para respostas
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log da resposta em desenvolvimento
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ [API Response] ${response.status} ${response.config.url}`)
          console.log('📦 [Response Data]', response.data)
        }
        return response
      },
      (error) => {
        // Log de erro
        console.error('❌ [API Error]', error)
        
        // Tratamento de erros customizado
        if (error.response) {
          // Se for 401 (não autorizado), limpa o token e redireciona para login
          if (error.response.status === 401) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('access_token')
              localStorage.removeItem('user')
              // Só redireciona se não estiver na página de login
              if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login'
              }
            }
          }
          
          // Erro com resposta do servidor
          const apiError: ApiError = {
            detail: error.response.data?.detail || 'Erro interno do servidor'
          }
          return Promise.reject(apiError)
        } else if (error.request) {
          // Erro de rede
          const networkError: ApiError = {
            detail: 'Erro de conexão com o servidor. Verifique sua internet.'
          }
          return Promise.reject(networkError)
        } else {
          // Erro desconhecido
          const unknownError: ApiError = {
            detail: 'Erro desconhecido. Tente novamente.'
          }
          return Promise.reject(unknownError)
        }
      }
    )
  }

  // Métodos HTTP
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }

  // Método para upload de arquivos
  async upload<T>(url: string, formData: FormData, onProgress?: (progress: number) => void): Promise<T> {
    const response = await this.client.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })
    return response.data
  }

  // Getter para acessar a instância do Axios diretamente se necessário
  get instance(): AxiosInstance {
    return this.client
  }

  // Método para atualizar a base URL dinamicamente
  updateBaseURL(baseURL: string): void {
    this.client.defaults.baseURL = baseURL
  }

  // Método para adicionar headers de autenticação
  setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  // Método para remover headers de autenticação
  removeAuthToken(): void {
    delete this.client.defaults.headers.common['Authorization']
  }
}

// Instância singleton do cliente
export const apiClient = new ApiClient()

// Função helper para lidar com erros da API
export const handleApiError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'detail' in error) {
    return (error as ApiError).detail
  }
  return 'Erro desconhecido. Tente novamente.'
}

// Função helper para construir query strings
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })
  
  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

export default apiClient