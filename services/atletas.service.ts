import http from '@/lib/http'
import { Atleta } from '@/types'
import { PaginatedResponse } from './api'
// Interface para resposta da API paginada


// Interface para resposta da API
interface ApiResponse<T> {
  status: string
  message: string
  data: T
}

// Interface para a criação de um atleta conforme esperado pelo backend
export interface CriarAtletaPayload {
  user_id?: string
  name?: string
  email?: string
  registration_number?: string
  birth_date?: string
  gender?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  medical_conditions?: string
  allergies?: string
  modalities?: string[]
  blood_type?: string
  height?: number
  weight?: number
  document_type?: string
  document_number?: string
  nationality?: string
  status: "active" | "inactive" | "suspended" | "pending"
  joined_at?: string
  notes?: string
  is_professional?: boolean
  has_health_insurance?: boolean
  health_insurance_provider?: string
  health_insurance_number?: string
}

// Interface com os parâmetros aceitos pelo endpoint de listagem
export interface ListarAtletasParams {
  page?: number
  per_page?: number
  search?: string
  status?: 'active' | 'inactive' | 'suspended' | 'pending' | 'ativo' | 'inativo' | 'suspenso'
  modality?: string
  modality_id?: number
  category?: string
  is_professional?: boolean
  sort_by?: string
  sort_dir?: 'asc' | 'desc'
}

// Interface para busca otimizada de atletas
export interface BuscarAtletasParams {
  search?: string
  status?: string | string[]
  modality_id?: number
  limit?: number
}

export const atletasService = {
  /**
   * Lista atletas com suporte à paginação e filtros
   * @param params Parâmetros de listagem e filtros
   * @returns Array de atletas
   */
  listar: async (params?: ListarAtletasParams) => {
    try {
      const response = await http.get<ApiResponse<PaginatedResponse<Atleta> | Atleta[]>>('/athletes', { params })
      
      // Verificar formato da resposta
      if (response.data?.data) {
        // Formato paginado
        if (typeof response.data.data === 'object' && 'data' in response.data.data) {
          return response.data.data.data;
        }
        // Array direto
        else if (Array.isArray(response.data.data)) {
          return response.data.data;
        }
      }
      
      return [];
    } catch (error) {
      console.error('Erro ao listar atletas:', error);
      return [];
    }
  },

  /**
   * Busca atletas usando a rota específica de busca otimizada
   * @param params Parâmetros de busca
   * @returns Lista de atletas que correspondem aos critérios
   */
  buscarAtletas: async (params?: BuscarAtletasParams) => {
    try {
      const response = await http.get<ApiResponse<Atleta[]>>('/athletes/search', { params })
      
      if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      return [];
    } catch (error) {
      console.error('Erro ao buscar atletas:', error);
      return [];
    }
  },

  obter: async (id: string) => {
    try {
      const response = await http.get<ApiResponse<Atleta>>(`/athletes/${id}`)
      return response?.data?.data || null
    } catch (error) {
      console.error(`Erro ao obter atleta ${id}:`, error);
      throw error;
    }
  },

  criar: async (dados: CriarAtletaPayload) => {
    try {
      const response = await http.post<ApiResponse<Atleta>>('/athletes', dados)
      return response?.data?.data || null
    } catch (error) {
      console.error('Erro ao criar atleta:', error);
      throw error;
    }
  },

  atualizar: async (id: string, dados: Partial<Atleta>) => {
    try {
      const response = await http.put<ApiResponse<Atleta>>(`/athletes/${id}`, dados)
      return response?.data?.data || null
    } catch (error) {
      console.error(`Erro ao atualizar atleta ${id}:`, error);
      throw error;
    }
  },

  excluir: async (id: string) => {
    try {
      await http.delete(`/athletes/${id}`)
    } catch (error) {
      console.error(`Erro ao excluir atleta ${id}:`, error);
      throw error;
    }
  },

  suspender: async (id: string, motivo: string) => {
    try {
      const response = await http.post<ApiResponse<Atleta>>(`/athletes/${id}/suspend`, { reason: motivo })
      return response?.data?.data || null
    } catch (error) {
      console.error(`Erro ao suspender atleta ${id}:`, error);
      throw error;
    }
  },

  reativar: async (id: string) => {
    try {
      const response = await http.post<ApiResponse<Atleta>>(`/athletes/${id}/reactivate`)
      return response?.data?.data || null
    } catch (error) {
      console.error(`Erro ao reativar atleta ${id}:`, error);
      throw error;
    }
  }
} 