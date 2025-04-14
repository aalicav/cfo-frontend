"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, MoreHorizontal, Plus, Search, Filter, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { espacosService, Espaco } from "@/services/espacos.service"
import { Skeleton } from "@/components/ui/skeleton"

export default function EspacosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFiltro, setTipoFiltro] = useState("todos")
  const [espacos, setEspacos] = useState<Espaco[]>([])
  const [loading, setLoading] = useState(true)
  const [tipos, setTipos] = useState<string[]>([])
  const [isLoadingTipos, setIsLoadingTipos] = useState(true)
  const { toast } = useToast()

  // Função para carregar os espaços
  const carregarEspacos = useCallback(async () => {
    try {
      setLoading(true)
      
      const params: any = {}
      
      if (searchTerm) {
        params.search = searchTerm
      }
      
      if (tipoFiltro !== "todos") {
        params.type = tipoFiltro
      }
      
      const espacosData = await espacosService.listar(params)
      setEspacos(espacosData)
    } catch (error) {
      console.error("Erro ao carregar espaços:", error)
      toast({
        title: "Erro ao carregar espaços",
        description: "Não foi possível carregar a lista de espaços. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [searchTerm, tipoFiltro, toast])

  // Função para carregar os tipos de espaços
  const carregarTipos = useCallback(async () => {
    try {
      setIsLoadingTipos(true)
      const tiposData = await espacosService.getTipos()
      setTipos(tiposData || [])
    } catch (error) {
      console.error("Erro ao carregar tipos de espaços:", error)
      setTipos([])
    } finally {
      setIsLoadingTipos(false)
    }
  }, [])

  // Efeito para carregar os espaços quando a página é carregada
  useEffect(() => {
    carregarEspacos()
  }, [carregarEspacos])

  // Efeito para carregar os tipos de espaços quando a página é carregada
  useEffect(() => {
    carregarTipos()
  }, [carregarTipos])

  // Função para mapear o status do espaço para texto legível
  const getStatusText = (status?: string | boolean) => {
    if (status === true || status === "active" || status === "available") return "Disponível"
    if (status === "maintenance") return "Em Manutenção"
    if (status === false || status === "inactive" || status === "unavailable") return "Indisponível"
    return "Desconhecido"
  }

  // Função para mapear o status do espaço para uma classe CSS
  const getStatusClass = (status?: string | boolean) => {
    if (status === true || status === "active" || status === "available") return "bg-green-500"
    if (status === "maintenance") return "bg-orange-500"
    if (status === false || status === "inactive" || status === "unavailable") return "bg-red-500"
    return "bg-gray-500"
  }

  // Função para pesquisar espaços
  const handleSearch = () => {
    carregarEspacos()
  }

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
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Select value={tipoFiltro} onValueChange={(value) => {
              setTipoFiltro(value)
              // Resetar a página e aplicar o filtro
              setTimeout(() => carregarEspacos(), 0)
            }}>
              <SelectTrigger className="w-full md:w-[180px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Tipo</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                {isLoadingTipos ? (
                  <SelectItem value="carregando" disabled>
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Carregando...
                    </div>
                  </SelectItem>
                ) : (
                  tipos.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleSearch}>
              Buscar
            </Button>
          </div>
        </div>

        <TabsContent value="lista" className="space-y-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden h-full">
                  <div className="aspect-video w-full bg-gray-100">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : espacos.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Nenhum espaço encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {espacos.map((espaco) => (
                <Link href={`/dashboard/espacos/${espaco.id}`} key={espaco.id}>
                  <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                    <div className="aspect-video w-full relative bg-gray-100">
                      <img
                        src={espaco.image_url || "/placeholder.svg"}
                        alt={espaco.name}
                        className="object-cover w-full h-full"
                      />
                      <Badge
                        className={`absolute top-2 right-2 ${getStatusClass(espaco.is_active)}`}
                      >
                        {getStatusText(espaco.is_active)}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{espaco.name}</h3>
                          <p className="text-sm text-muted-foreground">{espaco.type}</p>
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
                          <span>{espaco.location || "Localização não especificada"}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Capacidade: {espaco.capacity || "N/A"} pessoas</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
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
