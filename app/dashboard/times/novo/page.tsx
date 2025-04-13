"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Plus, X, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { timesService, CriarTimePayload, ComiteItem, LocalTreino } from "@/services/times.service"
import { Modalidade, modalidadesService } from "@/services/modalidades.service"
import { atletasService } from "@/services/atletas.service"
import { Atleta } from "@/types"

export default function NovoTimePage() {
  const router = useRouter()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("informacoes")
  const [dataCriacao, setDataCriacao] = useState<Date>(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modalidades, setModalidades] = useState<Modalidade[]>([])
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [carregandoModalidades, setCarregandoModalidades] = useState(true)
  const [carregandoAtletas, setCarregandoAtletas] = useState(false)
  const [buscaAtleta, setBuscaAtleta] = useState("")
  
  // IDs temporários de atletas selecionados (como strings para facilitar comparações)
  const [atletasSelecionados, setAtletasSelecionados] = useState<string[]>([])

  const [formData, setFormData] = useState<CriarTimePayload>({
    name: "",
    modality: "",
    category: "",
    coach: "",
    description: "",
    athletes: [],
    technical_committee: [{ name: "", role: "" }],
    training_locations: [{ name: "", days: "", schedule: "" }],
  })

  useEffect(() => {
    const carregarModalidades = async () => {
      setCarregandoModalidades(true)
      try {
        const response = await modalidadesService.listar()
        setModalidades(response)
      } catch (error) {
        console.error("Erro ao carregar modalidades:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar as modalidades. Tente novamente mais tarde.",
          variant: "destructive",
        })
        setModalidades([])
      } finally {
        setCarregandoModalidades(false)
      }
    }

    carregarModalidades()
  }, [toast])

  // Função para carregar atletas com termo de busca opcional
  const carregarAtletas = async (termoBusca?: string) => {
    if (!formData.modality) return
    
    setCarregandoAtletas(true)
    try {
      // Usar o serviço real de atletas com o termo de busca
      const response = await atletasService.listar({
        status: 'ativo',
        search: termoBusca || undefined, // Enviar apenas se tiver algum valor
      });

      // Garantir que response não seja undefined
      if (!response) {
        setAtletas([]);
        return;
      }
      
      setAtletas(response);
    } catch (error) {
      console.error("Erro ao carregar atletas:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os atletas. Tente novamente mais tarde.",
        variant: "destructive",
      })
      setAtletas([])
    } finally {
      setCarregandoAtletas(false)
    }
  }

  // Efeito para carregar atletas quando a modalidade muda
  useEffect(() => {
    if (formData.modality) {
      carregarAtletas(buscaAtleta);
    }
  }, [formData.modality, toast]);

  // Lidar com mudanças no campo de busca
  const handleBuscaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBuscaAtleta(e.target.value);
  };

  // Função para realizar a busca
  const realizarBusca = () => {
    carregarAtletas(buscaAtleta);
  };

  // Função para limpar a busca
  const limparBusca = () => {
    setBuscaAtleta("");
    carregarAtletas("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAtletaToggle = (atletaId: string | number) => {
    const id = atletaId.toString();
    
    // Atualizar lista de IDs selecionados
    setAtletasSelecionados(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  }

  const handleComissaoTecnicaChange = (index: number, field: keyof ComiteItem, value: string) => {
    const newComissao = [...(formData.technical_committee || [])]
    newComissao[index] = { ...newComissao[index], [field]: value }
    setFormData((prev) => ({ ...prev, technical_committee: newComissao }))
  }

  const addComissaoTecnica = () => {
    setFormData((prev) => ({
      ...prev,
      technical_committee: [...(prev.technical_committee || []), { name: "", role: "" }],
    }))
  }

  const removeComissaoTecnica = (index: number) => {
    const newComissao = [...(formData.technical_committee || [])]
    newComissao.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      technical_committee: newComissao.length ? newComissao : [{ name: "", role: "" }],
    }))
  }

  const handleLocalTreinamentoChange = (index: number, field: keyof LocalTreino, value: string) => {
    const newLocais = [...(formData.training_locations || [])]
    newLocais[index] = { ...newLocais[index], [field]: value }
    setFormData((prev) => ({ ...prev, training_locations: newLocais }))
  }

  const addLocalTreinamento = () => {
    setFormData((prev) => ({
      ...prev,
      training_locations: [...(prev.training_locations || []), { name: "", days: "", schedule: "" }],
    }))
  }

  const removeLocalTreinamento = (index: number) => {
    const newLocais = [...(formData.training_locations || [])]
    newLocais.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      training_locations: newLocais.length ? newLocais : [{ name: "", days: "", schedule: "" }],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validação básica
    if (!formData.name || !formData.modality || !formData.category || !formData.coach) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Filtrar comissão técnica e locais de treinamento com campos vazios
      const comissaoTecnica = (formData.technical_committee || [])
        .filter(item => item.name.trim() !== "" && item.role.trim() !== "")

      const locaisTreinamento = (formData.training_locations || [])
        .filter(item => item.name.trim() !== "")

      // Converter IDs de atletas para números, com validação adequada
      const atletasIds = atletasSelecionados
        .map((id: string) => {
          const numId = parseInt(id);
          // Validar se é um número válido
          return isNaN(numId) ? null : numId;
        })
        .filter((id: number | null): id is number => id !== null); // Type guard para garantir que só temos números

      // Dados finais para envio
      const timeData: CriarTimePayload = {
        ...formData,
        creation_date: format(dataCriacao, "yyyy-MM-dd"),
        athletes: atletasIds,
        technical_committee: comissaoTecnica,
        training_locations: locaisTreinamento,
      }
      
      console.log("Enviando dados para o backend:", timeData)
      const result = await timesService.criar(timeData)
      
      toast({
        title: "Time cadastrado com sucesso",
        description: "O novo time foi adicionado ao sistema.",
      })
      
      // Redirecionar para a página de detalhes do time criado ou para a lista
      router.push("/dashboard/times")
    } catch (error: any) {
      console.error("Erro ao cadastrar time:", error)
      toast({
        title: "Erro ao cadastrar time",
        description: error?.response?.data?.message || "Ocorreu um erro ao cadastrar o time. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextTab = () => {
    if (activeTab === "informacoes") setActiveTab("atletas")
    else if (activeTab === "atletas") setActiveTab("comissao")
    else if (activeTab === "comissao") setActiveTab("treinamentos")
  }

  const prevTab = () => {
    if (activeTab === "treinamentos") setActiveTab("comissao")
    else if (activeTab === "comissao") setActiveTab("atletas")
    else if (activeTab === "atletas") setActiveTab("informacoes")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/times">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Novo Time</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="informacoes">Informações Básicas</TabsTrigger>
            <TabsTrigger value="atletas">Atletas</TabsTrigger>
            <TabsTrigger value="comissao">Comissão Técnica</TabsTrigger>
            <TabsTrigger value="treinamentos">Treinamentos</TabsTrigger>
          </TabsList>

          <TabsContent value="informacoes">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Time</CardTitle>
                <CardDescription>Preencha os dados básicos do time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Time *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ex: Time de Natação Juvenil"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modality">Modalidade *</Label>
                    <Select
                      value={formData.modality}
                      onValueChange={(value) => handleSelectChange("modality", value)}
                    >
                      <SelectTrigger id="modality">
                        <SelectValue placeholder="Selecione a modalidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {carregandoModalidades ? (
                          <SelectItem value="carregando" disabled>Carregando...</SelectItem>
                        ) : modalidades.length > 0 ? (
                          modalidades.map((modalidade) => (
                            <SelectItem key={modalidade.id.toString()} value={modalidade.id.toString()}>
                              {modalidade.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="vazio" disabled>Nenhuma modalidade encontrada</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sub-12">Sub-12</SelectItem>
                        <SelectItem value="Sub-14">Sub-14</SelectItem>
                        <SelectItem value="Sub-16">Sub-16</SelectItem>
                        <SelectItem value="Sub-18">Sub-18</SelectItem>
                        <SelectItem value="Sub-21">Sub-21</SelectItem>
                        <SelectItem value="Adulto">Adulto</SelectItem>
                        <SelectItem value="Master">Master</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coach">Técnico Responsável *</Label>
                    <Input
                      id="coach"
                      name="coach"
                      value={formData.coach}
                      onChange={handleChange}
                      placeholder="Nome do técnico responsável"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataCriacao">Data de Criação</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {dataCriacao ? format(dataCriacao, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent 
                          mode="single" 
                          selected={dataCriacao} 
                          onSelect={(date) => date && setDataCriacao(date)} 
                          initialFocus 
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descreva o time, seus objetivos e características..."
                    className="min-h-[100px]"
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

          <TabsContent value="atletas">
            <Card>
              <CardHeader>
                <CardTitle>Atletas do Time</CardTitle>
                <CardDescription>Selecione os atletas que compõem o time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.modality ? (
                  <>
                    {/* Campo de busca de atletas */}
                    <div className="relative mb-4">
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <Input
                            placeholder="Buscar atletas por nome..."
                            value={buscaAtleta}
                            onChange={handleBuscaChange}
                            onKeyDown={(e) => e.key === 'Enter' && realizarBusca()}
                            className="w-full"
                          />
                        </div>
                        <Button 
                          type="button" 
                          onClick={realizarBusca}
                          variant="secondary"
                        >
                          Buscar
                        </Button>
                        {buscaAtleta && (
                          <Button 
                            type="button" 
                            onClick={limparBusca} 
                            variant="outline"
                          >
                            Limpar
                          </Button>
                        )}
                      </div>
                      {buscaAtleta && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Buscando por: "{buscaAtleta}"
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {carregandoAtletas ? (
                        <div className="col-span-full text-center py-8">
                          <p className="text-muted-foreground">Carregando atletas...</p>
                        </div>
                      ) : atletas.length > 0 ? (
                        atletas.map((atleta) => (
                          <div
                            key={atleta.id.toString()}
                            className={`border rounded-md p-4 cursor-pointer transition-colors ${
                              atletasSelecionados.includes(atleta.id.toString())
                                ? "border-green-500 bg-green-50"
                                : "hover:border-gray-400"
                            }`}
                            onClick={() => handleAtletaToggle(atleta.id)}
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={atletasSelecionados.includes(atleta.id.toString())}
                                onCheckedChange={() => handleAtletaToggle(atleta.id)}
                              />
                              <div>
                                <h3 className="font-medium">{atleta.user?.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {atleta.birth_date && new Date().getFullYear() - new Date(atleta.birth_date).getFullYear()} anos • {atleta.status || 'Sem status'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-8">
                          <p className="text-muted-foreground">
                            Não há atletas cadastrados para a modalidade selecionada.
                          </p>
                          <Link href="/dashboard/atletas/novo">
                            <Button className="mt-4 bg-green-700 hover:bg-green-600">Cadastrar Novo Atleta</Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Selecione uma modalidade para ver os atletas disponíveis.</p>
                    <Button
                      className="mt-4 bg-green-700 hover:bg-green-600"
                      onClick={() => setActiveTab("informacoes")}
                    >
                      Voltar e Selecionar Modalidade
                    </Button>
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

          <TabsContent value="comissao">
            <Card>
              <CardHeader>
                <CardTitle>Comissão Técnica</CardTitle>
                <CardDescription>Adicione os membros da comissão técnica</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 border rounded-md bg-gray-50">
                  <h3 className="font-medium">Técnico Principal</h3>
                  <p className="text-sm text-muted-foreground">{formData.coach || "Não definido"}</p>
                </div>

                {formData.technical_committee?.map((membro, index) => (
                  <div key={index} className="border rounded-md p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">Membro {index + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeComissaoTecnica(index)}
                        disabled={(formData.technical_committee?.length || 0) <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`membro-${index}-nome`}>Nome</Label>
                        <Input
                          id={`membro-${index}-nome`}
                          value={membro.name}
                          onChange={(e) => handleComissaoTecnicaChange(index, "name", e.target.value)}
                          placeholder="Nome do membro"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`membro-${index}-funcao`}>Função</Label>
                        <Input
                          id={`membro-${index}-funcao`}
                          value={membro.role}
                          onChange={(e) => handleComissaoTecnicaChange(index, "role", e.target.value)}
                          placeholder="Ex: Assistente Técnico, Preparador Físico"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button type="button" variant="outline" className="w-full" onClick={addComissaoTecnica}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Membro
                </Button>

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

          <TabsContent value="treinamentos">
            <Card>
              <CardHeader>
                <CardTitle>Locais e Horários de Treinamento</CardTitle>
                <CardDescription>Defina onde e quando os treinos acontecem</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.training_locations?.map((local, index) => (
                  <div key={index} className="border rounded-md p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">Local de Treinamento {index + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLocalTreinamento(index)}
                        disabled={(formData.training_locations?.length || 0) <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2 md:col-span-3">
                        <Label htmlFor={`local-${index}-espaco`}>Espaço</Label>
                        <Input
                          id={`local-${index}-espaco`}
                          value={local.name}
                          onChange={(e) => handleLocalTreinamentoChange(index, "name", e.target.value)}
                          placeholder="Ex: Piscina Olímpica, Quadra Poliesportiva"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`local-${index}-dias`}>Dias da Semana</Label>
                        <Input
                          id={`local-${index}-dias`}
                          value={local.days}
                          onChange={(e) => handleLocalTreinamentoChange(index, "days", e.target.value)}
                          placeholder="Ex: Segunda e Quarta"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`local-${index}-horario`}>Horário</Label>
                        <Input
                          id={`local-${index}-horario`}
                          value={local.schedule}
                          onChange={(e) => handleLocalTreinamentoChange(index, "schedule", e.target.value)}
                          placeholder="Ex: 14:00 às 16:00"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button type="button" variant="outline" className="w-full" onClick={addLocalTreinamento}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Local de Treinamento
                </Button>

                <div className="flex justify-between mt-6">
                  <Button type="button" variant="outline" onClick={prevTab}>
                    Voltar
                  </Button>
                  <Button type="submit" className="bg-green-700 hover:bg-green-600" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar Time"}
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
