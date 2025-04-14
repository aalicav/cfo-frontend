"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
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
  Users, 
  Calendar, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  AlertCircle,
  CheckCircle2,
  Filter,
  X
} from "lucide-react"
import { modalidadesService, Modalidade } from "@/services/modalidades.service"
import { useToast } from "@/hooks/use-toast"
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSearchParams } from 'next/navigation'
import { SearchX, FilterX, Book, Map } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Interface para parâmetros de listagem
interface ListarModalidadesParams {
  page?: number;
  per_page?: number;
  search?: string;
  category?: string;
  is_active?: boolean;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
}

// Estendendo a interface Modalidade para incluir contadores
interface ModalidadeExtendida extends Modalidade {
  athletes_count?: number;
  projects_count?: number;
  spaces_count?: number;
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

export default function ModalidadesPage() {
  const searchParams = useSearchParams()
  const [modalidades, setModalidades] = useState<ModalidadeExtendida[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [perPage, setPerPage] = useState(9)
  const [categoria, setCategoria] = useState<string>("")
  const [categorias, setCategorias] = useState<string[]>([])
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [viewType, setViewType] = useState<string>('grid')

  // Lista de categorias únicas das modalidades
  const categoriasUnicas = useMemo(() => {
    const categorias = modalidades
      .map(m => m.category)
      .filter((category): category is string => Boolean(category))
    
    return [...new Set(categorias)].sort()
  }, [modalidades])

  const carregarModalidades = useCallback(async (page: number = 1) => {
    setLoading(true)
    try {
      const params: ListarModalidadesParams = {
        page,
        per_page: perPage,
        search: debouncedSearchTerm || undefined,
        category: categoria && categoria !== 'all' ? categoria : undefined,
        sort_by: 'name',
        sort_dir: 'asc'
      }

      if (statusFilter) {
        params.is_active = statusFilter === 'active'
      }
      
      const response = await modalidadesService.listar(params)
      
      // Verificar se a resposta é um objeto paginado ou um array simples
      if (response && typeof response === 'object' && 'data' in response && 
          'current_page' in response && 'last_page' in response) {
        // É um objeto paginado
        setModalidades(response.data as ModalidadeExtendida[])
        setCurrentPage(Number(response.current_page))
        setTotalPages(Number(response.last_page))
      } else if (Array.isArray(response)) {
        // É um array simples
        setModalidades(response as ModalidadeExtendida[])
        setCurrentPage(1)
        setTotalPages(1)
      } else {
        // Formato desconhecido
        console.error("Formato de resposta inesperado:", response)
        setModalidades([])
        setCurrentPage(1)
        setTotalPages(1)
      }
    } catch (error) {
      console.error("Erro ao carregar modalidades:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as modalidades.",
        variant: "destructive",
      })
      setModalidades([])
    } finally {
      setLoading(false)
    }
  }, [perPage, categoria, debouncedSearchTerm, statusFilter, toast])

  // Carregar categorias disponíveis
  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const data = await modalidadesService.getCategorias()
        if (Array.isArray(data)) {
          setCategorias(data)
        }
      } catch (error) {
        console.error("Erro ao carregar categorias:", error)
      }
    }
    
    carregarCategorias()
  }, [])

  // Carregar modalidades
  useEffect(() => {
    carregarModalidades(currentPage)
  }, [carregarModalidades, currentPage])

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
    const category = searchParams.get('category')
    const status = searchParams.get('status')

    if (page) setCurrentPage(parseInt(page))
    if (search) setSearchTerm(search)
    if (category) setCategoria(category || 'all')
    if (status) setStatusFilter(status)
  }, [searchParams])

  // Limpar pesquisa e resetar para primeira página
  const handleClearSearch = () => {
    setSearchTerm("")
    setCategoria("all")
    setStatusFilter("")
    setCurrentPage(1)
  }

  // Alterar página
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const temFiltrosAtivos = debouncedSearchTerm || (categoria && categoria !== 'all') || statusFilter

  if (loading && modalidades.length === 0) {
    return <CarregandoModalidades />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modalidades Esportivas</h1>
          <p className="text-muted-foreground">
            Gerencie as modalidades esportivas oferecidas no Centro de Formação Olímpica.
          </p>
        </div>
        <Link href="/dashboard/modalidades/nova">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" /> Nova Modalidade
          </Button>
        </Link>
      </div>

      <div className="bg-muted/30 p-4 rounded-lg border">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar modalidades..."
              className="pl-8 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePageChange(1)}
          />
        </div>
        
        <div className="w-full md:w-64">
          <Select value={categoria} onValueChange={(value) => {
            setCategoria(value)
            setCurrentPage(1)
          }}>
              <SelectTrigger className="bg-background">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categorias.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
          <div className="w-full md:w-48">
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value)
              setCurrentPage(1)
            }}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="active">Ativas</SelectItem>
                <SelectItem value="inactive">Inativas</SelectItem>
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
        <CarregandoModalidades />
      ) : modalidades.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center h-[400px] bg-muted/30 rounded-lg border">
          <SearchX className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">Nenhuma modalidade encontrada</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            {temFiltrosAtivos 
              ? "Nenhuma modalidade corresponde aos filtros selecionados." 
              : "Não há modalidades cadastradas no sistema."}
          </p>
          {temFiltrosAtivos && (
            <Button variant="outline" onClick={handleClearSearch}>
              <FilterX className="h-4 w-4 mr-2" />
              Limpar filtros
            </Button>
          )}
        </div>
      ) : viewType === 'grid' ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modalidades.map((modalidade) => (
              <Card key={modalidade.id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  {modalidade.image_url ? (
                    <img 
                      src={modalidade.image_url} 
                    alt={modalidade.name}
                      className="object-cover w-full h-full transition-transform hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/40">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground/50"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    </div>
                  )}
                  {modalidade.category && (
                    <Badge className="absolute top-2 right-2 bg-primary/90 hover:bg-primary">
                      {modalidade.category}
                    </Badge>
                  )}
                </div>
                <CardContent className="pt-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{modalidade.name}</h3>
                    <Badge variant={modalidade.is_active ? "success" : "secondary"}>
                      {modalidade.is_active ? "Ativa" : "Inativa"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {modalidade.description || "Sem descrição disponível."}
                  </p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{modalidade.athletes_count || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{modalidade.spaces_count || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{(modalidade.schedule || []).length}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between">
                  <Link href={`/dashboard/modalidades/${modalidade.id}`}>
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
                        <Link href={`/dashboard/modalidades/${modalidade.id}/editar`} className="w-full">
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/dashboard/modalidades/${modalidade.id}/calendario`} className="w-full">
                          Calendário
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          // Aqui seria a lógica para desativar ou excluir
                          toast({
                            title: "Ação não implementada",
                            description: "Esta funcionalidade será implementada em breve.",
                          })
                        }}
                        className="text-red-600 focus:text-red-600"
                      >
                        {modalidade.is_active ? "Desativar" : "Ativar"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-background border rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 divide-y">
            {modalidades.map((modalidade) => (
              <div key={modalidade.id} className="p-4 hover:bg-muted/40 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-muted">
                    {modalidade.image_url ? (
                      <img 
                        src={modalidade.image_url} 
                        alt={modalidade.name} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center mb-1">
                      <h3 className="font-medium mr-2">{modalidade.name}</h3>
                      <Badge variant={modalidade.is_active ? "success" : "secondary"} className="text-xs">
                        {modalidade.is_active ? "Ativa" : "Inativa"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-1">
                      {modalidade.description || "Sem descrição disponível."}
                    </p>
                  </div>
                  <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{modalidade.athletes_count || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{modalidade.spaces_count || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/modalidades/${modalidade.id}`}>
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
                          <Link href={`/dashboard/modalidades/${modalidade.id}/editar`} className="w-full">
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href={`/dashboard/modalidades/${modalidade.id}/calendario`} className="w-full">
                            Calendário
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            // Aqui seria a lógica para desativar ou excluir
                            toast({
                              title: "Ação não implementada",
                              description: "Esta funcionalidade será implementada em breve.",
                            })
                          }}
                          className="text-red-600 focus:text-red-600"
                        >
                          {modalidade.is_active ? "Desativar" : "Ativar"}
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
            Mostrando {modalidades.length} de {perPage * totalPages} modalidades
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
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
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
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
      )}
    </div>
  )
}

function CarregandoModalidades() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-video relative">
              <Skeleton className="absolute inset-0" />
            </div>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-5 w-16" />
        </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
      </div>
            </CardContent>
            <CardFooter className="pt-0 flex justify-between">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
