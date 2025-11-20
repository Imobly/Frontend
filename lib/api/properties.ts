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
    return apiClient.get<PropertyResponse[]>(`${this.endpoint}/${queryString}`)
  }

  // Listar apenas propriedades disponíveis
  async getAvailableProperties(): Promise<PropertyResponse[]> {
    return apiClient.get<PropertyResponse[]>(`${this.endpoint}/available/`)
  }

  // Obter propriedade por ID
  async getProperty(id: number): Promise<PropertyResponse> {
    return apiClient.get<PropertyResponse>(`${this.endpoint}/${id}/`)
  }

  // Criar nova propriedade
  async createProperty(property: PropertyCreate): Promise<PropertyResponse> {
    return apiClient.post<PropertyResponse>(`${this.endpoint}/`, property)
  }

  // Atualizar propriedade
  async updateProperty(id: number, property: PropertyUpdate): Promise<PropertyResponse> {
    return apiClient.put<PropertyResponse>(`${this.endpoint}/${id}/`, property)
  }

  // Atualizar apenas o status da propriedade
  async updatePropertyStatus(id: number, status: string): Promise<PropertyResponse> {
    return apiClient.patch<PropertyResponse>(`${this.endpoint}/${id}/status/?status=${status}`)
  }

  // Deletar propriedade
  async deleteProperty(id: number): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`${this.endpoint}/${id}/`)
  }

  // Upload de imagens da propriedade
  async uploadImages(
    propertyId: number,
    files: File[],
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
    total_images: number
  }> {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })
    
    return apiClient.upload(
      `${this.endpoint}/${propertyId}/upload-images`,
      formData,
      onProgress
    )
  }

  // Deletar imagem da propriedade
  async deleteImage(propertyId: number, imageUrl: string): Promise<{
    message: string
    file_deleted: boolean
    remaining_images: number
  }> {
    return apiClient.delete(
      `${this.endpoint}/${propertyId}/images?image_url=${encodeURIComponent(imageUrl)}`
    )
  }
}

// Instância singleton do serviço
export const propertiesService = new PropertiesService()