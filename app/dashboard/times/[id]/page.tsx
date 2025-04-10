"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, User, Calendar, Medal, Dumbbell, Users, Trophy } from "lucide-react"
import { timesMock } from "@/lib/times-mock"
import { atletasMock } from "@/lib/atletas-mock"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TimeHistorico } from "@/components/time-historico"

export default function TimeDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const time = timesMock.find((t) => t.id === id)

  const [activeTab, setActiveTab] = useState("visao-geral")

  if (!time) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold">Time não encontrado</h2>
        <p className="text-muted-foreground mb-4">O time que você está procurando não existe.</p>
        <Button onClick={() => router.push("/dashboard/times")}>Voltar para lista de times</Button>
      </div>
    )
  }

  // Buscar atletas do time
  const atletasDoTime = atletasMock.filter((atleta) => time.atletas.includes(atleta.id))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/times">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{time.nome}</h1>
          <Badge className="ml-2">{time.categoria}</Badge>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/times/${id}/editar`}>
            <Button className="bg-green-700 hover:bg-green-600">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="atletas">Atletas</TabsTrigger>
          <TabsTrigger value="competicoes">Competições</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Detalhes do Time</CardTitle>
                <CardDescription>Informações gerais sobre o time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Nome do Time</p>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{time.nome}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Modalidade</p>
                    <div className="flex items-center">
                      <Dumbbell className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{time.modalidade}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Categoria</p>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{time.categoria}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Técnico Responsável</p>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{time.tecnico}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Data de Criação</p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{time.dataCriacao}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Quantidade de Atletas</p>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{time.atletas.length} atletas</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Descrição</h3>
                  <p className="text-muted-foreground">{time.descricao}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Locais de Treinamento</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {time.locaisTreinamento ? (
                      time.locaisTreinamento.map((local, index) => (
                        <div key={index} className="flex items-start space-x-3 border rounded-md p-3">
                          <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">{local.nome}</p>
                            <p className="text-sm text-muted-foreground">{local.horarios}</p>
                            <Link
                              href={`/dashboard/espacos/${local.id}`}
                              className="text-xs text-green-700 hover:underline"
                            >
                              Ver espaço
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-start space-x-3 border rounded-md p-3">
                        <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">Piscina Olímpica</p>
                          <p className="text-sm text-muted-foreground">Terças e Quintas, 14h às 16h</p>
                          <Link href="/dashboard/espacos/esp-002" className="text-xs text-green-700 hover:underline">
                            Ver espaço
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas</CardTitle>
                  <CardDescription>Números do time</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>Atletas</span>
                    </div>
                    <Badge variant="outline" className="font-medium">
                      {time.atletas.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Medal className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>Competições</span>
                    </div>
                    <Badge variant="outline" className="font-medium">
                      {time.competicoes || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>Medalhas</span>
                    </div>
                    <Badge variant="outline" className="font-medium">
                      {time.medalhas || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>Treinos Semanais</span>
                    </div>
                    <Badge variant="outline" className="font-medium">
                      {time.treinosSemanais || 3}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Comissão Técnica</CardTitle>
                  <CardDescription>Equipe técnica responsável</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 border-b pb-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium">{time.tecnico}</p>
                        <p className="text-sm text-muted-foreground">Técnico Principal</p>
                      </div>
                    </div>
                    {time.comissaoTecnica ? (
                      time.comissaoTecnica.map((membro, index) => (
                        <div key={index} className="flex items-start space-x-3 border-b pb-3 last:border-0">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">{membro.nome}</p>
                            <p className="text-sm text-muted-foreground">{membro.funcao}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-start space-x-3 last:border-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">Ana Silva</p>
                          <p className="text-sm text-muted-foreground">Assistente Técnico</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Próximos Eventos</CardTitle>
                  <CardDescription>Competições e eventos agendados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {time.proximosEventos ? (
                      time.proximosEventos.map((evento, index) => (
                        <div key={index} className="flex items-start space-x-3 border-b pb-3 last:border-0">
                          <div className="bg-blue-100 text-blue-700 p-2 rounded-md">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{evento.nome}</p>
                            <p className="text-sm text-muted-foreground">{evento.data}</p>
                            <p className="text-xs text-muted-foreground mt-1">{evento.local}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 text-blue-700 p-2 rounded-md">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">Campeonato Estadual</p>
                          <p className="text-sm text-muted-foreground">15/06/2025</p>
                          <p className="text-xs text-muted-foreground mt-1">Centro Aquático Municipal</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="atletas">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Atletas do Time</CardTitle>
                  <CardDescription>Lista de atletas que compõem o time</CardDescription>
                </div>
                <Link href={`/dashboard/times/${id}/atletas/gerenciar`}>
                  <Button className="bg-green-700 hover:bg-green-600">
                    <Users className="mr-2 h-4 w-4" />
                    Gerenciar Atletas
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {atletasDoTime.length > 0 ? (
                  atletasDoTime.map((atleta) => (
                    <div key={atleta.id} className="flex items-start space-x-4 p-4 border rounded-md">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={atleta.foto} alt={atleta.nome} />
                        <AvatarFallback>{atleta.nome.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium">{atleta.nome}</h3>
                        <p className="text-sm text-muted-foreground">{atleta.idade} anos</p>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Desde {atleta.dataEntradaTime || "Janeiro/2025"}
                          </span>
                        </div>
                        <div className="mt-2">
                          <Link href={`/dashboard/atletas/${atleta.id}`}>
                            <Button variant="outline" size="sm">
                              Ver Perfil
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">Nenhum atleta associado a este time.</p>
                    <Link href={`/dashboard/times/${id}/atletas/gerenciar`}>
                      <Button className="mt-4 bg-green-700 hover:bg-green-600">Adicionar Atletas</Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competicoes">
          <Card>
            <CardHeader>
              <CardTitle>Competições</CardTitle>
              <CardDescription>Histórico de competições e resultados</CardDescription>
            </CardHeader>
            <CardContent>
              {time.historicoCompeticoes && time.historicoCompeticoes.length > 0 ? (
                <div className="space-y-6">
                  {time.historicoCompeticoes.map((competicao, index) => (
                    <div key={index} className="border rounded-md overflow-hidden">
                      <div className="bg-gray-50 p-4 border-b">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{competicao.nome}</h3>
                            <p className="text-sm text-muted-foreground">{competicao.data}</p>
                          </div>
                          <Badge
                            className={
                              competicao.resultado === "1º Lugar"
                                ? "bg-yellow-500"
                                : competicao.resultado === "2º Lugar"
                                  ? "bg-gray-400"
                                  : competicao.resultado === "3º Lugar"
                                    ? "bg-amber-600"
                                    : "bg-blue-500"
                            }
                          >
                            {competicao.resultado}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{competicao.local}</span>
                          </div>
                          {competicao.destaques && (
                            <div>
                              <p className="text-sm font-medium mt-2">Destaques:</p>
                              <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
                                {competicao.destaques.map((destaque, idx) => (
                                  <li key={idx}>{destaque}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Este time ainda não participou de competições.</p>
                  <Button className="mt-4 bg-green-700 hover:bg-green-600">Registrar Competição</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historico">
          <Card>
            <CardHeader>
              <CardTitle>Histórico do Time</CardTitle>
              <CardDescription>Registro de atividades e evolução</CardDescription>
            </CardHeader>
            <CardContent>
              <TimeHistorico timeId={id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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
