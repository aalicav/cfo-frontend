import { Atleta } from './atleta';

// Interface do backend
export interface Avaliacao {
  id: string;
  nome: string;
  descricao: string;
  data: string;
  status: 'pendente' | 'concluida' | 'cancelada';
}

// Interface do frontend
export interface AvaliacaoFrontend {
  id: string;
  type: string;
  date: string;
  responsible: string;
  athlete: {
    id: string;
    name: string;
    photo?: string;
  };
  modality: string;
  observations?: string;
  indicators?: Array<{
    name: string;
    value: string;
    unit: string;
    reference?: string;
    percentage?: number;
    description?: string;
    observation?: string;
  }>;
}

// Parâmetros para listagem
export interface ListarAvaliacoesParams {
  page?: number;
  perPage?: number;
  status?: Avaliacao['status'];
  search?: string;
}

// Resposta da API
export interface ApiResponse<T> {
  data: T;
  message?: string;
} 