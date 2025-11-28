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
    return apiClient.get<TenantResponse[]>(`${this.endpoint}/${queryString}`)
  }

  // Obter inquilino por ID
  async getTenant(id: number): Promise<TenantResponse> {
    return apiClient.get<TenantResponse>(`${this.endpoint}/${id}/`)
  }

  // Obter inquilino por email
  async getTenantByEmail(email: string): Promise<TenantResponse> {
    return apiClient.get<TenantResponse>(`${this.endpoint}/by-email/${encodeURIComponent(email)}/`)
  }

  // Obter inquilino por CPF
  async getTenantByCpf(cpf: string): Promise<TenantResponse> {
    return apiClient.get<TenantResponse>(`${this.endpoint}/by-cpf/${encodeURIComponent(cpf)}/`)
  }

  // Criar novo inquilino
  async createTenant(tenant: TenantCreate): Promise<TenantResponse> {
    return apiClient.post<TenantResponse>(`${this.endpoint}/`, tenant)
  }

  // Atualizar inquilino
  async updateTenant(id: number, tenant: TenantUpdate): Promise<TenantResponse> {
    return apiClient.put<TenantResponse>(`${this.endpoint}/${id}/`, tenant)
  }

  // Deletar inquilino
  async deleteTenant(id: number): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`${this.endpoint}/${id}/`)
  }

  // Upload de documentos do inquilino
  async uploadDocuments(
    tenantId: number,
    files: File[],
    documentType: 'rg' | 'cpf' | 'cnh' | 'comprovante_residencia' | 'comprovante_renda' | 'contrato' | 'outros',
    onProgress?: (progress: number) => void
  ): Promise<{
    message: string
    uploaded_files: Array<{
      filename: string
      original_filename: string
      url: string
      size: number
      type: string
    }>
    total_documents: number
  }> {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })
    
    return apiClient.upload(
      `${this.endpoint}/${tenantId}/upload-documents?document_type=${documentType}`,
      formData,
      onProgress
    )
  }

  // Listar documentos do inquilino
  async getDocuments(tenantId: number): Promise<{
    tenant_id: number
    tenant_name: string
    documents: Array<{
      id: string
      name: string
      type: string
      url: string
      file_type: string
      size: number
      uploaded_at: string
    }>
    total_documents: number
  }> {
    return apiClient.get(`${this.endpoint}/${tenantId}/documents`)
  }

  // Deletar documento do inquilino
  async deleteDocument(tenantId: number, documentUrl: string): Promise<{
    message: string
    file_deleted: boolean
    remaining_documents: number
  }> {
    return apiClient.delete(
      `${this.endpoint}/${tenantId}/documents/?document_url=${encodeURIComponent(documentUrl)}`
    )
  }
}

// Instância singleton do serviço
export const tenantsService = new TenantsService()