"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Calendar, User, ClipboardList, Activity, LineChart, Edit, Download } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { avaliacoesService } from "@/services/api"
import { AvaliacaoFrontend } from "@/types"

export default function AvaliacaoDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [avaliacao, setAvaliacao] = useState<AvaliacaoFrontend | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("detalhes")
  
  useEffect(() => {
    const carregarAvaliacao = async () => {
      setIsLoading(true)
      try {
        const data = await avaliacoesService.obterFormatoFrontend(id)
        setAvaliacao(data)
      } catch (error) {
        console.error("Erro ao carregar avaliação:", error)
        setError("Não foi possível carregar a avaliação solicitada.")
      } finally {
        setIsLoading(false)
      }
    }
    
    carregarAvaliacao()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-xl font-medium">Carregando avaliação...</h2>
      </div>
    )
  }

  if (error || !avaliacao) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold">Avaliação não encontrada</h2>
        <p className="text-muted-foreground mb-4">A avaliação que você está procurando não existe ou houve um erro ao carregá-la.</p>
        <Button onClick={() => router.push("/dashboard/desempenho")}>Voltar para lista de avaliações</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/desempenho">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Avaliação {avaliacao.type}</h1>
          <Badge
            className={`ml-2 ${
              avaliacao.type === "Física"
                ? "bg-blue-500"
                : avaliacao.type === "Técnica"
                  ? "bg-green-500"
                  : "bg-purple-500"
            }`}
          >
            {avaliacao.type}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Link href={`/dashboard/desempenho/${id}/editar`}>
            <Button className="bg-green-700 hover:bg-green-600">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle>Informações da Avaliação</CardTitle>
            <CardDescription>Detalhes gerais da avaliação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border">
                <AvatarImage src={avaliacao.athlete.photo} alt={avaliacao.athlete.name} />
                <AvatarFallback className="text-xl">{avaliacao.athlete.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{avaliacao.athlete.name}</h2>
                <p className="text-sm text-muted-foreground">{avaliacao.modality}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Data: {avaliacao.date}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Responsável: {avaliacao.responsible}</span>
              </div>
              <div className="flex items-center">
                <ClipboardList className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Tipo: {avaliacao.type}</span>
              </div>
              <div className="flex items-center">
                <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  Indicadores: {avaliacao.indicators?.length || 0} indicador
                  {avaliacao.indicators?.length !== 1 ? "es" : ""}
                </span>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Observações</h3>
              <p className="text-sm text-muted-foreground">
                {avaliacao.observations ||
                  "Atleta apresentou bom desempenho nos testes realizados, com evolução significativa em relação à avaliação anterior."}
              </p>
            </div>

            <div className="pt-2">
              <Link href={`/dashboard/atletas/${avaliacao.athlete.id}`}>
                <Button variant="outline" className="w-full">
                  Ver Perfil do Atleta
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="w-full">
              <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
              <TabsTrigger value="evolucao">Evolução</TabsTrigger>
              <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
            </TabsList>

            <TabsContent value="detalhes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Resultados da Avaliação</CardTitle>
                  <CardDescription>Indicadores medidos nesta avaliação</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {avaliacao.indicators && avaliacao.indicators.length > 0 ? (
                      avaliacao.indicators.map((indicador, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{indicador.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                {indicador.description || "Medição padrão conforme protocolo do CFO"}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold">
                                {indicador.value}
                                {indicador.unit}
                              </span>
                              {indicador.reference && (
                                <p className="text-xs text-muted-foreground">
                                  Referência: {indicador.reference}
                                  {indicador.unit}
                                </p>
                              )}
                            </div>
                          </div>
                          <Progress
                            value={indicador.percentage || (Number(indicador.value) / (Number(indicador.reference) || 100)) * 100}
                            className="h-2"
                          />
                          {indicador.observation && (
                            <p className="text-xs text-muted-foreground mt-1">{indicador.observation}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Resistência</h4>
                              <p className="text-xs text-muted-foreground">Teste de resistência aeróbica</p>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold">80%</span>
                              <p className="text-xs text-muted-foreground">Referência: 75%</p>
                            </div>
                          </div>
                          <Progress value={80} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Força</h4>
                              <p className="text-xs text-muted-foreground">Teste de força muscular</p>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold">75%</span>
                              <p className="text-xs text-muted-foreground">Referência: 70%</p>
                            </div>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Velocidade</h4>
                              <p className="text-xs text-muted-foreground">Teste de velocidade</p>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold">85%</span>
                              <p className="text-xs text-muted-foreground">Referência: 80%</p>
                            </div>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Flexibilidade</h4>
                              <p className="text-xs text-muted-foreground">Teste de flexibilidade</p>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold">70%</span>
                              <p className="text-xs text-muted-foreground">Referência: 75%</p>
                            </div>
                          </div>
                          <Progress value={70} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            Abaixo da referência. Recomenda-se trabalho específico.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {avaliacao.type === "Médica" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Exames Realizados</CardTitle>
                    <CardDescription>Resultados dos exames médicos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-md">
                        <h4 className="font-medium">Exame Cardiológico</h4>
                        <p className="text-sm text-muted-foreground mt-1">Realizado em: {avaliacao.date}</p>
                        <p className="text-sm mt-2">
                          Resultado: <Badge className="bg-green-500">Normal</Badge>
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Não foram encontradas alterações significativas. Atleta liberado para atividades de alta
                          intensidade.
                        </p>
                      </div>

                      <div className="p-4 border rounded-md">
                        <h4 className="font-medium">Exame Ortopédico</h4>
                        <p className="text-sm text-muted-foreground mt-1">Realizado em: {avaliacao.date}</p>
                        <p className="text-sm mt-2">
                          Resultado: <Badge className="bg-yellow-500">Atenção</Badge>
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Leve instabilidade no joelho direito. Recomenda-se fortalecimento muscular específico e
                          acompanhamento.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="evolucao">
              <Card>
                <CardHeader>
                  <CardTitle>Evolução do Atleta</CardTitle>
                  <CardDescription>Comparativo com avaliações anteriores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full border rounded-md p-4 flex items-center justify-center mb-6">
                    <div className="text-center">
                      <LineChart className="h-16 w-16 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">
                        Gráfico de evolução dos indicadores nas últimas avaliações
                      </p>
                    </div>
                  </div>

                  <h3 className="font-medium mb-4">Histórico de Avaliações</h3>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => {
                      const date = new Date()
                      date.setMonth(date.getMonth() - (index + 1) * 2)
                      const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`

                      return (
                        <div key={index} className="p-4 border rounded-md">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">Avaliação {avaliacao.type}</h4>
                            <Badge variant="outline">{formattedDate}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">Responsável: {avaliacao.responsible}</p>
                          <div className="mt-3 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Resistência</span>
                              <span>{80 - index * 5}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Força</span>
                              <span>{75 - index * 3}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Velocidade</span>
                              <span>{85 - index * 4}%</span>
                            </div>
                          </div>
                          <Button variant="link" className="p-0 h-auto mt-2 text-green-700">
                            Ver detalhes
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comparativo">
              <Card>
                <CardHeader>
                  <CardTitle>Comparativo com a Equipe</CardTitle>
                  <CardDescription>Desempenho do atleta em relação à média da equipe</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full border rounded-md p-4 flex items-center justify-center mb-6">
                    <div className="text-center">
                      <Activity className="h-16 w-16 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">
                        Gráfico comparativo entre o atleta e a média da equipe
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h4 className="font-medium">Resistência</h4>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Atleta</span>
                            <span>80%</span>
                          </div>
                          <Progress value={80} className="h-2 bg-gray-200" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Média da Equipe</span>
                            <span>75%</span>
                          </div>
                          <Progress value={75} className="h-2 bg-gray-200" />
                        </div>
                      </div>
                      <p className="text-xs text-green-600 mt-1">+5% acima da média da equipe</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Força</h4>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Atleta</span>
                            <span>75%</span>
                          </div>
                          <Progress value={75} className="h-2 bg-gray-200" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Média da Equipe</span>
                            <span>78%</span>
                          </div>
                          <Progress value={78} className="h-2 bg-gray-200" />
                        </div>
                      </div>
                      <p className="text-xs text-red-600 mt-1">-3% abaixo da média da equipe</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Velocidade</h4>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Atleta</span>
                            <span>85%</span>
                          </div>
                          <Progress value={85} className="h-2 bg-gray-200" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Média da Equipe</span>
                            <span>80%</span>
                          </div>
                          <Progress value={80} className="h-2 bg-gray-200" />
                        </div>
                      </div>
                      <p className="text-xs text-green-600 mt-1">+5% acima da média da equipe</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 border rounded-md">
                    <h4 className="font-medium mb-2">Posição no Ranking da Equipe</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-700 font-medium">
                        3
                      </div>
                      <div>
                        <p className="text-sm">
                          O atleta está na <strong>3ª posição</strong> entre 12 atletas da equipe
                        </p>
                        <p className="text-xs text-muted-foreground">Baseado na média geral de todos os indicadores</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
