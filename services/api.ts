import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Configuração do axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Serviço de avaliações
export const avaliacoesService = {
  // Listar todas as avaliações com filtros
  listar: async (params?: any) => {
    const response = await api.get('/evaluations', { params });
    return response.data;
  },

  // Obter avaliações no formato do frontend
  listarFormatoFrontend: async (params?: any) => {
    const response = await api.get('/evaluations/frontend', { params });
    return response.data;
  },

  // Obter uma avaliação específica
  obter: async (id: string) => {
    const response = await api.get(`/evaluations/${id}`);
    return response.data;
  },

  // Obter uma avaliação no formato do frontend
  obterFormatoFrontend: async (id: string) => {
    const response = await api.get(`/evaluations/${id}/frontend`);
    return response.data;
  },

  // Criar uma nova avaliação
  criar: async (dados: any) => {
    const response = await api.post('/evaluations', dados);
    return response.data;
  },

  // Atualizar uma avaliação
  atualizar: async (id: string, dados: any) => {
    const response = await api.put(`/evaluations/${id}`, dados);
    return response.data;
  },

  // Excluir uma avaliação
  excluir: async (id: string) => {
    const response = await api.delete(`/evaluations/${id}`);
    return response.data;
  },

  // Importar avaliação do formato do frontend
  importar: async (dados: any) => {
    const response = await api.post('/evaluations/import-frontend', dados);
    return response.data;
  },

  // Completar uma avaliação
  completar: async (id: string) => {
    const response = await api.post(`/evaluations/${id}/complete`);
    return response.data;
  },

  // Cancelar uma avaliação
  cancelar: async (id: string, motivo: string) => {
    const response = await api.post(`/evaluations/${id}/cancel`, { cancellation_reason: motivo });
    return response.data;
  },

  // Minhas avaliações (do usuário autenticado)
  minhasAvaliacoes: async (params?: any) => {
    const response = await api.get('/evaluations/my', { params });
    return response.data;
  },
};

// Serviço de atletas
export const atletasService = {
  // Listar todos os atletas com filtros
  listar: async (params?: any) => {
    const response = await api.get('/athletes', { params });
    return response.data;
  },

  // Obter um atleta específico
  obter: async (id: string) => {
    const response = await api.get(`/athletes/${id}`);
    return response.data;
  },

  // Criar um novo atleta
  criar: async (dados: any) => {
    const response = await api.post('/athletes', dados);
    return response.data;
  },

  // Atualizar um atleta
  atualizar: async (id: string, dados: any) => {
    const response = await api.put(`/athletes/${id}`, dados);
    return response.data;
  },

  // Excluir um atleta
  excluir: async (id: string) => {
    const response = await api.delete(`/athletes/${id}`);
    return response.data;
  },

  // Obter avaliações de um atleta
  avaliacoes: async (id: string, params?: any) => {
    const response = await api.get(`/athletes/${id}/evaluations`, { params });
    return response.data;
  },

  // Renovar filiação
  renovarFiliacao: async (id: string, dados: any) => {
    const response = await api.post(`/athletes/${id}/renew`, dados);
    return response.data;
  },

  // Suspender um atleta
  suspender: async (id: string, dados: any) => {
    const response = await api.post(`/athletes/${id}/suspend`, dados);
    return response.data;
  },

  // Reativar um atleta
  reativar: async (id: string, dados?: any) => {
    const response = await api.post(`/athletes/${id}/reactivate`, dados);
    return response.data;
  },
};

export default api; 