import http from '@/lib/http'
import { Avaliacao, AvaliacaoFrontend, ListarAvaliacoesParams, ApiResponse } from '@/types/avaliacao'

export const avaliacoesService = {
  listar: async (params?: ListarAvaliacoesParams): Promise<AvaliacaoFrontend[]> => {
    try {
      const response = await http.get<ApiResponse<AvaliacaoFrontend[]>>('/evaluations/frontend', { params })
      return response?.data?.data || []
    } catch (error) {
      console.error('Erro ao listar avaliações:', error)
      return []
    }
  },

  obter: async (id: string): Promise<Avaliacao | undefined> => {
    try {
      const response = await http.get<ApiResponse<Avaliacao>>(`/evaluations/${id}`)
      return response?.data?.data
    } catch (error) {
      console.error(`Erro ao obter avaliação ${id}:`, error)
      return undefined
    }
  },

  obterFormatoFrontend: async (id: string): Promise<AvaliacaoFrontend | undefined> => {
    try {
      const response = await http.get<ApiResponse<AvaliacaoFrontend>>(`/evaluations/${id}/frontend`)
      return response?.data?.data
    } catch (error) {
      console.error(`Erro ao obter avaliação ${id}:`, error)
      return undefined
    }
  },

  criar: async (dados: Omit<Avaliacao, 'id'>): Promise<Avaliacao | undefined> => {
    try {
      const response = await http.post<ApiResponse<Avaliacao>>('/evaluations', dados)
      return response?.data?.data
    } catch (error) {
      console.error('Erro ao criar avaliação:', error)
      throw error
    }
  },

  atualizar: async (id: string, dados: Partial<Avaliacao>): Promise<Avaliacao | undefined> => {
    try {
      const response = await http.put<ApiResponse<Avaliacao>>(`/evaluations/${id}`, dados)
      return response?.data?.data
    } catch (error) {
      console.error(`Erro ao atualizar avaliação ${id}:`, error)
      throw error
    }
  },

  excluir: async (id: string): Promise<void> => {
    try {
      await http.delete(`/evaluations/${id}`)
    } catch (error) {
      console.error(`Erro ao excluir avaliação ${id}:`, error)
      throw error
    }
  },

  completar: async (id: string): Promise<Avaliacao | undefined> => {
    try {
      const response = await http.post<ApiResponse<Avaliacao>>(`/evaluations/${id}/complete`)
      return response?.data?.data
    } catch (error) {
      console.error(`Erro ao completar avaliação ${id}:`, error)
      throw error
    }
  },

  cancelar: async (id: string, motivo: string): Promise<Avaliacao | undefined> => {
    try {
      const response = await http.post<ApiResponse<Avaliacao>>(`/evaluations/${id}/cancel`, { motivo })
      return response?.data?.data
    } catch (error) {
      console.error(`Erro ao cancelar avaliação ${id}:`, error)
      throw error
    }
  },

  importarFormatoFrontend: async (dados: Omit<AvaliacaoFrontend, 'id'>): Promise<AvaliacaoFrontend | undefined> => {
    try {
      const response = await http.post<ApiResponse<AvaliacaoFrontend>>('/evaluations/import-frontend', dados)
      return response?.data?.data
    } catch (error) {
      console.error('Erro ao importar avaliação:', error)
      throw error
    }
  }
} 