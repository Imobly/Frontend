import { apiClient } from './client'
import {
  DashboardSummary,
  RevenueChartData,
  ExpenseChartData,
  PropertyPerformance,
  RecentActivity,
  HealthCheck,
  RootResponse,
} from '@/lib/types/api'

export class DashboardService {
  private readonly endpoint = '/dashboard'

  // Obter resumo do dashboard
  async getSummary(): Promise<DashboardSummary> {
    return apiClient.get<DashboardSummary>(`${this.endpoint}/summary`)
  }

  // Obter dados para gráfico de receitas
  async getRevenueChart(months: number = 12): Promise<RevenueChartData> {
    return apiClient.get<RevenueChartData>(`${this.endpoint}/revenue-chart?months=${months}`)
  }

  // Obter dados para gráfico de despesas
  async getExpenseChart(months: number = 12): Promise<ExpenseChartData> {
    return apiClient.get<ExpenseChartData>(`${this.endpoint}/expense-chart?months=${months}`)
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