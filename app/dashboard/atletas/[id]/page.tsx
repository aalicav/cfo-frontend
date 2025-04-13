"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { ChevronLeft, Edit, Trash, Activity, Trophy, MessageCircleIcon as Message, Calendar as CalendarIcon } from "lucide-react"
import { atletasService } from "@/services/api"
import { Atleta, Avaliacao } from "@/types"
import Link from "next/link"
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, Legend, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"
import http from "@/lib/http"

export default function AtletaDetalhesPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  
  const [atleta, setAtleta] = useState<Atleta | null>(null)
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  
  useEffect(() => {
    const carregarDados = async () => {
      setIsLoading(true)
      try {
        // Carregar dados do atleta
        const atletaData = await atletasService.obter(id)
        if (atletaData) {
          setAtleta(atletaData)
        }
        
        // Carregar avaliações do atleta usando a rota específica da API
        const response = await http.get(`/athletes/${id}/evaluations`)
        if (response.data?.data) {
          setAvaliacoes(response.data.data)
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        setError("Ocorreu um erro ao carregar os dados do atleta. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }
    
    if (id) {
      carregarDados()
    }
  }, [id])
  
  const formatarData = (data: string) => {
    try {
      return format(new Date(data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    } catch (e) {
      return "Data inválida"
    }
  }
  
  const calcularIdade = (dataNascimento: string) => {
    try {
      const hoje = new Date()
      const nascimento = new Date(dataNascimento)
      let idade = hoje.getFullYear() - nascimento.getFullYear()
      const m = hoje.getMonth() - nascimento.getMonth()
      
      if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--
      }
      
      return idade
    } catch (e) {
      return "N/A"
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Carregando dados do atleta...</p>
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
  
  if (!atleta) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Atleta não encontrado</p>
      </div>
    )
  }

  // Preparar dados para gráficos
  const dadosDesempenho = avaliacoes.map(avaliacao => ({
    name: format(new Date(avaliacao.evaluation_date), "dd/MM/yy"),
    desempenho: Math.floor(Math.random() * 100) // Simulação - idealmente seria baseado em indicadores reais
  }))
  
  const dadosRadar = [
    { subject: "Resistência", A: 75, B: 65 },
    { subject: "Força", A: 80, B: 70 },
    { subject: "Velocidade", A: 65, B: 60 },
    { subject: "Flexibilidade", A: 70, B: 65 },
    { subject: "Técnica", A: 85, B: 75 }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/atletas")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Detalhes do Atleta</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-32 h-32">
                  <Image
                    src={atleta.photo_url || "/placeholder-avatar.jpg"}
                    alt={atleta.user?.name || "Atleta"}
                    className="rounded-full object-cover border-4 border-white shadow-md"
                    fill
                  />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold">{atleta.user?.name}</h2>
                  <p className="text-gray-500">{atleta.code}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="text-red-500">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Nome Completo</p>
                <p className="font-medium">{atleta.user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Data de Nascimento</p>
                <p className="font-medium">{atleta.birth_date ? formatarData(atleta.birth_date) : "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Idade</p>
                <p className="font-medium">{atleta.birth_date ? calcularIdade(atleta.birth_date) + " anos" : "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Documento</p>
                <p className="font-medium">{atleta.document_number || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{atleta.user?.email || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Telefone</p>
                <p className="font-medium">{atleta.phone || "Não informado"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Esportivas</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Modalidades</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {atleta.modalities && atleta.modalities.length > 0 ? (
                      atleta.modalities.map((modalidade, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                          {modalidade}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">Nenhuma modalidade registrada</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-2 py-1 rounded-md text-sm ${
                    atleta.status === "active" ? "bg-green-100 text-green-800" :
                    atleta.status === "inactive" ? "bg-red-100 text-red-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {atleta.status === "active" ? "Ativo" :
                     atleta.status === "inactive" ? "Inativo" :
                     atleta.status === "pending" ? "Pendente" : atleta.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Categoria</p>
                  <p className="font-medium">{atleta.group || "Não informado"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Times</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {atleta.team_memberships && atleta.team_memberships.length > 0 ? (
                      atleta.team_memberships.map((time, index) => (
                        <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-sm">
                          {time.team?.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">Nenhum time registrado</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Altura</p>
                  <p className="font-medium">{atleta.height ? `${atleta.height} cm` : "Não informado"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Peso</p>
                  <p className="font-medium">{atleta.weight ? `${atleta.weight} kg` : "Não informado"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Última Avaliação</p>
                  <p className="font-medium">
                    {avaliacoes.length > 0 
                      ? formatarData(avaliacoes[0].evaluation_date) 
                      : "Nenhuma avaliação registrada"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total de Avaliações</p>
                  <p className="font-medium">{avaliacoes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Histórico e Desempenho</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="avaliacoes">
                <TabsList className="w-full justify-start mb-4">
                  <TabsTrigger value="avaliacoes" className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Avaliações
                  </TabsTrigger>
                  <TabsTrigger value="calendario" className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Agenda
                  </TabsTrigger>
                  <TabsTrigger value="conquistas" className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Conquistas
                  </TabsTrigger>
                  <TabsTrigger value="mensagens" className="flex items-center gap-2">
                    <Message className="h-4 w-4" />
                    Mensagens
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="avaliacoes" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Progresso</h3>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart data={dadosDesempenho}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="desempenho" fill="rgba(16, 185, 129, 0.8)" />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Comparativo</h3>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsRadarChart data={dadosRadar}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis />
                            <Radar name="Atual" dataKey="A" stroke="rgba(99, 102, 241, 1)" fill="rgba(99, 102, 241, 0.2)" />
                            <Radar name="Anterior" dataKey="B" stroke="rgba(161, 161, 170, 1)" fill="rgba(161, 161, 170, 0.2)" />
                            <Legend />
                          </RechartsRadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Histórico de Avaliações</h3>
                      <Link href="/dashboard/desempenho/nova-avaliacao">
                        <Button size="sm" className="bg-green-700 hover:bg-green-600">
                          Nova Avaliação
                        </Button>
                      </Link>
                    </div>
                    <div className="border rounded-md">
                      <div className="grid grid-cols-4 gap-4 p-4 border-b font-medium">
                        <div>Data</div>
                        <div>Tipo</div>
                        <div>Responsável</div>
                        <div>Status</div>
                      </div>
                      <div className="divide-y">
                        {avaliacoes.length > 0 ? (
                          avaliacoes.map((avaliacao) => (
                            <div key={avaliacao.id} className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50">
                              <div>{format(new Date(avaliacao.evaluation_date), "dd/MM/yyyy")}</div>
                              <div>{avaliacao.type}</div>
                              <div>{typeof avaliacao.created_by === 'object' && avaliacao.created_by?.name || "Sistema"}</div>
                              <div>
                                <span className={`px-2 py-1 rounded-md text-xs ${
                                  avaliacao.status === "completed" ? "bg-green-100 text-green-800" :
                                  avaliacao.status === "cancelled" ? "bg-red-100 text-red-800" :
                                  "bg-yellow-100 text-yellow-800"
                                }`}>
                                  {avaliacao.status === "completed" ? "Concluída" :
                                   avaliacao.status === "pending" ? "Pendente" :
                                   avaliacao.status === "cancelled" ? "Cancelada" : avaliacao.status}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            Nenhuma avaliação registrada para este atleta
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="calendario">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/2">
                      <h3 className="text-lg font-semibold mb-4">Agenda</h3>
                      <Calendar 
                        mode="single"
                        className="rounded-md border"
                      />
                    </div>
                    <div className="md:w-1/2">
                      <h3 className="text-lg font-semibold mb-4">Próximos Eventos</h3>
                      <div className="border rounded-md divide-y">
                        {/* Lista de eventos */}
                        <div className="p-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium">Treino de Natação</p>
                            <p className="text-sm text-gray-500">10 de Junho, 14:00 - 16:00</p>
                          </div>
                          <Button variant="outline" size="sm">Ver</Button>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium">Avaliação Física</p>
                            <p className="text-sm text-gray-500">15 de Junho, 09:00 - 10:30</p>
                          </div>
                          <Button variant="outline" size="sm">Ver</Button>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium">Competição Regional</p>
                            <p className="text-sm text-gray-500">25 de Junho, Todo o dia</p>
                          </div>
                          <Button variant="outline" size="sm">Ver</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="conquistas">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                      <CardContent className="p-6 flex items-center gap-4">
                        <div className="bg-amber-500 rounded-full p-2 text-white">
                          <Trophy className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-bold">Campeonato Estadual</h4>
                          <p className="text-sm">1º Lugar - 100m livre</p>
                          <p className="text-xs text-gray-500">10/05/2023</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
                      <CardContent className="p-6 flex items-center gap-4">
                        <div className="bg-gray-500 rounded-full p-2 text-white">
                          <Trophy className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-bold">Copa Regional</h4>
                          <p className="text-sm">2º Lugar - Revezamento</p>
                          <p className="text-xs text-gray-500">22/03/2023</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-amber-800/10 to-amber-700/20 border-amber-700/20">
                      <CardContent className="p-6 flex items-center gap-4">
                        <div className="bg-amber-700 rounded-full p-2 text-white">
                          <Trophy className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-bold">Troféu Excelência</h4>
                          <p className="text-sm">3º Lugar - Classificação geral</p>
                          <p className="text-xs text-gray-500">15/12/2022</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="mensagens">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Mensagens</h3>
                      <Button size="sm">Nova Mensagem</Button>
                    </div>
                    <div className="border rounded-md divide-y">
                      <div className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Confirmação de Treino</span>
                          <span className="text-xs text-gray-500">21/05/2023</span>
                        </div>
                        <p className="text-sm">Olá! Estamos confirmando sua participação no treino especial de amanhã. Por favor, confirme sua presença.</p>
                      </div>
                      <div className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Resultado da Avaliação</span>
                          <span className="text-xs text-gray-500">15/05/2023</span>
                        </div>
                        <p className="text-sm">Sua avaliação física foi concluída. Os resultados estão disponíveis para visualização no sistema.</p>
                      </div>
                      <div className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Inscrição em Competição</span>
                          <span className="text-xs text-gray-500">02/05/2023</span>
                        </div>
                        <p className="text-sm">Você foi inscrito na competição regional que ocorrerá no próximo mês. Mais detalhes serão enviados em breve.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
