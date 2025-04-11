import http from '@/lib/http'

interface Time {
  id: string
  nome: string
  descricao: string
  categoria: string
  status: 'ativo' | 'inativo'
}

interface ListarTimesParams {
  page?: number
  perPage?: number
  status?: Time['status']
  search?: string
}

export const timesService = {
  listar: async (params?: ListarTimesParams) => {
    const response = await http.get<Time[]>('/teams', { params })
    return response.data
  },

  obter: async (id: string) => {
    const response = await http.get<Time>(`/teams/${id}`)
    return response.data
  },

  criar: async (dados: Omit<Time, 'id'>) => {
    const response = await http.post<Time>('/teams', dados)
    return response.data
  },

  atualizar: async (id: string, dados: Partial<Time>) => {
    const response = await http.put<Time>(`/teams/${id}`, dados)
    return response.data
  },

  excluir: async (id: string) => {
    await http.delete(`/teams/${id}`)
  },

  adicionarAtleta: async (timeId: string, atletaId: string) => {
    const response = await http.post<Time>(`/teams/${timeId}/athletes`, { atletaId })
    return response.data
  },

  removerAtleta: async (timeId: string, atletaId: string) => {
    const response = await http.delete<Time>(`/teams/${timeId}/athletes/${atletaId}`)
    return response.data
  }
} 