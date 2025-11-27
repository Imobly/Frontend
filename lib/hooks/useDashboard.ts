import { useState, useEffect } from 'react'
import { dashboardService } from '@/lib/api/dashboard'
import { DashboardSummary, DashboardStats, RevenueVsExpensesData, PropertiesStatusResponse } from '@/lib/types/api'

interface UseDashboardReturn {
  summary: DashboardSummary | null
  stats: DashboardStats | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useDashboard(period?: string): UseDashboardReturn {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSummary = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [summaryData, statsData] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getStats()
      ])
      
      // Validar estrutura de dados para evitar undefined
      const validatedSummary = {
        properties: {
          total: summaryData?.properties?.total || 0,
          occupied_units: summaryData?.properties?.occupied_units || 0,
          vacant_units: summaryData?.properties?.vacant_units || 0,
          occupancy_rate: summaryData?.properties?.occupancy_rate || 0
        },
        contracts: {
          active: summaryData?.contracts?.active || 0,
          expiring_soon: summaryData?.contracts?.expiring_soon || 0,
          expired: summaryData?.contracts?.expired || 0
        },
        financial: {
          monthly_revenue: summaryData?.financial?.monthly_revenue || 0,
          monthly_expenses: summaryData?.financial?.monthly_expenses || 0,
          overdue_payments: summaryData?.financial?.overdue_payments || 0,
          total_received: summaryData?.financial?.total_received || 0
        }
      }
      
      setSummary(validatedSummary)
      setStats(statsData)
    } catch (err: any) {
      const errorMessage = err?.detail || 'Erro ao carregar dashboard'
      setError(errorMessage)
      console.error('❌ Erro ao carregar dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [period])

  return {
    summary,
    stats,
    loading,
    error,
    refetch: fetchSummary
  }
}

// Hook para dados de receitas vs despesas
export function useRevenueVsExpenses(months: number = 6) {
  const [data, setData] = useState<RevenueVsExpensesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const chartData = await dashboardService.getRevenueVsExpenses(months)
        
        // Validar dados do gráfico
        if (chartData && chartData.data) {
          const validatedData = {
            ...chartData,
            data: chartData.data.map(item => ({
              month: item.month || '',
              revenue: item.revenue || 0,
              expenses: item.expenses || 0,
              profit: item.profit || 0
            }))
          }
          setData(validatedData)
        } else {
          setData({ data: [] })
        }
      } catch (err: any) {
        const errorMessage = err?.detail || 'Erro ao carregar gráfico'
        setError(errorMessage)
        console.error('❌ Erro ao carregar gráfico de receitas vs despesas:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [months])

  return { data, loading, error }
}

// Hook para status das propriedades
export function usePropertiesStatus(period?: string) {
  const [data, setData] = useState<PropertiesStatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const propertiesData = await dashboardService.getPropertiesStatus()
        
        // Validar dados das propriedades
        if (propertiesData) {
          const validatedData = {
            summary: propertiesData.summary ? {
              occupancy_rate: propertiesData.summary.occupancy_rate || 0,
              total_revenue: propertiesData.summary.total_revenue || 0,
              total_expenses: propertiesData.summary.total_expenses || 0
            } : undefined,
            properties: (propertiesData.properties || []).map(prop => ({
              id: prop.id || prop.property_id || 0,
              property_id: prop.id || prop.property_id || 0,
              property_name: prop.name || prop.property_name || 'Imóvel sem nome',
              name: prop.name || prop.property_name,
              address: prop.address,
              status: prop.status || 'vacant',
              type: prop.type,
              active_contracts: prop.active_contracts ?? 0,
              expected_monthly_revenue: prop.expected_monthly_revenue ?? 0,
              received_monthly_revenue: prop.received_monthly_revenue ?? 0,
              monthly_revenue: prop.monthly_revenue ?? 0,
              monthly_expenses: prop.monthly_expenses ?? 0,
              net_profit: prop.net_profit ?? 0,
              occupancy_rate: prop.occupancy_rate ?? 0,
              bedrooms: prop.bedrooms ?? 0,
              bathrooms: prop.bathrooms ?? 0,
              parking_spaces: prop.parking_spaces ?? 0
            }))
          }
          console.log('🏠 Dados de propriedades:', validatedData)
          setData(validatedData)
        } else {
          setData({ properties: [] })
        }
      } catch (err: any) {
        const errorMessage = err?.detail || 'Erro ao carregar propriedades'
        setError(errorMessage)
        console.error('❌ Erro ao carregar status das propriedades:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [period])

  return { data, loading, error }
}