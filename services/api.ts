import { authService } from './auth.service'
import { avaliacoesService } from './avaliacoes.service'
import { atletasService } from './atletas.service'
import { timesService } from './times.service'

// Interface para resposta da API
export interface ApiResponse<T> {
  data: T
  message: string
  status: string
}

// Interface para resposta paginada
export interface PaginatedResponse<T> {
  current_page: number
  data: T[]
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

// Interface de Atleta
export interface Atleta {
  id: number | string  // Aceitamos tanto number (do backend) quanto string (para uso com componentes)
  nome: string
  email: string
  telefone: string
  dataNascimento: string
  status: 'ativo' | 'inativo' | 'suspenso'
  registrationNumber?: string
  modality?: string
  category?: string
}

// Interface para parâmetros de busca de atletas
export interface BuscarAtletasParams {
  search?: string
  status?: string | string[]
  modality?: string
  limit?: number
}

// Parâmetros para listar atletas
export interface ListarAtletasParams {
  page?: number
  per_page?: number
  search?: string
  status?: 'ativo' | 'inativo' | 'suspenso' | 'active' | 'inactive' | 'suspended'
  modality?: string
  category?: string
  sort_by?: string
  sort_dir?: string
}

export {
  authService,
  avaliacoesService,
  atletasService,
  timesService
} 