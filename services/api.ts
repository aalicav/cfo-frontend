import { authService } from './auth.service'
import { avaliacoesService } from './avaliacoes.service'
import { atletasService } from './atletas.service'
import { timesService } from './times.service'
export interface PaginatedResponse<T> {
  current_page: number
  data: T[]
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

export {
  authService,
  avaliacoesService,
  atletasService,
  timesService
} 