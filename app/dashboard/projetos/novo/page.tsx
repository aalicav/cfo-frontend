"use client"

import type React from "react"

import { useState } from "react"
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
import { modalidadesMock } from "@/lib/modalidades-mock"
import { espacosMock } from "@/lib/espacos-mock"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function NovoProjetoPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("informacoes")
  const [dataInicio, setDataInicio] = useState<Date>()
  const [dataFim, setDataFim] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    nome: "",
    modalidade: "",
    tipo: "",
    status: "planejado",
    responsavel: "",
    descricao: "",
    publicoAlvo: "",
    quantidadePrevista: "",
    espacos: [] as string[],
    metas: [{ descricao: "", data: "", indicadores: [""] }],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEspacoToggle = (espacoId: string) => {
    setFormData((prev) => {
      const espacos = [...prev.espacos]
      if (espacos.includes(espacoId)) {
        return { ...prev, espacos: espacos.filter((id) => id !== espacoId) }
      } else {
        return { ...prev, espacos: [...espacos, espacoId] }
      }
    })
  }

  const handleMetaChange = (index: number, field: string, value: string) => {
    const newMetas = [...formData.metas]
    newMetas[index] = { ...newMetas[index], [field]: value }
    setFormData((prev) => ({ ...prev, metas: newMetas }))
  }

  const handleIndicadorChange = (metaIndex: number, indicadorIndex: number, value: string) => {
    const newMetas = [...formData.metas]
    const newIndicadores = [...newMetas[metaIndex].indicadores]
    newIndicadores[indicadorIndex] = value
    newMetas[metaIndex].indicadores = newIndicadores
    setFormData((prev) => ({ ...prev, metas: newMetas }))
  }

  const addMeta = () => {
    setFormData((prev) => ({
      ...prev,
      metas: [...prev.metas, { descricao: "", data: "", indicadores: [""] }],
    }))
  }

  const removeMeta = (index: number) => {
    const newMetas = [...formData.metas]
    newMetas.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      metas: newMetas.length ? newMetas : [{ descricao: "", data: "", indicadores: [""] }],
    }))
  }

  const addIndicador = (metaIndex: number) => {
    const newMetas = [...formData.metas]
    newMetas[metaIndex].indicadores.push("")
    setFormData((prev) => ({ ...prev, metas: newMetas }))
  }

  const removeIndicador = (metaIndex: number, indicadorIndex: number) => {
    const newMetas = [...formData.metas]
    const newIndicadores = [...newMetas[metaIndex].indicadores]
    newIndicadores.splice(indicadorIndex, 1)
    newMetas[metaIndex].indicadores = newIndicadores.length ? newIndicadores : [""]
    setFormData((prev) => ({ ...prev, metas: newMetas }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validação básica
    if (!formData.nome || !formData.modalidade || !formData.responsavel || !dataInicio || !dataFim) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Simulando envio para API
    setTimeout(() => {
      toast({
        title: "Projeto criado com sucesso",
        description: "O novo projeto foi adicionado ao sistema.",
      })
      router.push("/dashboard/projetos")
    }, 1500)
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
                    <Label htmlFor="nome">Nome do Projeto *</Label>
                    <Input
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Ex: Natação para Jovens"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modalidade">Modalidade *</Label>
                    <Select
                      value={formData.modalidade}
                      onValueChange={(value) => handleSelectChange("modalidade", value)}
                    >
                      <SelectTrigger id="modalidade">
                        <SelectValue placeholder="Selecione a modalidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {modalidadesMock.map((modalidade) => (
                          <SelectItem key={modalidade.id} value={modalidade.nome}>
                            {modalidade.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Projeto</Label>
                    <Select value={formData.tipo} onValueChange={(value) => handleSelectChange("tipo", value)}>
                      <SelectTrigger id="tipo">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Esportivo">Esportivo</SelectItem>
                        <SelectItem value="Social">Social</SelectItem>
                        <SelectItem value="Educacional">Educacional</SelectItem>
                        <SelectItem value="Cultural">Cultural</SelectItem>
                        <SelectItem value="Misto">Misto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planejado">Planejado</SelectItem>
                        <SelectItem value="em_andamento">Em andamento</SelectItem>
                        <SelectItem value="encerrado">Encerrado</SelectItem>
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
                    <Label htmlFor="responsavel">Responsável *</Label>
                    <Input
                      id="responsavel"
                      name="responsavel"
                      value={formData.responsavel}
                      onChange={handleChange}
                      placeholder="Ex: Carlos Mendes"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="publicoAlvo">Público-Alvo</Label>
                    <Input
                      id="publicoAlvo"
                      name="publicoAlvo"
                      value={formData.publicoAlvo}
                      onChange={handleChange}
                      placeholder="Ex: Crianças e adolescentes de 10 a 17 anos"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantidadePrevista">Quantidade Prevista</Label>
                    <Input
                      id="quantidadePrevista"
                      name="quantidadePrevista"
                      value={formData.quantidadePrevista}
                      onChange={handleChange}
                      placeholder="Ex: 50 participantes"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição do Projeto</Label>
                  <Textarea
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {espacosMock.map((espaco) => (
                    <div
                      key={espaco.id}
                      className={`border rounded-md p-4 cursor-pointer transition-colors ${
                        formData.espacos.includes(espaco.id) ? "border-green-500 bg-green-50" : "hover:border-gray-400"
                      }`}
                      onClick={() => handleEspacoToggle(espaco.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 rounded-md bg-gray-100 flex-shrink-0 overflow-hidden">
                          <img
                            src={espaco.imagens[0] || "/placeholder.svg"}
                            alt={espaco.nome}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{espaco.nome}</h3>
                          <p className="text-sm text-muted-foreground">{espaco.tipo}</p>
                          <p className="text-xs text-muted-foreground mt-1">Capacidade: {espaco.capacidade} pessoas</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

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
                {formData.metas.map((meta, metaIndex) => (
                  <div key={metaIndex} className="border rounded-md p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">Meta {metaIndex + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMeta(metaIndex)}
                        disabled={formData.metas.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`meta-${metaIndex}-descricao`}>Descrição da Meta</Label>
                        <Input
                          id={`meta-${metaIndex}-descricao`}
                          value={meta.descricao}
                          onChange={(e) => handleMetaChange(metaIndex, "descricao", e.target.value)}
                          placeholder="Ex: Inscrever 50 participantes"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`meta-${metaIndex}-data`}>Data Prevista</Label>
                        <Input
                          id={`meta-${metaIndex}-data`}
                          value={meta.data}
                          onChange={(e) => handleMetaChange(metaIndex, "data", e.target.value)}
                          placeholder="Ex: 30/06/2025"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Indicadores</Label>
                      {meta.indicadores.map((indicador, indicadorIndex) => (
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
                            disabled={meta.indicadores.length === 1}
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
