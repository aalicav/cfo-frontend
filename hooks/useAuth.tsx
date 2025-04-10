'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import http from '@/lib/http';
import { User, RegisterData, ResetPasswordData } from '@/lib/types';

// Tipos
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  updatePassword: (currentPassword: string, password: string, passwordConfirmation: string) => Promise<void>;
  clearError: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Duração do cookie em dias
const COOKIE_EXPIRY = 30;

// Criar o contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provedor de autenticação
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Carregar usuário do localStorage quando montar o componente
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedToken = Cookies.get('auth_token') || localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // Função para verificar a autenticação atual
  const checkAuth = async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      const response = await http.get('/me');
      if (response.status === 'success' && response.user) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await http.post('/login', { email, password });
      
      if (response.status === 'success' && response.token && response.user) {
        // Salvar token em cookie e localStorage
        Cookies.set('auth_token', response.token, { expires: COOKIE_EXPIRY, sameSite: 'Lax' });
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        setToken(response.token);
        setUser(response.user);
        
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.email?.[0]) {
        setError(error.response.data.email[0]);
      } else {
        setError('Ocorreu um erro durante o login. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Registro
  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await http.post('/register', data);
      
      if (response.status === 'success' && response.token && response.user) {
        // Salvar token em cookie e localStorage
        Cookies.set('auth_token', response.token, { expires: COOKIE_EXPIRY, sameSite: 'Lax' });
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        setToken(response.token);
        setUser(response.user);
        
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Ocorreu um erro durante o registro. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setIsLoading(true);
      if (token) {
        await http.post('/logout');
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      Cookies.remove('auth_token');
      setToken(null);
      setUser(null);
      setIsLoading(false);
      router.push('/login');
    }
  };

  // Esqueci minha senha
  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await http.post('/forgot-password', { email });
      
      if (response.status === 'success') {
        return;
      }
    } catch (error: any) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Ocorreu um erro ao solicitar a recuperação de senha. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Redefinir senha
  const resetPassword = async (data: ResetPasswordData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await http.post('/reset-password', data);
      
      if (response.status === 'success') {
        router.push('/login');
      }
    } catch (error: any) {
      console.error('Erro ao redefinir senha:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Ocorreu um erro ao redefinir a senha. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar senha
  const updatePassword = async (currentPassword: string, password: string, password_confirmation: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await http.put('/password', {
        current_password: currentPassword,
        password,
        password_confirmation
      });
      
      if (response.status === 'success') {
        return;
      }
    } catch (error: any) {
      console.error('Erro ao atualizar senha:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.current_password?.[0]) {
        setError(error.response.data.current_password[0]);
      } else {
        setError('Ocorreu um erro ao atualizar a senha. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  // Valor do contexto
  const contextValue: AuthContextType = {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updatePassword,
    clearError,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default useAuth; 