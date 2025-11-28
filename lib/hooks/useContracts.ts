import { useState, useEffect } from 'react'
import { ApiService, handleApiError } from '@/lib/api'
import { ContractResponse, ContractCreate, ContractFilters } from '@/lib/types/api'

interface UseContractsReturn {
  contracts: ContractResponse[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  createContract: (contract: ContractCreate) => Promise<ContractResponse | null>
}

export function useContracts(filters?: ContractFilters): UseContractsReturn {
  const [contracts, setContracts] = useState<ContractResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContracts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ApiService.contracts.getContracts(filters)
      setContracts(data)
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('❌ Erro ao carregar contratos:', err)
    } finally {
      setLoading(false)
    }
  }

  const createContract = async (contract: ContractCreate): Promise<ContractResponse | null> => {
    try {
      const newContract = await ApiService.contracts.createContract(contract)
      setContracts(prev => [...prev, newContract])
      return newContract
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('❌ Erro ao criar contrato:', err)
      return null
    }
  }

  useEffect(() => {
    fetchContracts()
  }, [filters])

  return {
    contracts,
    loading,
    error,
    refetch: fetchContracts,
    createContract
  }
}