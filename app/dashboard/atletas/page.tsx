"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, MoreHorizontal, User, Calendar, Medal, Dumbbell } from "lucide-react"
import { atletasMock } from "@/lib/atletas-mock"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AtletasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [modalidadeFiltro, setModalidadeFiltro] = useState("todas")
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas")
  const [statusFiltro, setStatusFiltro] = useState("todos")

  const atletasFiltrados = atletasMock.filter((atleta) => {
    const matchesSearch =
      atleta.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atleta.documento.includes(searchTerm) ||
      atleta.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesModalidade = modalidadeFiltro === "todas" || atleta.modalidades.includes(modalidadeFiltro)
    const matchesCategoria = categoriaFiltro === "todas" || atleta.categoria === categoriaFiltro
    const matchesStatus = statusFiltro === "todos" || atleta.status === statusFiltro

    return matchesSearch && matchesModalidade && matchesCategoria && matchesStatus
  })

  // Extrair modalidades únicas para o filtro
  const modalidades = Array.from(new Set(atletasMock.flatMap((atleta) => atleta.modalidades)))

  // Extrair categorias únicas para o filtro
  const categorias = Array.from(new Set(atletasMock.map((atleta) => atleta.categoria)))

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Atletas</h1>
          <p className="text-muted-foreground">Gerencie o cadastro de atletas do Centro de Formação Olímpica.</p>
        </div>
        <Link href="/dashboard/atletas/novo">
          <Button className="bg-green-700 hover:bg-green-600">
            <Plus className="mr-2 h-4 w-4" /> Novo Atleta
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar atletas por nome, documento ou email..."
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

          <Select value={statusFiltro} onValueChange={setStatusFiltro}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {atletasFiltrados.map((atleta) => (
          <Card key={atleta.id} className="overflow-hidden h-full hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={atleta.foto} alt={atleta.nome} />
                    <AvatarFallback>{atleta.nome.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{atleta.nome}</h3>
                    <p className="text-xs text-muted-foreground">{atleta.documento}</p>
                  </div>
                </div>
                <Badge
                  className={`${
                    atleta.status === "ativo"
                      ? "bg-green-500"
                      : atleta.status === "inativo"
                        ? "bg-gray-500"
                        : "bg-yellow-500"
                  }`}
                >
                  {atleta.status === "ativo" ? "Ativo" : atleta.status === "inativo" ? "Inativo" : "Pendente"}
                </Badge>
              </div>
              <div className="p-4">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {atleta.dataNascimento} ({atleta.idade} anos)
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Dumbbell className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {atleta.modalidades.length > 1
                        ? `${atleta.modalidades[0]} e mais ${atleta.modalidades.length - 1}`
                        : atleta.modalidades[0]}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Categoria: {atleta.categoria}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Medal className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{atleta.competicoes} competições</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Link href={`/dashboard/atletas/${atleta.id}`}>
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
                        <Link href={`/dashboard/atletas/${atleta.id}`} className="w-full">
                          Ver detalhes
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/dashboard/atletas/${atleta.id}/editar`} className="w-full">
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/dashboard/atletas/${atleta.id}/documentos`} className="w-full">
                          Documentos
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/dashboard/atletas/${atleta.id}/historico`} className="w-full">
                          Histórico
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

      {atletasFiltrados.length === 0 && (
        <div className="text-center p-12 border rounded-lg">
          <h3 className="text-lg font-medium">Nenhum atleta encontrado</h3>
          <p className="text-muted-foreground mt-2">
            Não foram encontrados atletas com os critérios de busca informados.
          </p>
          <Link href="/dashboard/atletas/novo">
            <Button className="mt-4 bg-green-700 hover:bg-green-600">
              <Plus className="mr-2 h-4 w-4" /> Cadastrar Novo Atleta
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
