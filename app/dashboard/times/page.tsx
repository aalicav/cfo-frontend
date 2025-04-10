"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, MoreHorizontal, Users, Calendar, Dumbbell, User } from "lucide-react"
import { timesMock } from "@/lib/times-mock"

export default function TimesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [modalidadeFiltro, setModalidadeFiltro] = useState("todas")
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas")

  const timesFiltrados = timesMock.filter((time) => {
    const matchesSearch =
      time.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      time.tecnico.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesModalidade = modalidadeFiltro === "todas" || time.modalidade === modalidadeFiltro
    const matchesCategoria = categoriaFiltro === "todas" || time.categoria === categoriaFiltro

    return matchesSearch && matchesModalidade && matchesCategoria
  })

  // Extrair modalidades únicas para o filtro
  const modalidades = Array.from(new Set(timesMock.map((time) => time.modalidade)))

  // Extrair categorias únicas para o filtro
  const categorias = Array.from(new Set(timesMock.map((time) => time.categoria)))

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Times</h1>
          <p className="text-muted-foreground">Gerencie os times e equipes do Centro de Formação Olímpica.</p>
        </div>
        <Link href="/dashboard/times/novo">
          <Button className="bg-green-700 hover:bg-green-600">
            <Plus className="mr-2 h-4 w-4" /> Novo Time
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar times por nome ou técnico..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
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

          <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as categorias</SelectItem>
              {categorias.map((categoria) => (
                <SelectItem key={categoria} value={categoria}>
                  {categoria}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {timesFiltrados.map((time) => (
          <Card key={time.id} className="overflow-hidden h-full hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="p-4 border-b bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{time.nome}</h3>
                    <p className="text-sm text-muted-foreground">{time.modalidade}</p>
                  </div>
                  <Badge>{time.categoria}</Badge>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Técnico: {time.tecnico}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{time.atletas.length} atletas</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Dumbbell className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{time.modalidade}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{time.competicoes || 0} competições</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Link href={`/dashboard/times/${time.id}`}>
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
                        <Link href={`/dashboard/times/${time.id}`} className="w-full">
                          Ver detalhes
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/dashboard/times/${time.id}/editar`} className="w-full">
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/dashboard/times/${time.id}/atletas`} className="w-full">
                          Gerenciar atletas
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {timesFiltrados.length === 0 && (
        <div className="text-center p-12 border rounded-lg">
          <h3 className="text-lg font-medium">Nenhum time encontrado</h3>
          <p className="text-muted-foreground mt-2">
            Não foram encontrados times com os critérios de busca informados.
          </p>
          <Link href="/dashboard/times/novo">
            <Button className="mt-4 bg-green-700 hover:bg-green-600">
              <Plus className="mr-2 h-4 w-4" /> Cadastrar Novo Time
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
