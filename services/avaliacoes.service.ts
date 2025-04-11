import http from '@/lib/http'

interface Avaliacao {
  id: string
  nome: string
  descricao: string
  data: string
  status: 'pendente' | 'concluida' | 'cancelada'
}

interface ListarAvaliacoesParams {
  page?: number
  perPage?: number
  status?: Avaliacao['status']
  search?: string
}

export const avaliacoesService = {
  listar: async (params?: ListarAvaliacoesParams) => {
    const response = await http.get<Avaliacao[]>('/evaluations', { params })
    return response.data
  },

  obter: async (id: string) => {
    const response = await http.get<Avaliacao>(`/evaluations/${id}`)
    return response.data
  },

  criar: async (dados: Omit<Avaliacao, 'id'>) => {
    const response = await http.post<Avaliacao>('/evaluations', dados)
    return response.data
  },

  atualizar: async (id: string, dados: Partial<Avaliacao>) => {
    const response = await http.put<Avaliacao>(`/evaluations/${id}`, dados)
    return response.data
  },

  excluir: async (id: string) => {
    await http.delete(`/evaluations/${id}`)
  },

  completar: async (id: string) => {
    const response = await http.post<Avaliacao>(`/evaluations/${id}/complete`)
    return response.data
  },

  cancelar: async (id: string, motivo: string) => {
    const response = await http.post<Avaliacao>(`/evaluations/${id}/cancel`, { motivo })
    return response.data
  }
} 