"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, LineChart, Activity, TrendingUp, ArrowLeft } from "lucide-react"
import { AtletaPortalLayout } from "@/components/atleta-portal-layout"

export default function PortalAtletaDesempenhoPage() {
  return (
    <AtletaPortalLayout>
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/portal-atleta/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meu Desempenho</h1>
            <p className="text-muted-foreground">Acompanhe sua evolução e resultados</p>
          </div>
        </div>

        <Tabs defaultValue="geral" className="space-y-4">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
            <TabsTrigger value="geral">Visão Geral</TabsTrigger>
            <TabsTrigger value="fisico">Físico</TabsTrigger>
            <TabsTrigger value="tecnico">Técnico</TabsTrigger>
            <TabsTrigger value="competicoes">Competições</TabsTrigger>
          </TabsList>

          <TabsContent value="geral" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Evolução Geral</CardTitle>
                <CardDescription>Acompanhe sua evolução nos principais indicadores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full border rounded-md p-4 flex items-center justify-center mb-6">
                  <div className="text-center">
                    <LineChart className="h-16 w-16 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">
                      Gráfico de evolução dos indicadores nos últimos 6 meses
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">Resistência</span>
                        <Badge className="ml-2 bg-green-500">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +5%
                        </Badge>
                      </div>
                      <span className="text-sm font-medium">80%</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">Técnica de Nado</span>
                        <Badge className="ml-2 bg-green-500">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +4%
                        </Badge>
                      </div>
                      <span className="text-sm font-medium">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">Velocidade</span>
                        <Badge className="ml-2 bg-green-500">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +3%
                        </Badge>
                      </div>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Últimas Avaliações</CardTitle>
                <CardDescription>Resultados das suas avaliações mais recentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Avaliação Física</h4>
                        <Badge variant="outline">15/03/2025</Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground mb-4">Responsável: Carlos Silva • Natação</p>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Resistência</span>
                            <span className="text-sm font-medium">80%</span>
                          </div>
                          <Progress value={80} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Força</span>
                            <span className="text-sm font-medium">75%</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Velocidade</span>
                            <span className="text-sm font-medium">85%</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                      </div>
                      <Button variant="link" className="p-0 h-auto mt-4 text-green-700">
                        Ver detalhes completos
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Avaliação Técnica</h4>
                        <Badge variant="outline">20/03/2025</Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground mb-4">Responsável: Ana Oliveira • Natação</p>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Técnica de Nado</span>
                            <span className="text-sm font-medium">82%</span>
                          </div>
                          <Progress value={82} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Viradas</span>
                            <span className="text-sm font-medium">78%</span>
                          </div>
                          <Progress value={78} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Saídas</span>
                            <span className="text-sm font-medium">80%</span>
                          </div>
                          <Progress value={80} className="h-2" />
                        </div>
                      </div>
                      <Button variant="link" className="p-0 h-auto mt-4 text-green-700">
                        Ver detalhes completos
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fisico" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Avaliações Físicas</CardTitle>
                <CardDescription>Histórico de avaliações físicas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="h-80 w-full border rounded-md p-4 flex items-center justify-center mb-6">
                    <div className="text-center">
                      <Activity className="h-16 w-16 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">Gráfico de evolução dos indicadores físicos</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => {
                      const date = new Date()
                      date.setMonth(date.getMonth() - index * 2)
                      const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`

                      return (
                        <div key={index} className="border rounded-md overflow-hidden">
                          <div className="bg-gray-50 p-4 border-b">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium">Avaliação Física</h4>
                              <Badge variant="outline">{formattedDate}</Badge>
                            </div>
                          </div>
                          <div className="p-4">
                            <p className="text-sm text-muted-foreground mb-4">Responsável: Carlos Silva • Natação</p>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Resistência</span>
                                  <span className="text-sm font-medium">{80 - index * 5}%</span>
                                </div>
                                <Progress value={80 - index * 5} className="h-2" />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Força</span>
                                  <span className="text-sm font-medium">{75 - index * 3}%</span>
                                </div>
                                <Progress value={75 - index * 3} className="h-2" />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Velocidade</span>
                                  <span className="text-sm font-medium">{85 - index * 4}%</span>
                                </div>
                                <Progress value={85 - index * 4} className="h-2" />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Flexibilidade</span>
                                  <span className="text-sm font-medium">{70 - index * 2}%</span>
                                </div>
                                <Progress value={70 - index * 2} className="h-2" />
                              </div>
                            </div>
                            <Button variant="link" className="p-0 h-auto mt-4 text-green-700">
                              Ver detalhes completos
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tecnico" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Avaliações Técnicas</CardTitle>
                <CardDescription>Histórico de avaliações técnicas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="h-80 w-full border rounded-md p-4 flex items-center justify-center mb-6">
                    <div className="text-center">
                      <Activity className="h-16 w-16 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">Gráfico de evolução dos indicadores técnicos</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => {
                      const date = new Date()
                      date.setMonth(date.getMonth() - index * 2)
                      const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`

                      return (
                        <div key={index} className="border rounded-md overflow-hidden">
                          <div className="bg-gray-50 p-4 border-b">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium">Avaliação Técnica</h4>
                              <Badge variant="outline">{formattedDate}</Badge>
                            </div>
                          </div>
                          <div className="p-4">
                            <p className="text-sm text-muted-foreground mb-4">Responsável: Ana Oliveira • Natação</p>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Técnica de Nado</span>
                                  <span className="text-sm font-medium">{82 - index * 4}%</span>
                                </div>
                                <Progress value={82 - index * 4} className="h-2" />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Viradas</span>
                                  <span className="text-sm font-medium">{78 - index * 3}%</span>
                                </div>
                                <Progress value={78 - index * 3} className="h-2" />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Saídas</span>
                                  <span className="text-sm font-medium">{80 - index * 5}%</span>
                                </div>
                                <Progress value={80 - index * 5} className="h-2" />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Respiração</span>
                                  <span className="text-sm font-medium">{85 - index * 4}%</span>
                                </div>
                                <Progress value={85 - index * 4} className="h-2" />
                              </div>
                            </div>
                            <Button variant="link" className="p-0 h-auto mt-4 text-green-700">
                              Ver detalhes completos
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competicoes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resultados em Competições</CardTitle>
                <CardDescription>Histórico de participação em competições</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Copa Regional de Natação</h4>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">15/02/2025</span>
                        </div>
                      </div>
                      <Badge className="bg-yellow-500">1º Lugar</Badge>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                        <span className="text-sm">100m Livre</span>
                        <span className="text-sm font-medium">00:58.45</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                        <span className="text-sm">Revezamento 4x100m</span>
                        <span className="text-sm font-medium">04:05.30</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Campeonato Estadual de Natação</h4>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">15/03/2025</span>
                        </div>
                      </div>
                      <Badge className="bg-gray-400">2º Lugar</Badge>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                        <span className="text-sm">100m Livre</span>
                        <span className="text-sm font-medium">00:57.82</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                        <span className="text-sm">200m Livre</span>
                        <span className="text-sm font-medium">02:10.15</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Torneio Interestadual</h4>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">10/01/2025</span>
                        </div>
                      </div>
                      <Badge className="bg-amber-600">3º Lugar</Badge>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                        <span className="text-sm">100m Livre</span>
                        <span className="text-sm font-medium">00:59.12</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                        <span className="text-sm">Revezamento 4x100m</span>
                        <span className="text-sm font-medium">04:08.75</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 border rounded-md">
                  <h4 className="font-medium mb-2">Resumo de Medalhas</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold">
                        2
                      </div>
                      <span className="text-xs mt-1">Ouro</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
                        1
                      </div>
                      <span className="text-xs mt-1">Prata</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                        2
                      </div>
                      <span className="text-xs mt-1">Bronze</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AtletaPortalLayout>
  )
}
