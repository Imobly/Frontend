import { useState, useEffect } from 'react'
import { ApiService, handleApiError } from '@/lib/api'
import { TenantResponse, TenantFilters } from '@/lib/types/api'

interface UseTenantsReturn {
  tenants: TenantResponse[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  createTenant: (tenant: any) => Promise<TenantResponse | null>
  updateTenant: (id: number, tenant: any) => Promise<TenantResponse | null>
  deleteTenant: (id: number) => Promise<boolean>
}

export function useTenants(filters?: TenantFilters): UseTenantsReturn {
  const [tenants, setTenants] = useState<TenantResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTenants = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ApiService.tenants.getTenants(filters)
      setTenants(data)
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('❌ Erro ao carregar inquilinos:', err)
    } finally {
      setLoading(false)
    }
  }

  const createTenant = async (tenant: any): Promise<TenantResponse | null> => {
    try {
      const newTenant = await ApiService.tenants.createTenant(tenant)
      setTenants(prev => [...prev, newTenant])
      return newTenant
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('❌ Erro ao criar inquilino:', err)
      return null
    }
  }

  const updateTenant = async (id: number, tenant: any): Promise<TenantResponse | null> => {
    try {
      const updatedTenant = await ApiService.tenants.updateTenant(id, tenant)
      setTenants(prev =>
        prev.map(t => t.id === id ? updatedTenant : t)
      )
      return updatedTenant
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('❌ Erro ao atualizar inquilino:', err)
      return null
    }
  }

  const deleteTenant = async (id: number): Promise<boolean> => {
    try {
      await ApiService.tenants.deleteTenant(id)
      setTenants(prev => prev.filter(t => t.id !== id))
      return true
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('❌ Erro ao deletar inquilino:', err)
      return false
    }
  }

  useEffect(() => {
    fetchTenants()
  }, [filters])

  return {
    tenants,
    loading,
    error,
    refetch: fetchTenants,
    createTenant,
    updateTenant,
    deleteTenant
  }
}

// Hook para buscar um inquilino específico
export function useTenant(id: number) {
  const [tenant, setTenant] = useState<TenantResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await ApiService.tenants.getTenant(id)
        setTenant(data)
      } catch (err) {
        const errorMessage = handleApiError(err)
        setError(errorMessage)
        console.error('❌ Erro ao carregar inquilino:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchTenant()
    }
  }, [id])

  return { tenant, loading, error }
}