import { apiClient, buildQueryString } from './client'
import {
  ExpenseResponse,
  ExpenseCreate,
  ExpenseUpdate,
  ExpenseFilters,
  ExpenseSummary,
} from '@/lib/types/api'

export class ExpensesService {
  private readonly endpoint = '/expenses'

  // Listar despesas com filtros
  async getExpenses(filters?: ExpenseFilters): Promise<ExpenseResponse[]> {
    const queryString = filters ? buildQueryString(filters) : ''
    return apiClient.get<ExpenseResponse[]>(`${this.endpoint}${queryString}`)
  }

  // Obter despesa por ID
  async getExpense(id: string): Promise<ExpenseResponse> {
    return apiClient.get<ExpenseResponse>(`${this.endpoint}/${id}`)
  }

  // Criar nova despesa
  async createExpense(expense: ExpenseCreate): Promise<ExpenseResponse> {
    return apiClient.post<ExpenseResponse>(this.endpoint, expense)
  }

  // Atualizar despesa
  async updateExpense(id: string, expense: ExpenseUpdate): Promise<ExpenseResponse> {
    return apiClient.put<ExpenseResponse>(`${this.endpoint}/${id}`, expense)
  }

  // Deletar despesa
  async deleteExpense(id: string): Promise<void> {
    return apiClient.delete<void>(`${this.endpoint}/${id}`)
  }

  // Obter despesas mensais de uma propriedade
  async getPropertyMonthlyExpenses(
    propertyId: number,
    year: number,
    month: number
  ): Promise<any> {
    return apiClient.get<any>(`${this.endpoint}/property/${propertyId}/monthly?year=${year}&month=${month}`)
  }

  // Obter resumo de despesas por categoria
  async getExpensesSummaryByCategory(filters?: {
    property_id?: number
    year?: number
    month?: number
  }): Promise<{ categories: ExpenseSummary[] }> {
    const queryString = filters ? buildQueryString(filters) : ''
    return apiClient.get<{ categories: ExpenseSummary[] }>(`${this.endpoint}/categories/summary${queryString}`)
  }
}

// Instância singleton do serviço
export const expensesService = new ExpensesService()