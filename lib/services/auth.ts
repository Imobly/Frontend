import { LoginRequest, RegisterRequest, ChangePasswordRequest, AuthResponse, User } from '../types/auth';

const AUTH_API_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8001/api/v1/auth';
const USE_MOCK_AUTH = false; // Usando a API real agora

class AuthService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    if (USE_MOCK_AUTH) {
      // Mock login para desenvolvimento
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay da API
      
      if (credentials.email === 'admin@imobly.com' && credentials.password === 'admin123') {
        const mockResponse: AuthResponse = {
          access_token: 'mock_token_' + Date.now(),
          token_type: 'Bearer',
          user: {
            id: '1',
            email: credentials.email,
            name: 'Administrador',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        };
        
        // Salva o token no localStorage
        localStorage.setItem('access_token', mockResponse.access_token);
        localStorage.setItem('user', JSON.stringify(mockResponse.user));
        
        return mockResponse;
      } else {
        throw new Error('Email ou senha incorretos');
      }
    }

    // Implementação real da API - envia JSON
    const response = await fetch(`${AUTH_API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.username, // Pode ser email ou username
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(errorData.detail || 'Login failed');
    }

    const tokenData = await response.json();
    
    // Busca dados do usuário com o token
    const userResponse = await fetch(`${AUTH_API_BASE_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Erro ao buscar dados do usuário');
    }

    const userData = await userResponse.json();
    
    const authResponse: AuthResponse = {
      access_token: tokenData.access_token,
      token_type: tokenData.token_type,
      user: {
        id: userData.id.toString(),
        email: userData.email,
        name: userData.full_name || userData.username,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
      }
    };
    
    // Salva o token no localStorage
    localStorage.setItem('access_token', authResponse.access_token);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
    
    return authResponse;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    if (USE_MOCK_AUTH) {
      // Mock register para desenvolvimento
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay da API
      
      // Verifica se email já existe (mock)
      if (userData.email === 'admin@imobly.com') {
        throw new Error('Este email já está em uso');
      }
      
      const mockResponse: AuthResponse = {
        access_token: 'mock_token_' + Date.now(),
        token_type: 'Bearer',
        user: {
          id: Date.now().toString(),
          email: userData.email,
          name: userData.name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      };
      
      // Salva o token no localStorage
      localStorage.setItem('access_token', mockResponse.access_token);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      
      return mockResponse;
    }

    // Implementação real da API
    const response = await fetch(`${AUTH_API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        username: userData.username,
        full_name: userData.name,
        password: userData.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(errorData.detail || 'Registration failed');
    }

    const userResponseData = await response.json();
    
    // Após o registro, faz login automático
    const loginResponse = await this.login({
      username: userData.username,
      password: userData.password,
    });
    
    return loginResponse;
  }

  async changePassword(passwordData: ChangePasswordRequest): Promise<void> {
    if (USE_MOCK_AUTH) {
      // Mock change password para desenvolvimento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (passwordData.old_password === 'wrong') {
        throw new Error('Senha atual incorreta');
      }
      
      return; // Sucesso
    }

    // Implementação real da API
    const response = await fetch(`${AUTH_API_BASE_URL}/change-password`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        current_password: passwordData.old_password,
        new_password: passwordData.new_password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Password change failed' }));
      throw new Error(errorData.detail || 'Password change failed');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    if (USE_MOCK_AUTH) {
      // Retorna usuário do localStorage para mock
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    }

    // Implementação real da API
    try {
      const response = await fetch(`${AUTH_API_BASE_URL}/me`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        // Token inválido, limpa o localStorage
        this.logout();
        return null;
      }

      const userData = await response.json();
      const user: User = {
        id: userData.id.toString(),
        email: userData.email,
        name: userData.full_name || userData.username,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      // Erro de rede, retorna dados do localStorage se disponível
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
  }

  async logout(): Promise<void> {
    const token = localStorage.getItem('access_token');
    
    // Chama o endpoint de logout da API se houver token
    if (token && !USE_MOCK_AUTH) {
      try {
        await fetch(`${AUTH_API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        // Ignora erros do logout da API, mas limpa localmente mesmo assim
        console.error('Erro ao fazer logout na API:', error);
      }
    }
    
    // Limpa o localStorage independente do resultado da API
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getStoredUser(): User | null {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  }

  async updateUser(userData: { email?: string; full_name?: string }): Promise<User> {
    const response = await fetch(`${AUTH_API_BASE_URL}/me`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Erro ao atualizar usuário' }));
      throw new Error(errorData.detail || 'Erro ao atualizar usuário');
    }

    const data = await response.json();
    const user: User = {
      id: data.id.toString(),
      email: data.email,
      name: data.full_name || data.username,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
}

export const authService = new AuthService();