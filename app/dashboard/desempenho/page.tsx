"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Search, LineChart, Activity, ClipboardList } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { avaliacoesService, atletasService } from "@/services/api"
import { AvaliacaoFrontend, Atleta, ApiResponse } from "@/types"

export default function DesempenhoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFiltro, setTipoFiltro] = useState("todos")
  const [modalidadeFiltro, setModalidadeFiltro] = useState("todas")
  const [periodoFiltro, setPeriodoFiltro] = useState("todos")
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoFrontend[]>([])
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const carregarDados = async () => {
      setIsLoading(true)
      try {
        // Carregar avaliações
        const avaliacoesData = await avaliacoesService.listarFormatoFrontend();
        setAvaliacoes(avaliacoesData);

        // Carregar atletas
        const atletasResponse = await atletasService.listar();
        if (atletasResponse && atletasResponse.data) {
          setAtletas(atletasResponse.data);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setError("Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    carregarDados();
  }, []);

  // Filtrar avaliações
  const avaliacoesFiltradas = avaliacoes.filter((avaliacao) => {
    const matchesSearch =
      avaliacao.athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      avaliacao.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      avaliacao.responsible.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTipo = tipoFiltro === "todos" || avaliacao.type === tipoFiltro
    const matchesModalidade = modalidadeFiltro === "todas" || avaliacao.modality === modalidadeFiltro

    // Filtro de período
    let matchesPeriodo = true
    const dataAvaliacao = new Date(avaliacao.date.split("/").reverse().join("-"))
    const hoje = new Date()
    const umMesAtras = new Date()
    umMesAtras.setMonth(hoje.getMonth() - 1)
    const treseMesesAtras = new Date()
    treseMesesAtras.setMonth(hoje.getMonth() - 3)
    const seiseMesesAtras = new Date()
    seiseMesesAtras.setMonth(hoje.getMonth() - 6)
    const umAnoAtras = new Date()
    umAnoAtras.setFullYear(hoje.getFullYear() - 1)

    switch (periodoFiltro) {
      case "ultimos_30_dias":
        matchesPeriodo = dataAvaliacao >= umMesAtras
        break
      case "ultimos_3_meses":
        matchesPeriodo = dataAvaliacao >= treseMesesAtras
        break
      case "ultimos_6_meses":
        matchesPeriodo = dataAvaliacao >= seiseMesesAtras
        break
      case "ultimo_ano":
        matchesPeriodo = dataAvaliacao >= umAnoAtras
        break
      default:
        matchesPeriodo = true
    }

    return matchesSearch && matchesTipo && matchesModalidade && matchesPeriodo
  })

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Carregando avaliações...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Desempenho</h2>
          <p className="text-muted-foreground">Gerencie e avalie o desempenho dos atletas</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/desempenho/nova-avaliacao">
            <Button className="bg-green-700 hover:bg-green-600">
              <Plus className="mr-2 h-4 w-4" />
              Nova Avaliação
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="avaliacoes" className="mt-6">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
        </TabsList>

        <TabsContent value="avaliacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
              <CardDescription>Filtre as avaliações por diferentes critérios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <label htmlFor="search" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Pesquisar
                  </label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Nome, responsável..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="tipo" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Tipo
                  </label>
                  <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
                    <SelectTrigger id="tipo">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os tipos</SelectItem>
                      <SelectItem value="Física">Física</SelectItem>
                      <SelectItem value="Técnica">Técnica</SelectItem>
                      <SelectItem value="Médica">Médica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="modalidade" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Modalidade
                  </label>
                  <Select value={modalidadeFiltro} onValueChange={setModalidadeFiltro}>
                    <SelectTrigger id="modalidade">
                      <SelectValue placeholder="Selecione a modalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as modalidades</SelectItem>
                      {/* Lista única de modalidades das avaliações */}
                      {Array.from(new Set(avaliacoes.map((a) => a.modality)))
                        .filter(Boolean)
                        .sort()
                        .map((modalidade) => (
                          <SelectItem key={modalidade} value={modalidade}>
                            {modalidade}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="periodo" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Período
                  </label>
                  <Select value={periodoFiltro} onValueChange={setPeriodoFiltro}>
                    <SelectTrigger id="periodo">
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todo o período</SelectItem>
                      <SelectItem value="ultimos_30_dias">Últimos 30 dias</SelectItem>
                      <SelectItem value="ultimos_3_meses">Últimos 3 meses</SelectItem>
                      <SelectItem value="ultimos_6_meses">Últimos 6 meses</SelectItem>
                      <SelectItem value="ultimo_ano">Último ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {avaliacoesFiltradas.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-32 p-6">
                <p className="text-center text-muted-foreground">Nenhuma avaliação encontrada com os filtros selecionados.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {avaliacoesFiltradas.map((avaliacao) => (
                <Link key={avaliacao.id} href={`/dashboard/desempenho/${avaliacao.id}`}>
                  <Card className="cursor-pointer transition-all hover:shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{avaliacao.type}</CardTitle>
                          <CardDescription>{avaliacao.date}</CardDescription>
                        </div>
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
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={avaliacao.athlete.photo || ""} alt={avaliacao.athlete.name} />
                          <AvatarFallback>{avaliacao.athlete.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{avaliacao.athlete.name}</div>
                          <div className="text-xs text-muted-foreground">{avaliacao.modality}</div>
                        </div>
                      </div>

                      <div className="space-y-1 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{avaliacao.date}</span>
                        </div>
                        <div className="flex items-center">
                          <ClipboardList className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {avaliacao.indicators ? avaliacao.indicators.length : 0} indicador
                            {!avaliacao.indicators || avaliacao.indicators.length !== 1 ? "es" : ""}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Responsável: {avaliacao.responsible}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="resumo" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Avaliações</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avaliacoes.length}</div>
                <p className="text-xs text-muted-foreground">
                  {avaliacoes.filter(a => {
                    const data = new Date(a.date.split('/').reverse().join('-'));
                    const umMesAtras = new Date();
                    umMesAtras.setMonth(umMesAtras.getMonth() - 1);
                    return data >= umMesAtras;
                  }).length} nos últimos 30 dias
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Modalidades Avaliadas</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(avaliacoes.map(a => a.modality).filter(Boolean)).size}
                </div>
                <p className="text-xs text-muted-foreground">
                  De um total de {new Set(atletas.flatMap(a => a.modalities || [])).size} modalidades
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Atletas Avaliados</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(avaliacoes.map(a => a.athlete.id)).size}
                </div>
                <p className="text-xs text-muted-foreground">
                  De um total de {atletas.length} atletas registrados
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-2 md:col-span-1">
              <CardHeader>
                <CardTitle>Tipo de Avaliações</CardTitle>
                <CardDescription>Distribuição de avaliações por tipo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Física", "Técnica", "Médica"].map(tipo => {
                    const count = avaliacoes.filter(a => a.type === tipo).length;
                    const percentage = avaliacoes.length ? Math.round((count / avaliacoes.length) * 100) : 0;
                    
                    return (
                      <div key={tipo} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full ${
                              tipo === "Física" ? "bg-blue-500" : 
                              tipo === "Técnica" ? "bg-green-500" : "bg-purple-500"
                            }`}></div>
                            <span>{tipo}</span>
                          </div>
                          <span>{count} ({percentage}%)</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-100">
                          <div 
                            className={`h-2 rounded-full ${
                              tipo === "Física" ? "bg-blue-500" : 
                              tipo === "Técnica" ? "bg-green-500" : "bg-purple-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2 md:col-span-1">
              <CardHeader>
                <CardTitle>Avaliações Recentes</CardTitle>
                <CardDescription>Últimas avaliações realizadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {avaliacoes
                    .sort((a, b) => {
                      const dateA = new Date(a.date.split('/').reverse().join('-'));
                      const dateB = new Date(b.date.split('/').reverse().join('-'));
                      return dateB.getTime() - dateA.getTime();
                    })
                    .slice(0, 5)
                    .map(avaliacao => (
                      <div key={avaliacao.id} className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={avaliacao.athlete.photo || ""} alt={avaliacao.athlete.name} />
                          <AvatarFallback>{avaliacao.athlete.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{avaliacao.athlete.name}</div>
                            <Badge
                              className={`${
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
                          <div className="text-xs text-muted-foreground">{avaliacao.date}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Desempenho por Atleta</CardTitle>
              <CardDescription>Visão geral de atletas com avaliações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Atletas com melhor desempenho</h3>
                <div className="space-y-2">
                  {atletas.slice(0, 5).map((atleta, index) => (
                    <div key={atleta.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-700 font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{atleta.user?.name || "Atleta"}</div>
                          <div className="text-xs text-muted-foreground">
                            {(atleta.modalities && atleta.modalities.length > 0)
                              ? `${atleta.modalities.length} modalidade${atleta.modalities.length !== 1 ? 's' : ''}`
                              : 'Sem modalidade'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {avaliacoes.filter(a => a.athlete.id === atleta.id).length} avaliações
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Última: {
                            avaliacoes
                              .filter(a => a.athlete.id === atleta.id)
                              .sort((a, b) => {
                                const dateA = new Date(a.date.split('/').reverse().join('-'));
                                const dateB = new Date(b.date.split('/').reverse().join('-'));
                                return dateB.getTime() - dateA.getTime();
                              })[0]?.date || 'N/A'
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparativo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparação de Desempenho</CardTitle>
              <CardDescription>Compare o desempenho entre atletas e modalidades</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex flex-col items-center justify-center text-center">
              <LineChart className="h-16 w-16 mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Os gráficos comparativos estarão disponíveis em breve</h3>
              <p className="text-muted-foreground max-w-md">
                Estamos trabalhando para disponibilizar visualizações comparativas do desempenho dos atletas nas
                próximas atualizações.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Evolução por Modalidade</CardTitle>
                <CardDescription>Acompanhe a evolução de indicadores por modalidade esportiva</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <Select defaultValue="todas">
                      <SelectTrigger id="modalidade-comp">
                        <SelectValue placeholder="Selecione a modalidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas as modalidades</SelectItem>
                        {Array.from(new Set(avaliacoes.map((a) => a.modality)))
                          .filter(Boolean)
                          .sort()
                          .map((modalidade) => (
                            <SelectItem key={modalidade} value={modalidade}>
                              {modalidade}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <Select defaultValue="todos">
                      <SelectTrigger id="periodo-comp">
                        <SelectValue placeholder="Selecione o período" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todo o período</SelectItem>
                        <SelectItem value="ultimos_30_dias">Últimos 30 dias</SelectItem>
                        <SelectItem value="ultimos_3_meses">Últimos 3 meses</SelectItem>
                        <SelectItem value="ultimos_6_meses">Últimos 6 meses</SelectItem>
                        <SelectItem value="ultimo_ano">Último ano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="h-64 border rounded-md flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-2" />
                      <p>Os dados de evolução estarão disponíveis em breve</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comparativo entre Atletas</CardTitle>
                <CardDescription>Compare o desempenho entre diferentes atletas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <Select defaultValue="todos">
                      <SelectTrigger id="atleta-1">
                        <SelectValue placeholder="Selecione o primeiro atleta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os atletas</SelectItem>
                        {atletas.slice(0, 5).map((atleta) => (
                          <SelectItem key={atleta.id} value={atleta.id}>
                            {atleta.user?.name || "Atleta"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select defaultValue="todos">
                      <SelectTrigger id="atleta-2">
                        <SelectValue placeholder="Selecione o segundo atleta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os atletas</SelectItem>
                        {atletas.slice(0, 5).map((atleta) => (
                          <SelectItem key={atleta.id} value={atleta.id}>
                            {atleta.user?.name || "Atleta"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="h-64 border rounded-md flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-2" />
                      <p>Os dados comparativos estarão disponíveis em breve</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
