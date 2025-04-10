import { atletasMock } from "./atletas-mock"

export interface Indicador {
  nome: string
  valor: number | string
  unidade: string
  referencia?: number | string
  percentual?: number
  descricao?: string
  observacao?: string
}

export interface Avaliacao {
  id: string
  tipo: "Física" | "Técnica" | "Médica"
  data: string
  responsavel: string
  atleta: {
    id: string
    nome: string
    foto: string
  }
  modalidade: string
  observacoes?: string
  indicadores?: Indicador[]
}

export const avaliacoesMock: Avaliacao[] = [
  {
    id: "aval-001",
    tipo: "Física",
    data: "15/03/2025",
    responsavel: "Carlos Silva",
    atleta: {
      id: atletasMock[0].id,
      nome: atletasMock[0].nome,
      foto: atletasMock[0].foto,
    },
    modalidade: "Natação",
    observacoes: "Atleta apresentou bom desempenho nos testes realizados.",
    indicadores: [
      {
        nome: "Resistência",
        valor: 85,
        unidade: "%",
        referencia: 80,
        percentual: 85,
        descricao: "Teste de resistência aeróbica",
      },
      {
        nome: "Força",
        valor: 78,
        unidade: "%",
        referencia: 75,
        percentual: 78,
        descricao: "Teste de força muscular",
      },
      {
        nome: "Velocidade",
        valor: 82,
        unidade: "%",
        referencia: 80,
        percentual: 82,
        descricao: "Teste de velocidade",
      },
      {
        nome: "Flexibilidade",
        valor: 70,
        unidade: "%",
        referencia: 75,
        percentual: 70,
        descricao: "Teste de flexibilidade",
        observacao: "Abaixo da referência. Recomenda-se trabalho específico.",
      },
    ],
  },
  {
    id: "aval-002",
    tipo: "Técnica",
    data: "20/03/2025",
    responsavel: "Ana Oliveira",
    atleta: {
      id: atletasMock[1].id,
      nome: atletasMock[1].nome,
      foto: atletasMock[1].foto,
    },
    modalidade: "Natação",
    indicadores: [
      {
        nome: "Técnica de Nado",
        valor: 88,
        unidade: "%",
        referencia: 85,
        percentual: 88,
        descricao: "Avaliação da técnica de nado crawl",
      },
      {
        nome: "Viradas",
        valor: 82,
        unidade: "%",
        referencia: 80,
        percentual: 82,
        descricao: "Avaliação da técnica de viradas",
      },
      {
        nome: "Saídas",
        valor: 85,
        unidade: "%",
        referencia: 85,
        percentual: 85,
        descricao: "Avaliação da técnica de saídas",
      },
    ],
  },
  {
    id: "aval-003",
    tipo: "Médica",
    data: "10/03/2025",
    responsavel: "Dr. Roberto Mendes",
    atleta: {
      id: atletasMock[2].id,
      nome: atletasMock[2].nome,
      foto: atletasMock[2].foto,
    },
    modalidade: "Atletismo",
    observacoes: "Atleta em boas condições de saúde. Liberado para atividades de alta intensidade.",
    indicadores: [
      {
        nome: "Frequência Cardíaca em Repouso",
        valor: 58,
        unidade: "bpm",
        referencia: "60-70",
        percentual: 90,
        descricao: "Medição da frequência cardíaca em repouso",
      },
      {
        nome: "Pressão Arterial",
        valor: "120/80",
        unidade: "mmHg",
        referencia: "120/80",
        percentual: 100,
        descricao: "Medição da pressão arterial",
      },
      {
        nome: "IMC",
        valor: 22.5,
        unidade: "kg/m²",
        referencia: "18.5-24.9",
        percentual: 95,
        descricao: "Índice de Massa Corporal",
      },
    ],
  },
  {
    id: "aval-004",
    tipo: "Física",
    data: "05/03/2025",
    responsavel: "Carlos Silva",
    atleta: {
      id: atletasMock[3].id,
      nome: atletasMock[3].nome,
      foto: atletasMock[3].foto,
    },
    modalidade: "Judô",
    indicadores: [
      {
        nome: "Força",
        valor: 90,
        unidade: "%",
        referencia: 85,
        percentual: 90,
        descricao: "Teste de força muscular",
      },
      {
        nome: "Resistência",
        valor: 75,
        unidade: "%",
        referencia: 80,
        percentual: 75,
        descricao: "Teste de resistência aeróbica",
        observacao: "Abaixo da referência. Recomenda-se trabalho específico.",
      },
      {
        nome: "Flexibilidade",
        valor: 85,
        unidade: "%",
        referencia: 80,
        percentual: 85,
        descricao: "Teste de flexibilidade",
      },
    ],
  },
  {
    id: "aval-005",
    tipo: "Técnica",
    data: "25/02/2025",
    responsavel: "Ana Oliveira",
    atleta: {
      id: atletasMock[0].id,
      nome: atletasMock[0].nome,
      foto: atletasMock[0].foto,
    },
    modalidade: "Natação",
    indicadores: [
      {
        nome: "Técnica de Nado",
        valor: 82,
        unidade: "%",
        referencia: 85,
        percentual: 82,
        descricao: "Avaliação da técnica de nado crawl",
        observacao: "Melhorou em relação à avaliação anterior, mas ainda precisa ajustar a posição da cabeça.",
      },
      {
        nome: "Viradas",
        valor: 78,
        unidade: "%",
        referencia: 80,
        percentual: 78,
        descricao: "Avaliação da técnica de viradas",
      },
      {
        nome: "Saídas",
        valor: 80,
        unidade: "%",
        referencia: 85,
        percentual: 80,
        descricao: "Avaliação da técnica de saídas",
      },
    ],
  },
  {
    id: "aval-006",
    tipo: "Médica",
    data: "18/02/2025",
    responsavel: "Dra. Márcia Santos",
    atleta: {
      id: atletasMock[1].id,
      nome: atletasMock[1].nome,
      foto: atletasMock[1].foto,
    },
    modalidade: "Natação",
    observacoes:
      "Atleta apresentou leve desconforto no ombro direito. Recomenda-se acompanhamento fisioterápico preventivo.",
    indicadores: [
      {
        nome: "Frequência Cardíaca em Repouso",
        valor: 62,
        unidade: "bpm",
        referencia: "60-70",
        percentual: 95,
        descricao: "Medição da frequência cardíaca em repouso",
      },
      {
        nome: "Pressão Arterial",
        valor: "118/78",
        unidade: "mmHg",
        referencia: "120/80",
        percentual: 98,
        descricao: "Medição da pressão arterial",
      },
      {
        nome: "Percentual de Gordura",
        valor: 12,
        unidade: "%",
        referencia: "10-15",
        percentual: 90,
        descricao: "Medição do percentual de gordura corporal",
      },
    ],
  },
]
