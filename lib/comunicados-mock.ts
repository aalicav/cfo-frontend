export interface Comunicado {
  id: string
  titulo: string
  conteudo: string
  autor: string
  data: string
  tipo: "geral" | "importante" | "urgente" | "informativo"
  destinatarios: string
  anexos?: string[]
}

export const comunicadosMock: Comunicado[] = [
  {
    id: "com-001",
    titulo: "Alteração no Calendário de Competições",
    conteudo:
      "Informamos que o calendário de competições para o segundo trimestre de 2025 foi atualizado. As novas datas estão disponíveis no sistema. Por favor, verifiquem as alterações e ajustem seus planejamentos de treino conforme necessário.",
    autor: "Ana Oliveira - Coordenadora",
    data: "2025-03-18T14:30:00",
    tipo: "importante",
    destinatarios: "Todos os usuários",
    anexos: ["calendario_competicoes_2025.pdf"],
  },
  {
    id: "com-002",
    titulo: "Manutenção da Piscina Olímpica",
    conteudo:
      "Comunicamos que a Piscina Olímpica estará fechada para manutenção entre os dias 25/03/2025 e 28/03/2025. Durante este período, os treinos de natação serão realizados na piscina auxiliar, com horários ajustados conforme disponibilidade.",
    autor: "Carlos Santos - Gerente de Infraestrutura",
    data: "2025-03-17T10:15:00",
    tipo: "geral",
    destinatarios: "Atletas, Instrutores",
  },
  {
    id: "com-003",
    titulo: "Suspensão Temporária de Atividades",
    conteudo:
      "Devido a problemas na rede elétrica do Centro de Formação Olímpica, todas as atividades estão suspensas no dia 22/03/2025. A previsão é que o problema seja resolvido até o final do dia. Atualizações serão enviadas por e-mail e notificações no sistema.",
    autor: "Roberto Mendes - Diretor",
    data: "2025-03-16T18:45:00",
    tipo: "urgente",
    destinatarios: "Todos os usuários",
  },
  {
    id: "com-004",
    titulo: "Novos Protocolos de Segurança",
    conteudo:
      "Informamos que foram implementados novos protocolos de segurança no Centro de Formação Olímpica. Todos os usuários devem se familiarizar com as novas diretrizes, disponíveis no documento anexo. Treinamentos serão realizados nas próximas semanas.",
    autor: "Juliana Oliveira - Gerente de Segurança",
    data: "2025-03-15T09:30:00",
    tipo: "informativo",
    destinatarios: "Todos os usuários",
    anexos: ["protocolos_seguranca_2025.pdf", "calendario_treinamentos.xlsx"],
  },
  {
    id: "com-005",
    titulo: "Visita de Atletas Olímpicos",
    conteudo:
      "Temos o prazer de anunciar que no dia 30/03/2025, receberemos a visita de atletas olímpicos que participaram dos Jogos de 2024. Haverá uma palestra motivacional e sessão de autógrafos. A participação é aberta a todos os atletas e funcionários do CFO.",
    autor: "Márcia Santos - Coordenadora de Eventos",
    data: "2025-03-14T15:00:00",
    tipo: "geral",
    destinatarios: "Todos os usuários",
    anexos: ["programacao_visita.pdf"],
  },
  {
    id: "com-006",
    titulo: "Atualização do Sistema",
    conteudo:
      "Informamos que o sistema do Centro de Formação Olímpica será atualizado para a versão 2.5 no dia 25/03/2025, entre 23:00 e 01:00. Durante este período, o sistema estará indisponível. A nova versão inclui melhorias na interface e novas funcionalidades.",
    autor: "Pedro Almeida - Administrador de Sistemas",
    data: "2025-03-13T11:20:00",
    tipo: "informativo",
    destinatarios: "Todos os usuários",
    anexos: ["novidades_sistema_v2.5.pdf"],
  },
  {
    id: "com-007",
    titulo: "Campanha de Vacinação",
    conteudo:
      "O Centro de Formação Olímpica, em parceria com a Secretaria de Saúde, realizará uma campanha de vacinação contra gripe nos dias 26 e 27/03/2025. A vacinação é gratuita e recomendada para todos os atletas e funcionários.",
    autor: "Dr. Ricardo Silva - Departamento Médico",
    data: "2025-03-12T14:45:00",
    tipo: "importante",
    destinatarios: "Todos os usuários",
  },
]
