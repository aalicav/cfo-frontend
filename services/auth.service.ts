import http from '@/lib/http'

interface LoginCredentials {
  email: string
  password: string
}

interface AuthResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await http.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },

  logout: async () => {
    await http.post('/auth/logout')
  },

  refreshToken: async () => {
    const response = await http.post<AuthResponse>('/auth/refresh')
    return response.data
  },

  getProfile: async () => {
    const response = await http.get<AuthResponse['user']>('/auth/profile')
    return response.data
  }
} 