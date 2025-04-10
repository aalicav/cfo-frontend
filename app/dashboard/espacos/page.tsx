"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, MoreHorizontal, Plus, Search, Filter } from "lucide-react"
import { espacosMock } from "@/lib/espacos-mock"

export default function EspacosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFiltro, setTipoFiltro] = useState("todos")

  const espacosFiltrados = espacosMock.filter((espaco) => {
    const matchesSearch =
      espaco.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      espaco.localizacao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = tipoFiltro === "todos" || espaco.tipo === tipoFiltro

    return matchesSearch && matchesTipo
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Espaços</h1>
          <p className="text-muted-foreground">Gerencie os espaços e instalações do Centro de Formação Olímpica.</p>
        </div>
        <Link href="/dashboard/espacos/novo">
          <Button className="bg-green-700 hover:bg-green-600">
            <Plus className="mr-2 h-4 w-4" /> Novo Espaço
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="lista" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lista">Lista</TabsTrigger>
          <TabsTrigger value="calendario">Calendário</TabsTrigger>
          <TabsTrigger value="manutencao">Manutenções</TabsTrigger>
        </TabsList>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar espaços..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
              <SelectTrigger className="w-full md:w-[180px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Tipo</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="quadra">Quadra</SelectItem>
                <SelectItem value="piscina">Piscina</SelectItem>
                <SelectItem value="ginasio">Ginásio</SelectItem>
                <SelectItem value="sala">Sala</SelectItem>
                <SelectItem value="pista">Pista</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="lista" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {espacosFiltrados.map((espaco) => (
              <Link href={`/dashboard/espacos/${espaco.id}`} key={espaco.id}>
                <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                  <div className="aspect-video w-full relative bg-gray-100">
                    <img
                      src={espaco.imagens[0] || "/placeholder.svg"}
                      alt={espaco.nome}
                      className="object-cover w-full h-full"
                    />
                    <Badge
                      className={`absolute top-2 right-2 ${
                        espaco.status === "disponivel"
                          ? "bg-green-500"
                          : espaco.status === "manutencao"
                            ? "bg-orange-500"
                            : "bg-red-500"
                      }`}
                    >
                      {espaco.status === "disponivel"
                        ? "Disponível"
                        : espaco.status === "manutencao"
                          ? "Em Manutenção"
                          : "Ocupado"}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{espaco.nome}</h3>
                        <p className="text-sm text-muted-foreground">{espaco.tipo}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link href={`/dashboard/espacos/${espaco.id}`} className="w-full">
                              Ver detalhes
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href={`/dashboard/espacos/${espaco.id}/editar`} className="w-full">
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href={`/dashboard/espacos/${espaco.id}/agenda`} className="w-full">
                              Ver agenda
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{espaco.localizacao}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Capacidade: {espaco.capacidade} pessoas</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{espaco.agendamentos} agendamentos esta semana</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendario">
          <Card>
            <CardContent className="p-6">
              <div className="text-center p-12">
                <h3 className="text-lg font-medium">Calendário de Espaços</h3>
                <p className="text-muted-foreground mt-2">
                  Visualize a agenda completa de todos os espaços em formato de calendário.
                </p>
                <Link href="/dashboard/espacos/calendario">
                  <Button className="mt-4 bg-green-700 hover:bg-green-600">Abrir Calendário Completo</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manutencao">
          <Card>
            <CardContent className="p-6">
              <div className="text-center p-12">
                <h3 className="text-lg font-medium">Manutenções Programadas</h3>
                <p className="text-muted-foreground mt-2">
                  Gerencie as manutenções programadas para os espaços do complexo.
                </p>
                <Link href="/dashboard/espacos/manutencoes">
                  <Button className="mt-4 bg-green-700 hover:bg-green-600">Gerenciar Manutenções</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
