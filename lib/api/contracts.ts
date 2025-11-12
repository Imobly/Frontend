import { apiClient, buildQueryString } from './client'
import {
  ContractResponse,
  ContractCreate,
  ContractUpdate,
  ContractFilters,
} from '@/lib/types/api'

export class ContractsService {
  private readonly endpoint = '/contracts'

  // Listar contratos com filtros
  async getContracts(filters?: ContractFilters): Promise<ContractResponse[]> {
    const queryString = filters ? buildQueryString(filters) : ''
    return apiClient.get<ContractResponse[]>(`${this.endpoint}${queryString}`)
  }

  // Obter contrato por ID
  async getContract(id: number): Promise<ContractResponse> {
    return apiClient.get<ContractResponse>(`${this.endpoint}/${id}`)
  }

  // Criar novo contrato
  async createContract(contract: ContractCreate): Promise<ContractResponse> {
    return apiClient.post<ContractResponse>(this.endpoint, contract)
  }

  // Atualizar contrato
  async updateContract(id: number, contract: ContractUpdate): Promise<ContractResponse> {
    return apiClient.put<ContractResponse>(`${this.endpoint}/${id}`, contract)
  }

  // Renovar contrato
  async renewContract(
    id: number,
    newEndDate: string,
    newRentAmount?: number
  ): Promise<ContractResponse> {
    const data: any = { new_end_date: newEndDate }
    if (newRentAmount) {
      data.new_rent_amount = newRentAmount
    }
    return apiClient.post<ContractResponse>(`${this.endpoint}/${id}/renew`, data)
  }

  // Rescindir contrato
  async terminateContract(
    id: number,
    terminationDate: string,
    reason?: string
  ): Promise<ContractResponse> {
    const data: any = { termination_date: terminationDate }
    if (reason) {
      data.reason = reason
    }
    return apiClient.post<ContractResponse>(`${this.endpoint}/${id}/terminate`, data)
  }

  // Obter contratos que vencem em X dias
  async getExpiringContracts(days: number = 30): Promise<ContractResponse[]> {
    return apiClient.get<ContractResponse[]>(`${this.endpoint}/expiring/${days}`)
  }
}

// Instância singleton do serviço
export const contractsService = new ContractsService()