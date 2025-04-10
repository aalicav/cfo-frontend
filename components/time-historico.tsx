"use client"

import { useState } from "react"

interface TimeHistoricoProps {
  timeId: string
}

export function TimeHistorico({ timeId }: TimeHistoricoProps) {
  const [activeTab, setActiveTab] = useState("todos")

  // Dados simulados para o histórico
  const historicoCompeticoes = [
    {
      id: 1,
      nome: "Campeonato Estadual de Natação",
      data: "15/03/2025",
      local: "Centro Aquático Municipal",
      resultado: "2º Lugar Geral",
      destaques: ["João Silva - 1º Lugar 100m Livre", "Equipe - 1º Lugar Revezamento 4x100m"],
    },
    {
      id: 2,
      nome: "Copa Regional de Natação",
      data: "20/01/2025",
      local: "Clube Aquático",
      resultado: "1º Lugar Geral",
      destaques: ["Maria Santos - 1º Lugar 200m Livre", "Pedro Oliveira - 2º Lugar 100m Borboleta"],
    },
  ]

  const historicoAtletas = [
    {
      id: 1,
      tipo: "entrada",
      nome: "João Silva",
      data: "01/01/2025",
      descricao: "Novo atleta adicionado ao time",
    },
    {
      id: 2,
      tipo: "entrada",
      nome: "Maria Santos",
      data: "01/01/2025",
      descricao: "Nova atleta adicionada ao time",
    },
    {
      id: 3,
      tipo: "saida",
      nome: "Carlos Ferreira",
      data: "15/02/2025",
      descricao: "Atleta transferido para outro time",
    },
  ]

  const historicoTreinamentos = [
    {
      id: 1,
      tipo: "alteracao",
      data: "01/02/2025",
      descricao: \"Alteração no cronograma de
