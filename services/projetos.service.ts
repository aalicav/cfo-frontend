import http from '@/lib/http'
import { PaginatedResponse } from './api'

// Interface para Projeto
export interface Projeto {
  id: number | string
  name: string
  modality: string
  type?: string
  status: 'planned' | 'in_progress' | 'completed'
  start_date: string
  end_date: string
  responsible: string
  description?: string
  target_audience?: string
  expected_participants?: number
  created_by?: number
  created_at?: string
  updated_at?: string
  completed_goals_count?: number
  total_goals_count?: number
  progress_percentage?: number
  status_display?: string
  goals?: MetaProjeto[]
  spaces?: EspacoProjeto[]
}

// Interface para Meta do Projeto
export interface MetaProjeto {
  id?: number | string
  project_id?: number | string
  description: string
  target_date?: string
  indicators?: string[]
  is_completed?: boolean
  created_at?: string
  updated_at?: string
}

// Interface para Espaço do Projeto (relacionamento)
export interface EspacoProjeto {
  id?: number | string
  project_id?: number | string
  space_id: number | string
  notes?: string
  schedule?: any
  space?: {
    id: number | string
    name: string
    type: string
    capacity: number
    image_url?: string
  }
}

// Interface para parâmetros de listagem
export interface ListarProjetosParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
  type?: string
  modality?: string
  sort_by?: string
  sort_dir?: 'asc' | 'desc'
}

// Interface para criação/atualização de projeto
export interface ProjetoPayload {
  name: string
  modality: string
  type?: string
  status: 'planned' | 'in_progress' | 'completed'
  start_date: string
  end_date: string
  responsible: string
  description?: string
  target_audience?: string
  expected_participants?: number
  spaces?: (number | string)[]
  goals?: {
    id?: number | string
    description: string
    target_date?: string
    indicators?: string[]
    is_completed?: boolean
  }[]
}

// Interface para resposta da API
interface ApiResponse<T> {
  status: string
  message: string
  data: T
}

export const projetosService = {
  // Listar projetos com filtros opcionais
  listar: async (params?: ListarProjetosParams) => {
    try {
      const response = await http.get<ApiResponse<PaginatedResponse<Projeto>>>('/projects', { params })
      return response.data?.data
    } catch (error) {
      console.error('Erro ao listar projetos:', error)
      return []
    }
  },

  // Obter um projeto pelo ID
  obter: async (id: number | string) => {
    try {
      const response = await http.get<ApiResponse<Projeto>>(`/projects/${id}`)
      return response.data?.data
    } catch (error) {
      console.error(`Erro ao obter projeto ${id}:`, error)
      throw error
    }
  },

  // Criar um novo projeto
  criar: async (dados: ProjetoPayload) => {
    try {
      const response = await http.post<ApiResponse<Omit<Projeto, 'created_at' | 'updated_at' | 'completed_goals_count' | 'total_goals_count' | 'progress_percentage' | 'status_display' | 'goals' | 'spaces' | 'id'>>>('/projects', dados)
      return {
        dados: response.data?.data,
        mensagem: response.data?.message
      }
    } catch (error) {
      console.error('Erro ao criar projeto:', error)
      throw error
    }
  },

  // Atualizar um projeto existente
  atualizar: async (id: number | string, dados: Partial<ProjetoPayload>) => {
    try {
      const response = await http.put<ApiResponse<Projeto>>(`/projects/${id}`, dados)
      return {
        dados: response.data?.data,
        mensagem: response.data?.message
      }
    } catch (error) {
      console.error(`Erro ao atualizar projeto ${id}:`, error)
      throw error
    }
  },

  // Excluir um projeto
  excluir: async (id: number | string) => {
    try {
      const response = await http.delete<ApiResponse<null>>(`/projects/${id}`)
      return {
        mensagem: response.data?.message
      }
    } catch (error) {
      console.error(`Erro ao excluir projeto ${id}:`, error)
      throw error
    }
  },

  // Gerenciar metas do projeto
  gerenciarMetas: async (id: number | string, metas: MetaProjeto[]) => {
    try {
      const response = await http.post<ApiResponse<MetaProjeto[]>>(`/projects/${id}/goals`, { goals: metas })
      return {
        dados: response.data?.data,
        mensagem: response.data?.message
      }
    } catch (error) {
      console.error(`Erro ao gerenciar metas do projeto ${id}:`, error)
      throw error
    }
  },

  // Gerenciar espaços do projeto
  gerenciarEspacos: async (id: number | string, espacos: (number | string)[]) => {
    try {
      const response = await http.post<ApiResponse<EspacoProjeto[]>>(`/projects/${id}/spaces`, { spaces: espacos })
      return {
        dados: response.data?.data,
        mensagem: response.data?.message
      }
    } catch (error) {
      console.error(`Erro ao gerenciar espaços do projeto ${id}:`, error)
      throw error
    }
  },

  // Obter tipos de projetos para dropdown
  getTipos: async () => {
    try {
      const response = await http.get<ApiResponse<string[]>>('/projects/types')
      return response.data?.data
    } catch (error) {
      console.error('Erro ao obter tipos de projetos:', error)
      return []
    }
  },

  // Obter estatísticas de projetos
  getEstatisticas: async () => {
    try {
      const response = await http.get<ApiResponse<{
        status_counts: Record<string, number>,
        type_counts: Record<string, number>,
        total_projects: number,
        recent_projects: Projeto[],
        upcoming_projects: Projeto[]
      }>>('/projects/statistics')
      return response.data?.data
    } catch (error) {
      console.error('Erro ao obter estatísticas de projetos:', error)
      throw error
    }
  }
} 