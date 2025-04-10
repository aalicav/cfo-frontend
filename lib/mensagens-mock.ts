export interface Mensagem {
  id: string
  assunto: string
  conteudo: string
  remetente: {
    id: string
    nome: string
    cargo: string
    foto: string
  }
  destinatario: {
    id: string
    nome: string
  }
  data: string
  status: "lida" | "nao-lida"
}

export const mensagensMock: Mensagem[] = [
  {
    id: "msg-001",
    assunto: "Avaliação de Desempenho",
    conteudo:
      "Olá, gostaria de agendar uma reunião para discutirmos os resultados da última avaliação de desempenho dos atletas da equipe de natação. Podemos nos encontrar na próxima semana? Por favor, sugira algumas datas e horários que sejam convenientes para você.",
    remetente: {
      id: "user-001",
      nome: "Carlos Silva",
      cargo: "Treinador de Natação",
      foto: "/placeholder.svg?height=40&width=40",
    },
    destinatario: {
      id: "user-002",
      nome: "Ana Oliveira",
    },
    data: "2025-03-19T14:30:00",
    status: "nao-lida",
  },
  {
    id: "msg-002",
    assunto: "Solicitação de Materiais",
    conteudo:
      "Prezado(a), estou enviando a lista de materiais necessários para os treinos da próxima semana. Precisamos de 10 bolas de vôlei, 15 coletes e 20 cones. Poderia providenciar esses itens até segunda-feira? Agradeço antecipadamente.",
    remetente: {
      id: "user-003",
      nome: "Juliana Oliveira",
      cargo: "Treinadora de Vôlei",
      foto: "/placeholder.svg?height=40&width=40",
    },
    destinatario: {
      id: "user-002",
      nome: "Ana Oliveira",
    },
    data: "2025-03-18T10:15:00",
    status: "lida",
  },
  {
    id: "msg-003",
    assunto: "Relatório de Frequência",
    conteudo:
      "Segue em anexo o relatório de frequência dos atletas da equipe de atletismo referente ao mês de fevereiro. Observamos uma queda na frequência em relação ao mês anterior. Sugiro que discutamos estratégias para melhorar esse indicador na próxima reunião de coordenação.",
    remetente: {
      id: "user-004",
      nome: "Pedro Almeida",
      cargo: "Coordenador de Atletismo",
      foto: "/placeholder.svg?height=40&width=40",
    },
    destinatario: {
      id: "user-002",
      nome: "Ana Oliveira",
    },
    data: "2025-03-17T16:45:00",
    status: "lida",
  },
  {
    id: "msg-004",
    assunto: "Confirmação de Participação em Evento",
    conteudo:
      "Confirmo minha participação no Workshop de Nutrição Esportiva que será realizado no dia 29/03/2025. Gostaria de saber se há algum material que devo levar ou preparar para o evento. Aguardo mais informações.",
    remetente: {
      id: "user-005",
      nome: "Mariana Costa",
      cargo: "Nutricionista",
      foto: "/placeholder.svg?height=40&width=40",
    },
    destinatario: {
      id: "user-002",
      nome: "Ana Oliveira",
    },
    data: "2025-03-16T09:30:00",
    status: "nao-lida",
  },
  {
    id: "msg-005",
    assunto: "Dúvida sobre Agendamento",
    conteudo:
      "Estou com uma dúvida sobre o agendamento da Quadra Poliesportiva para o dia 25/03/2025. No sistema consta que a quadra está reservada para a equipe de basquete, mas havíamos combinado que neste dia seria utilizada pela equipe de vôlei. Poderia verificar essa informação?",
    remetente: {
      id: "user-006",
      nome: "Roberto Santos",
      cargo: "Instrutor",
      foto: "/placeholder.svg?height=40&width=40",
    },
    destinatario: {
      id: "user-002",
      nome: "Ana Oliveira",
    },
    data: "2025-03-15T13:20:00",
    status: "lida",
  },
  {
    id: "msg-006",
    assunto: "Solicitação de Férias",
    conteudo:
      "Venho por meio desta solicitar férias no período de 10/04/2025 a 25/04/2025. Durante minha ausência, o treinador auxiliar João Pereira assumirá as atividades da equipe de natação. Já conversamos sobre o planejamento e ele está ciente de todas as responsabilidades.",
    remetente: {
      id: "user-001",
      nome: "Carlos Silva",
      cargo: "Treinador de Natação",
      foto: "/placeholder.svg?height=40&width=40",
    },
    destinatario: {
      id: "user-002",
      nome: "Ana Oliveira",
    },
    data: "2025-03-14T11:00:00",
    status: "lida",
  },
  {
    id: "msg-007",
    assunto: "Feedback sobre Avaliação",
    conteudo:
      "Gostaria de agradecer pelo feedback detalhado sobre minha última avaliação de desempenho. As sugestões foram muito úteis e já estou implementando as melhorias sugeridas. Se puder, gostaria de agendar uma conversa para discutirmos mais alguns pontos específicos.",
    remetente: {
      id: "user-007",
      nome: "Fernanda Lima",
      cargo: "Atleta",
      foto: "/placeholder.svg?height=40&width=40",
    },
    destinatario: {
      id: "user-002",
      nome: "Ana Oliveira",
    },
    data: "2025-03-13T15:30:00",
    status: "nao-lida",
  },
]
