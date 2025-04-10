"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, Award } from "lucide-react"

interface AtletaDesempenhoProps {
  atletaId: string
}

export function AtletaDesempenho({ atletaId }: AtletaDesempenhoProps) {
  const [activeTab, setActiveTab] = useState("geral")

  // Dados simulados para o desempenho
  const avaliacoesFisicas = [
    {
      id: 1,
      data: "15/01/2025",
      tipo: "Avaliação Inicial",
      resultados: [
        { nome: "Resistência", valor: 75, unidade: "%" },
        { nome: "Força", valor: 68, unidade: "%" },
        { nome: "Velocidade", valor: 82, unidade: "%" },
        { nome: "Flexibilidade", valor: 70, unidade: "%" },
      ],
    },
    {
      id: 2,
      data: "15/03/2025",
      tipo: "Avaliação Trimestral",
      resultados: [
        { nome: "Resistência", valor: 80, unidade: "%" },
        { nome: "Força", valor: 72, unidade: "%" },
        { nome: "Velocidade", valor: 85, unidade: "%" },
        { nome: "Flexibilidade", valor: 75, unidade: "%" },
      ],
    },
  ]

  const avaliacoesTecnicas = [
    {
      id: 1,
      data: "20/01/2025",
      modalidade: "Natação",
      resultados: [
        { nome: "Técnica de Nado", valor: 78, unidade: "%" },
        { nome: "Viradas", valor: 72, unidade: "%" },
        { nome: "Saídas", valor: 80, unidade: "%" },
        { nome: "Respiração", valor: 85, unidade: "%" },
      ],
    },
    {
      id: 2,
      data: "20/03/2025",
      modalidade: "Natação",
      resultados: [
        { nome: "Técnica de Nado", valor: 82, unidade: "%" },
        { nome: "Viradas", valor: 78, unidade: "%" },
        { nome: "Saídas", valor: 85, unidade: "%" },
        { nome: "Respiração", valor: 88, unidade: "%" },
      ],
    },
  ]

  const resultadosCompeticoes = [
    {
      id: 1,
      data: "15/02/2025",
      nome: "Copa Regional de Natação",
      prova: "100m Livre",
      resultado: "00:58.45",
      colocacao: "1º Lugar",
    },
    {
      id: 2,
      data: "15/03/2025",
      nome: "Campeonato Estadual de Natação",
      prova: "100m Livre",
      resultado: "00:57.82",
      colocacao: "2º Lugar",
    },
    {
      id: 3,
      data: "15/03/2025",
      nome: "Campeonato Estadual de Natação",
      prova: "Revezamento 4x100m",
      resultado: "04:05.30",
      colocacao: "1º Lugar",
    },
  ]

  // Calcular evolução
  const calcularEvolucao = (avaliacoes: any[], indice: string) => {
    if (avaliacoes.length < 2) return 0

    const primeiraAvaliacao = avaliacoes[0].resultados.find((r: any) => r.nome === indice)?.valor || 0
    const ultimaAvaliacao = avaliacoes[avaliacoes.length - 1].resultados.find((r: any) => r.nome === indice)?.valor || 0

    return ultimaAvaliacao - primeiraAvaliacao
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="fisico">Físico</TabsTrigger>
          <TabsTrigger value="tecnico">Técnico</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Evolução Geral</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">Resistência</span>
                      {calcularEvolucao(avaliacoesFisicas, "Resistência") > 0 && (
                        <Badge className="ml-2 bg-green-500">
                          <TrendingUp className="h-3 w-3 mr-1" />+{calcularEvolucao(avaliacoesFisicas, "Resistência")}%
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      {avaliacoesFisicas[avaliacoesFisicas.length - 1]?.resultados.find((r) => r.nome === "Resistência")
                        ?.valor || 0}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      avaliacoesFisicas[avaliacoesFisicas.length - 1]?.resultados.find((r) => r.nome === "Resistência")
                        ?.valor || 0
                    }
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">Técnica de Nado</span>
                      {calcularEvolucao(avaliacoesTecnicas, "Técnica de Nado") > 0 && (
                        <Badge className="ml-2 bg-green-500">
                          <TrendingUp className="h-3 w-3 mr-1" />+
                          {calcularEvolucao(avaliacoesTecnicas, "Técnica de Nado")}%
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      {avaliacoesTecnicas[avaliacoesTecnicas.length - 1]?.resultados.find(
                        (r) => r.nome === "Técnica de Nado",
                      )?.valor || 0}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      avaliacoesTecnicas[avaliacoesTecnicas.length - 1]?.resultados.find(
                        (r) => r.nome === "Técnica de Nado",
                      )?.valor || 0
                    }
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">Velocidade</span>
                      {calcularEvolucao(avaliacoesFisicas, "Velocidade") > 0 && (
                        <Badge className="ml-2 bg-green-500">
                          <TrendingUp className="h-3 w-3 mr-1" />+{calcularEvolucao(avaliacoesFisicas, "Velocidade")}%
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      {avaliacoesFisicas[avaliacoesFisicas.length - 1]?.resultados.find((r) => r.nome === "Velocidade")
                        ?.valor || 0}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      avaliacoesFisicas[avaliacoesFisicas.length - 1]?.resultados.find((r) => r.nome === "Velocidade")
                        ?.valor || 0
                    }
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Resultados em Competições</h3>
              <div className="space-y-4">
                {resultadosCompeticoes.map((resultado) => (
                  <div key={resultado.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{resultado.nome}</h4>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{resultado.data}</span>
                        </div>
                      </div>
                      <Badge
                        className={
                          resultado.colocacao.includes("1º")
                            ? "bg-yellow-500"
                            : resultado.colocacao.includes("2º")
                              ? "bg-gray-400"
                              : resultado.colocacao.includes("3º")
                                ? "bg-amber-600"
                                : "bg-blue-500"
                        }
                      >
                        {resultado.colocacao}
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm">
                          {resultado.prova} - {resultado.resultado}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fisico">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Avaliações Físicas</h3>
              <div className="space-y-6">
                {avaliacoesFisicas.map((avaliacao) => (
                  <div key={avaliacao.id} className="border rounded-md overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{avaliacao.tipo}</h4>
                        <Badge variant="outline">{avaliacao.data}</Badge>
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      {avaliacao.resultados.map((resultado, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{resultado.nome}</span>
                            <span className="text-sm font-medium">
                              {resultado.valor}
                              {resultado.unidade}
                            </span>
                          </div>
                          <Progress value={resultado.valor} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tecnico">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Avaliações Técnicas</h3>
              <div className="space-y-6">
                {avaliacoesTecnicas.map((avaliacao) => (
                  <div key={avaliacao.id} className="border rounded-md overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{avaliacao.modalidade}</h4>
                        <Badge variant="outline">{avaliacao.data}</Badge>
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      {avaliacao.resultados.map((resultado, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{resultado.nome}</span>
                            <span className="text-sm font-medium">
                              {resultado.valor}
                              {resultado.unidade}
                            </span>
                          </div>
                          <Progress value={resultado.valor} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
