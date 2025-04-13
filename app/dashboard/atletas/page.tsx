"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Table as ReactTable,
  HeaderGroup,
  Row,
  Cell,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Plus, Search, UserPlus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { atletasService } from "@/services/api"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Atleta } from "@/types"
import { ListarAtletasParams } from "@/services/atletas.service"

export default function AtletasPage() {
  const [data, setData] = useState<Atleta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [modalidadeFiltro, setModalidadeFiltro] = useState<string>("todas")
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("todas")
  const [statusFiltro, setStatusFiltro] = useState<string>("todos")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsPerPage] = useState(10)
  
  useEffect(() => {
    fetchAtletas()
  }, [currentPage, modalidadeFiltro, categoriaFiltro, statusFiltro, searchTerm])
  
  const fetchAtletas = async () => {
    setLoading(true)
    try {
      const params: ListarAtletasParams = {
        page: currentPage,
        per_page: itemsPerPage,
        search: searchTerm || undefined,
        modality: modalidadeFiltro !== "todas" ? modalidadeFiltro : undefined,
        category: categoriaFiltro !== "todas" ? categoriaFiltro : undefined,
        status: statusFiltro !== "todos" ? 
          (statusFiltro as 'active' | 'inactive' | 'suspended' | 'pending' | 'ativo' | 'inativo' | 'suspenso') : 
          undefined,
      }
      
      const atletas = await atletasService.listar(params)
      
      if (Array.isArray(atletas)) {
        setData(atletas as unknown as Atleta[])
        setTotalPages(Math.ceil(atletas.length / itemsPerPage))
      } else {
        setData([])
        setTotalPages(1)
      }
    } catch (error) {
      console.error("Erro ao carregar atletas:", error)
      setError("Ocorreu um erro ao carregar os atletas. Tente novamente mais tarde.")
      setData([])
    } finally {
      setLoading(false)
    }
  }
  
  const formatarData = (data: string) => {
    try {
      return format(new Date(data), "dd/MM/yyyy", { locale: ptBR })
    } catch (e) {
      return "Data inválida"
    }
  }
  
  const calcularIdade = (dataNascimento: string) => {
    try {
      const hoje = new Date()
      const nascimento = new Date(dataNascimento)
      let idade = hoje.getFullYear() - nascimento.getFullYear()
      const m = hoje.getMonth() - nascimento.getMonth()
      
      if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--
      }
      
      return idade + " anos"
    } catch (e) {
      return "N/A"
    }
  }

  const columns: ColumnDef<Atleta>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }: { row: any }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "nome",
      header: "Nome",
      cell: ({ row }: { row: any }) => {
        const atleta = row.original as Atleta
        return (
          <div className="flex items-center gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={atleta.photo_url || ""} alt={atleta.user?.name || ""} />
              <AvatarFallback>{atleta.user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <Link href={`/dashboard/atletas/${atleta.id}`} className="font-medium hover:underline">
              {atleta.user?.name}
            </Link>
          </div>
        )
      },
    },
    {
      accessorKey: "idade",
      header: "Idade",
      cell: ({ row }: { row: any }) => {
        const atleta = row.original as Atleta
        return <div>{atleta.birth_date ? calcularIdade(atleta.birth_date) : "N/A"}</div>
      },
    },
    {
      accessorKey: "data_nascimento",
      header: "Data de Nascimento",
      cell: ({ row }: { row: any }) => {
        const atleta = row.original as Atleta
        return <div>{atleta.birth_date ? formatarData(atleta.birth_date) : "N/A"}</div>
      },
    },
    {
      accessorKey: "modalidades",
      header: "Modalidades",
      cell: ({ row }: { row: any }) => {
        const atleta = row.original as Atleta
        return (
          <div className="flex flex-wrap gap-1">
            {atleta.modalities && atleta.modalities.length > 0 ? (
              atleta.modalities.map((modalidade: string, i: number) => (
                <Badge key={i} variant="outline" className="mr-1">
                  {modalidade}
                </Badge>
              ))
            ) : (
              <span className="text-gray-500">-</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "categoria",
      header: "Categoria",
      cell: ({ row }: { row: any }) => {
        const atleta = row.original as Atleta
        return <div>{atleta.group || "-"}</div>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const status = (row.original as Atleta).status
        return (
          <Badge
            className={
              status === "active" ? "bg-green-100 text-green-800" : 
              status === "inactive" ? "bg-red-100 text-red-800" : 
              "bg-yellow-100 text-yellow-800"
            }
          >
            {status === "active" ? "Ativo" : 
             status === "inactive" ? "Inativo" : 
             status === "pending" ? "Pendente" : 
             status === "suspended" ? "Suspenso" : status}
          </Badge>
        )
      },
    },
    {
      id: "acoes",
      header: "Ações",
      cell: ({ row }: { row: any }) => {
        const atleta = row.original as Atleta
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/atletas/${atleta.id}`}>Visualizar</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/atletas/${atleta.id}/editar`}>Editar</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/desempenho/nova-avaliacao?atleta=${atleta.id}`}>Nova Avaliação</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  const modalidades = [
    "Futebol",
    "Basquete",
    "Vôlei",
    "Natação",
    "Atletismo",
    "Tênis",
    "Judô",
    "Ginástica"
  ]

  const categorias = [
    "Sub-15",
    "Sub-17", 
    "Sub-20",
    "Adulto"
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Atletas</h1>
        <Link href="/dashboard/atletas/novo">
          <Button className="bg-green-700 hover:bg-green-600">
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Atleta
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Atletas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar atletas..."
                  className="pl-8 flex-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select
                value={modalidadeFiltro}
                onValueChange={setModalidadeFiltro}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Modalidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas Modalidades</SelectItem>
                  {modalidades.map((modalidade) => (
                    <SelectItem key={modalidade} value={modalidade.toLowerCase()}>
                      {modalidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={categoriaFiltro}
                onValueChange={setCategoriaFiltro}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas Categorias</SelectItem>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria} value={categoria.toLowerCase()}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={statusFiltro}
                onValueChange={setStatusFiltro}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Status</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="suspended">Suspenso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-lg">Carregando atletas...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-lg text-red-500">{error}</p>
              </div>
            ) : data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <UserPlus className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">Nenhum atleta encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  Não existem atletas cadastrados ou que correspondam aos filtros aplicados.
                </p>
                <Link href="/dashboard/atletas/novo">
                  <Button className="bg-green-700 hover:bg-green-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Atleta
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup: HeaderGroup<Atleta>) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header: any) => (
                            <TableHead key={header.id}>
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </TableHead>
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={columns.length} className="h-24 text-center">
                            Carregando...
                          </TableCell>
                        </TableRow>
                      ) : table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row: Row<Atleta>) => (
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                          >
                            {row.getVisibleCells().map((cell: Cell<Atleta, unknown>) => (
                              <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={columns.length} className="h-24 text-center">
                            Nenhum resultado encontrado.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber = i + 1
                      return (
                        <PaginationItem key={i}>
                          <PaginationLink
                            isActive={currentPage === pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    })}
                    
                    {totalPages > 5 && (
                      <>
                        <PaginationItem>
                          <PaginationLink>...</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink
                            isActive={currentPage === totalPages}
                            onClick={() => setCurrentPage(totalPages)}
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
