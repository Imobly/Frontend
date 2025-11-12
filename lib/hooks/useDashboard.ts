import { useState, useEffect } from 'react'
import { ApiService, handleApiError } from '@/lib/api'
import { DashboardSummary } from '@/lib/types/api'

interface UseDashboardReturn {
  summary: DashboardSummary | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useDashboard(): UseDashboardReturn {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSummary = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ApiService.dashboard.getSummary()
      setSummary(data)
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('❌ Erro ao carregar dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [])

  return {
    summary,
    loading,
    error,
    refetch: fetchSummary
  }
}

// Hook para dados do gráfico de receitas
export function useRevenueChart(months: number = 12) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const chartData = await ApiService.dashboard.getRevenueChart(months)
        setData(chartData)
      } catch (err) {
        const errorMessage = handleApiError(err)
        setError(errorMessage)
        console.error('❌ Erro ao carregar gráfico de receitas:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [months])

  return { data, loading, error }
}

// Hook para dados do gráfico de despesas
export function useExpenseChart(months: number = 12) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const chartData = await ApiService.dashboard.getExpenseChart(months)
        setData(chartData)
      } catch (err) {
        const errorMessage = handleApiError(err)
        setError(errorMessage)
        console.error('❌ Erro ao carregar gráfico de despesas:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [months])

  return { data, loading, error }
}