import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import Cookies from 'js-cookie';

// Criar instância do axios com configurações base
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Isso permite enviar cookies cross-origin
});

// Interceptor para adicionar o token às requisições
api.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token') || localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Verificar se o erro é de autenticação (401)
    if (error.response?.status === 401) {
      // Se não for uma rota de autenticação, limpar o token e redirecionar
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register') &&
        !window.location.pathname.includes('/forgot-password')
      ) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        Cookies.remove('auth_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Tipos
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  [key: string]: any;
}

// Funções de utilidade para requisições HTTP
const http = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => 
    api.get(url, config).then(res => res.data),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => 
    api.post(url, data, config).then(res => res.data),
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => 
    api.put(url, data, config).then(res => res.data),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => 
    api.delete(url, config).then(res => res.data),
  
  // Função específica para upload de arquivos
  upload: <T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const uploadConfig = {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.post(url, formData, uploadConfig).then(res => res.data);
  },
};

export default http; 