import { useState, useEffect } from 'react'
import { ApiService, handleApiError } from '@/lib/api'
import { ExpenseResponse, ExpenseFilters } from '@/lib/types/api'

interface UseExpensesReturn {
  expenses: ExpenseResponse[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  createExpense: (expense: any) => Promise<ExpenseResponse | null>
  updateExpense: (id: string, expense: any) => Promise<ExpenseResponse | null>
  deleteExpense: (id: string) => Promise<boolean>
}

export function useExpenses(filters?: ExpenseFilters): UseExpensesReturn {
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ApiService.expenses.getExpenses(filters)
      setExpenses(data)
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('❌ Erro ao carregar despesas:', err)
    } finally {
      setLoading(false)
    }
  }

  const createExpense = async (expense: any): Promise<ExpenseResponse | null> => {
    try {
      const newExpense = await ApiService.expenses.createExpense(expense)
      setExpenses(prev => [...prev, newExpense])
      return newExpense
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('❌ Erro ao criar despesa:', err)
      return null
    }
  }

  const updateExpense = async (id: string, expense: any): Promise<ExpenseResponse | null> => {
    try {
      const updatedExpense = await ApiService.expenses.updateExpense(id, expense)
      setExpenses(prev =>
        prev.map(e => e.id === id ? updatedExpense : e)
      )
      return updatedExpense
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('❌ Erro ao atualizar despesa:', err)
      return null
    }
  }

  const deleteExpense = async (id: string): Promise<boolean> => {
    try {
      await ApiService.expenses.deleteExpense(id)
      setExpenses(prev => prev.filter(e => e.id !== id))
      return true
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('❌ Erro ao deletar despesa:', err)
      return false
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [filters])

  return {
    expenses,
    loading,
    error,
    refetch: fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense
  }
}

// Hook para buscar uma despesa específica
export function useExpense(id: string) {
  const [expense, setExpense] = useState<ExpenseResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await ApiService.expenses.getExpense(id)
        setExpense(data)
      } catch (err) {
        const errorMessage = handleApiError(err)
        setError(errorMessage)
        console.error('❌ Erro ao carregar despesa:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchExpense()
    }
  }, [id])

  return { expense, loading, error }
}