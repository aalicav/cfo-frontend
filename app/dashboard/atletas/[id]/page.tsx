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
import { ArrowLeft, Edit, User, Calendar, Mail, Phone, MapPin, FileText, Medal, Dumbbell, Users } from "lucide-react"
import { atletasMock } from "@/lib/atletas-mock"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AtletaDocumentos } from "@/components/atleta-documentos"
import { AtletaHistorico } from "@/components/atleta-historico"
import { AtletaDesempenho } from "@/components/atleta-desempenho"

export default function AtletaDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const atleta = atletasMock.find((a) => a.id === id)

  const [activeTab, setActiveTab] = useState("perfil")

  if (!atleta) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold">Atleta não encontrado</h2>
        <p className="text-muted-foreground mb-4">O atleta que você está procurando não existe.</p>
        <Button onClick={() => router.push("/dashboard/atletas")}>Voltar para lista de atletas</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/atletas">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{atleta.nome}</h1>
          <Badge
            className={`ml-2 ${
              atleta.status === "ativo" ? "bg-green-500" : atleta.status === "inativo" ? "bg-gray-500" : "bg-yellow-500"
            }`}
          >
            {atleta.status === "ativo" ? "Ativo" : atleta.status === "inativo" ? "Inativo" : "Pendente"}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/atletas/${id}/editar`}>
            <Button className="bg-green-700 hover:bg-green-600">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="modalidades">Modalidades e Times</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="desempenho">Desempenho</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
                <CardDescription>Informações pessoais do atleta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                  <Avatar className="h-24 w-24 border">
                    <AvatarImage src={atleta.foto} alt={atleta.nome} />
                    <AvatarFallback className="text-2xl">{atleta.nome.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2 text-center sm:text-left">
                    <h2 className="text-xl font-bold">{atleta.nome}</h2>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                      {atleta.modalidades.map((modalidade) => (
                        <Badge key={modalidade} variant="outline">
                          {modalidade}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Categoria: {atleta.categoria} • {atleta.idade} anos
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Nome Completo</p>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{atleta.nome}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Data de Nascimento</p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>
                        {atleta.dataNascimento} ({atleta.idade} anos)
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Documento</p>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{atleta.documento}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Gênero</p>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{atleta.genero}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{atleta.email}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{atleta.telefone}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Endereço</h3>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <p className="text-muted-foreground">{atleta.endereco}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Informações Adicionais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Altura</p>
                      <p>{atleta.altura} cm</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Peso</p>
                      <p>{atleta.peso} kg</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Tipo Sanguíneo</p>
                      <p>{atleta.tipoSanguineo}</p>
                    </div>
                  </div>
                </div>

                {atleta.observacoes && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2">Observações</h3>
                      <p className="text-muted-foreground">{atleta.observacoes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contatos de Emergência</CardTitle>
                  <CardDescription>Pessoas para contato em caso de emergência</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {atleta.contatosEmergencia ? (
                      atleta.contatosEmergencia.map((contato, index) => (
                        <div key={index} className="flex items-start space-x-3 border-b pb-3 last:border-0">
                          <div className="bg-blue-100 text-blue-700 p-2 rounded-md">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{contato.nome}</p>
                            <p className="text-sm text-muted-foreground">{contato.parentesco}</p>
                            <p className="text-sm text-muted-foreground">{contato.telefone}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 text-blue-700 p-2 rounded-md">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">Maria Silva</p>
                          <p className="text-sm text-muted-foreground">Mãe</p>
                          <p className="text-sm text-muted-foreground">(85) 98765-4321</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas</CardTitle>
                  <CardDescription>Números do atleta</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Dumbbell className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>Modalidades</span>
                    </div>
                    <Badge variant="outline" className="font-medium">
                      {atleta.modalidades.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>Times</span>
                    </div>
                    <Badge variant="outline" className="font-medium">
                      {atleta.times?.length || 1}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Medal className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>Competições</span>
                    </div>
                    <Badge variant="outline" className="font-medium">
                      {atleta.competicoes}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>Medalhas</span>
                    </div>
                    <Badge variant="outline" className="font-medium">
                      {atleta.medalhas || 0}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status da Documentação</CardTitle>
                  <CardDescription>Situação dos documentos obrigatórios</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">Atestado Médico</span>
                      </div>
                      <Badge
                        className={
                          atleta.documentos?.atestadoMedico?.status === "valido"
                            ? "bg-green-500"
                            : atleta.documentos?.atestadoMedico?.status === "pendente"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }
                      >
                        {atleta.documentos?.atestadoMedico?.status === "valido"
                          ? "Válido"
                          : atleta.documentos?.atestadoMedico?.status === "pendente"
                            ? "Pendente"
                            : "Vencido"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">Autorização</span>
                      </div>
                      <Badge
                        className={
                          atleta.documentos?.autorizacao?.status === "valido"
                            ? "bg-green-500"
                            : atleta.documentos?.autorizacao?.status === "pendente"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }
                      >
                        {atleta.documentos?.autorizacao?.status === "valido"
                          ? "Válido"
                          : atleta.documentos?.autorizacao?.status === "pendente"
                            ? "Pendente"
                            : "Vencido"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">Documentos Pessoais</span>
                      </div>
                      <Badge
                        className={
                          atleta.documentos?.documentosPessoais?.status === "valido"
                            ? "bg-green-500"
                            : atleta.documentos?.documentosPessoais?.status === "pendente"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }
                      >
                        {atleta.documentos?.documentosPessoais?.status === "valido"
                          ? "Válido"
                          : atleta.documentos?.documentosPessoais?.status === "pendente"
                            ? "Pendente"
                            : "Vencido"}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="link"
                    className="text-green-700 p-0 mt-2 w-full"
                    onClick={() => setActiveTab("documentos")}
                  >
                    Ver todos os documentos
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documentos">
          <Card>
            <CardHeader>
              <CardTitle>Documentos do Atleta</CardTitle>
              <CardDescription>Documentos e arquivos relacionados ao atleta</CardDescription>
            </CardHeader>
            <CardContent>
              <AtletaDocumentos atletaId={id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modalidades">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Modalidades</CardTitle>
                <CardDescription>Modalidades esportivas praticadas pelo atleta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {atleta.modalidades.map((modalidade, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border rounded-md">
                      <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center">
                        <Dumbbell className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{modalidade}</h3>
                        <p className="text-sm text-muted-foreground">
                          {atleta.detalhesModalidades?.[modalidade]?.nivel || "Nível Intermediário"}
                        </p>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Desde {atleta.detalhesModalidades?.[modalidade]?.desde || "Janeiro/2025"}
                          </span>
                        </div>
                        <div className="mt-2">
                          <Link href={`/dashboard/modalidades/${modalidade.toLowerCase().replace(/\s+/g, "-")}`}>
                            <Button variant="outline" size="sm">
                              Ver Modalidade
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Times</CardTitle>
                <CardDescription>Times e equipes que o atleta integra</CardDescription>
              </CardHeader>
              <CardContent>
                {atleta.times && atleta.times.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {atleta.times.map((time, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 border rounded-md">
                        <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center">
                          <Users className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">{time.nome}</h3>
                          <p className="text-sm text-muted-foreground">{time.categoria}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Técnico: {time.tecnico} • {time.modalidade}
                          </p>
                          <div className="mt-2">
                            <Link href={`/dashboard/times/${time.id}`}>
                              <Button variant="outline" size="sm">
                                Ver Time
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-start space-x-4 p-4 border rounded-md">
                    <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">Time de Natação Juvenil</h3>
                      <p className="text-sm text-muted-foreground">Sub-17</p>
                      <p className="text-xs text-muted-foreground mt-1">Técnico: Carlos Mendes • Natação</p>
                      <div className="mt-2">
                        <Link href="/dashboard/times/time-001">
                          <Button variant="outline" size="sm">
                            Ver Time
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Projetos</CardTitle>
                <CardDescription>Projetos que o atleta participa</CardDescription>
              </CardHeader>
              <CardContent>
                {atleta.projetos && atleta.projetos.length > 0 ? (
                  <div className="space-y-4">
                    {atleta.projetos.map((projeto, index) => (
                      <div key={index} className="flex items-start justify-between border-b pb-4 last:border-0">
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
                    <p className="text-muted-foreground">Este atleta não está associado a nenhum projeto.</p>
                    <Link href="/dashboard/projetos">
                      <Button className="mt-4 bg-green-700 hover:bg-green-600">Associar a Projeto</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="historico">
          <Card>
            <CardHeader>
              <CardTitle>Histórico do Atleta</CardTitle>
              <CardDescription>Registro de participação em projetos, competições e modalidades</CardDescription>
            </CardHeader>
            <CardContent>
              <AtletaHistorico atletaId={id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="desempenho">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho do Atleta</CardTitle>
              <CardDescription>Avaliações e métricas de desempenho</CardDescription>
            </CardHeader>
            <CardContent>
              <AtletaDesempenho atletaId={id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Trophy(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}
