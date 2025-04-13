"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, MoreHorizontal, Users, Calendar, Dumbbell, User, Loader2 } from "lucide-react"
import { timesService, Time } from "@/services/times.service"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"

interface TimesPageProps {}

const TimesPage = ({}: TimesPageProps) => {
  const [times, setTimes] = useState<Time[]>([])
  const [carregando, setCarregando] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [modalidadeFiltro, setModalidadeFiltro] = useState<string | undefined>(undefined)
  const [categoriaFiltro, setCategoriaFiltro] = useState<string | undefined>(undefined)
  const [modalidades, setModalidades] = useState<string[]>([])
  const [categorias, setCategorias] = useState<string[]>([])

  // Extrair modalidades e categorias únicas com useMemo
  const modalidadesUnicas = useMemo(() => {
    const uniqueModalities = [...new Set(times.map(time => time.modality).filter(Boolean))]
    return uniqueModalities as string[]
  }, [times])

  const categoriasUnicas = useMemo(() => {
    const uniqueCategories = [...new Set(times.map(time => time.category).filter(Boolean))]
    return uniqueCategories as string[]
  }, [times])

  // Carregar os times do serviço
  const carregarTimes = async () => {
    setCarregando(true)
    try {
      const params: Record<string, any> = {}
      
      if (searchTerm) {
        params.search = searchTerm
      }
      
      if (modalidadeFiltro) {
        params.modality = modalidadeFiltro
      }
      
      if (categoriaFiltro) {
        params.category = categoriaFiltro
      }
      
      const timesList = await timesService.listar(params)
      setTimes(Array.isArray(timesList) ? timesList : [])
    } catch (error) {
      console.error("Erro ao carregar times:", error)
      toast.error("Não foi possível carregar a lista de times")
      setTimes([])
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarTimes()
  }, [searchTerm, modalidadeFiltro, categoriaFiltro])

  useEffect(() => {
    setModalidades(modalidadesUnicas)
    setCategorias(categoriasUnicas)
  }, [modalidadesUnicas, categoriasUnicas])

  // Função para lidar com mudanças de busca com debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Times</h2>
          <p className="text-muted-foreground">
            Gerencie todos os times cadastrados no sistema
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Time
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="search">Buscar por nome</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Buscar times..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full sm:w-[180px] space-y-2">
            <Label>Modalidade</Label>
            <Select
              value={modalidadeFiltro}
              onValueChange={(value) => setModalidadeFiltro(value === "todas" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                {modalidades.map((modalidade) => (
                  <SelectItem key={modalidade} value={modalidade}>
                    {modalidade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-[180px] space-y-2">
            <Label>Categoria</Label>
            <Select
              value={categoriaFiltro}
              onValueChange={(value) => setCategoriaFiltro(value === "todas" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria} value={categoria}>
                    {categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {carregando ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Carregando times...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {times.map((time) => (
              <Card key={time.id} className="overflow-hidden h-full hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="p-4 border-b bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{time.name}</h3>
                        <p className="text-sm text-muted-foreground">{time.modality}</p>
                      </div>
                      <Badge>{time.category}</Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Técnico: {time.coach}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{time.athletes?.length || 0} atletas</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Dumbbell className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{time.modality}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{time.competitions || 0} competições</span>
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

          {times.length === 0 && (
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
        </>
      )}
    </div>
  )
}

export default TimesPage
