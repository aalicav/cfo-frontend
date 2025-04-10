"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import {
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  FileText,
  Filter,
  MessageCircle,
  Plus,
  Search,
  Trash2,
  User,
  Users,
  XCircle,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { notificacoesMock } from "@/lib/notificacoes-mock"
import { comunicadosMock } from "@/lib/comunicados-mock"
import { mensagensMock } from "@/lib/mensagens-mock"

export default function NotificacoesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFiltro, setTipoFiltro] = useState("todas")
  const [statusFiltro, setStatusFiltro] = useState("todas")
  const [activeTab, setActiveTab] = useState("notificacoes")
  const [showNovoForm, setShowNovoForm] = useState(false)

  // Filtrar notificações
  const notificacoesFiltradas = notificacoesMock.filter((notificacao) => {
    const matchesSearch = notificacao.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = tipoFiltro === "todas" || notificacao.tipo === tipoFiltro
    const matchesStatus = statusFiltro === "todas" || notificacao.status === statusFiltro

    return matchesSearch && matchesTipo && matchesStatus
  })

  // Filtrar comunicados
  const comunicadosFiltrados = comunicadosMock.filter((comunicado) => {
    return comunicado.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Filtrar mensagens
  const mensagensFiltradas = mensagensMock.filter((mensagem) => {
    return (
      mensagem.remetente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mensagem.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mensagem.conteudo.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Função para formatar data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  // Função para formatar hora
  const formatarHora = (dataString: string) => {
    const data = new Date(dataString)
    return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  }

  // Função para obter ícone de tipo de notificação
  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "agendamento":
        return <Calendar className="h-4 w-4 text-blue-500" />
      case "alteracao":
        return <Edit className="h-4 w-4 text-amber-500" />
      case "cancelamento":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "confirmacao":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "sistema":
        return <Bell className="h-4 w-4 text-purple-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  // Função para obter cor de badge de tipo de notificação
  const getTipoBadgeClass = (tipo: string) => {
    switch (tipo) {
      case "agendamento":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "alteracao":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      case "cancelamento":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "confirmacao":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "sistema":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      default:
        return ""
    }
  }

  // Função para obter ícone de status de notificação
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "lida":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "nao-lida":
        return <Clock className="h-4 w-4 text-amber-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notificações e Comunicados</h1>
          <p className="text-muted-foreground">
            Gerencie notificações, comunicados e mensagens do Centro de Formação Olímpica
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setShowNovoForm(false)
              setActiveTab("notificacoes")
            }}
          >
            <Bell className="mr-2 h-4 w-4" />
            Notificações
            <Badge className="ml-2 bg-red-500 text-white">
              {notificacoesMock.filter((n) => n.status === "nao-lida").length}
            </Badge>
          </Button>
          <Button
            className="bg-green-700 hover:bg-green-600"
            onClick={() => {
              setShowNovoForm(true)
              setActiveTab("comunicados")
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Comunicado
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 h-auto">
          <TabsTrigger
            value="notificacoes"
            className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger
            value="comunicados"
            className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
          >
            <FileText className="h-4 w-4 mr-2" />
            Comunicados
          </TabsTrigger>
          <TabsTrigger value="mensagens" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
            <MessageCircle className="h-4 w-4 mr-2" />
            Mensagens
          </TabsTrigger>
        </TabsList>

        {/* Notificações */}
        <TabsContent value="notificacoes" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Notificações</CardTitle>
              <CardDescription>Notificações do sistema e eventos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar notificações..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todos os tipos</SelectItem>
                      <SelectItem value="agendamento">Agendamento</SelectItem>
                      <SelectItem value="alteracao">Alteração</SelectItem>
                      <SelectItem value="cancelamento">Cancelamento</SelectItem>
                      <SelectItem value="confirmacao">Confirmação</SelectItem>
                      <SelectItem value="sistema">Sistema</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFiltro} onValueChange={setStatusFiltro}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todos os status</SelectItem>
                      <SelectItem value="lida">Lidas</SelectItem>
                      <SelectItem value="nao-lida">Não lidas</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {notificacoesFiltradas.length === 0 ? (
                  <div className="text-center p-12 border rounded-lg">
                    <Bell className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="text-lg font-medium mt-4">Nenhuma notificação encontrada</h3>
                    <p className="text-muted-foreground mt-2">
                      Não foram encontradas notificações com os critérios de busca informados.
                    </p>
                  </div>
                ) : (
                  notificacoesFiltradas.map((notificacao) => (
                    <div
                      key={notificacao.id}
                      className={`p-4 border rounded-md ${
                        notificacao.status === "nao-lida" ? "bg-green-50 border-green-200" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              notificacao.tipo === "agendamento"
                                ? "bg-blue-100"
                                : notificacao.tipo === "alteracao"
                                  ? "bg-amber-100"
                                  : notificacao.tipo === "cancelamento"
                                    ? "bg-red-100"
                                    : notificacao.tipo === "confirmacao"
                                      ? "bg-green-100"
                                      : "bg-purple-100"
                            }`}
                          >
                            {getTipoIcon(notificacao.tipo)}
                          </div>
                          <div>
                            <h4 className="font-medium">{notificacao.titulo}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{notificacao.conteudo}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatarData(notificacao.data)}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatarHora(notificacao.data)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="outline" className={getTipoBadgeClass(notificacao.tipo)}>
                            {notificacao.tipo === "agendamento" && "Agendamento"}
                            {notificacao.tipo === "alteracao" && "Alteração"}
                            {notificacao.tipo === "cancelamento" && "Cancelamento"}
                            {notificacao.tipo === "confirmacao" && "Confirmação"}
                            {notificacao.tipo === "sistema" && "Sistema"}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(notificacao.status)}
                            <span className="text-xs text-muted-foreground">
                              {notificacao.status === "lida" ? "Lida" : "Não lida"}
                            </span>
                          </div>
                        </div>
                      </div>
                      {notificacao.status === "nao-lida" && (
                        <div className="flex justify-end mt-4">
                          <Button variant="outline" size="sm">
                            Marcar como lida
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {notificacoesFiltradas.length > 0 && (
                <div className="flex justify-between items-center mt-6">
                  <Button variant="outline" size="sm">
                    Marcar todas como lidas
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Mostrando {notificacoesFiltradas.length} de {notificacoesMock.length} notificações
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>Personalize suas preferências de notificações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notificações de Agendamento</h4>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações quando novos agendamentos forem criados
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notif-agendamento" className="rounded border-gray-300" defaultChecked />
                    <Label htmlFor="notif-agendamento" className="text-sm font-normal">
                      Ativar
                    </Label>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notificações de Alteração</h4>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações quando agendamentos forem alterados
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notif-alteracao" className="rounded border-gray-300" defaultChecked />
                    <Label htmlFor="notif-alteracao" className="text-sm font-normal">
                      Ativar
                    </Label>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notificações de Cancelamento</h4>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações quando agendamentos forem cancelados
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notif-cancelamento" className="rounded border-gray-300" defaultChecked />
                    <Label htmlFor="notif-cancelamento" className="text-sm font-normal">
                      Ativar
                    </Label>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notificações por E-mail</h4>
                    <p className="text-sm text-muted-foreground">Receba notificações também por e-mail</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notif-email" className="rounded border-gray-300" defaultChecked />
                    <Label htmlFor="notif-email" className="text-sm font-normal">
                      Ativar
                    </Label>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notificações Push</h4>
                    <p className="text-sm text-muted-foreground">Receba notificações push no navegador</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notif-push" className="rounded border-gray-300" />
                    <Label htmlFor="notif-push" className="text-sm font-normal">
                      Ativar
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button>Salvar Configurações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comunicados */}
        <TabsContent value="comunicados" className="space-y-4">
          {showNovoForm ? (
            <Card>
              <CardHeader>
                <CardTitle>Novo Comunicado</CardTitle>
                <CardDescription>Crie um novo comunicado para os usuários do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título</Label>
                    <Input id="titulo" placeholder="Título do comunicado" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conteudo">Conteúdo</Label>
                    <Textarea id="conteudo" placeholder="Digite o conteúdo do comunicado..." rows={5} required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipo">Tipo</Label>
                      <Select required>
                        <SelectTrigger id="tipo">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="geral">Geral</SelectItem>
                          <SelectItem value="importante">Importante</SelectItem>
                          <SelectItem value="urgente">Urgente</SelectItem>
                          <SelectItem value="informativo">Informativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="destinatarios">Destinatários</Label>
                      <Select required>
                        <SelectTrigger id="destinatarios">
                          <SelectValue placeholder="Selecione os destinatários" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos os usuários</SelectItem>
                          <SelectItem value="atletas">Atletas</SelectItem>
                          <SelectItem value="instrutores">Instrutores</SelectItem>
                          <SelectItem value="coordenadores">Coordenadores</SelectItem>
                          <SelectItem value="gerentes">Gerentes</SelectItem>
                          <SelectItem value="administradores">Administradores</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="anexos">Anexos (opcional)</Label>
                    <div className="border rounded-md p-4 text-center">
                      <Button variant="outline" type="button" className="mx-auto">
                        <Plus className="h-4 w-4 mr-2" /> Adicionar Arquivo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        Você pode anexar arquivos relevantes (máx. 5MB)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="enviar-email" className="rounded border-gray-300" />
                    <Label htmlFor="enviar-email" className="text-sm font-normal">
                      Enviar também por e-mail
                    </Label>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setShowNovoForm(false)}>
                  Cancelar
                </Button>
                <Button className="bg-green-700 hover:bg-green-600">Publicar Comunicado</Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Comunicados</CardTitle>
                <CardDescription>Comunicados administrativos e informações importantes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar comunicados..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button className="bg-green-700 hover:bg-green-600" onClick={() => setShowNovoForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Comunicado
                  </Button>
                </div>

                <div className="space-y-4">
                  {comunicadosFiltrados.length === 0 ? (
                    <div className="text-center p-12 border rounded-lg">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="text-lg font-medium mt-4">Nenhum comunicado encontrado</h3>
                      <p className="text-muted-foreground mt-2">
                        Não foram encontrados comunicados com os critérios de busca informados.
                      </p>
                      <Button className="mt-4 bg-green-700 hover:bg-green-600" onClick={() => setShowNovoForm(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Criar Novo Comunicado
                      </Button>
                    </div>
                  ) : (
                    comunicadosFiltrados.map((comunicado) => (
                      <div
                        key={comunicado.id}
                        className={`p-4 border rounded-md ${
                          comunicado.tipo === "urgente"
                            ? "bg-red-50 border-red-200"
                            : comunicado.tipo === "importante"
                              ? "bg-amber-50 border-amber-200"
                              : ""
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{comunicado.titulo}</h4>
                              <Badge
                                className={
                                  comunicado.tipo === "urgente"
                                    ? "bg-red-500"
                                    : comunicado.tipo === "importante"
                                      ? "bg-amber-500"
                                      : comunicado.tipo === "informativo"
                                        ? "bg-blue-500"
                                        : "bg-green-500"
                                }
                              >
                                {comunicado.tipo.charAt(0).toUpperCase() + comunicado.tipo.slice(1)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center text-xs text-muted-foreground">
                                <User className="h-3 w-3 mr-1" />
                                {comunicado.autor}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatarData(comunicado.data)}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Users className="h-3 w-3 mr-1" />
                                {comunicado.destinatarios}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Separator className="my-3" />
                        <div className="text-sm">{comunicado.conteudo}</div>
                        {comunicado.anexos && comunicado.anexos.length > 0 && (
                          <div className="mt-4">
                            <h5 className="text-sm font-medium mb-2">Anexos:</h5>
                            <div className="flex flex-wrap gap-2">
                              {comunicado.anexos.map((anexo, index) => (
                                <Badge key={index} variant="outline" className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  {anexo}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Mensagens */}
        <TabsContent value="mensagens" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Mensagens</CardTitle>
              <CardDescription>Sistema de mensagens privadas entre usuários</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar mensagens..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button className="bg-green-700 hover:bg-green-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Mensagem
                </Button>
              </div>

              <div className="space-y-4">
                {mensagensFiltradas.length === 0 ? (
                  <div className="text-center p-12 border rounded-lg">
                    <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="text-lg font-medium mt-4">Nenhuma mensagem encontrada</h3>
                    <p className="text-muted-foreground mt-2">
                      Não foram encontradas mensagens com os critérios de busca informados.
                    </p>
                    <Button className="mt-4 bg-green-700 hover:bg-green-600">
                      <Plus className="mr-2 h-4 w-4" /> Enviar Nova Mensagem
                    </Button>
                  </div>
                ) : (
                  mensagensFiltradas.map((mensagem) => (
                    <div
                      key={mensagem.id}
                      className={`p-4 border rounded-md ${
                        mensagem.status === "nao-lida" ? "bg-green-50 border-green-200" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10 border">
                            <AvatarImage src={mensagem.remetente.foto} alt={mensagem.remetente.nome} />
                            <AvatarFallback>{mensagem.remetente.nome.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{mensagem.assunto}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              De: {mensagem.remetente.nome} ({mensagem.remetente.cargo})
                            </p>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatarData(mensagem.data)}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatarHora(mensagem.data)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {mensagem.status === "nao-lida" && <Badge className="bg-green-500">Nova</Badge>}
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Separator className="my-3" />
                      <div className="text-sm">{mensagem.conteudo}</div>
                      <div className="flex justify-end mt-4 gap-2">
                        {mensagem.status === "nao-lida" && (
                          <Button variant="outline" size="sm">
                            Marcar como lida
                          </Button>
                        )}
                        <Button size="sm">Responder</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
