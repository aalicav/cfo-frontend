"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Users, Calendar, MapPin, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modalidades Esportivas</h1>
          <p className="text-muted-foreground">
            Gerencie as modalidades esportivas oferecidas no Centro de Formação Olímpica.
          </p>
        </div>
        <Link href="/dashboard/modalidades/nova">
          <Button className="bg-green-700 hover:bg-green-600">
            <Plus className="mr-2 h-4 w-4" /> Nova Modalidade
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar modalidades..."
            className="pl-8"
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
            <SelectTrigger>
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
        
        <Button 
          variant="outline" 
          onClick={() => handlePageChange(1)}
        >
          Pesquisar
        </Button>
        
        {(searchTerm || categoria) && (
          <Button variant="ghost" onClick={handleClearSearch}>
            Limpar filtros
          </Button>
        )}
      </div>

      {loading ? (
        <div className="text-center p-12">
          <p className="text-lg">Carregando modalidades...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modalidades.length > 0 ? modalidades.map((modalidade) => (
              <Card key={modalidade.id} className="overflow-hidden h-full hover:shadow-md transition-shadow">
                <div className="aspect-video w-full relative bg-gray-100">
                  <img
                    src={modalidade.image_url || "/placeholder.svg?height=400&width=600"}
                    alt={modalidade.name}
                    className="object-cover w-full h-full"
                  />
                  <Badge className="absolute top-2 right-2 bg-green-700">{modalidade.category}</Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{modalidade.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{modalidade.description}</p>
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
                          <Link href={`/dashboard/modalidades/${modalidade.id}`} className="w-full">
                            Ver detalhes
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href={`/dashboard/modalidades/${modalidade.id}/editar`} className="w-full">
                            Editar
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{modalidade.athletes_count ?? 0} atletas cadastrados</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{modalidade.projects_count ?? 0} projetos ativos</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{modalidade.spaces_count ?? 0} espaços associados</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Link href={`/dashboard/modalidades/${modalidade.id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      Ver Detalhes
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )) : (
              <div className="text-center p-12 border rounded-lg col-span-full">
                <h3 className="text-lg font-medium">Nenhuma modalidade encontrada</h3>
                <p className="text-muted-foreground mt-2">
                  Não foram encontradas modalidades com os critérios de busca informados.
                </p>
                <Link href="/dashboard/modalidades/nova">
                  <Button className="mt-4 bg-green-700 hover:bg-green-600">
                    <Plus className="mr-2 h-4 w-4" /> Cadastrar Nova Modalidade
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {!loading && modalidades.length > 0 && totalPages > 1 && (
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
                    
                    // Lógica para determinar quais números de página mostrar
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
        </>
      )}
    </div>
  )
}

function CarregandoModalidades() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-10 w-48" />
          <Skeleton className="mt-2 h-5 w-72" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="mt-6 space-y-6">
        <Skeleton className="h-40 w-full" />
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
