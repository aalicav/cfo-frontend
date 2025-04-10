"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Download, Filter, Plus, Search, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { agendamentosMock } from "@/lib/agendamentos-mock"
import { espacosMock } from "@/lib/espacos-mock"
import { projetosMock } from "@/lib/projetos-mock"

export default function AgendamentosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [tipoFilter, setTipoFilter] = useState("todos")
  const [espacoFilter, setEspacoFilter] = useState("todos")
  const [projetoFilter, setProjetoFilter] = useState("todos")

  // Função para formatar data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return data.toLocaleDateString("pt-BR")
  }

  // Função para formatar hora
  const formatarHora = (hora: number) => {
    return `${hora}:00`
  }

  // Função para obter nome do espaço pelo ID
  const getNomeEspaco = (espacoId: string) => {
    const espaco = espacosMock.find((e) => e.id === espacoId)
    return espaco ? espaco.nome : "Não especificado"
  }

  // Função para obter nome do projeto pelo ID
  const getNomeProjeto = (projetoId: string | null) => {
    if (!projetoId) return "Não vinculado"
    const projeto = projetosMock.find((p) => p.id === projetoId)
    return projeto ? projeto.nome : "Não especificado"
  }

  // Função para obter ícone de status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmado":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pendente":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "rejeitado":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "conflito":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      default:
        return null
    }
  }

  // Função para obter cor de badge de status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "confirmado":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "pendente":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      case "rejeitado":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "conflito":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      default:
        return ""
    }
  }

  // Filtrar agendamentos
  const agendamentosFiltrados = agendamentosMock.filter((agendamento) => {
    // Filtro de busca
    const matchesSearch =
      agendamento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.responsavel.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro de status
    const matchesStatus = statusFilter === "todos" || agendamento.status === statusFilter

    // Filtro de tipo
    const matchesTipo =
      tipoFilter === "todos" ||
      (tipoFilter === "interno" && agendamento.tipo === "interno") ||
      (tipoFilter === "externo" && agendamento.tipo === "externo")

    // Filtro de espaço
    const matchesEspaco = espacoFilter === "todos" || agendamento.espacoId === espacoFilter

    // Filtro de projeto
    const matchesProjeto = projetoFilter === "todos" || agendamento.projetoId === projetoFilter

    return matchesSearch && matchesStatus && matchesTipo && matchesEspaco && matchesProjeto
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Agendamentos</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/agendamentos/calendario">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Calendário
            </Button>
          </Link>
          <Link href="/dashboard/agendamentos/novo">
            <Button className="bg-green-700 hover:bg-green-600">
              <Plus className="mr-2 h-4 w-4" />
              Novo Agendamento
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="todos" className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
            <TabsTrigger value="confirmados">Confirmados</TabsTrigger>
            <TabsTrigger value="rejeitados">Rejeitados</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Filtros</CardTitle>
              <CardDescription>Refine a lista de agendamentos usando os filtros abaixo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por título ou responsável"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os status</SelectItem>
                    <SelectItem value="pendente">Pendentes</SelectItem>
                    <SelectItem value="confirmado">Confirmados</SelectItem>
                    <SelectItem value="rejeitado">Rejeitados</SelectItem>
                    <SelectItem value="conflito">Com conflito</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={tipoFilter} onValueChange={setTipoFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os tipos</SelectItem>
                    <SelectItem value="interno">Interno</SelectItem>
                    <SelectItem value="externo">Externo</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={espacoFilter} onValueChange={setEspacoFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Espaço" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os espaços</SelectItem>
                    {espacosMock.map((espaco) => (
                      <SelectItem key={espaco.id} value={espaco.id}>
                        {espaco.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={projetoFilter} onValueChange={setProjetoFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Projeto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os projetos</SelectItem>
                    {projetosMock.map((projeto) => (
                      <SelectItem key={projeto.id} value={projeto.id}>
                        {projeto.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <TabsContent value="todos" className="m-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Todos os Agendamentos</CardTitle>
                <CardDescription>{agendamentosFiltrados.length} agendamentos encontrados</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Responsável</TableHead>
                        <TableHead>Espaço</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Horário</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Projeto</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agendamentosFiltrados.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                            Nenhum agendamento encontrado com os filtros selecionados.
                          </TableCell>
                        </TableRow>
                      ) : (
                        agendamentosFiltrados.map((agendamento) => (
                          <TableRow key={agendamento.id}>
                            <TableCell className="font-medium">{agendamento.titulo}</TableCell>
                            <TableCell>{agendamento.responsavel}</TableCell>
                            <TableCell>{getNomeEspaco(agendamento.espacoId)}</TableCell>
                            <TableCell>{formatarData(agendamento.data)}</TableCell>
                            <TableCell>
                              {formatarHora(agendamento.horaInicio)} - {formatarHora(agendamento.horaFim)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  agendamento.tipo === "interno"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-purple-100 text-purple-800"
                                }
                              >
                                {agendamento.tipo === "interno" ? "Interno" : "Externo"}
                              </Badge>
                            </TableCell>
                            <TableCell>{getNomeProjeto(agendamento.projetoId)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(agendamento.status)}
                                <Badge variant="outline" className={getStatusBadgeClass(agendamento.status)}>
                                  {agendamento.status === "confirmado" && "Confirmado"}
                                  {agendamento.status === "pendente" && "Pendente"}
                                  {agendamento.status === "rejeitado" && "Rejeitado"}
                                  {agendamento.status === "conflito" && "Conflito"}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Link href={`/dashboard/agendamentos/${agendamento.id}`}>
                                <Button variant="ghost" size="sm">
                                  Detalhes
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pendentes" className="m-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Agendamentos Pendentes</CardTitle>
                <CardDescription>Agendamentos que aguardam aprovação</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Responsável</TableHead>
                        <TableHead>Espaço</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Horário</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agendamentosFiltrados.filter((a) => a.status === "pendente").length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            Nenhum agendamento pendente encontrado.
                          </TableCell>
                        </TableRow>
                      ) : (
                        agendamentosFiltrados
                          .filter((a) => a.status === "pendente")
                          .map((agendamento) => (
                            <TableRow key={agendamento.id}>
                              <TableCell className="font-medium">{agendamento.titulo}</TableCell>
                              <TableCell>{agendamento.responsavel}</TableCell>
                              <TableCell>{getNomeEspaco(agendamento.espacoId)}</TableCell>
                              <TableCell>{formatarData(agendamento.data)}</TableCell>
                              <TableCell>
                                {formatarHora(agendamento.horaInicio)} - {formatarHora(agendamento.horaFim)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    agendamento.tipo === "interno"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-purple-100 text-purple-800"
                                  }
                                >
                                  {agendamento.tipo === "interno" ? "Interno" : "Externo"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900"
                                  >
                                    Aprovar
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900"
                                  >
                                    Rejeitar
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="confirmados" className="m-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Agendamentos Confirmados</CardTitle>
                <CardDescription>Agendamentos aprovados e confirmados</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Responsável</TableHead>
                        <TableHead>Espaço</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Horário</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agendamentosFiltrados.filter((a) => a.status === "confirmado").length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            Nenhum agendamento confirmado encontrado.
                          </TableCell>
                        </TableRow>
                      ) : (
                        agendamentosFiltrados
                          .filter((a) => a.status === "confirmado")
                          .map((agendamento) => (
                            <TableRow key={agendamento.id}>
                              <TableCell className="font-medium">{agendamento.titulo}</TableCell>
                              <TableCell>{agendamento.responsavel}</TableCell>
                              <TableCell>{getNomeEspaco(agendamento.espacoId)}</TableCell>
                              <TableCell>{formatarData(agendamento.data)}</TableCell>
                              <TableCell>
                                {formatarHora(agendamento.horaInicio)} - {formatarHora(agendamento.horaFim)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    agendamento.tipo === "interno"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-purple-100 text-purple-800"
                                  }
                                >
                                  {agendamento.tipo === "interno" ? "Interno" : "Externo"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Link href={`/dashboard/agendamentos/${agendamento.id}`}>
                                  <Button variant="ghost" size="sm">
                                    Detalhes
                                  </Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejeitados" className="m-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Agendamentos Rejeitados</CardTitle>
                <CardDescription>Agendamentos que foram rejeitados</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Responsável</TableHead>
                        <TableHead>Espaço</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Horário</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Motivo</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agendamentosFiltrados.filter((a) => a.status === "rejeitado").length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            Nenhum agendamento rejeitado encontrado.
                          </TableCell>
                        </TableRow>
                      ) : (
                        agendamentosFiltrados
                          .filter((a) => a.status === "rejeitado")
                          .map((agendamento) => (
                            <TableRow key={agendamento.id}>
                              <TableCell className="font-medium">{agendamento.titulo}</TableCell>
                              <TableCell>{agendamento.responsavel}</TableCell>
                              <TableCell>{getNomeEspaco(agendamento.espacoId)}</TableCell>
                              <TableCell>{formatarData(agendamento.data)}</TableCell>
                              <TableCell>
                                {formatarHora(agendamento.horaInicio)} - {formatarHora(agendamento.horaFim)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    agendamento.tipo === "interno"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-purple-100 text-purple-800"
                                  }
                                >
                                  {agendamento.tipo === "interno" ? "Interno" : "Externo"}
                                </Badge>
                              </TableCell>
                              <TableCell>{agendamento.motivoRejeicao || "Não especificado"}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm">
                                  Solicitar novamente
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
