"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  BarChart,
  PieChart,
  LineChart,
  Download,
  FileText,
  Filter,
  Calendar,
  Users,
  Dumbbell,
  MapPin,
} from "lucide-react"

export default function RelatoriosPage() {
  const [periodoOcupacao, setPeriodoOcupacao] = useState("ultimo-mes")
  const [periodoParticipacao, setPeriodoParticipacao] = useState("ultimo-mes")
  const [periodoFrequencia, setPeriodoFrequencia] = useState("ultimo-mes")
  const [formatoExportacao, setFormatoExportacao] = useState("pdf")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios e Indicadores</h1>
        <p className="text-muted-foreground">
          Visualize e exporte relatórios detalhados sobre o Centro de Formação Olímpica
        </p>
      </div>

      <Tabs defaultValue="ocupacao" className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 h-auto">
          <TabsTrigger value="ocupacao" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
            <MapPin className="h-4 w-4 mr-2" />
            Ocupação de Espaços
          </TabsTrigger>
          <TabsTrigger
            value="participacao"
            className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
          >
            <Users className="h-4 w-4 mr-2" />
            Participação
          </TabsTrigger>
          <TabsTrigger
            value="frequencia"
            className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Frequência
          </TabsTrigger>
          <TabsTrigger
            value="modalidades"
            className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
          >
            <Dumbbell className="h-4 w-4 mr-2" />
            Modalidades
          </TabsTrigger>
        </TabsList>

        {/* Ocupação de Espaços */}
        <TabsContent value="ocupacao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ocupação de Espaços</CardTitle>
              <CardDescription>Análise de utilização dos espaços do Centro de Formação Olímpica</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="w-full md:w-1/4">
                  <Label htmlFor="periodo-ocupacao">Período</Label>
                  <Select value={periodoOcupacao} onValueChange={setPeriodoOcupacao}>
                    <SelectTrigger id="periodo-ocupacao">
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ultima-semana">Última semana</SelectItem>
                      <SelectItem value="ultimo-mes">Último mês</SelectItem>
                      <SelectItem value="ultimo-trimestre">Último trimestre</SelectItem>
                      <SelectItem value="ultimo-ano">Último ano</SelectItem>
                      <SelectItem value="personalizado">Período personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {periodoOcupacao === "personalizado" && (
                  <>
                    <div className="w-full md:w-1/4">
                      <Label htmlFor="data-inicio">Data Início</Label>
                      <Input type="date" id="data-inicio" />
                    </div>
                    <div className="w-full md:w-1/4">
                      <Label htmlFor="data-fim">Data Fim</Label>
                      <Input type="date" id="data-fim" />
                    </div>
                  </>
                )}

                <div className="w-full md:w-1/4">
                  <Label htmlFor="espaco">Espaço</Label>
                  <Select defaultValue="todos">
                    <SelectTrigger id="espaco">
                      <SelectValue placeholder="Selecione o espaço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os espaços</SelectItem>
                      <SelectItem value="piscina-olimpica">Piscina Olímpica</SelectItem>
                      <SelectItem value="quadra-poliesportiva">Quadra Poliesportiva</SelectItem>
                      <SelectItem value="pista-atletismo">Pista de Atletismo</SelectItem>
                      <SelectItem value="ginasio">Ginásio</SelectItem>
                      <SelectItem value="sala-lutas">Sala de Lutas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full md:w-1/4 md:self-end">
                  <Button className="w-full">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrar
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Taxa de Ocupação por Espaço</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 w-full flex items-center justify-center">
                      <div className="text-center">
                        <BarChart className="h-16 w-16 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">Gráfico de ocupação por espaço</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Distribuição de Uso por Tipo de Agendamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 w-full flex items-center justify-center">
                      <div className="text-center">
                        <PieChart className="h-16 w-16 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">Gráfico de distribuição por tipo</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Ocupação por Dia da Semana</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 w-full flex items-center justify-center">
                      <div className="text-center">
                        <BarChart className="h-16 w-16 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">Gráfico de ocupação por dia da semana</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Ocupação por Horário</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 w-full flex items-center justify-center">
                      <div className="text-center">
                        <LineChart className="h-16 w-16 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">Gráfico de ocupação por horário</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="text-lg font-medium mb-4">Resumo de Ocupação</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold">78%</div>
                        <p className="text-sm text-muted-foreground">Taxa média de ocupação</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold">245</div>
                        <p className="text-sm text-muted-foreground">Total de agendamentos</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold">18h</div>
                        <p className="text-sm text-muted-foreground">Horário de pico</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Select value={formatoExportacao} onValueChange={setFormatoExportacao}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Relatório
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Participação */}
        <TabsContent value="participacao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Participação</CardTitle>
              <CardDescription>Análise de participação por atleta, equipe, projeto e modalidade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="w-full md:w-1/5">
                  <Label htmlFor="periodo-participacao">Período</Label>
                  <Select value={periodoParticipacao} onValueChange={setPeriodoParticipacao}>
                    <SelectTrigger id="periodo-participacao">
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ultima-semana">Última semana</SelectItem>
                      <SelectItem value="ultimo-mes">Último mês</SelectItem>
                      <SelectItem value="ultimo-trimestre">Último trimestre</SelectItem>
                      <SelectItem value="ultimo-ano">Último ano</SelectItem>
                      <SelectItem value="personalizado">Período personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {periodoParticipacao === "personalizado" && (
                  <>
                    <div className="w-full md:w-1/5">
                      <Label htmlFor="data-inicio-part">Data Início</Label>
                      <Input type="date" id="data-inicio-part" />
                    </div>
                    <div className="w-full md:w-1/5">
                      <Label htmlFor="data-fim-part">Data Fim</Label>
                      <Input type="date" id="data-fim-part" />
                    </div>
                  </>
                )}

                <div className="w-full md:w-1/5">
                  <Label htmlFor="modalidade">Modalidade</Label>
                  <Select defaultValue="todas">
                    <SelectTrigger id="modalidade">
                      <SelectValue placeholder="Selecione a modalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as modalidades</SelectItem>
                      <SelectItem value="natacao">Natação</SelectItem>
                      <SelectItem value="atletismo">Atletismo</SelectItem>
                      <SelectItem value="ginastica">Ginástica</SelectItem>
                      <SelectItem value="judo">Judô</SelectItem>
                      <SelectItem value="volei">Vôlei</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full md:w-1/5">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select defaultValue="todas">
                    <SelectTrigger id="categoria">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as categorias</SelectItem>
                      <SelectItem value="sub15">Sub-15</SelectItem>
                      <SelectItem value="sub17">Sub-17</SelectItem>
                      <SelectItem value="sub20">Sub-20</SelectItem>
                      <SelectItem value="adulto">Adulto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full md:w-1/5 md:self-end">
                  <Button className="w-full">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrar
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Participação por Modalidade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 w-full flex items-center justify-center">
                      <div className="text-center">
                        <PieChart className="h-16 w-16 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">Gráfico de participação por modalidade</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Participação por Gênero</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 w-full flex items-center justify-center">
                      <div className="text-center">
                        <PieChart className="h-16 w-16 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">Gráfico de participação por gênero</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Participação por Faixa Etária</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 w-full flex items-center justify-center">
                      <div className="text-center">
                        <BarChart className="h-16 w-16 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">Gráfico de participação por faixa etária</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Participação por Projeto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 w-full flex items-center justify-center">
                      <div className="text-center">
                        <BarChart className="h-16 w-16 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">Gráfico de participação por projeto</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="text-lg font-medium mb-4">Resumo de Participação</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold">320</div>
                        <p className="text-sm text-muted-foreground">Total de atletas ativos</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold">18</div>
                        <p className="text-sm text-muted-foreground">Equipes formadas</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold">12</div>
                        <p className="text-sm text-muted-foreground">Projetos ativos</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold">8</div>
                        <p className="text-sm text-muted-foreground">Modalidades</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Select defaultValue="pdf">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Relatório
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Frequência */}
        <TabsContent value="frequencia" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequência</CardTitle>
              <CardDescription>Análise de frequência de atletas em treinos e eventos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="w-full md:w-1/4">
                  <Label htmlFor="periodo-frequencia">Período</Label>
                  <Select value={periodoFrequencia} onValueChange={setPeriodoFrequencia}>
                    <SelectTrigger id="periodo-frequencia">
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ultima-semana">Última semana</SelectItem>
                      <SelectItem value="ultimo-mes">Último mês</SelectItem>
                      <SelectItem value="ultimo-trimestre">Último trimestre</SelectItem>
                      <SelectItem value="ultimo-ano">Último ano</SelectItem>
                      <SelectItem value="personalizado">Período personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {periodoFrequencia === "personalizado" && (
                  <>
                    <div className="w-full md:w-1/4">
                      <Label htmlFor="data-inicio-freq">Data Início</Label>
                      <Input type="date" id="data-inicio-freq" />
                    </div>
                    <div className="w-full md:w-1/4">
                      <Label htmlFor="data-fim-freq">Data Fim</Label>
                      <Input type="date" id="data-fim-freq" />
                    </div>
                  </>
                )}

                <div className="w-full md:w-1/4">
                  <Label htmlFor="tipo-atividade">Tipo de Atividade</Label>
                  <Select defaultValue="todos">
                    <SelectTrigger id="tipo-atividade">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os tipos</SelectItem>
                      <SelectItem value="treino">Treinos</SelectItem>
                      <SelectItem value="competicao">Competições</SelectItem>
                      <SelectItem value="avaliacao">Avaliações</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full md:w-1/4 md:self-end">
                  <Button className="w-full">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrar
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Taxa de Frequência por Modalidade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 w-full flex items-center justify-center">
                      <div className="text-center">
                        <BarChart className="h-16 w-16 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">Gráfico de frequência por modalidade</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Evolução da Frequência</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 w-full flex items-center justify-center">
                      <div className="text-center">
                        <LineChart className="h-16 w-16 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">
                          Gráfico de evolução da frequência ao longo do tempo
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Frequência por Dia da Semana</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 w-full flex items-center justify-center">
                      <div className="text-center">
                        <BarChart className="h-16 w-16 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">Gráfico de frequência por dia da semana</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Frequência por Categoria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 w-full flex items-center justify-center">
                      <div className="text-center">
                        <BarChart className="h-16 w-16 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">Gráfico de frequência por categoria</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="text-lg font-medium mb-4">Atletas com Maior Frequência</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Atleta
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Modalidade
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Categoria
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Frequência
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Taxa
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[...Array(5)].map((_, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {
                                    [
                                      "Ana Silva",
                                      "Carlos Santos",
                                      "Juliana Oliveira",
                                      "Pedro Almeida",
                                      "Mariana Costa",
                                    ][index]
                                  }
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {["Natação", "Atletismo", "Natação", "Judô", "Ginástica"][index]}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {["Sub-17", "Adulto", "Sub-20", "Sub-17", "Sub-15"][index]}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{[28, 26, 25, 24, 23][index]} presenças</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{[98, 96, 94, 92, 90][index]}%</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Select defaultValue="pdf">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Relatório
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Modalidades */}
        <TabsContent value="modalidades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Modalidades</CardTitle>
              <CardDescription>Análise de desempenho e participação por modalidade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="w-full md:w-1/3">
                  <Label htmlFor="modalidade-select">Modalidade</Label>
                  <Select defaultValue="todas">
                    <SelectTrigger id="modalidade-select">
                      <SelectValue placeholder="Selecione a modalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as modalidades</SelectItem>
                      <SelectItem value="natacao">Natação</SelectItem>
                      <SelectItem value="atletismo">Atletismo</SelectItem>
                      <SelectItem value="ginastica">Ginástica</SelectItem>
                      <SelectItem value="judo">Judô</SelectItem>
                      <SelectItem value="volei">Vôlei</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full md:w-1/3">
                  <Label htmlFor="periodo-modalidade">Período</Label>
                  <Select defaultValue="ultimo-ano">
                    <SelectTrigger id="periodo-modalidade">
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ultimo-mes">Último mês</SelectItem>
                      <SelectItem value="ultimo-trimestre">Último trimestre</SelectItem>
                      <SelectItem value="ultimo-semestre">Último semestre</SelectItem>
                      <SelectItem value="ultimo-ano">Último ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full md:w-1/3 md:self-end">
                  <Button className="w-full">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrar
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Distribuição de Atletas por Modalidade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 w-full flex items-center justify-center">
                      <div className="text-center">
                        <PieChart className="h-16 w-16 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">Gráfico de distribuição de atletas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Evolução de Desempenho por Modalidade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 w-full flex items-center justify-center">
                      <div className="text-center">
                        <LineChart className="h-16 w-16 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">Gráfico de evolução de desempenho</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Resultados em Competições por Modalidade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 w-full flex items-center justify-center">
                      <div className="text-center">
                        <BarChart className="h-16 w-16 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">Gráfico de resultados em competições</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Uso de Espaços por Modalidade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 w-full flex items-center justify-center">
                      <div className="text-center">
                        <PieChart className="h-16 w-16 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">Gráfico de uso de espaços</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="text-lg font-medium mb-4">Comparativo entre Modalidades</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Modalidade
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Atletas
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Equipes
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Competições
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Medalhas
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        { modalidade: "Natação", atletas: 85, equipes: 4, competicoes: 12, medalhas: 28 },
                        { modalidade: "Atletismo", atletas: 65, equipes: 3, competicoes: 8, medalhas: 15 },
                        { modalidade: "Ginástica", atletas: 45, equipes: 2, competicoes: 6, medalhas: 12 },
                        { modalidade: "Judô", atletas: 40, equipes: 2, competicoes: 5, medalhas: 10 },
                        { modalidade: "Vôlei", atletas: 36, equipes: 3, competicoes: 4, medalhas: 2 },
                      ].map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.modalidade}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.atletas}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.equipes}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.competicoes}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.medalhas}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Select defaultValue="pdf">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Relatório
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Relatórios Institucionais</CardTitle>
          <CardDescription>Relatórios pré-configurados para uso institucional</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 text-green-700 p-3 rounded-md">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Relatório Mensal de Atividades</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Resumo completo das atividades do mês, incluindo ocupação, participação e resultados.
                    </p>
                    <Button variant="outline" size="sm" className="mt-4">
                      <Download className="h-4 w-4 mr-2" /> Exportar PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 text-blue-700 p-3 rounded-md">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Relatório de Desempenho Esportivo</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Análise detalhada do desempenho dos atletas e equipes em competições e avaliações.
                    </p>
                    <Button variant="outline" size="sm" className="mt-4">
                      <Download className="h-4 w-4 mr-2" /> Exportar PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 text-purple-700 p-3 rounded-md">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Relatório de Gestão de Espaços</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Análise completa da utilização dos espaços, taxa de ocupação e agendamentos.
                    </p>
                    <Button variant="outline" size="sm" className="mt-4">
                      <Download className="h-4 w-4 mr-2" /> Exportar PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
