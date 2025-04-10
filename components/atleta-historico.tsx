"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Medal, Dumbbell, Users, FileText, User } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AtletaHistoricoProps {
  atletaId: string
}

export function AtletaHistorico({ atletaId }: AtletaHistoricoProps) {
  const [activeTab, setActiveTab] = useState("todos")

  // Dados simulados para o histórico
  const historicoCompeticoes = [
    {
      id: 1,
      nome: "Campeonato Estadual de Natação",
      data: "15/03/2025",
      local: "Centro Aquático Municipal",
      modalidade: "Natação",
      categoria: "Juvenil",
      resultado: "2º Lugar - 100m Livre",
      time: "Time de Natação Juvenil",
    },
    {
      id: 2,
      nome: "Copa Regional de Natação",
      data: "20/01/2025",
      local: "Clube Aquático",
      modalidade: "Natação",
      categoria: "Juvenil",
      resultado: "1º Lugar - Revezamento 4x100m",
      time: "Time de Natação Juvenil",
    },
  ]

  const historicoProjetos = [
    {
      id: 1,
      nome: "Natação Olímpica",
      dataInicio: "01/01/2025",
      dataFim: "31/12/2025",
      status: "Em andamento",
      modalidade: "Natação",
      responsavel: "Carlos Mendes",
    },
  ]

  const historicoModalidades = [
    {
      id: 1,
      nome: "Natação",
      dataInicio: "01/01/2025",
      status: "Ativo",
      nivel: "Intermediário",
      treinador: "Carlos Mendes",
    },
  ]

  const historicoTimes = [
    {
      id: 1,
      nome: "Time de Natação Juvenil",
      dataInicio: "01/01/2025",
      status: "Ativo",
      categoria: "Juvenil",
      tecnico: "Carlos Mendes",
    },
  ]

  // Filtrar histórico com base na aba selecionada
  const getHistoricoFiltrado = () => {
    switch (activeTab) {
      case "competicoes":
        return historicoCompeticoes
      case "projetos":
        return historicoProjetos
      case "modalidades":
        return historicoModalidades
      case "times":
        return historicoTimes
      default:
        return [
          ...historicoCompeticoes.map((item) => ({ ...item, tipo: "competicao" })),
          ...historicoProjetos.map((item) => ({ ...item, tipo: "projeto" })),
          ...historicoModalidades.map((item) => ({ ...item, tipo: "modalidade" })),
          ...historicoTimes.map((item) => ({ ...item, tipo: "time" })),
        ].sort((a, b) => {
          // Ordenar por data (mais recente primeiro)
          const dataA = a.data || a.dataInicio
          const dataB = b.data || b.dataInicio
          return (
            new Date(dataB.split("/").reverse().join("-")).getTime() -
            new Date(dataA.split("/").reverse().join("-")).getTime()
          )
        })
    }
  }

  const historicoFiltrado = getHistoricoFiltrado()

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="competicoes">Competições</TabsTrigger>
          <TabsTrigger value="projetos">Projetos</TabsTrigger>
          <TabsTrigger value="modalidades">Modalidades</TabsTrigger>
          <TabsTrigger value="times">Times</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-6">
          {historicoFiltrado.length > 0 ? (
            <div className="relative border-l-2 border-gray-200 pl-6 ml-3 space-y-6">
              {historicoFiltrado.map((item: any, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[31px] mt-1.5 h-4 w-4 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        item.tipo === "competicao"
                          ? "bg-yellow-500"
                          : item.tipo === "projeto"
                            ? "bg-green-500"
                            : item.tipo === "modalidade"
                              ? "bg-blue-500"
                              : "bg-purple-500"
                      }`}
                    />
                  </div>
                  <div className="mb-1 flex items-center">
                    <Badge variant="outline" className="mr-2">
                      {item.data || item.dataInicio}
                    </Badge>
                    <Badge
                      className={`${
                        item.tipo === "competicao"
                          ? "bg-yellow-500"
                          : item.tipo === "projeto"
                            ? "bg-green-500"
                            : item.tipo === "modalidade"
                              ? "bg-blue-500"
                              : "bg-purple-500"
                      }`}
                    >
                      <div className="flex items-center">
                        {item.tipo === "competicao" ? (
                          <Medal className="h-4 w-4 mr-1" />
                        ) : item.tipo === "projeto" ? (
                          <FileText className="h-4 w-4 mr-1" />
                        ) : item.tipo === "modalidade" ? (
                          <Dumbbell className="h-4 w-4 mr-1" />
                        ) : (
                          <Users className="h-4 w-4 mr-1" />
                        )}
                        <span>
                          {item.tipo === "competicao"
                            ? "Competição"
                            : item.tipo === "projeto"
                              ? "Projeto"
                              : item.tipo === "modalidade"
                                ? "Modalidade"
                                : "Time"}
                        </span>
                      </div>
                    </Badge>
                  </div>
                  <h4 className="font-medium">{item.nome}</h4>
                  {item.tipo === "competicao" && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        {item.modalidade} - {item.categoria}
                      </p>
                      <p className="text-sm font-medium mt-1">{item.resultado}</p>
                      <div className="flex items-center mt-1">
                        <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{item.time}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{item.local}</span>
                      </div>
                    </>
                  )}
                  {item.tipo === "projeto" && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        {item.modalidade} - {item.status}
                      </p>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {item.dataInicio} a {item.dataFim}
                        </span>
                      </div>
                      <div className="flex items-center mt-1">
                        <User className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Responsável: {item.responsavel}</span>
                      </div>
                    </>
                  )}
                  {item.tipo === "modalidade" && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Nível: {item.nivel} - {item.status}
                      </p>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Desde {item.dataInicio}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <User className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Treinador: {item.treinador}</span>
                      </div>
                    </>
                  )}
                  {item.tipo === "time" && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Categoria: {item.categoria} - {item.status}
                      </p>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Desde {item.dataInicio}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <User className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Técnico: {item.tecnico}</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum registro encontrado para este atleta.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function MapPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
