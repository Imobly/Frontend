import { apiClient, buildQueryString } from './client'
import {
  PropertyResponse,
  PropertyCreate,
  PropertyUpdate,
  PropertyFilters,
} from '@/lib/types/api'

export class PropertiesService {
  private readonly endpoint = '/properties'

  // Listar propriedades com filtros
  async getProperties(filters?: PropertyFilters): Promise<PropertyResponse[]> {
    const queryString = filters ? buildQueryString(filters) : ''
    return apiClient.get<PropertyResponse[]>(`${this.endpoint}${queryString}`)
  }

  // Listar apenas propriedades disponíveis
  async getAvailableProperties(): Promise<PropertyResponse[]> {
    return apiClient.get<PropertyResponse[]>(`${this.endpoint}/available`)
  }

  // Obter propriedade por ID
  async getProperty(id: number): Promise<PropertyResponse> {
    return apiClient.get<PropertyResponse>(`${this.endpoint}/${id}`)
  }

  // Criar nova propriedade
  async createProperty(property: PropertyCreate): Promise<PropertyResponse> {
    return apiClient.post<PropertyResponse>(this.endpoint, property)
  }

  // Atualizar propriedade
  async updateProperty(id: number, property: PropertyUpdate): Promise<PropertyResponse> {
    return apiClient.put<PropertyResponse>(`${this.endpoint}/${id}`, property)
  }

  // Atualizar apenas o status da propriedade
  async updatePropertyStatus(id: number, status: string): Promise<PropertyResponse> {
    return apiClient.patch<PropertyResponse>(`${this.endpoint}/${id}/status?status=${status}`)
  }

  // Deletar propriedade
  async deleteProperty(id: number): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`${this.endpoint}/${id}`)
  }
}

// Instância singleton do serviço
export const propertiesService = new PropertiesService()