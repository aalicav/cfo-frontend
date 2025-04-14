import http from '@/lib/http'

// Interface para estatísticas do dashboard
export interface DashboardStats {
  total_atletas: number
  projetos_ativos: number
  agendamentos_hoje: number
  desempenho_medio: number
  atividades_recentes: AtividadeRecente[]
  proximos_eventos: ProximoEvento[]
  notificacoes: Notificacao[]
}

// Interface para atividade recente
export interface AtividadeRecente {
  id: number
  tipo: string
  descricao: string
  data: string
  atleta?: string
  atleta_id?: number
}

// Interface para próximo evento
export interface ProximoEvento {
  id: number
  titulo: string
  local: string
  horario: string
  tipo: string
}

// Interface para notificação
export interface Notificacao {
  id: number
  titulo: string
  descricao: string
  lida: boolean
  data: string
}

// Interface para métricas de desempenho
export interface MetricasDesempenho {
  categoria: string
  valor: number
  percentual: number
}

// Serviço do dashboard
export const dashboardService = {
  // Obter estatísticas gerais do dashboard
  getEstatisticas: async () => {
    try {
      const response = await http.get<any>('/dashboard/statistics')
      return response.data?.data || null
    } catch (error) {
      console.error('Erro ao obter estatísticas do dashboard:', error)
      return null
    }
  },

  // Obter estatísticas específicas para cada perfil de usuário
  getEstatisticasPerfil: async (perfil: string) => {
    try {
      const response = await http.get<any>(`/dashboard/${perfil}/statistics`)
      return response.data?.data || null
    } catch (error) {
      console.error(`Erro ao obter estatísticas para o perfil ${perfil}:`, error)
      return null
    }
  },

  // Obter atividades recentes
  getAtividadesRecentes: async (limit: number = 5) => {
    try {
      const response = await http.get<any>('/dashboard/activities', { params: { limit } })
      return response.data?.data || []
    } catch (error) {
      console.error('Erro ao obter atividades recentes:', error)
      return []
    }
  },

  // Obter próximos eventos
  getProximosEventos: async (limit: number = 3) => {
    try {
      const response = await http.get<any>('/dashboard/events', { params: { limit } })
      return response.data?.data || []
    } catch (error) {
      console.error('Erro ao obter próximos eventos:', error)
      return []
    }
  },

  // Obter métricas de desempenho
  getMetricasDesempenho: async () => {
    try {
      const response = await http.get<any>('/dashboard/performance')
      return response.data?.data || []
    } catch (error) {
      console.error('Erro ao obter métricas de desempenho:', error)
      return []
    }
  }
} 