"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Users, Calendar, MapPin, Trophy, FileText } from "lucide-react"
import { modalidadesMock } from "@/lib/modalidades-mock"
import { projetosMock } from "@/lib/projetos-mock"
import { espacosMock } from "@/lib/espacos-mock"

export default function ModalidadeDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const modalidade = modalidadesMock.find((m) => m.id === id)

  const [activeTab, setActiveTab] = useState("visao-geral")

  if (!modalidade) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold">Modalidade não encontrada</h2>
        <p className="text-muted-foreground mb-4">A modalidade que você está procurando não existe.</p>
        <Button onClick={() => router.push("/dashboard/modalidades")}>Voltar para lista de modalidades</Button>
      </div>
    )
  }

  // Projetos associados a esta modalidade
  const projetosAssociados = projetosMock.filter((p) => p.modalidade === modalidade.nome)

  // Espaços associados a esta modalidade (simulação)
  const espacosAssociados = espacosMock.filter((_, index) => index % 3 === 0).slice(0, 2)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/modalidades">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{modalidade.nome}</h1>
          <Badge className="ml-2 bg-green-700">{modalidade.categoria}</Badge>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/modalidades/${id}/editar`}>
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
          <TabsTrigger value="projetos">Projetos</TabsTrigger>
          <TabsTrigger value="espacos">Espaços</TabsTrigger>
          <TabsTrigger value="atletas">Atletas</TabsTrigger>
          <TabsTrigger value="competicoes">Competições</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Detalhes da Modalidade</CardTitle>
                <CardDescription>Informações gerais sobre a modalidade esportiva</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video w-full overflow-hidden rounded-md">
                  <img
                    src={modalidade.imagem || "/placeholder.svg?height=400&width=600"}
                    alt={modalidade.nome}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="font-medium mb-2">Descrição</h3>
                  <p className="text-muted-foreground">{modalidade.descricao}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Características</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Categoria</p>
                      <p>{modalidade.categoria}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                      <p>{modalidade.tipo || "Individual/Coletiva"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Nível</p>
                      <p>{modalidade.nivel || "Iniciante a Avançado"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Faixa Etária Recomendada</p>
                      <p>{modalidade.faixaEtaria || "7 anos ou mais"}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Requisitos</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {modalidade.requisitos ? (
                      modalidade.requisitos.map((requisito, index) => <li key={index}>{requisito}</li>)
                    ) : (
                      <>
                        <li>Atestado médico de aptidão física</li>
                        <li>Equipamentos específicos para a prática</li>
                        <li>Disponibilidade para treinos regulares</li>
                      </>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas</CardTitle>
                  <CardDescription>Números da modalidade</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>Atletas</span>
                    </div>
                    <Badge variant="outline" className="font-medium">
                      {modalidade.atletas || Math.floor(Math.random() * 50) + 10}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>Projetos</span>
                    </div>
                    <Badge variant="outline" className="font-medium">
                      {projetosAssociados.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>Espaços</span>
                    </div>
                    <Badge variant="outline" className="font-medium">
                      {espacosAssociados.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>Competições</span>
                    </div>
                    <Badge variant="outline" className="font-medium">
                      {modalidade.competicoes || Math.floor(Math.random() * 8) + 2}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Coordenadores</CardTitle>
                  <CardDescription>Responsáveis pela modalidade</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {modalidade.coordenadores ? (
                      modalidade.coordenadores.map((coordenador, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">{coordenador.nome}</p>
                            <p className="text-sm text-muted-foreground">{coordenador.cargo}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-start space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">Carlos Mendes</p>
                          <p className="text-sm text-muted-foreground">Coordenador Técnico</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Documentos</CardTitle>
                  <CardDescription>Arquivos relacionados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {modalidade.documentos ? (
                      modalidade.documentos.map((documento, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">{documento.nome}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            Ver
                          </Button>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">Regulamento.pdf</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            Ver
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">Plano_Treinamento.pdf</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            Ver
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="projetos">
          <Card>
            <CardHeader>
              <CardTitle>Projetos Associados</CardTitle>
              <CardDescription>Projetos que utilizam esta modalidade</CardDescription>
            </CardHeader>
            <CardContent>
              {projetosAssociados.length > 0 ? (
                <div className="space-y-4">
                  {projetosAssociados.map((projeto) => (
                    <div key={projeto.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                      <div>
                        <h4 className="font-medium">{projeto.nome}</h4>
                        <p className="text-sm text-muted-foreground">{projeto.descricao}</p>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {projeto.dataInicio} a {projeto.dataFim}
                          </span>
                        </div>
                      </div>
                      <Link href={`/dashboard/projetos/${projeto.id}`}>
                        <Button variant="outline" size="sm">
                          Ver Projeto
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum projeto associado a esta modalidade.</p>
                  <Link href="/dashboard/projetos/novo">
                    <Button className="mt-4 bg-green-700 hover:bg-green-600">Criar Novo Projeto</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="espacos">
          <Card>
            <CardHeader>
              <CardTitle>Espaços Associados</CardTitle>
              <CardDescription>Espaços utilizados para esta modalidade</CardDescription>
            </CardHeader>
            <CardContent>
              {espacosAssociados.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {espacosAssociados.map((espaco) => (
                    <Card key={espaco.id} className="overflow-hidden">
                      <div className="aspect-video w-full relative bg-gray-100">
                        <img
                          src={espaco.imagens[0] || "/placeholder.svg"}
                          alt={espaco.nome}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{espaco.nome}</h3>
                        <p className="text-sm text-muted-foreground">{espaco.tipo}</p>
                        <div className="mt-2">
                          <Link href={`/dashboard/espacos/${espaco.id}`}>
                            <Button variant="outline" size="sm" className="w-full">
                              Ver Espaço
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum espaço associado a esta modalidade.</p>
                  <Link href="/dashboard/espacos">
                    <Button className="mt-4 bg-green-700 hover:bg-green-600">Associar Espaços</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="atletas">
          <Card>
            <CardHeader>
              <CardTitle>Atletas</CardTitle>
              <CardDescription>Atletas praticantes desta modalidade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Lista de atletas em desenvolvimento.</p>
                <Button className="mt-4 bg-green-700 hover:bg-green-600" onClick={() => setActiveTab("visao-geral")}>
                  Voltar para Visão Geral
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competicoes">
          <Card>
            <CardHeader>
              <CardTitle>Competições</CardTitle>
              <CardDescription>Competições relacionadas a esta modalidade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Lista de competições em desenvolvimento.</p>
                <Button className="mt-4 bg-green-700 hover:bg-green-600" onClick={() => setActiveTab("visao-geral")}>
                  Voltar para Visão Geral
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
