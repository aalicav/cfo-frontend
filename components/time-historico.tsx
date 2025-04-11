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
      descricao: "Alteração no cronograma de treinamentos",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveTab("todos")}
          className={`px-3 py-1 rounded ${activeTab === "todos" ? "bg-green-700 text-white" : "bg-gray-100"}`}
        >
          Todos
        </button>
        <button
          onClick={() => setActiveTab("competicoes")}
          className={`px-3 py-1 rounded ${activeTab === "competicoes" ? "bg-green-700 text-white" : "bg-gray-100"}`}
        >
          Competições
        </button>
        <button
          onClick={() => setActiveTab("atletas")}
          className={`px-3 py-1 rounded ${activeTab === "atletas" ? "bg-green-700 text-white" : "bg-gray-100"}`}
        >
          Atletas
        </button>
        <button
          onClick={() => setActiveTab("treinamentos")}
          className={`px-3 py-1 rounded ${activeTab === "treinamentos" ? "bg-green-700 text-white" : "bg-gray-100"}`}
        >
          Treinamentos
        </button>
      </div>
      
      <div className="space-y-4">
        {(activeTab === "todos" || activeTab === "competicoes") && (
          <div>
            <h3 className="text-lg font-medium mb-2">Competições</h3>
            {historicoCompeticoes.map((competicao) => (
              <div key={competicao.id} className="border p-3 rounded-md mb-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{competicao.nome}</h4>
                  <span className="text-sm text-gray-500">{competicao.data}</span>
                </div>
                <p className="text-sm text-gray-600">{competicao.local}</p>
                <p className="text-sm font-medium mt-1">{competicao.resultado}</p>
                {competicao.destaques && (
                  <div className="mt-2">
                    <p className="text-xs font-medium">Destaques:</p>
                    <ul className="text-xs text-gray-600 list-disc list-inside">
                      {competicao.destaques.map((destaque, idx) => (
                        <li key={idx}>{destaque}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {(activeTab === "todos" || activeTab === "atletas") && (
          <div>
            <h3 className="text-lg font-medium mb-2">Atletas</h3>
            {historicoAtletas.map((evento) => (
              <div key={evento.id} className="border p-3 rounded-md mb-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{evento.nome}</h4>
                  <span className="text-sm text-gray-500">{evento.data}</span>
                </div>
                <p className="text-sm text-gray-600">
                  {evento.tipo === "entrada" ? "Entrada no time" : "Saída do time"}
                </p>
                <p className="text-sm mt-1">{evento.descricao}</p>
              </div>
            ))}
          </div>
        )}
        
        {(activeTab === "todos" || activeTab === "treinamentos") && (
          <div>
            <h3 className="text-lg font-medium mb-2">Treinamentos</h3>
            {historicoTreinamentos.map((evento) => (
              <div key={evento.id} className="border p-3 rounded-md mb-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{evento.tipo}</h4>
                  <span className="text-sm text-gray-500">{evento.data}</span>
                </div>
                <p className="text-sm mt-1">{evento.descricao}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
