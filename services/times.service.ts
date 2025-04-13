import http from '@/lib/http'

// Interface principal do Time conforme definido no modelo do backend
export interface Time {
  id: number
  name: string
  modality: string
  category: string
  coach: string
  description?: string
  creation_date?: string
  medals: number
  competitions: number
  weekly_trainings: number
  created_at?: string
  updated_at?: string
  deleted_at?: string
  athletes?: Atleta[]
  technicalCommittee?: ComiteItem[]
  trainingLocations?: LocalTreino[]
}

// Interface de Atleta para relação com o time
interface Atleta {
  id: number
  name: string
  joined_at?: string
}

// Interface para membros do comitê técnico
export interface ComiteItem {
  id?: number
  name: string
  role: string
}

// Interface para locais de treino
export interface LocalTreino {
  id?: number
  name: string
  days: string
  schedule: string
  space_id?: number
}

// Interface para competições
interface Competicao {
  name: string
  date: string
  location: string
  result: string
  description?: string
  highlights?: string[]
}

// Interface para eventos
interface Evento {
  name: string
  date: string
  location: string
  description?: string
  type: string
}

// Interface para criação de um time
export interface CriarTimePayload {
  name: string
  modality: string
  category: string
  coach: string
  description?: string
  creation_date?: string
  athletes?: number[]
  technical_committee?: ComiteItem[]
  training_locations?: LocalTreino[]
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
  items?: T[]
}

// Interface para resposta da API
interface ApiResponse<T> {
  data: T
  message: string
  status?: string
}

// Parâmetros para listar times
interface ListarTimesParams {
  page?: number
  per_page?: number
  search?: string
  category?: string
  modality?: string
  sort_field?: 'name' | 'modality' | 'category' | 'created_at' | 'coach'
  sort_direction?: 'asc' | 'desc'
}

export const timesService = {
  // Buscar lista de times com filtros opcionais
  listar: async (params?: ListarTimesParams): Promise<Time[]> => {
    try {
      const response = await http.get<ApiResponse<PaginatedResponse<Time>>>('/teams', { params })
      
      // Verificar se a resposta é válida e tem a estrutura esperada
      if (response?.data?.data?.data && Array.isArray(response.data.data.data)) {
        return response.data.data.data;
      }
      
      // Se a resposta tiver a estrutura alternativa com 'items'
      if (response?.data?.data?.items && Array.isArray(response.data.data.items)) {
        return response.data.data.items;
      }
      
      // Fallback para array vazio
      return [];
    } catch (error) {
      console.error('Erro ao listar times:', error);
      return [];
    }
  },

  // Obter um time específico pelo ID
  obter: async (id: number | string): Promise<Time | undefined> => {
    try {
      const response = await http.get<ApiResponse<Time>>(`/teams/${id}`)
      return response.data?.data
    } catch (error) {
      console.error(`Erro ao obter time ${id}:`, error);
      return undefined;
    }
  },

  // Criar um novo time
  criar: async (dados: CriarTimePayload): Promise<Time | undefined> => {
    try {
      const response = await http.post<ApiResponse<Time>>('/teams', dados)
      return response.data?.data
    } catch (error) {
      console.error('Erro ao criar time:', error);
      throw error;
    }
  },

  // Atualizar dados de um time existente
  atualizar: async (id: number | string, dados: Partial<Time>): Promise<Time | undefined> => {
    try {
      const response = await http.put<ApiResponse<Time>>(`/teams/${id}`, dados)
      return response.data?.data
    } catch (error) {
      console.error(`Erro ao atualizar time ${id}:`, error);
      throw error;
    }
  },

  // Excluir um time
  excluir: async (id: number | string): Promise<void> => {
    try {
      await http.delete(`/teams/${id}`)
    } catch (error) {
      console.error(`Erro ao excluir time ${id}:`, error);
      throw error;
    }
  },

  // Gerenciar atletas do time
  gerenciarAtletas: async (timeId: number | string, atletasIds: number[]): Promise<Time | undefined> => {
    try {
      const response = await http.post<ApiResponse<Time>>(`/teams/${timeId}/athletes`, { 
        athletes: atletasIds 
      })
      return response.data?.data
    } catch (error) {
      console.error(`Erro ao gerenciar atletas do time ${timeId}:`, error);
      throw error;
    }
  },

  // Gerenciar comitê técnico do time
  gerenciarComiteTecnico: async (timeId: number | string, comite: ComiteItem[]) => {
    const response = await http.post<ApiResponse<Time>>(`/teams/${timeId}/technical-committee`, { 
      technical_committee: comite 
    })
    return response.data?.data
  },

  // Gerenciar locais de treino do time
  gerenciarLocaisTreino: async (timeId: number | string, locais: LocalTreino[]) => {
    const response = await http.post<ApiResponse<Time>>(`/teams/${timeId}/training-locations`, { 
      training_locations: locais 
    })
    return response.data?.data
  },

  // Adicionar uma competição ao time
  adicionarCompeticao: async (timeId: number | string, competicao: Competicao) => {
    const response = await http.post<ApiResponse<Competicao>>(`/teams/${timeId}/competitions`, competicao)
    return response.data?.data
  },

  // Adicionar um evento ao time
  adicionarEvento: async (timeId: number | string, evento: Evento) => {
    const response = await http.post<ApiResponse<Evento>>(`/teams/${timeId}/events`, evento)
    return response.data?.data
  }
} 