import http from '@/lib/http'

interface Notificacao {
  id: string
  type: string
  notifiable_type: string
  notifiable_id: string
  data: {
    title: string
    message: string
    action?: string
    url?: string
    icon?: string
  }
  read_at: string | null
  created_at: string
  updated_at: string
}

interface ListarNotificacoesParams {
  page?: number
  per_page?: number
}

export const notificacoesService = {
  /**
   * Listar todas as notificações do usuário atual
   */
  listar: async (params?: ListarNotificacoesParams) => {
    const response = await http.get<Notificacao[]>('/notifications', { params })
    return response.data
  },

  /**
   * Listar apenas as notificações não lidas
   */
  listarNaoLidas: async (params?: ListarNotificacoesParams) => {
    const response = await http.get<Notificacao[]>('/notifications/unread', { params })
    return response.data
  },

  /**
   * Obter uma notificação específica
   */
  obter: async (id: string) => {
    const response = await http.get<Notificacao>(`/notifications/${id}`)
    return response.data
  },

  /**
   * Marcar uma notificação como lida
   */
  marcarComoLida: async (id: string) => {
    const response = await http.post(`/notifications/${id}/read`)
    return response.data
  },

  /**
   * Marcar todas as notificações como lidas
   */
  marcarTodasComoLidas: async () => {
    const response = await http.post('/notifications/read-all')
    return response.data
  },

  /**
   * Excluir uma notificação
   */
  excluir: async (id: string) => {
    await http.delete(`/notifications/${id}`)
  },

  /**
   * Excluir todas as notificações
   */
  excluirTodas: async () => {
    await http.delete('/notifications')
  }
} 