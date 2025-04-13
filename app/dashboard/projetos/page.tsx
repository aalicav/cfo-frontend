"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, MoreHorizontal, Calendar, Users, Target, Clock } from "lucide-react"
import { projetosService, Projeto } from "@/services/projetos.service"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { useToast } from "@/hooks/use-toast"

export default function ProjetosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFiltro, setStatusFiltro] = useState("todos")
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [tiposProjeto, setTiposProjeto] = useState<string[]>([])
  const [tipoFiltro, setTipoFiltro] = useState("todos")
  const { toast } = useToast()

  const carregarProjetos = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      // Mapear os valores do filtro para o formato do backend
      const statusMap: Record<string, string> = {
        todos: "",
        planejado: "planned",
        em_andamento: "in_progress",
        encerrado: "completed"
      }

      const params = {
        page,
        per_page: 9,
        search: searchTerm || undefined,
        status: statusMap[statusFiltro] || undefined,
        type: tipoFiltro !== "todos" ? tipoFiltro : undefined,
        sort_by: 'name',
        sort_dir: 'asc' as const
      }

      const response = await projetosService.listar(params)
      
      if (response && 'data' in response && Array.isArray(response.data)) {
        setProjetos(response.data)
        setCurrentPage(response.current_page)
        setTotalPages(response.last_page)
      } else if (Array.isArray(response)) {
        setProjetos(response)
        setCurrentPage(1)
        setTotalPages(1)
      } else {
        setProjetos([])
      }
    } catch (error) {
      console.error("Erro ao carregar projetos:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os projetos.",
        variant: "destructive",
      })
      setProjetos([])
    } finally {
      setLoading(false)
    }
  }, [searchTerm, statusFiltro, tipoFiltro, toast])

  const carregarTiposProjeto = useCallback(async () => {
    try {
      const tipos = await projetosService.getTipos()
      if (Array.isArray(tipos)) {
        setTiposProjeto(tipos)
      }
    } catch (error) {
      console.error("Erro ao carregar tipos de projeto:", error)
    }
  }, [])

  useEffect(() => {
    carregarTiposProjeto()
  }, [carregarTiposProjeto])

  useEffect(() => {
    carregarProjetos(currentPage)
  }, [carregarProjetos, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Função para exibir o status em português
  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, string> = {
      planned: "Planejado",
      in_progress: "Em andamento",
      completed: "Encerrado"
    }
    return statusMap[status] || status
  }

  // Função para obter a classe CSS do status
  const getStatusClass = (status: string) => {
    const statusMap: Record<string, string> = {
      planned: "bg-blue-500",
      in_progress: "bg-green-500",
      completed: "bg-gray-500"
    }
    return statusMap[status] || "bg-gray-500"
  }

  if (loading && projetos.length === 0) {
    return <CarregandoProjetos />
  }

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
            onKeyDown={(e) => e.key === 'Enter' && carregarProjetos(1)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={statusFiltro} onValueChange={(value) => {
            setStatusFiltro(value)
            setCurrentPage(1)
          }}>
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
          
          {tiposProjeto.length > 0 && (
            <Select value={tipoFiltro} onValueChange={(value) => {
              setTipoFiltro(value)
              setCurrentPage(1)
            }}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                {tiposProjeto.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => carregarProjetos(1)}
          >
            Pesquisar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projetos.length > 0 ? projetos.map((projeto) => (
          <Card key={projeto.id} className="overflow-hidden h-full hover:shadow-md transition-shadow">
            <div className="p-4 border-b bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{projeto.name}</h3>
                  <p className="text-sm text-muted-foreground">{projeto.modality}</p>
                </div>
                <Badge className={getStatusClass(projeto.status)}>
                  {getStatusDisplay(projeto.status)}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{projeto.description}</p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {new Date(projeto.start_date).toLocaleDateString('pt-BR')} a {new Date(projeto.end_date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Responsável: {projeto.responsible}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {projeto.completed_goals_count || 0}/
                    {projeto.total_goals_count || 0} metas concluídas
                  </span>
                </div>
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
        )) : (
          <div className="text-center p-12 border rounded-lg col-span-full">
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

      {!loading && projetos.length > 0 && totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {/* Mostrar no máximo 5 páginas */}
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNumber: number;
                
                if (totalPages <= 5) {
                  // Se temos 5 ou menos páginas, mostrar todas em sequência
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  // Se estamos nas primeiras páginas, mostrar 1,2,3,4,5
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  // Se estamos nas últimas páginas, mostrar as últimas 5
                  pageNumber = totalPages - 4 + i;
                } else {
                  // Se estamos no meio, mostrar 2 antes e 2 depois da atual
                  pageNumber = currentPage - 2 + i;
                }
                
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNumber)}
                      isActive={currentPage === pageNumber}
                      className="cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}

function CarregandoProjetos() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Skeleton className="h-10 w-48" />
          <Skeleton className="mt-2 h-5 w-72" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <Skeleton className="h-10 w-full md:w-64 flex-1" />
        <div className="flex gap-2 w-full md:w-auto">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-64 w-full" />
        ))}
      </div>
    </div>
  )
}
