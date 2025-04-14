"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Filter, 
  X, 
  Users, 
  Trophy,
  Calendar,
  MapPin,
  Clock,
  UserPlus
} from "lucide-react"
import { timesService } from "@/services/times.service"
import { useToast } from "@/hooks/use-toast"
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationEllipsis
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSearchParams } from 'next/navigation'
import { SearchX, FilterX } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Time, TimeStatus } from "@/types/time"

// Interface para parâmetros de listagem
interface ListarTimesParams {
  page?: number;
  per_page?: number;
  search?: string;
  modality?: string;
  status?: TimeStatus;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
}

// Interface para representar respostas paginadas da API
interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  from: number;
  to: number;
  per_page: number;
  total: number;
}

export default function TimesPage() {
  const searchParams = useSearchParams()
  const [times, setTimes] = useState<Time[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [perPage, setPerPage] = useState(6)
  const [modalidade, setModalidade] = useState<string>("")
  const [modalidades, setModalidades] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<TimeStatus | "">("")
  const [viewType, setViewType] = useState<string>('grid')
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  const carregarTimes = useCallback(async (page: number = 1) => {
    setLoading(true)
    try {
      const params: ListarTimesParams = {
        page,
        per_page: perPage,
        search: debouncedSearchTerm || undefined,
        modality: modalidade || undefined,
        status: statusFilter || undefined,
        sort_by: 'name',
        sort_dir: 'asc'
      }
      
      const response = await timesService.listar(params)
      
      // Verificar se a resposta é um objeto paginado ou um array simples
      if (response && typeof response === 'object' && 'data' in response && 
          'current_page' in response && 'last_page' in response) {
        // É um objeto paginado
        setTimes(response.data as Time[])
        setCurrentPage(Number(response.current_page))
        setTotalPages(Number(response.last_page))
      } else if (Array.isArray(response)) {
        // É um array simples
        setTimes(response as Time[])
        setCurrentPage(1)
        setTotalPages(1)
      } else {
        // Formato desconhecido
        console.error("Formato de resposta inesperado:", response)
        setTimes([])
        setCurrentPage(1)
        setTotalPages(1)
      }
    } catch (error) {
      console.error("Erro ao carregar times:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os times.",
        variant: "destructive",
      })
      setTimes([])
    } finally {
      setLoading(false)
    }
  }, [perPage, modalidade, debouncedSearchTerm, statusFilter, toast])

  // Carregar modalidades disponíveis
  useEffect(() => {
    const carregarModalidades = async () => {
      try {
        // Normalmente você buscaria do backend
        // Por enquanto, vamos simular algumas modalidades
        setModalidades([
          "Natação", 
          "Atletismo", 
          "Ginástica", 
          "Futebol", 
          "Vôlei", 
          "Basquete", 
          "Judô"
        ])
      } catch (error) {
        console.error("Erro ao carregar modalidades:", error)
      }
    }
    
    carregarModalidades()
  }, [])

  // Carregar times
  useEffect(() => {
    carregarTimes(currentPage)
  }, [carregarTimes, currentPage])

  // Efeito para debounce da pesquisa
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Verificar parâmetros da URL para navegação direta
  useEffect(() => {
    const page = searchParams.get('page')
    const search = searchParams.get('search')
    const modality = searchParams.get('modality')
    const status = searchParams.get('status')

    if (page) setCurrentPage(parseInt(page))
    if (search) setSearchTerm(search)
    if (modality) setModalidade(modality)
    if (status) setStatusFilter(status as TimeStatus | "")
  }, [searchParams])

  // Limpar pesquisa e resetar para primeira página
  const handleClearSearch = () => {
    setSearchTerm("")
    setModalidade("")
    setStatusFilter("")
    setCurrentPage(1)
  }

  // Alterar página
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const temFiltrosAtivos = debouncedSearchTerm || modalidade || statusFilter
  
  const formatarData = (dataString?: string) => {
    if (!dataString) return "N/A"
    try {
      return format(parseISO(dataString), "dd/MM/yyyy", { locale: ptBR })
    } catch (error) {
      return "Data inválida"
    }
  }

  const statusColor = (status?: TimeStatus | null) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
      case 'inactive':
        return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
      case 'training':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
      case 'competing':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  if (loading && times.length === 0) {
    return <CarregandoTimes />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Times</h1>
          <p className="text-muted-foreground">
            Gerencie os times do Centro de Formação Olímpica.
          </p>
        </div>
        <Link href="/dashboard/times/novo">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" /> Novo Time
          </Button>
        </Link>
      </div>

      <div className="bg-muted/30 p-4 rounded-lg border mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
              type="search"
                placeholder="Buscar times..."
              className="pl-8 bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePageChange(1)}
              />
          </div>
          
          <div className="w-full md:w-64">
            <Select value={modalidade} onValueChange={(value) => {
              setModalidade(value)
              setCurrentPage(1)
            }}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Modalidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as modalidades</SelectItem>
                {modalidades.map((mod) => (
                  <SelectItem key={mod} value={mod}>{mod}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-48">
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value as TimeStatus | "")
              setCurrentPage(1)
            }}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
                <SelectItem value="training">Em treinamento</SelectItem>
                <SelectItem value="competing">Em competição</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 ml-auto">
            <Button 
              variant="outline" 
              onClick={() => handlePageChange(1)}
              className="bg-background"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
            
            {temFiltrosAtivos && (
              <Button variant="outline" onClick={handleClearSearch} className="bg-background">
                <X className="h-4 w-4 mr-2" />
                Limpar
              </Button>
            )}
            
            <div className="hidden md:flex border rounded-md overflow-hidden">
              <Button 
                variant={viewType === 'grid' ? 'default' : 'ghost'} 
                className="rounded-none px-3 h-9"
                onClick={() => setViewType('grid')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-grid-2x2"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 12h18"/><path d="M12 3v18"/></svg>
              </Button>
              <Button 
                variant={viewType === 'list' ? 'default' : 'ghost'} 
                className="rounded-none px-3 h-9"
                onClick={() => setViewType('list')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list"><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3" y1="6" y2="6" /><line x1="3" x2="3" y1="12" y2="12" /><line x1="3" x2="3" y1="18" y2="18" /></svg>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <CarregandoTimes />
      ) : times.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center h-[400px] bg-muted/30 rounded-lg border">
          <SearchX className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">Nenhum time encontrado</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            {temFiltrosAtivos 
              ? "Nenhum time corresponde aos filtros selecionados." 
              : "Não há times cadastrados no sistema."}
          </p>
          {temFiltrosAtivos && (
            <Button variant="outline" onClick={handleClearSearch}>
              <FilterX className="h-4 w-4 mr-2" />
              Limpar filtros
            </Button>
          )}
        </div>
      ) : viewType === 'grid' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {times.map((time) => (
            <Card key={time.id} className="overflow-hidden transition-all hover:shadow-md">
              <div className="h-32 relative overflow-hidden bg-muted">
                {time.cover_image ? (
                  <img 
                    src={time.cover_image} 
                    alt={time.name} 
                    className="object-cover w-full h-full transition-transform hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/40">
                    <Trophy className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                )}
                {time.modality && (
                  <Badge className="absolute top-2 right-2 bg-primary/90 hover:bg-primary">
                    {time.modality}
                  </Badge>
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{time.name}</CardTitle>
                  <Badge variant="outline" className={statusColor(time.status)}>
                    {time.status === 'active' ? 'Ativo' : 
                     time.status === 'inactive' ? 'Inativo' : 
                     time.status === 'training' ? 'Treinando' :
                     time.status === 'competing' ? 'Competindo' : 'Desconhecido'}
                  </Badge>
                </div>
                <CardDescription>{time.category || 'Categoria não definida'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {time.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {time.description}
                    </p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Formado em</span>
                      <span>{formatarData(time.founded_at)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Treinador</span>
                      <span>{time.coach_name || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{time.athletes_count || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-1" />
                      <span>{time.achievements_count || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{time.competitions_count || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/25 flex justify-between pt-3">
                <Link href={`/dashboard/times/${time.id}`}>
                  <Button variant="outline" size="sm">Ver Detalhes</Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link href={`/dashboard/times/${time.id}/editar`} className="w-full">
                        Editar
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/dashboard/times/${time.id}/atletas`} className="w-full">
                        Gerenciar Atletas
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/dashboard/times/${time.id}/agenda`} className="w-full">
                        Agenda
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        toast({
                          title: "Ação não implementada",
                          description: "Esta funcionalidade será implementada em breve.",
                        })
                      }}
                      className="text-red-600 focus:text-red-600"
                    >
                      {time.status === 'active' ? 'Desativar' : 'Ativar'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-background border rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 divide-y">
            {times.map((time) => (
              <div key={time.id} className="p-4 hover:bg-muted/40 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-muted">
                    {time.logo_url ? (
                      <img 
                        src={time.logo_url} 
                        alt={time.name} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <Trophy className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center mb-1">
                      <h3 className="font-medium mr-2">{time.name}</h3>
                      <Badge variant="outline" className={`text-xs ${statusColor(time.status)}`}>
                        {time.status === 'active' ? 'Ativo' : 
                         time.status === 'inactive' ? 'Inativo' : 
                         time.status === 'training' ? 'Treinando' :
                         time.status === 'competing' ? 'Competindo' : 'Desconhecido'}
                      </Badge>
                      </div>
                    <div className="flex flex-wrap gap-x-6 text-sm text-muted-foreground">
                      <span>{time.category || 'Sem categoria'}</span>
                      {time.coach_name && <span>Treinador: {time.coach_name}</span>}
                      <span>Formado em: {formatarData(time.founded_at)}</span>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{time.athletes_count || 0}</span>
                      </div>
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-1" />
                      <span>{time.achievements_count || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                      <Link href={`/dashboard/times/${time.id}`}>
                      <Button variant="outline" size="sm">Ver</Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link href={`/dashboard/times/${time.id}/editar`} className="w-full">
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href={`/dashboard/times/${time.id}/atletas`} className="w-full">
                            Gerenciar Atletas
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href={`/dashboard/times/${time.id}/agenda`} className="w-full">
                            Agenda
                            </Link>
                          </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            toast({
                              title: "Ação não implementada",
                              description: "Esta funcionalidade será implementada em breve.",
                            })
                          }}
                          className="text-red-600 focus:text-red-600"
                        >
                          {time.status === 'active' ? 'Desativar' : 'Ativar'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-muted-foreground">
            Mostrando {times.length} de {perPage * totalPages} times
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-left"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
                </Button>
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                // Mostrar números de página próximos ao atual e primeira/última página
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <Button
                        variant={pageNumber === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    </PaginationItem>
                  );
                }
                
                // Mostrar reticências se houver lacunas
                if (
                  (pageNumber === 2 && currentPage > 3) ||
                  (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                ) {
                  return <PaginationEllipsis key={pageNumber} />;
                }
                
                return null;
              })}
              
              <PaginationItem>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-right"><path d="m13 17 5-5-5-5"/><path d="m6 17 5-5-5-5"/></svg>
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
            </div>
      )}
    </div>
  )
}

function CarregandoTimes() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-32 relative">
              <Skeleton className="absolute inset-0" />
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-24 mt-1" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <Skeleton className="h-3 w-20 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div>
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-3">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/25 flex justify-between pt-3">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
