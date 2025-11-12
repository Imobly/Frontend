import { apiClient, buildQueryString } from './client'
import {
  TenantResponse,
  TenantCreate,
  TenantUpdate,
  TenantFilters,
} from '@/lib/types/api'

export class TenantsService {
  private readonly endpoint = '/tenants'

  // Listar inquilinos com filtros
  async getTenants(filters?: TenantFilters): Promise<TenantResponse[]> {
    const queryString = filters ? buildQueryString(filters) : ''
    return apiClient.get<TenantResponse[]>(`${this.endpoint}${queryString}`)
  }

  // Obter inquilino por ID
  async getTenant(id: number): Promise<TenantResponse> {
    return apiClient.get<TenantResponse>(`${this.endpoint}/${id}`)
  }

  // Obter inquilino por email
  async getTenantByEmail(email: string): Promise<TenantResponse> {
    return apiClient.get<TenantResponse>(`${this.endpoint}/by-email/${encodeURIComponent(email)}`)
  }

  // Obter inquilino por CPF
  async getTenantByCpf(cpf: string): Promise<TenantResponse> {
    return apiClient.get<TenantResponse>(`${this.endpoint}/by-cpf/${encodeURIComponent(cpf)}`)
  }

  // Criar novo inquilino
  async createTenant(tenant: TenantCreate): Promise<TenantResponse> {
    return apiClient.post<TenantResponse>(this.endpoint, tenant)
  }

  // Atualizar inquilino
  async updateTenant(id: number, tenant: TenantUpdate): Promise<TenantResponse> {
    return apiClient.put<TenantResponse>(`${this.endpoint}/${id}`, tenant)
  }

  // Deletar inquilino
  async deleteTenant(id: number): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`${this.endpoint}/${id}`)
  }
}

// Instância singleton do serviço
export const tenantsService = new TenantsService()