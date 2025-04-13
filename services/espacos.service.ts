import http from '@/lib/http'

// Interface para Espaço
export interface Espaco {
  id: number | string
  name: string
  type?: string
  description?: string
  capacity?: number
  image_url?: string
  location?: string
  is_active?: boolean
  available_hours?: any[]
  created_at?: string
  updated_at?: string
}

// Interface para resposta da API
interface ApiResponse<T> {
  data: T
  message: string
  status: string
}

// Interface para resposta paginada
interface PaginatedResponse<T> {
  current_page: number
  data: T[]
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
  items?: T[] // Campo opcional para formatos variados
}

// Interface para resposta com items
interface ItemsResponse<T> {
  items: T[]
}

// Tipos para possíveis formatos de resposta
export type EspacosResponse = ApiResponse<PaginatedResponse<Espaco> | Espaco[] | ItemsResponse<Espaco>>

// Parâmetros para listar espaços
interface ListarEspacosParams {
  page?: number
  per_page?: number
  search?: string
  type?: string
  is_active?: boolean
  capacity_min?: number
  capacity_max?: number
  sort_by?: string
  sort_dir?: 'asc' | 'desc'
}

export const espacosService = {
  // Buscar lista de espaços com filtros opcionais
  listar: async (params?: ListarEspacosParams) => {
    try {
      const response = await http.get<ApiResponse<Espaco[] | PaginatedResponse<Espaco>>>('/spaces', { params })
      
      // Verificar o formato da resposta com base no controlador backend
      if (response.data?.data) {
        // Se for paginado (Laravel Pagination)
        if (typeof response.data.data === 'object' && 'data' in response.data.data) {
          return response.data.data.data;
        }
        // Se for array direto (sem paginação)
        else if (Array.isArray(response.data.data)) {
          return response.data.data;
        }
      }
      
      return []; // Retorno padrão caso nenhum formato conhecido seja encontrado
    } catch (error) {
      console.error('Erro ao listar espaços:', error);
      return [];
    }
  },

  // Obter um espaço específico pelo ID
  obter: async (id: number | string) => {
    const response = await http.get<ApiResponse<Espaco>>(`/spaces/${id}`)
    return response.data?.data
  },

  // Criar um novo espaço
  criar: async (dados: Partial<Espaco>) => {
    const response = await http.post<ApiResponse<Espaco>>('/spaces', dados)
    return response.data?.data
  },

  // Atualizar dados de um espaço existente
  atualizar: async (id: number | string, dados: Partial<Espaco>) => {
    const response = await http.put<ApiResponse<Espaco>>(`/spaces/${id}`, dados)
    return response.data?.data
  },

  // Excluir um espaço
  excluir: async (id: number | string) => {
    await http.delete(`/spaces/${id}`)
  },

  // Obter tipos de espaços disponíveis
  getTipos: async () => {
    const response = await http.get<ApiResponse<string[]>>('/spaces/types')
    return response.data?.data
  },

  // Verificar disponibilidade de um espaço
  verificarDisponibilidade: async (id: number | string, data: string, horarioInicio: string, horarioFim: string) => {
    const response = await http.get<ApiResponse<{ available: boolean }>>(`/spaces/${id}/check-availability`, {
      params: {
        date: data,
        start_time: horarioInicio,
        end_time: horarioFim
      }
    })
    return response.data?.data?.available || false
  }
} 