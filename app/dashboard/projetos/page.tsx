"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, MoreHorizontal, Calendar, Users, Target, Clock } from "lucide-react"
import { projetosMock } from "@/lib/projetos-mock"

export default function ProjetosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFiltro, setStatusFiltro] = useState("todos")

  const projetosFiltrados = projetosMock.filter((projeto) => {
    const matchesSearch =
      projeto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projeto.modalidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projeto.responsavel.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFiltro === "todos" || projeto.status === statusFiltro

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
          <p className="text-muted-foreground">
            Gerencie os projetos sociais, educacionais e culturais do Centro de Formação Olímpica.
          </p>
        </div>
        <Link href="/dashboard/projetos/novo">
          <Button className="bg-green-700 hover:bg-green-600">
            <Plus className="mr-2 h-4 w-4" /> Novo Projeto
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar projetos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={statusFiltro} onValueChange={setStatusFiltro}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="planejado">Planejado</SelectItem>
              <SelectItem value="em_andamento">Em andamento</SelectItem>
              <SelectItem value="encerrado">Encerrado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projetosFiltrados.map((projeto) => (
          <Card key={projeto.id} className="overflow-hidden h-full hover:shadow-md transition-shadow">
            <div className="p-4 border-b bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{projeto.nome}</h3>
                  <p className="text-sm text-muted-foreground">{projeto.modalidade}</p>
                </div>
                <Badge
                  className={`${
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
            </div>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{projeto.descricao}</p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {projeto.dataInicio} a {projeto.dataFim}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Responsável: {projeto.responsavel}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {projeto.metasConcluidas || Math.floor(Math.random() * 5)}/
                    {projeto.metasTotal || Math.floor(Math.random() * 5) + 5} metas concluídas
                  </span>
                </div>
                {projeto.proximaAcao && (
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Próxima ação: {projeto.proximaAcao}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <Link href={`/dashboard/projetos/${projeto.id}`}>
                  <Button variant="outline">Ver Detalhes</Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Abrir menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link href={`/dashboard/projetos/${projeto.id}`} className="w-full">
                        Ver detalhes
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/dashboard/projetos/${projeto.id}/editar`} className="w-full">
                        Editar
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/dashboard/projetos/${projeto.id}/cronograma`} className="w-full">
                        Ver cronograma
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projetosFiltrados.length === 0 && (
        <div className="text-center p-12 border rounded-lg">
          <h3 className="text-lg font-medium">Nenhum projeto encontrado</h3>
          <p className="text-muted-foreground mt-2">
            Não foram encontrados projetos com os critérios de busca informados.
          </p>
          <Link href="/dashboard/projetos/novo">
            <Button className="mt-4 bg-green-700 hover:bg-green-600">
              <Plus className="mr-2 h-4 w-4" /> Cadastrar Novo Projeto
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
