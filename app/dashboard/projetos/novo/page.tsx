"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, X, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { projetosService, ProjetoPayload } from "@/services/projetos.service"
import { Skeleton } from "@/components/ui/skeleton"
import { modalidadesService } from "@/services/modalidades.service"
import { espacosService } from "@/services/espacos.service"

interface Modalidade {
  id: number | string
  name: string
}

interface Espaco {
  id: number | string
  name: string
  type: string
  capacity?: number
  image_url?: string
}

export default function NovoProjetoPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("informacoes")
  const [dataInicio, setDataInicio] = useState<Date>()
  const [dataFim, setDataFim] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingModalidades, setLoadingModalidades] = useState(true)
  const [loadingEspacos, setLoadingEspacos] = useState(true)
  const [modalidades, setModalidades] = useState<Modalidade[]>([])
  const [espacos, setEspacos] = useState<Espaco[]>([])
  const [tipos, setTipos] = useState<string[]>([])

  const [formData, setFormData] = useState<Omit<ProjetoPayload, 'start_date' | 'end_date'>>({
    name: "",
    modality: "",
    type: "",
    status: "planned",
    responsible: "",
    description: "",
    target_audience: "",
    expected_participants: undefined,
    spaces: [],
    goals: [{ description: "", target_date: "", indicators: [""] }],
  })

  // Carregar tipos de projeto
  useEffect(() => {
    const carregarTipos = async () => {
      try {
        const response = await projetosService.getTipos()
        if (Array.isArray(response)) {
          setTipos(response)
        }
      } catch (error) {
        console.error("Erro ao carregar tipos de projeto:", error)
      }
    }
    
    carregarTipos()
  }, [])

  // Carregar modalidades
  useEffect(() => {
    const carregarModalidades = async () => {
      setLoadingModalidades(true)
      try {
        const response = await modalidadesService.listar()
        if (Array.isArray(response)) {
          setModalidades(response)
        } else if (response && 'data' in response) {
          setModalidades(response.data)
        }
      } catch (error) {
        console.error("Erro ao carregar modalidades:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar as modalidades.",
          variant: "destructive",
        })
      } finally {
        setLoadingModalidades(false)
      }
    }
    
    carregarModalidades()
  }, [toast])

  // Carregar espaços
  useEffect(() => {
    const carregarEspacos = async () => {
      setLoadingEspacos(true)
      try {
        const response = await espacosService.listar()
        if (Array.isArray(response)) {
          setEspacos(response)
        } else if (response && 'data' in response) {
          setEspacos(response.data)
        }
      } catch (error) {
        console.error("Erro ao carregar espaços:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os espaços.",
          variant: "destructive",
        })
      } finally {
        setLoadingEspacos(false)
      }
    }
    
    carregarEspacos()
  }, [toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Converter para número quando necessário
    if (name === 'expected_participants') {
      const numValue = value === '' ? undefined : Number(value)
      setFormData((prev) => ({ ...prev, [name]: numValue }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEspacoToggle = (espacoId: string) => {
    setFormData((prev) => {
      const espacos = [...(prev.spaces || [])]
      if (espacos.includes(espacoId)) {
        return { ...prev, spaces: espacos.filter((id) => id !== espacoId) }
      } else {
        return { ...prev, spaces: [...espacos, espacoId] }
      }
    })
  }

  const handleMetaChange = (index: number, field: string, value: string) => {
    const newMetas = [...formData.goals!]
    newMetas[index] = { ...newMetas[index], [field]: value }
    setFormData((prev) => ({ ...prev, goals: newMetas }))
  }

  const handleIndicadorChange = (metaIndex: number, indicadorIndex: number, value: string) => {
    const newMetas = [...formData.goals!]
    const newIndicadores = [...(newMetas[metaIndex].indicators || [""])]
    newIndicadores[indicadorIndex] = value
    newMetas[metaIndex].indicators = newIndicadores
    setFormData((prev) => ({ ...prev, goals: newMetas }))
  }

  const addMeta = () => {
    setFormData((prev) => ({
      ...prev,
      goals: [...(prev.goals || []), { description: "", target_date: "", indicators: [""] }],
    }))
  }

  const removeMeta = (index: number) => {
    const newMetas = [...formData.goals!]
    newMetas.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      goals: newMetas.length ? newMetas : [{ description: "", target_date: "", indicators: [""] }],
    }))
  }

  const addIndicador = (metaIndex: number) => {
    const newMetas = [...formData.goals!]
    newMetas[metaIndex].indicators = [...(newMetas[metaIndex].indicators || []), ""]
    setFormData((prev) => ({ ...prev, goals: newMetas }))
  }

  const removeIndicador = (metaIndex: number, indicadorIndex: number) => {
    const newMetas = [...formData.goals!]
    const newIndicadores = [...(newMetas[metaIndex].indicators || [""])]
    newIndicadores.splice(indicadorIndex, 1)
    newMetas[metaIndex].indicators = newIndicadores.length ? newIndicadores : [""]
    setFormData((prev) => ({ ...prev, goals: newMetas }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validação básica
    if (!formData.name || !formData.modality || !formData.responsible || !dataInicio || !dataFim) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Formatar datas para ISO string
      const projetoData: ProjetoPayload = {
        ...formData,
        start_date: dataInicio.toISOString().split('T')[0],
        end_date: dataFim.toISOString().split('T')[0],
      }

      // Formatar datas das metas
      if (projetoData.goals) {
        projetoData.goals = projetoData.goals.map(meta => ({
          ...meta,
          target_date: meta.target_date 
            ? new Date(meta.target_date).toISOString().split('T')[0] 
            : undefined
        }))
      }

      // Enviar para API
      const result = await projetosService.criar(projetoData)

      toast({
        title: "Projeto criado com sucesso",
        description: result.mensagem || "O novo projeto foi adicionado ao sistema.",
      })

      router.push("/dashboard/projetos")
    } catch (error: any) {
      console.error("Erro ao criar projeto:", error)
      toast({
        title: "Erro ao criar projeto",
        description: error.response?.data?.message || "Ocorreu um erro ao salvar o projeto.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextTab = () => {
    if (activeTab === "informacoes") setActiveTab("espacos")
    else if (activeTab === "espacos") setActiveTab("metas")
  }

  const prevTab = () => {
    if (activeTab === "metas") setActiveTab("espacos")
    else if (activeTab === "espacos") setActiveTab("informacoes")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/projetos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Novo Projeto</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="informacoes">Informações Básicas</TabsTrigger>
            <TabsTrigger value="espacos">Espaços e Recursos</TabsTrigger>
            <TabsTrigger value="metas">Metas e Indicadores</TabsTrigger>
          </TabsList>

          <TabsContent value="informacoes">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Projeto</CardTitle>
                <CardDescription>Preencha os dados básicos do projeto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Projeto *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ex: Natação para Jovens"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modality">Modalidade *</Label>
                    {loadingModalidades ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Select
                        value={formData.modality}
                        onValueChange={(value) => handleSelectChange("modality", value)}
                      >
                        <SelectTrigger id="modality">
                          <SelectValue placeholder="Selecione a modalidade" />
                        </SelectTrigger>
                        <SelectContent>
                          {modalidades.map((modalidade) => (
                            <SelectItem key={modalidade.id} value={modalidade.name}>
                              {modalidade.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Projeto</Label>
                    <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tipos.length > 0 ? (
                          tipos.map((tipo) => (
                            <SelectItem key={tipo} value={tipo}>
                              {tipo}
                            </SelectItem>
                          ))
                        ) : (
                          <>
                            <SelectItem value="Sports">Esportivo</SelectItem>
                            <SelectItem value="Social">Social</SelectItem>
                            <SelectItem value="Educational">Educacional</SelectItem>
                            <SelectItem value="Cultural">Cultural</SelectItem>
                            <SelectItem value="Mixed">Misto</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value as 'planned' | 'in_progress' | 'completed')}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planned">Planejado</SelectItem>
                        <SelectItem value="in_progress">Em andamento</SelectItem>
                        <SelectItem value="completed">Encerrado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataInicio">Data de Início *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {dataInicio ? format(dataInicio, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent mode="single" selected={dataInicio} onSelect={setDataInicio} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataFim">Data de Término *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {dataFim ? format(dataFim, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={dataFim}
                          onSelect={setDataFim}
                          initialFocus
                          disabled={(date) => (dataInicio ? date < dataInicio : false)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="responsible">Responsável *</Label>
                    <Input
                      id="responsible"
                      name="responsible"
                      value={formData.responsible}
                      onChange={handleChange}
                      placeholder="Ex: Carlos Mendes"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="target_audience">Público-Alvo</Label>
                    <Input
                      id="target_audience"
                      name="target_audience"
                      value={formData.target_audience}
                      onChange={handleChange}
                      placeholder="Ex: Crianças e adolescentes de 10 a 17 anos"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expected_participants">Quantidade Prevista</Label>
                    <Input
                      id="expected_participants"
                      name="expected_participants"
                      type="number"
                      value={formData.expected_participants || ''}
                      onChange={handleChange}
                      placeholder="Ex: 50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição do Projeto</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descreva o projeto, seus objetivos e características..."
                    className="min-h-[120px]"
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="button" className="bg-green-700 hover:bg-green-600" onClick={nextTab}>
                    Próximo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="espacos">
            <Card>
              <CardHeader>
                <CardTitle>Espaços e Recursos</CardTitle>
                <CardDescription>Selecione os espaços que serão utilizados no projeto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingEspacos ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <Skeleton key={index} className="h-32 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {espacos.map((espaco) => (
                      <div
                        key={espaco.id}
                        className={`border rounded-md p-4 cursor-pointer transition-colors ${
                          formData.spaces?.includes(espaco.id) ? "border-green-500 bg-green-50" : "hover:border-gray-400"
                        }`}
                        onClick={() => handleEspacoToggle(espaco.id.toString())}
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-12 w-12 rounded-md bg-gray-100 flex-shrink-0 overflow-hidden">
                            <img
                              src={espaco.image_url || "/placeholder.svg"}
                              alt={espaco.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{espaco.name}</h3>
                            <p className="text-sm text-muted-foreground">{espaco.type}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Capacidade: {espaco.capacity || '?'} pessoas
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <Button type="button" variant="outline" onClick={prevTab}>
                    Voltar
                  </Button>
                  <Button type="button" className="bg-green-700 hover:bg-green-600" onClick={nextTab}>
                    Próximo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metas">
            <Card>
              <CardHeader>
                <CardTitle>Metas e Indicadores</CardTitle>
                <CardDescription>Defina as metas e indicadores de acompanhamento do projeto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.goals?.map((meta, metaIndex) => (
                  <div key={metaIndex} className="border rounded-md p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">Meta {metaIndex + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMeta(metaIndex)}
                        disabled={formData.goals?.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`meta-${metaIndex}-description`}>Descrição da Meta</Label>
                        <Input
                          id={`meta-${metaIndex}-description`}
                          value={meta.description}
                          onChange={(e) => handleMetaChange(metaIndex, "description", e.target.value)}
                          placeholder="Ex: Inscrever 50 participantes"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`meta-${metaIndex}-target_date`}>Data Prevista</Label>
                        <Input
                          id={`meta-${metaIndex}-target_date`}
                          type="date"
                          value={meta.target_date || ''}
                          onChange={(e) => handleMetaChange(metaIndex, "target_date", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Indicadores</Label>
                      {meta.indicators?.map((indicador, indicadorIndex) => (
                        <div key={indicadorIndex} className="flex gap-2 items-center">
                          <Input
                            value={indicador}
                            onChange={(e) => handleIndicadorChange(metaIndex, indicadorIndex, e.target.value)}
                            placeholder="Ex: Número de inscritos, Taxa de frequência, etc."
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeIndicador(metaIndex, indicadorIndex)}
                            disabled={(meta.indicators?.length || 0) <= 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => addIndicador(metaIndex)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Indicador
                      </Button>
                    </div>
                  </div>
                ))}

                <Button type="button" variant="outline" className="w-full" onClick={addMeta}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Nova Meta
                </Button>

                <div className="flex justify-between mt-6">
                  <Button type="button" variant="outline" onClick={prevTab}>
                    Voltar
                  </Button>
                  <Button type="submit" className="bg-green-700 hover:bg-green-600" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar Projeto"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}
