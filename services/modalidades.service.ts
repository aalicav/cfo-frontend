import http from '@/lib/http'

// Interface para Modalidade
export interface Modalidade {
  id: number | string
  name: string
  description?: string
  category?: string
  image_url?: string
  is_active?: boolean
  instructors?: number[]
  schedule?: any[]
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
export type ModalidadesResponse = ApiResponse<PaginatedResponse<Modalidade> | Modalidade[] | ItemsResponse<Modalidade>>

// Parâmetros para listar modalidades
interface ListarModalidadesParams {
  page?: number
  per_page?: number
  search?: string
  category?: string
  is_active?: boolean
  sort_by?: string
  sort_dir?: 'asc' | 'desc'
}

export const modalidadesService = {
  // Buscar lista de modalidades com filtros opcionais
  listar: async (params?: ListarModalidadesParams) => {
    try {
      const response = await http.get<ApiResponse<Modalidade[] | PaginatedResponse<Modalidade>>>('/modalities', { params })
      
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
      console.error('Erro ao listar modalidades:', error);
      return [];
    }
  },

  // Obter uma modalidade específica pelo ID
  obter: async (id: number | string) => {
    const response = await http.get<ApiResponse<Modalidade>>(`/modalities/${id}`)
    return response.data?.data
  },

  // Criar uma nova modalidade
  criar: async (dados: Partial<Modalidade>) => {
    const response = await http.post<ApiResponse<Modalidade>>('/modalities', dados)
    return response.data?.data
  },

  // Atualizar dados de uma modalidade existente
  atualizar: async (id: number | string, dados: Partial<Modalidade>) => {
    const response = await http.put<ApiResponse<Modalidade>>(`/modalities/${id}`, dados)
    return response.data?.data
  },

  // Excluir uma modalidade
  excluir: async (id: number | string) => {
    await http.delete(`/modalities/${id}`)
  },

  // Obter categorias disponíveis
  getCategorias: async () => {
    const response = await http.get<ApiResponse<any>>('/modalities/categories')
    return response.data?.data
  },

  // Obter instrutores disponíveis para modalidades
  getInstrutores: async () => {
    const response = await http.get<ApiResponse<any>>('/modalities/instructors')
    return response.data?.data
  }
} 