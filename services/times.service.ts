import http from '@/lib/http'

// Interface principal do Time conforme definido no modelo do backend
interface Time {
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
interface ComiteItem {
  id?: number
  name: string
  role: string
}

// Interface para locais de treino
interface LocalTreino {
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
interface CriarTimePayload {
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

// Interface para resposta da API
interface ApiResponse<T> {
  data: T
  message: string
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
  listar: async (params?: ListarTimesParams) => {
    const response = await http.get<ApiResponse<Time[]>>('/teams', { params })
    return response.data?.data || []
  },

  // Obter um time específico pelo ID
  obter: async (id: number | string) => {
    const response = await http.get<ApiResponse<Time>>(`/teams/${id}`)
    return response.data?.data as Time
  },

  // Criar um novo time
  criar: async (dados: CriarTimePayload) => {
    const response = await http.post<ApiResponse<Time>>('/teams', dados)
    return response.data?.data as Time
  },

  // Atualizar dados de um time existente
  atualizar: async (id: number | string, dados: Partial<Time>) => {
    const response = await http.put<ApiResponse<Time>>(`/teams/${id}`, dados)
    return response.data?.data as Time
  },

  // Excluir um time
  excluir: async (id: number | string) => {
    await http.delete(`/teams/${id}`)
  },

  // Gerenciar atletas do time
  gerenciarAtletas: async (timeId: number | string, atletasIds: number[]) => {
    const response = await http.post<ApiResponse<Time>>(`/teams/${timeId}/athletes`, { 
      athletes: atletasIds 
    })
    return response.data?.data as Time
  },

  // Gerenciar comitê técnico do time
  gerenciarComiteTecnico: async (timeId: number | string, comite: ComiteItem[]) => {
    const response = await http.post<ApiResponse<Time>>(`/teams/${timeId}/technical-committee`, { 
      technical_committee: comite 
    })
    return response.data?.data as Time
  },

  // Gerenciar locais de treino do time
  gerenciarLocaisTreino: async (timeId: number | string, locais: LocalTreino[]) => {
    const response = await http.post<ApiResponse<Time>>(`/teams/${timeId}/training-locations`, { 
      training_locations: locais 
    })
    return response.data?.data as Time
  },

  // Adicionar uma competição ao time
  adicionarCompeticao: async (timeId: number | string, competicao: Competicao) => {
    const response = await http.post<ApiResponse<Competicao>>(`/teams/${timeId}/competitions`, competicao)
    return response.data?.data as Competicao
  },

  // Adicionar um evento ao time
  adicionarEvento: async (timeId: number | string, evento: Evento) => {
    const response = await http.post<ApiResponse<Evento>>(`/teams/${timeId}/events`, evento)
    return response.data?.data as Evento
  }
} 