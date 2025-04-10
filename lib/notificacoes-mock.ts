export interface Notificacao {
  id: string
  titulo: string
  conteudo: string
  tipo: "agendamento" | "alteracao" | "cancelamento" | "confirmacao" | "sistema"
  status: "lida" | "nao-lida"
  data: string
}

export const notificacoesMock: Notificacao[] = [
  {
    id: "notif-001",
    titulo: "Novo agendamento criado",
    conteudo: "Um novo agendamento foi criado para a Piscina Olímpica no dia 25/03/2025 às 15:00.",
    tipo: "agendamento",
    status: "nao-lida",
    data: "2025-03-20T10:30:00",
  },
  {
    id: "notif-002",
    titulo: "Agendamento alterado",
    conteudo: "O agendamento da Quadra Poliesportiva foi alterado de 18/03/2025 para 19/03/2025.",
    tipo: "alteracao",
    status: "nao-lida",
    data: "2025-03-19T14:15:00",
  },
  {
    id: "notif-003",
    titulo: "Agendamento cancelado",
    conteudo: "O agendamento da Pista de Atletismo para o dia 22/03/2025 foi cancelado.",
    tipo: "cancelamento",
    status: "nao-lida",
    data: "2025-03-18T09:45:00",
  },
  {
    id: "notif-004",
    titulo: "Agendamento confirmado",
    conteudo: "Seu agendamento para o Ginásio no dia 30/03/2025 foi confirmado.",
    tipo: "confirmacao",
    status: "lida",
    data: "2025-03-17T16:20:00",
  },
  {
    id: "notif-005",
    titulo: "Manutenção programada",
    conteudo: "O sistema estará indisponível para manutenção no dia 25/03/2025 das 23:00 às 01:00.",
    tipo: "sistema",
    status: "lida",
    data: "2025-03-15T11:00:00",
  },
  {
    id: "notif-006",
    titulo: "Nova avaliação agendada",
    conteudo: "Uma nova avaliação física foi agendada para o atleta João Silva no dia 28/03/2025 às 10:00.",
    tipo: "agendamento",
    status: "lida",
    data: "2025-03-14T13:30:00",
  },
  {
    id: "notif-007",
    titulo: "Conflito de agendamento",
    conteudo: "Foi detectado um conflito de agendamento na Sala de Lutas para o dia 26/03/2025 às 16:00.",
    tipo: "sistema",
    status: "nao-lida",
    data: "2025-03-13T15:45:00",
  },
  {
    id: "notif-008",
    titulo: "Novo documento disponível",
    conteudo: "Um novo documento foi adicionado ao sistema: 'Regulamento de Competições 2025'.",
    tipo: "sistema",
    status: "lida",
    data: "2025-03-12T10:15:00",
  },
  {
    id: "notif-009",
    titulo: "Alteração de horário",
    conteudo: "O horário do treino de Natação foi alterado de 14:00 para 15:30 no dia 24/03/2025.",
    tipo: "alteracao",
    status: "lida",
    data: "2025-03-11T09:00:00",
  },
  {
    id: "notif-010",
    titulo: "Cancelamento de evento",
    conteudo: "O evento 'Workshop de Nutrição Esportiva' agendado para 27/03/2025 foi cancelado.",
    tipo: "cancelamento",
    status: "lida",
    data: "2025-03-10T14:20:00",
  },
]
