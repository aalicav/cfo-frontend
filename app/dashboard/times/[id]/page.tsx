"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, User, Calendar, Medal, Dumbbell, Users, Trophy, MapPin } from "lucide-react"
import { timesService, atletasService } from "@/services/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TimeHistorico } from "@/components/time-historico"
import { Team, Atleta, TeamMembership } from "@/types"

export default function TimeDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const [time, setTime] = useState<Team | null>(null)
  const [atletasDoTime, setAtletasDoTime] = useState<Atleta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("visao-geral")

  useEffect(() => {
    const carregarDados = async () => {
      setIsLoading(true)
      try {
        // Carregar dados do time
        const timeResponse = await timesService.obter(id)
        if (timeResponse && timeResponse.data) {
          setTime(timeResponse.data)
          
          // Carregar atletas do time
          if (timeResponse.data.athletes && timeResponse.data.athletes.length > 0) {
            setAtletasDoTime(timeResponse.data.athletes)
          } else if (timeResponse.data.athletes_ids && timeResponse.data.athletes_ids.length > 0) {
            const atletasResponse = await atletasService.listar({ 
              ids: timeResponse.data.athletes_ids.join(',') 
            })
            if (atletasResponse && atletasResponse.data) {
              setAtletasDoTime(atletasResponse.data.items || [])
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        setError("Ocorreu um erro ao carregar os dados do time. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }
    
    if (id) {
      carregarDados()
    }
  }, [id])

  const encontrarDataEntrada = (atleta: Atleta): string => {
    if (atleta.team_memberships && atleta.team_memberships.length > 0) {
      const membership = atleta.team_memberships.find(tm => tm.team_id === id)
      if (membership && membership.joined_at) {
        return new Date(membership.joined_at).toLocaleDateString('pt-BR', {
          month: 'long', 
          year: 'numeric'
        })
      }
    }
    return "Data não informada"
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Carregando dados do time...</p>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    )
  }

  if (!time) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold">Time não encontrado</h2>
        <p className="text-muted-foreground mb-4">O time que você está procurando não existe.</p>
        <Button onClick={() => router.push("/dashboard/times")}>Voltar para lista de times</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/times">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{time.name}</h1>
          <Badge className="ml-2">{time.category}</Badge>
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
                      <p>{time.name}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Modalidade</p>
                    <div className="flex items-center">
                      <Dumbbell className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{time.modality}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Categoria</p>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{time.category}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Técnico Responsável</p>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{time.coach}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Data de Criação</p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{time.creation_date ? new Date(time.creation_date).toLocaleDateString('pt-BR') : 'Não informada'}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Quantidade de Atletas</p>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{atletasDoTime?.length || 0} atletas</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Descrição</h3>
                  <p className="text-muted-foreground">{time.description || 'Sem descrição'}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Locais de Treinamento</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {time.training_locations && time.training_locations.length > 0 ? (
                      time.training_locations.map((local, index) => (
                        <div key={index} className="flex items-start space-x-3 border rounded-md p-3">
                          <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">{local.name}</p>
                            <p className="text-sm text-muted-foreground">{local.days}, {local.schedule}</p>
                            {local.space_id && (
                              <Link href={`/dashboard/espacos/${local.space_id}`} className="text-xs text-green-700 hover:underline">
                                Ver espaço
                              </Link>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-start space-x-3 border rounded-md p-3">
                        <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">Nenhum local registrado</p>
                          <p className="text-sm text-muted-foreground">Adicione locais de treinamento na edição do time</p>
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
                      {atletasDoTime?.length || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Medal className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>Competições</span>
                    </div>
                    <Badge variant="outline" className="font-medium">
                      {time.competitions || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>Medalhas</span>
                    </div>
                    <Badge variant="outline" className="font-medium">
                      {time.medals || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>Treinos Semanais</span>
                    </div>
                    <Badge variant="outline" className="font-medium">
                      {time.weekly_trainings || 0}
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
                        <p className="font-medium">{time.coach}</p>
                        <p className="text-sm text-muted-foreground">Técnico Principal</p>
                      </div>
                    </div>
                    {time.technical_committee && time.technical_committee.length > 0 ? (
                      time.technical_committee.map((membro, index) => (
                        <div key={index} className="flex items-start space-x-3 border-b pb-3 last:border-0">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">{membro.name}</p>
                            <p className="text-sm text-muted-foreground">{membro.role}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-start space-x-3 last:border-0">
                        <div className="text-center w-full mt-2">
                          <p className="text-sm text-muted-foreground">Nenhum membro adicional na comissão técnica</p>
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
                    {time.upcoming_events && time.upcoming_events.length > 0 ? (
                      time.upcoming_events.map((evento, index) => (
                        <div key={index} className="flex items-start space-x-3 border-b pb-3 last:border-0">
                          <div className="bg-blue-100 text-blue-700 p-2 rounded-md">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{evento.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(evento.date).toLocaleDateString('pt-BR')}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{evento.location}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-start space-x-3">
                        <div className="text-center w-full">
                          <p className="text-sm text-muted-foreground">Nenhum evento agendado</p>
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
                        <AvatarImage src={atleta.photo_url} alt={atleta.user?.name} />
                        <AvatarFallback>{atleta.user?.name?.charAt(0) || 'A'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium">{atleta.user?.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {atleta.birth_date && new Date().getFullYear() - new Date(atleta.birth_date).getFullYear()} anos
                        </p>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Desde {encontrarDataEntrada(atleta)}
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Competições</CardTitle>
                  <CardDescription>Histórico de competições e resultados</CardDescription>
                </div>
                <Link href={`/dashboard/times/${id}/competicoes/adicionar`}>
                  <Button className="bg-green-700 hover:bg-green-600">
                    <Trophy className="mr-2 h-4 w-4" />
                    Adicionar Competição
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {time.competitions_history && time.competitions_history.length > 0 ? (
                <div className="space-y-6">
                  {time.competitions_history.map((competicao, index) => (
                    <div key={index} className="border rounded-md overflow-hidden">
                      <div className="bg-gray-50 p-4 border-b">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{competicao.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(competicao.date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <Badge
                            className={
                              competicao.result === "1º Lugar"
                                ? "bg-yellow-500"
                                : competicao.result === "2º Lugar"
                                  ? "bg-gray-400"
                                  : competicao.result === "3º Lugar"
                                    ? "bg-amber-600"
                                    : "bg-blue-500"
                            }
                          >
                            {competicao.result}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{competicao.location}</span>
                          </div>
                          {competicao.description && (
                            <p className="text-sm text-muted-foreground">{competicao.description}</p>
                          )}
                          {competicao.highlights && competicao.highlights.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mt-2">Destaques:</p>
                              <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
                                {competicao.highlights.map((destaque, idx) => (
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
                  <Link href={`/dashboard/times/${id}/competicoes/adicionar`}>
                    <Button className="mt-4 bg-green-700 hover:bg-green-600">Registrar Competição</Button>
                  </Link>
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
