import { apiClient, buildQueryString } from './client'
import {
  NotificationResponse,
  NotificationCreate,
  NotificationUpdate,
  NotificationFilters,
  NotificationCount,
} from '@/lib/types/api'

export class NotificationsService {
  private readonly endpoint = '/notifications'

  // Listar notificações com filtros
  async getNotifications(filters?: NotificationFilters): Promise<NotificationResponse[]> {
    const queryString = filters ? buildQueryString(filters) : ''
    return apiClient.get<NotificationResponse[]>(`${this.endpoint}/${queryString}`)
  }

  // Obter notificação por ID
  async getNotification(id: string): Promise<NotificationResponse> {
    return apiClient.get<NotificationResponse>(`${this.endpoint}/${id}/`)
  }

  // Criar nova notificação
  async createNotification(notification: NotificationCreate): Promise<NotificationResponse> {
    return apiClient.post<NotificationResponse>(`${this.endpoint}/`, notification)
  }

  // Marcar notificação como lida
  async markAsRead(id: string): Promise<NotificationResponse> {
    return apiClient.put<NotificationResponse>(`${this.endpoint}/${id}/read/`)
  }

  // Marcar todas as notificações como lidas
  async markAllAsRead(): Promise<{ message: string }> {
    return apiClient.put<{ message: string }>(`${this.endpoint}/mark-all-read/`)
  }

  // Deletar notificação
  async deleteNotification(id: string): Promise<void> {
    return apiClient.delete<void>(`${this.endpoint}/${id}/`)
  }

  // Obter quantidade de notificações não lidas
  async getUnreadCount(): Promise<NotificationCount> {
    return apiClient.get<NotificationCount>(`${this.endpoint}/unread/count/`)
  }
}

// Instância singleton do serviço
export const notificationsService = new NotificationsService()