import { apiClient, buildQueryString } from './client'
import {
  PaymentResponse,
  PaymentCreate,
  PaymentUpdate,
  PaymentFilters,
  PaymentConfirm,
  BulkPaymentConfirm,
} from '@/lib/types/api'

export class PaymentsService {
  private readonly endpoint = '/payments'

  // Listar pagamentos com filtros
  async getPayments(filters?: PaymentFilters): Promise<PaymentResponse[]> {
    const queryString = filters ? buildQueryString(filters) : ''
    return apiClient.get<PaymentResponse[]>(`${this.endpoint}${queryString}`)
  }

  // Obter pagamento por ID
  async getPayment(id: number): Promise<PaymentResponse> {
    return apiClient.get<PaymentResponse>(`${this.endpoint}/${id}`)
  }

  // Criar novo pagamento
  async createPayment(payment: PaymentCreate): Promise<PaymentResponse> {
    return apiClient.post<PaymentResponse>(this.endpoint, payment)
  }

  // Atualizar pagamento
  async updatePayment(id: number, payment: PaymentUpdate): Promise<PaymentResponse> {
    return apiClient.put<PaymentResponse>(`${this.endpoint}/${id}`, payment)
  }

  // Confirmar pagamento
  async confirmPayment(id: number, confirmation?: PaymentConfirm): Promise<PaymentResponse> {
    const data = confirmation || {}
    return apiClient.post<PaymentResponse>(`${this.endpoint}/${id}/confirm`, data)
  }

  // Obter pagamentos em atraso
  async getOverduePayments(): Promise<PaymentResponse[]> {
    return apiClient.get<PaymentResponse[]>(`${this.endpoint}/overdue/list`)
  }

  // Gerar pagamentos anuais para um contrato
  async generateYearlyPayments(contractId: number, year: number): Promise<PaymentResponse[]> {
    return apiClient.get<PaymentResponse[]>(`${this.endpoint}/contract/${contractId}/generate/${year}`)
  }

  // Confirmar múltiplos pagamentos
  async bulkConfirmPayments(data: BulkPaymentConfirm): Promise<PaymentResponse[]> {
    return apiClient.post<PaymentResponse[]>(`${this.endpoint}/bulk-confirm`, data)
  }
}

// Instância singleton do serviço
export const paymentsService = new PaymentsService()