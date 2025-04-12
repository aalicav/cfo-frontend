import http from '@/lib/http'
import { 
  Atleta, 
  BuscarAtletasParams, 
  ListarAtletasParams, 
  ApiResponse, 
  PaginatedResponse 
} from './api'

export const atletasService = {
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

  listar: async (params?: ListarAtletasParams) => {
    try {
      // A API espera "search" como parâmetro para busca por nome
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
      
      // Fallback para array vazio
      return [];
    } catch (error) {
      console.error('Erro ao listar atletas:', error);
      return [];
    }
  },

  obter: async (id: string) => {
    const response = await http.get<Atleta>(`/athletes/${id}`)
    return response.data
  },

  criar: async (dados: Omit<Atleta, 'id'>) => {
    const response = await http.post<Atleta>('/athletes', dados)
    return response.data
  },

  atualizar: async (id: string, dados: Partial<Atleta>) => {
    const response = await http.put<Atleta>(`/athletes/${id}`, dados)
    return response.data
  },

  excluir: async (id: string) => {
    await http.delete(`/athletes/${id}`)
  },

  suspender: async (id: string, motivo: string) => {
    const response = await http.post<Atleta>(`/athletes/${id}/suspend`, { motivo })
    return response.data
  },

  reativar: async (id: string) => {
    const response = await http.post<Atleta>(`/athletes/${id}/reactivate`)
    return response.data
  }
} 