"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Award, Clock, Dumbbell, FileText, MessageSquare, Activity, User } from "lucide-react"
import { AtletaPortalLayout } from "@/components/atleta-portal-layout"

export default function PortalAtletaDashboardPage() {
  return (
    <AtletaPortalLayout>
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bem-vindo, João!</h1>
          <p className="text-muted-foreground">Confira seus próximos compromissos e atualizações</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximo Treino</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Hoje, 15:00</div>
              <p className="text-xs text-muted-foreground">Natação - Piscina Olímpica</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próxima Competição</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15/06/2025</div>
              <p className="text-xs text-muted-foreground">Campeonato Estadual</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Horas Treinadas</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24h</div>
              <p className="text-xs text-muted-foreground">Neste mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Novas Mensagens</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Não lidas</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Agenda Semanal</CardTitle>
              <CardDescription>Seus próximos treinamentos e eventos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Treino de Natação</p>
                    <p className="text-xs text-muted-foreground">Hoje, 15:00 - 17:00</p>
                  </div>
                  <Badge>Confirmado</Badge>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Preparação Física</p>
                    <p className="text-xs text-muted-foreground">Amanhã, 09:00 - 10:30</p>
                  </div>
                  <Badge>Confirmado</Badge>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-yellow-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Avaliação de Desempenho</p>
                    <p className="text-xs text-muted-foreground">Quarta, 14:00 - 15:00</p>
                  </div>
                  <Badge variant="outline">Pendente</Badge>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-purple-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Treino Técnico</p>
                    <p className="text-xs text-muted-foreground">Sexta, 16:00 - 18:00</p>
                  </div>
                  <Badge>Confirmado</Badge>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/portal-atleta/agenda">
                  <Button variant="link" className="p-0 h-auto text-green-700">
                    Ver agenda completa
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documentos Pendentes</CardTitle>
              <CardDescription>Documentos que precisam de atenção</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-red-100 text-red-700 p-2 rounded-md">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Atestado Médico</p>
                    <p className="text-xs text-muted-foreground">Vence em 15 dias</p>
                    <Button variant="link" className="p-0 h-auto text-xs text-green-700 mt-1">
                      Atualizar
                    </Button>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-yellow-100 text-yellow-700 p-2 rounded-md">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Termo de Responsabilidade</p>
                    <p className="text-xs text-muted-foreground">Pendente de assinatura</p>
                    <Button variant="link" className="p-0 h-auto text-xs text-green-700 mt-1">
                      Assinar
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/portal-atleta/documentos">
                  <Button variant="link" className="p-0 h-auto text-green-700">
                    Ver todos os documentos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="desempenho" className="space-y-4">
          <TabsList>
            <TabsTrigger value="desempenho">Desempenho</TabsTrigger>
            <TabsTrigger value="competicoes">Competições</TabsTrigger>
            <TabsTrigger value="mensagens">Mensagens</TabsTrigger>
          </TabsList>
          <TabsContent value="desempenho">
            <Card>
              <CardHeader>
                <CardTitle>Evolução de Desempenho</CardTitle>
                <CardDescription>Seus resultados nas últimas avaliações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="text-sm font-medium">Velocidade</p>
                      </div>
                      <p className="text-sm font-medium">85%</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-full w-[85%] rounded-full bg-green-500" />
                    </div>
                    <p className="text-xs text-green-600">+5% em relação à última avaliação</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="text-sm font-medium">Resistência</p>
                      </div>
                      <p className="text-sm font-medium">72%</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-full w-[72%] rounded-full bg-yellow-500" />
                    </div>
                    <p className="text-xs text-yellow-600">+2% em relação à última avaliação</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="text-sm font-medium">Técnica</p>
                      </div>
                      <p className="text-sm font-medium">90%</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-full w-[90%] rounded-full bg-blue-500" />
                    </div>
                    <p className="text-xs text-blue-600">+8% em relação à última avaliação</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/portal-atleta/desempenho">
                    <Button variant="link" className="p-0 h-auto text-green-700">
                      Ver análise completa
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="competicoes">
            <Card>
              <CardHeader>
                <CardTitle>Próximas Competições</CardTitle>
                <CardDescription>Competições agendadas para você</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Campeonato Estadual de Natação</h4>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">15/06/2025</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <User className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Categoria: Juvenil</span>
                        </div>
                      </div>
                      <Badge className="bg-green-500">Confirmado</Badge>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        Provas: 100m livre, 200m livre, Revezamento 4x100m
                      </p>
                    </div>
                  </div>
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Copa Regional de Natação</h4>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">10/07/2025</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <User className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Categoria: Juvenil</span>
                        </div>
                      </div>
                      <Badge variant="outline">Pendente</Badge>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">Provas: 100m livre, 100m costas</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/portal-atleta/competicoes">
                    <Button variant="link" className="p-0 h-auto text-green-700">
                      Ver todas as competições
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="mensagens">
            <Card>
              <CardHeader>
                <CardTitle>Mensagens Recentes</CardTitle>
                <CardDescription>Comunicações da coordenação e instrutores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md bg-blue-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Carlos Silva - Treinador</h4>
                        <p className="text-xs text-muted-foreground mt-1">Hoje, 10:30</p>
                      </div>
                      <Badge>Nova</Badge>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm">
                        Parabéns pelo desempenho no treino de ontem! Continue focado para a competição.
                      </p>
                    </div>
                  </div>
                  <div className="p-4 border rounded-md bg-blue-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Ana Oliveira - Coordenadora</h4>
                        <p className="text-xs text-muted-foreground mt-1">Ontem, 15:45</p>
                      </div>
                      <Badge>Nova</Badge>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm">
                        Informamos que sua inscrição no Campeonato Estadual foi confirmada. Verifique os detalhes.
                      </p>
                    </div>
                  </div>
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Coordenação CFO</h4>
                        <p className="text-xs text-muted-foreground mt-1">20/03/2025</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm">
                        Lembrete: Atualize seu atestado médico até o final do mês para continuar participando dos
                        treinos.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/portal-atleta/mensagens">
                    <Button variant="link" className="p-0 h-auto text-green-700">
                      Ver todas as mensagens
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AtletaPortalLayout>
  )
}
