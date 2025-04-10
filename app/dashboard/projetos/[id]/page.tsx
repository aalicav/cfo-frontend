"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Edit, Users, MapPin, FileText, Clock, CheckCircle2 } from "lucide-react"
import { projetosMock } from "@/lib/projetos-mock"
import { espacosMock } from "@/lib/espacos-mock"
import { ProjetoCronograma } from "@/components/projeto-cronograma"
import { ProjetoDocumentos } from "@/components/projeto-documentos"
import { ProjetoHistorico } from "@/components/projeto-historico"

export default function ProjetoDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const projeto = projetosMock.find((p) => p.id === id)

  const [activeTab, setActiveTab] = useState("visao-geral")

  if (!projeto) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold">Projeto não encontrado</h2>
        <p className="text-muted-foreground mb-4">O projeto que você está procurando não existe.</p>
        <Button onClick={() => router.push("/dashboard/projetos")}>Voltar para lista de projetos</Button>
      </div>
    )
  }

  // Espaços associados a este projeto
  const espacosAssociados = espacosMock.filter((e) => projeto.espacos.includes(e.id))

  // Calcular progresso do projeto
  const dataInicio = new Date(projeto.dataInicio.split("/").reverse().join("-"))
  const dataFim = new Date(projeto.dataFim.split("/").reverse().join("-"))
  const hoje = new Date()

  let progresso = 0
  if (hoje >= dataFim) {
    progresso = 100
  } else if (hoje <= dataInicio) {
    progresso = 0
  } else {
    const totalDias = (dataFim.getTime() - dataInicio.getTime()) / (1000 * 3600 * 24)
    const diasPassados = (hoje.getTime() - dataInicio.getTime()) / (1000 * 3600 * 24)
    progresso = Math.round((diasPassados / totalDias) * 100)
  }

  // Metas do projeto (simulação)
  const metas = [
    { id: 1, descricao: "Inscrever 50 participantes", concluida: true, data: "15/03/2025" },
    { id: 2, descricao: "Realizar avaliação inicial", concluida: true, data: "30/03/2025" },
    {
      id: 3,
      descricao: "Completar primeiro ciclo de treinamento",
      concluida: projeto.status === "em_andamento",
      data: "30/06/2025",
    },
    { id: 4, descricao: "Participar de competição regional", concluida: false, data: "15/08/2025" },
    { id: 5, descricao: "Realizar avaliação final", concluida: false, data: "30/11/2025" },
  ]

  const metasConcluidas = metas.filter((meta) => meta.concluida).length
  const progressoMetas = Math.round((metasConcluidas / metas.length) * 100)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/projetos">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{projeto.nome}</h1>
          <Badge
            className={`ml-2 ${
              projeto.status === "planejado"
                ? "bg-blue-500"
                : projeto.status === "em_andamento"
                  ? "bg-green-500"
                  : "bg-gray-500"
            }`}
          >
            {projeto.status === "planejado"
              ? "Planejado"
              : projeto.status === "em_andamento"
                ? "Em andamento"
                : "Encerrado"}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/projetos/${id}/editar`}>
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
          <TabsTrigger value="cronograma">Cronograma</TabsTrigger>
          <TabsTrigger value="metas">Metas e Indicadores</TabsTrigger>
          <TabsTrigger value="equipe">Equipe</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Detalhes do Projeto</CardTitle>
                <CardDescription>Informações gerais sobre o projeto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Descrição</h3>
                  <p className="text-muted-foreground">{projeto.descricao}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Modalidade</p>
                    <p>{projeto.modalidade}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Responsável</p>
                    <p>{projeto.responsavel}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Data de Início</p>
                    <p>{projeto.dataInicio}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Data de Término</p>
                    <p>{projeto.dataFim}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                    <p>{projeto.tipo || "Esportivo"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Público-Alvo</p>
                    <p>{projeto.publicoAlvo || "Crianças e adolescentes de 10 a 17 anos"}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Progresso do Projeto</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Cronograma</p>
                      <p className="text-sm font-medium">{progresso}%</p>
                    </div>
                    <Progress value={progresso} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {progresso < 100
                        ? `${Math.round((dataFim.getTime() - hoje.getTime()) / (1000 * 3600 * 24))} dias restantes`
                        : "Projeto concluído"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Espaços Utilizados</h3>
                  {espacosAssociados.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {espacosAssociados.map((espaco) => (
                        <div key={espaco.id} className="flex items-start space-x-3 border rounded-md p-3">
                          <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">{espaco.nome}</p>
                            <p className="text-sm text-muted-foreground">{espaco.tipo}</p>
                            <Link
                              href={`/dashboard/espacos/${espaco.id}`}
                              className="text-xs text-green-700 hover:underline"
                            >
                              Ver detalhes
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Nenhum espaço associado a este projeto.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Próximas Ações</CardTitle>
                  <CardDescription>Atividades programadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projeto.proximasAcoes ? (
                      projeto.proximasAcoes.map((acao, index) => (
                        <div key={index} className="flex items-start space-x-3 border-b pb-3 last:border-0">
                          <div className="bg-blue-100 text-blue-700 p-2 rounded-md">
                            <Clock className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{acao.titulo}</p>
                            <p className="text-sm text-muted-foreground">{acao.data}</p>
                            <p className="text-xs text-muted-foreground mt-1">{acao.descricao}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-start space-x-3 border-b pb-3">
                          <div className="bg-blue-100 text-blue-700 p-2 rounded-md">
                            <Clock className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">Reunião de Avaliação</p>
                            <p className="text-sm text-muted-foreground">15/06/2025</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Avaliação do progresso do primeiro trimestre
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="bg-blue-100 text-blue-700 p-2 rounded-md">
                            <Clock className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">Competição Regional</p>
                            <p className="text-sm text-muted-foreground">30/06/2025</p>
                            <p className="text-xs text-muted-foreground mt-1">Participação na competição regional</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Metas</CardTitle>
                  <CardDescription>Progresso das metas do projeto</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm">Progresso geral</p>
                        <p className="text-sm font-medium">{progressoMetas}%</p>
                      </div>
                      <Progress value={progressoMetas} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {metasConcluidas} de {metas.length} metas concluídas
                      </p>
                    </div>
                    <div className="space-y-2">
                      {metas.slice(0, 3).map((meta) => (
                        <div key={meta.id} className="flex items-center">
                          <div className={`mr-2 ${meta.concluida ? "text-green-500" : "text-gray-300"}`}>
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                          <span className={`text-sm ${meta.concluida ? "line-through text-muted-foreground" : ""}`}>
                            {meta.descricao}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Button variant="link" className="text-green-700 p-0" onClick={() => setActiveTab("metas")}>
                      Ver todas as metas
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Documentos</CardTitle>
                  <CardDescription>Arquivos do projeto</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">Plano_do_Projeto.pdf</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        Ver
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">Cronograma.xlsx</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        Ver
                      </Button>
                    </div>
                  </div>
                  <Button variant="link" className="text-green-700 p-0 mt-2" onClick={() => setActiveTab("documentos")}>
                    Ver todos os documentos
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cronograma">
          <Card>
            <CardHeader>
              <CardTitle>Cronograma do Projeto</CardTitle>
              <CardDescription>Planejamento de atividades e marcos</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjetoCronograma projetoId={id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metas">
          <Card>
            <CardHeader>
              <CardTitle>Metas e Indicadores</CardTitle>
              <CardDescription>Objetivos e métricas de acompanhamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Progresso das Metas</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Progresso geral</p>
                      <p className="text-sm font-medium">{progressoMetas}%</p>
                    </div>
                    <Progress value={progressoMetas} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {metasConcluidas} de {metas.length} metas concluídas
                    </p>
                  </div>

                  <div className="space-y-4">
                    {metas.map((meta) => (
                      <div key={meta.id} className="flex items-start p-3 border rounded-md">
                        <div className={`mr-3 mt-0.5 ${meta.concluida ? "text-green-500" : "text-gray-300"}`}>
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className={`font-medium ${meta.concluida ? "line-through text-muted-foreground" : ""}`}>
                              {meta.descricao}
                            </p>
                            <Badge variant="outline">{meta.data}</Badge>
                          </div>
                          {meta.indicadores && (
                            <div className="mt-2">
                              <p className="text-sm text-muted-foreground">Indicadores:</p>
                              <ul className="list-disc list-inside text-sm text-muted-foreground ml-2 mt-1">
                                {meta.indicadores.map((indicador, idx) => (
                                  <li key={idx}>{indicador}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4">Público-Alvo</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium">Perfil</p>
                          <p className="text-sm text-muted-foreground">
                            {projeto.publicoAlvo || "Crianças e adolescentes de 10 a 17 anos"}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Quantidade Prevista</p>
                          <p className="text-sm text-muted-foreground">
                            {projeto.quantidadePrevista || "50 participantes"}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Critérios de Seleção</p>
                          <ul className="list-disc list-inside text-sm text-muted-foreground ml-2 mt-1">
                            <li>Faixa etária compatível</li>
                            <li>Interesse na modalidade</li>
                            <li>Disponibilidade para participar das atividades</li>
                            <li>Autorização dos responsáveis</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipe">
          <Card>
            <CardHeader>
              <CardTitle>Equipe do Projeto</CardTitle>
              <CardDescription>Membros e responsabilidades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Coordenação</h3>
                  <div className="flex items-start space-x-4 p-4 border rounded-md">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <Users className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">{projeto.responsavel}</p>
                      <p className="text-sm text-muted-foreground">Coordenador do Projeto</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Responsável pela gestão geral do projeto, coordenação da equipe e prestação de contas.
                      </p>
                      <div className="mt-2">
                        <Button variant="outline" size="sm">
                          <Users className="h-4 w-4 mr-2" />
                          Ver Perfil
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Equipe Técnica</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projeto.equipe ? (
                      projeto.equipe.map((membro, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 border rounded-md">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">{membro.nome}</p>
                            <p className="text-sm text-muted-foreground">{membro.cargo}</p>
                            <p className="text-xs text-muted-foreground mt-1">{membro.responsabilidades}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-start space-x-3 p-3 border rounded-md">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">Ana Silva</p>
                            <p className="text-sm text-muted-foreground">Técnica Esportiva</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Responsável pelo treinamento técnico e avaliação dos atletas.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 border rounded-md">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">Pedro Santos</p>
                            <p className="text-sm text-muted-foreground">Preparador Físico</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Responsável pela preparação física e condicionamento dos atletas.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 border rounded-md">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">Carla Oliveira</p>
                            <p className="text-sm text-muted-foreground">Psicóloga Esportiva</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Responsável pelo acompanhamento psicológico e motivacional.
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentos">
          <Card>
            <CardHeader>
              <CardTitle>Documentos do Projeto</CardTitle>
              <CardDescription>Arquivos e documentação</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjetoDocumentos projetoId={id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historico">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Ações</CardTitle>
              <CardDescription>Registro de atividades e alterações</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjetoHistorico projetoId={id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
