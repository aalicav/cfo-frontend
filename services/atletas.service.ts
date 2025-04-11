import http from '@/lib/http'

interface Atleta {
  id: string
  nome: string
  email: string
  telefone: string
  dataNascimento: string
  status: 'ativo' | 'inativo' | 'suspenso'
}

interface ListarAtletasParams {
  page?: number
  perPage?: number
  status?: Atleta['status']
  search?: string
}

export const atletasService = {
  listar: async (params?: ListarAtletasParams) => {
    const response = await http.get<Atleta[]>('/athletes', { params })
    return response.data
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