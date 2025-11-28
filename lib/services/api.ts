import { authService } from './auth';

const API_BASE_URL = 'http://localhost:8000/api/v1';

class ApiService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async get(endpoint: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token inválido, redireciona para login
        authService.logout();
        window.location.href = '/login';
        return;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async post(endpoint: string, data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        authService.logout();
        window.location.href = '/login';
        return;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async put(endpoint: string, data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        authService.logout();
        window.location.href = '/login';
        return;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async delete(endpoint: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        authService.logout();
        window.location.href = '/login';
        return;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Métodos específicos para as entidades
  
  // Properties
  async getProperties(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.get(`/properties/${queryString}`);
  }

  async getProperty(id: string) {
    return this.get(`/properties/${id}`);
  }

  async createProperty(data: any) {
    return this.post('/properties/', data);
  }

  async updateProperty(id: string, data: any) {
    return this.put(`/properties/${id}`, data);
  }

  async deleteProperty(id: string) {
    return this.delete(`/properties/${id}`);
  }

  // Tenants
  async getTenants(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.get(`/tenants/${queryString}`);
  }

  async getTenant(id: string) {
    return this.get(`/tenants/${id}`);
  }

  async createTenant(data: any) {
    return this.post('/tenants/', data);
  }

  async updateTenant(id: string, data: any) {
    return this.put(`/tenants/${id}`, data);
  }

  async deleteTenant(id: string) {
    return this.delete(`/tenants/${id}`);
  }

  // Payments
  async getPayments(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.get(`/payments/${queryString}`);
  }

  async getPayment(id: string) {
    return this.get(`/payments/${id}`);
  }

  async createPayment(data: any) {
    return this.post('/payments/', data);
  }

  async updatePayment(id: string, data: any) {
    return this.put(`/payments/${id}`, data);
  }

  async deletePayment(id: string) {
    return this.delete(`/payments/${id}`);
  }

  // Expenses
  async getExpenses(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.get(`/expenses/${queryString}`);
  }

  async getExpense(id: string) {
    return this.get(`/expenses/${id}`);
  }

  async createExpense(data: any) {
    return this.post('/expenses/', data);
  }

  async updateExpense(id: string, data: any) {
    return this.put(`/expenses/${id}`, data);
  }

  async deleteExpense(id: string) {
    return this.delete(`/expenses/${id}`);
  }

  // Dashboard data
  async getDashboardData() {
    return this.get('/dashboard/');
  }

  async getOverviewStats() {
    return this.get('/overview/stats');
  }
}

export const apiService = new ApiService();