"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Search, LineChart, Activity, ClipboardList } from "lucide-react"
import { atletasMock } from "@/lib/atletas-mock"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { avaliacoesMock } from "@/lib/avaliacoes-mock"

export default function DesempenhoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFiltro, setTipoFiltro] = useState("todos")
  const [modalidadeFiltro, setModalidadeFiltro] = useState("todas")
  const [periodoFiltro, setPeriodoFiltro] = useState("todos")

  // Filtrar avaliações
  const avaliacoesFiltradas = avaliacoesMock.filter((avaliacao) => {
    const matchesSearch =
      avaliacao.atleta.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      avaliacao.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      avaliacao.responsavel.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTipo = tipoFiltro === "todos" || avaliacao.tipo === tipoFiltro
    const matchesModalidade = modalidadeFiltro === "todas" || avaliacao.modalidade === modalidadeFiltro

    // Filtro de período
    let matchesPeriodo = true
    const dataAvaliacao = new Date(avaliacao.data.split("/").reverse().join("-"))
    const hoje = new Date()

    if (periodoFiltro === "ultimos7dias") {
      const seteDiasAtras = new Date()
      seteDiasAtras.setDate(hoje.getDate() - 7)
      matchesPeriodo = dataAvaliacao >= seteDiasAtras
    } else if (periodoFiltro === "ultimos30dias") {
      const trintaDiasAtras = new Date()
      trintaDiasAtras.setDate(hoje.getDate() - 30)
      matchesPeriodo = dataAvaliacao >= trintaDiasAtras
    } else if (periodoFiltro === "ultimos90dias") {
      const noventaDiasAtras = new Date()
      noventaDiasAtras.setDate(hoje.getDate() - 90)
      matchesPeriodo = dataAvaliacao >= noventaDiasAtras
    }

    return matchesSearch && matchesTipo && matchesModalidade && matchesPeriodo
  })

  // Extrair tipos únicos para o filtro
  const tipos = Array.from(new Set(avaliacoesMock.map((avaliacao) => avaliacao.tipo)))

  // Extrair modalidades únicas para o filtro
  const modalidades = Array.from(new Set(avaliacoesMock.map((avaliacao) => avaliacao.modalidade)))

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Desempenho e Avaliações</h1>
          <p className="text-muted-foreground">
            Gerencie avaliações físicas, técnicas e médicas dos atletas do Centro de Formação Olímpica.
          </p>
        </div>
        <Link href="/dashboard/desempenho/nova-avaliacao">
          <Button className="bg-green-700 hover:bg-green-600">
            <Plus className="mr-2 h-4 w-4" /> Nova Avaliação
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="avaliacoes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
          <TabsTrigger value="indicadores">Indicadores</TabsTrigger>
          <TabsTrigger value="comparativos">Comparativos</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="avaliacoes" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar avaliações por atleta, tipo ou responsável..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Tipo de Avaliação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  {tipos.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={modalidadeFiltro} onValueChange={setModalidadeFiltro}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Modalidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as modalidades</SelectItem>
                  {modalidades.map((modalidade) => (
                    <SelectItem key={modalidade} value={modalidade}>
                      {modalidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={periodoFiltro} onValueChange={setPeriodoFiltro}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os períodos</SelectItem>
                  <SelectItem value="ultimos7dias">Últimos 7 dias</SelectItem>
                  <SelectItem value="ultimos30dias">Últimos 30 dias</SelectItem>
                  <SelectItem value="ultimos90dias">Últimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {avaliacoesFiltradas.map((avaliacao) => (
              <Card key={avaliacao.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={avaliacao.atleta.foto} alt={avaliacao.atleta.nome} />
                        <AvatarFallback>{avaliacao.atleta.nome.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{avaliacao.atleta.nome}</h3>
                        <p className="text-xs text-muted-foreground">{avaliacao.modalidade}</p>
                      </div>
                    </div>
                    <Badge
                      className={`${
                        avaliacao.tipo === "Física"
                          ? "bg-blue-500"
                          : avaliacao.tipo === "Técnica"
                            ? "bg-green-500"
                            : "bg-purple-500"
                      }`}
                    >
                      {avaliacao.tipo}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{avaliacao.data}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <ClipboardList className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Responsável: {avaliacao.responsavel}</span>
                      </div>
                      {avaliacao.indicadores && avaliacao.indicadores.length > 0 && (
                        <div className="flex items-center text-sm">
                          <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {avaliacao.indicadores.length} indicador{avaliacao.indicadores.length !== 1 ? "es" : ""}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <Link href={`/dashboard/desempenho/${avaliacao.id}`}>
                        <Button variant="outline">Ver Detalhes</Button>
                      </Link>
                      <Link href={`/dashboard/atletas/${avaliacao.atleta.id}`}>
                        <Button variant="ghost" size="sm">
                          Perfil do Atleta
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {avaliacoesFiltradas.length === 0 && (
            <div className="text-center p-12 border rounded-lg">
              <h3 className="text-lg font-medium">Nenhuma avaliação encontrada</h3>
              <p className="text-muted-foreground mt-2">
                Não foram encontradas avaliações com os critérios de busca informados.
              </p>
              <Link href="/dashboard/desempenho/nova-avaliacao">
                <Button className="mt-4 bg-green-700 hover:bg-green-600">
                  <Plus className="mr-2 h-4 w-4" /> Registrar Nova Avaliação
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="indicadores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Indicadores de Desempenho</CardTitle>
              <CardDescription>Visualize e compare indicadores de desempenho dos atletas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Select defaultValue="resistencia">
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Selecione o indicador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resistencia">Resistência</SelectItem>
                    <SelectItem value="forca">Força</SelectItem>
                    <SelectItem value="velocidade">Velocidade</SelectItem>
                    <SelectItem value="flexibilidade">Flexibilidade</SelectItem>
                    <SelectItem value="tecnica">Técnica</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="natacao">
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Selecione a modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="natacao">Natação</SelectItem>
                    <SelectItem value="atletismo">Atletismo</SelectItem>
                    <SelectItem value="ginastica">Ginástica</SelectItem>
                    <SelectItem value="judo">Judô</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="ultimos6meses">
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ultimos3meses">Últimos 3 meses</SelectItem>
                    <SelectItem value="ultimos6meses">Últimos 6 meses</SelectItem>
                    <SelectItem value="ultimo1ano">Último ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="h-80 w-full border rounded-md p-4 flex items-center justify-center">
                <div className="text-center">
                  <LineChart className="h-16 w-16 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">
                    Gráfico de evolução do indicador de Resistência para atletas de Natação nos últimos 6 meses
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium">Atletas com melhor desempenho</h3>
                <div className="space-y-2">
                  {atletasMock.slice(0, 5).map((atleta, index) => (
                    <div key={atleta.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-700 font-medium">
                          {index + 1}
                        </div>
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={atleta.foto} alt={atleta.nome} />
                          <AvatarFallback>{atleta.nome.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{atleta.nome}</h4>
                          <p className="text-xs text-muted-foreground">
                            {atleta.modalidades[0]} • {atleta.categoria}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{85 - index * 3}%</div>
                        <div className="text-xs text-muted-foreground">
                          {index === 0 ? "+5%" : index === 1 ? "+3%" : index === 2 ? "+2%" : "+1%"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparativos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparativo por Equipe</CardTitle>
              <CardDescription>Compare o desempenho entre diferentes equipes e modalidades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Select defaultValue="natacao">
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Selecione a modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="natacao">Natação</SelectItem>
                    <SelectItem value="atletismo">Atletismo</SelectItem>
                    <SelectItem value="ginastica">Ginástica</SelectItem>
                    <SelectItem value="judo">Judô</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="sub17">
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sub15">Sub-15</SelectItem>
                    <SelectItem value="sub17">Sub-17</SelectItem>
                    <SelectItem value="sub20">Sub-20</SelectItem>
                    <SelectItem value="adulto">Adulto</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="fisico">
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Tipo de avaliação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fisico">Físico</SelectItem>
                    <SelectItem value="tecnico">Técnico</SelectItem>
                    <SelectItem value="medico">Médico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Time A vs Time B</h3>
                  <div className="h-60 w-full flex items-center justify-center">
                    <div className="text-center">
                      <Activity className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">Gráfico comparativo entre times</p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Evolução por Indicador</h3>
                  <div className="h-60 w-full flex items-center justify-center">
                    <div className="text-center">
                      <LineChart className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">Gráfico de evolução por indicador</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Comparativo de Equipes</h3>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Time A - Natação Sub-17</h4>
                      <Badge className="bg-blue-500">Média: 82%</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Resistência</span>
                          <span>85%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: "85%" }}></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Força</span>
                          <span>78%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: "78%" }}></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Técnica</span>
                          <span>83%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: "83%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Time B - Natação Sub-17</h4>
                      <Badge className="bg-green-500">Média: 79%</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Resistência</span>
                          <span>80%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: "80%" }}></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Força</span>
                          <span>82%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: "82%" }}></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Técnica</span>
                          <span>75%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: "75%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Desempenho</CardTitle>
              <CardDescription>Gere relatórios personalizados de desempenho</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo de Relatório</label>
                    <Select defaultValue="individual">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="equipe">Por Equipe</SelectItem>
                        <SelectItem value="modalidade">Por Modalidade</SelectItem>
                        <SelectItem value="categoria">Por Categoria</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Período</label>
                    <Select defaultValue="ultimos3meses">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o período" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ultimo1mes">Último mês</SelectItem>
                        <SelectItem value="ultimos3meses">Últimos 3 meses</SelectItem>
                        <SelectItem value="ultimos6meses">Últimos 6 meses</SelectItem>
                        <SelectItem value="ultimo1ano">Último ano</SelectItem>
                        <SelectItem value="personalizado">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo de Avaliação</label>
                    <Select defaultValue="todos">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="fisica">Física</SelectItem>
                        <SelectItem value="tecnica">Técnica</SelectItem>
                        <SelectItem value="medica">Médica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Atleta</label>
                  <Select defaultValue="todos">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o atleta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os atletas</SelectItem>
                      {atletasMock.slice(0, 5).map((atleta) => (
                        <SelectItem key={atleta.id} value={atleta.id}>
                          {atleta.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Indicadores</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="resistencia" className="rounded border-gray-300" defaultChecked />
                      <label htmlFor="resistencia">Resistência</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="forca" className="rounded border-gray-300" defaultChecked />
                      <label htmlFor="forca">Força</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="velocidade" className="rounded border-gray-300" defaultChecked />
                      <label htmlFor="velocidade">Velocidade</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="flexibilidade" className="rounded border-gray-300" defaultChecked />
                      <label htmlFor="flexibilidade">Flexibilidade</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="tecnica" className="rounded border-gray-300" defaultChecked />
                      <label htmlFor="tecnica">Técnica</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="imc" className="rounded border-gray-300" />
                      <label htmlFor="imc">IMC</label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Formato do Relatório</label>
                    <Select defaultValue="pdf">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o formato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Incluir Gráficos</label>
                    <Select defaultValue="sim">
                      <SelectTrigger>
                        <SelectValue placeholder="Incluir gráficos?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Visualizar</Button>
                  <Button className="bg-green-700 hover:bg-green-600">Gerar Relatório</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
