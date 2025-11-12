import { useState, useEffect } from 'react'
import { ApiService, handleApiError } from '@/lib/api'
import { PaymentResponse, PaymentFilters } from '@/lib/types/api'

interface UsePaymentsReturn {
  payments: PaymentResponse[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  confirmPayment: (id: number, data?: any) => Promise<boolean>
  createPayment: (payment: any) => Promise<PaymentResponse | null>
}

export function usePayments(filters?: PaymentFilters): UsePaymentsReturn {
  const [payments, setPayments] = useState<PaymentResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPayments = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ApiService.payments.getPayments(filters)
      setPayments(data)
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('❌ Erro ao carregar pagamentos:', err)
    } finally {
      setLoading(false)
    }
  }

  const confirmPayment = async (id: number, data?: any): Promise<boolean> => {
    try {
      const updatedPayment = await ApiService.payments.confirmPayment(id, data)
      setPayments(prev =>
        prev.map(p => p.id === id ? updatedPayment : p)
      )
      return true
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('❌ Erro ao confirmar pagamento:', err)
      return false
    }
  }

  const createPayment = async (payment: any): Promise<PaymentResponse | null> => {
    try {
      const newPayment = await ApiService.payments.createPayment(payment)
      setPayments(prev => [...prev, newPayment])
      return newPayment
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('❌ Erro ao criar pagamento:', err)
      return null
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [filters])

  return {
    payments,
    loading,
    error,
    refetch: fetchPayments,
    confirmPayment,
    createPayment
  }
}

// Hook para pagamentos em atraso
export function useOverduePayments() {
  const [overduePayments, setOverduePayments] = useState<PaymentResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOverduePayments = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await ApiService.payments.getOverduePayments()
        setOverduePayments(data)
      } catch (err) {
        const errorMessage = handleApiError(err)
        setError(errorMessage)
        console.error('❌ Erro ao carregar pagamentos em atraso:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOverduePayments()
  }, [])

  return { overduePayments, loading, error }
}