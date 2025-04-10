// Tipos relacionados à autenticação
export interface User {
  id: number;
  name: string;
  email: string;
  type?: string;
  roles?: string[];
  permissions?: string[];
  [key: string]: any;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  type?: string;
}

export interface ResetPasswordData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface UpdatePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

// Tipos relacionados a respostas da API
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  [key: string]: any;
}

// Tipos relacionados a componentes
export interface BasicComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Tipos relacionados ao middleware
export interface MiddlewareConfig {
  matcher: string[];
} 