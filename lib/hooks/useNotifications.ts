import { useState, useEffect } from 'react'
import { ApiService, handleApiError } from '@/lib/api'
import { NotificationResponse, NotificationFilters } from '@/lib/types/api'

interface UseNotificationsReturn {
  notifications: NotificationResponse[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  createNotification: (notification: any) => Promise<NotificationResponse | null>
  markAsRead: (id: string) => Promise<boolean>
  markAllAsRead: () => Promise<boolean>
  deleteNotification: (id: string) => Promise<boolean>
}

export function useNotifications(filters?: NotificationFilters): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ApiService.notifications.getNotifications(filters)
      setNotifications(data)
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('❌ Erro ao carregar notificações:', err)
    } finally {
      setLoading(false)
    }
  }

  const createNotification = async (notification: any): Promise<NotificationResponse | null> => {
    try {
      const newNotification = await ApiService.notifications.createNotification(notification)
      setNotifications(prev => [...prev, newNotification])
      return newNotification
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('❌ Erro ao criar notificação:', err)
      return null
    }
  }

  const markAsRead = async (id: string): Promise<boolean> => {
    try {
      const updatedNotification = await ApiService.notifications.markAsRead(id)
      setNotifications(prev =>
        prev.map(n => n.id === id ? updatedNotification : n)
      )
      return true
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('❌ Erro ao marcar notificação como lida:', err)
      return false
    }
  }

  const markAllAsRead = async (): Promise<boolean> => {
    try {
      await ApiService.notifications.markAllAsRead()
      setNotifications(prev =>
        prev.map(n => ({ ...n, read_status: true }))
      )
      return true
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('❌ Erro ao marcar todas como lidas:', err)
      return false
    }
  }

  const deleteNotification = async (id: string): Promise<boolean> => {
    try {
      await ApiService.notifications.deleteNotification(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
      return true
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('❌ Erro ao deletar notificação:', err)
      return false
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [filters])

  return {
    notifications,
    loading,
    error,
    refetch: fetchNotifications,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification
  }
}

// Hook para contagem de notificações não lidas
export function useUnreadNotificationsCount() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await ApiService.notifications.getUnreadCount()
        setUnreadCount(data.unread_count)
      } catch (err) {
        const errorMessage = handleApiError(err)
        setError(errorMessage)
        console.error('❌ Erro ao carregar contagem de não lidas:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUnreadCount()
  }, [])

  return { unreadCount, loading, error }
}