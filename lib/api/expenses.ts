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
    return apiClient.get<ExpenseResponse[]>(`${this.endpoint}/${queryString}`)
  }

  // Obter despesa por ID
  async getExpense(id: string): Promise<ExpenseResponse> {
    return apiClient.get<ExpenseResponse>(`${this.endpoint}/${id}/`)
  }

  // Criar nova despesa
  async createExpense(expense: ExpenseCreate): Promise<ExpenseResponse> {
    return apiClient.post<ExpenseResponse>(`${this.endpoint}/`, expense)
  }

  // Atualizar despesa
  async updateExpense(id: string, expense: ExpenseUpdate): Promise<ExpenseResponse> {
    return apiClient.put<ExpenseResponse>(`${this.endpoint}/${id}/`, expense)
  }

  // Deletar despesa
  async deleteExpense(id: string): Promise<void> {
    return apiClient.delete<void>(`${this.endpoint}/${id}/`)
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

  // Upload de documentos da despesa (novo endpoint com array)
  async uploadDocuments(
    expenseId: string,
    files: File[],
    documentType: 'comprovante' | 'nota_fiscal' | 'recibo' | 'outros',
    onProgress?: (progress: number) => void
  ): Promise<{
    message: string
    uploaded_files: Array<{
      filename: string
      original_filename: string
      url: string
      size: number
      type: string
    }>
    total_documents: number
  }> {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })
    
    return apiClient.upload(
      `${this.endpoint}/${expenseId}/upload-documents?document_type=${documentType}`,
      formData,
      onProgress
    )
  }

  // Listar documentos da despesa
  async getDocuments(expenseId: string): Promise<{
    expense_id: string
    documents: Array<{
      id: string
      name: string
      type: string
      url: string
      file_type: string
      size: number
      uploaded_at: string
    }>
    total_documents: number
  }> {
    return apiClient.get(`${this.endpoint}/${expenseId}/documents`)
  }

  // Deletar documento da despesa
  async deleteDocument(expenseId: string, documentUrl: string): Promise<{
    message: string
    file_deleted: boolean
    remaining_documents: number
  }> {
    return apiClient.delete(
      `${this.endpoint}/${expenseId}/documents?document_url=${encodeURIComponent(documentUrl)}`
    )
  }

  // Upload de comprovante da despesa (legacy - mantido para compatibilidade)
  async uploadReceipt(
    expenseId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{
    message: string
    file_info: {
      filename: string
      original_filename: string
      url: string
      size: number
      type: string
    }
    expense_id: string
  }> {
    const formData = new FormData()
    formData.append('file', file)
    
    return apiClient.upload(
      `${this.endpoint}/${expenseId}/upload-receipt`,
      formData,
      onProgress
    )
  }

  // Deletar comprovante da despesa (legacy - mantido para compatibilidade)
  async deleteReceipt(expenseId: string): Promise<{
    message: string
    file_deleted: boolean
  }> {
    return apiClient.delete(`${this.endpoint}/${expenseId}/receipt`)
  }
}

// Instância singleton do serviço
export const expensesService = new ExpensesService()