import { apiClient } from './client'
import {
  DashboardSummary,
  DashboardStats,
  RevenueVsExpensesData,
  PropertiesStatusResponse,
  PropertyPerformance,
  RecentActivity,
  HealthCheck,
  RootResponse,
} from '@/lib/types/api'

export class DashboardService {
  private readonly endpoint = '/dashboard'

  // Obter estatísticas básicas
  async getStats(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>(`${this.endpoint}/stats`)
  }

  // Obter resumo completo do dashboard
  async getSummary(): Promise<DashboardSummary> {
    return apiClient.get<DashboardSummary>(`${this.endpoint}/summary`)
  }

  // Obter dados de receitas vs despesas
  async getRevenueVsExpenses(months: number = 12, propertyId?: number): Promise<RevenueVsExpensesData> {
    const params = new URLSearchParams({ months: months.toString() })
    if (propertyId) params.append('property_id', propertyId.toString())
    return apiClient.get<RevenueVsExpensesData>(`${this.endpoint}/revenue-vs-expenses?${params}`)
  }

  // Obter status das propriedades
  async getPropertiesStatus(): Promise<PropertiesStatusResponse> {
    return apiClient.get<PropertiesStatusResponse>(`${this.endpoint}/properties-status`)
  }

  // Obter performance das propriedades
  async getPropertyPerformance(): Promise<PropertyPerformance> {
    return apiClient.get<PropertyPerformance>(`${this.endpoint}/property-performance`)
  }

  // Obter atividades recentes
  async getRecentActivity(limit: number = 10): Promise<RecentActivity> {
    return apiClient.get<RecentActivity>(`${this.endpoint}/recent-activity?limit=${limit}`)
  }
}

export class GeneralService {
  // Health check
  async healthCheck(): Promise<HealthCheck> {
    return apiClient.get<HealthCheck>('/health')
  }

  // Root endpoint
  async getRoot(): Promise<RootResponse> {
    return apiClient.get<RootResponse>('/')
  }
}

// Instâncias singleton dos serviços
export const dashboardService = new DashboardService()
export const generalService = new GeneralService()