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
import { atletasService } from "@/services/api"
import { Atleta } from "@/types"

// Serviços simulados para modalidades e times até que sejam implementados na API
const modalidadesService = {
  listar: async () => {
    // Simulação de resposta
    return {
      data: {
        items: [
          { id: "nat", name: "Natação" },
          { id: "fut", name: "Futebol" },
          { id: "vol", name: "Vôlei" },
          { id: "bas", name: "Basquete" },
          { id: "atl", name: "Atletismo" }
        ]
      }
    }
  }
}

const timesService = {
  criar: async (data: any) => {
    // Simulação de resposta
    console.log("Time criado:", data)
    return { success: true }
  }
}

// Interface para modalidade
interface Modalidade {
  id: string;
  name: string;
}

interface FormData {
  nome: string;
  modalidade: string;
  categoria: string;
  tecnico: string;
  descricao: string;
  atletas: string[];
  comissaoTecnica: { nome: string; funcao: string }[];
  locaisTreinamento: { espaco: string; dias: string; horario: string }[];
}

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

  const [formData, setFormData] = useState<FormData>({
    nome: "",
    modalidade: "",
    categoria: "",
    tecnico: "",
    descricao: "",
    atletas: [],
    comissaoTecnica: [{ nome: "", funcao: "" }],
    locaisTreinamento: [{ espaco: "", dias: "", horario: "" }],
  })

  useEffect(() => {
    const carregarModalidades = async () => {
      setCarregandoModalidades(true)
      try {
        const response = await modalidadesService.listar()
        if (response && response.data) {
          setModalidades(response.data.items || [])
        }
      } catch (error) {
        console.error("Erro ao carregar modalidades:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar as modalidades. Tente novamente mais tarde.",
          variant: "destructive",
        })
      } finally {
        setCarregandoModalidades(false)
      }
    }

    carregarModalidades()
  }, [toast])

  useEffect(() => {
    const carregarAtletas = async () => {
      if (!formData.modalidade) return
      
      setCarregandoAtletas(true)
      try {
        const response = await atletasService.listar({
          modality: formData.modalidade
        })
        if (response && response.data) {
          setAtletas(response.data.items || [])
        }
      } catch (error) {
        console.error("Erro ao carregar atletas:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os atletas. Tente novamente mais tarde.",
          variant: "destructive",
        })
      } finally {
        setCarregandoAtletas(false)
      }
    }

    if (formData.modalidade) {
      carregarAtletas()
    }
  }, [formData.modalidade, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAtletaToggle = (atletaId: string) => {
    setFormData((prev) => {
      const atletas = [...prev.atletas]
      if (atletas.includes(atletaId)) {
        return { ...prev, atletas: atletas.filter((id) => id !== atletaId) }
      } else {
        return { ...prev, atletas: [...atletas, atletaId] }
      }
    })
  }

  const handleComissaoTecnicaChange = (index: number, field: string, value: string) => {
    const newComissao = [...formData.comissaoTecnica]
    newComissao[index] = { ...newComissao[index], [field]: value }
    setFormData((prev) => ({ ...prev, comissaoTecnica: newComissao }))
  }

  const addComissaoTecnica = () => {
    setFormData((prev) => ({
      ...prev,
      comissaoTecnica: [...prev.comissaoTecnica, { nome: "", funcao: "" }],
    }))
  }

  const removeComissaoTecnica = (index: number) => {
    const newComissao = [...formData.comissaoTecnica]
    newComissao.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      comissaoTecnica: newComissao.length ? newComissao : [{ nome: "", funcao: "" }],
    }))
  }

  const handleLocalTreinamentoChange = (index: number, field: string, value: string) => {
    const newLocais = [...formData.locaisTreinamento]
    newLocais[index] = { ...newLocais[index], [field]: value }
    setFormData((prev) => ({ ...prev, locaisTreinamento: newLocais }))
  }

  const addLocalTreinamento = () => {
    setFormData((prev) => ({
      ...prev,
      locaisTreinamento: [...prev.locaisTreinamento, { espaco: "", dias: "", horario: "" }],
    }))
  }

  const removeLocalTreinamento = (index: number) => {
    const newLocais = [...formData.locaisTreinamento]
    newLocais.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      locaisTreinamento: newLocais.length ? newLocais : [{ espaco: "", dias: "", horario: "" }],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validação básica
    if (!formData.nome || !formData.modalidade || !formData.categoria || !formData.tecnico) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const timeData = {
        nome: formData.nome,
        modalidade: formData.modalidade,
        categoria: formData.categoria,
        tecnico: formData.tecnico,
        descricao: formData.descricao,
        atletas: formData.atletas,
        comissaoTecnica: formData.comissaoTecnica,
        locaisTreinamento: formData.locaisTreinamento,
        dataCriacao: format(dataCriacao, "yyyy-MM-dd")
      }
      
      await timesService.criar(timeData)
      
      toast({
        title: "Time cadastrado com sucesso",
        description: "O novo time foi adicionado ao sistema.",
      })
      router.push("/dashboard/times")
    } catch (error) {
      console.error("Erro ao cadastrar time:", error)
      toast({
        title: "Erro ao cadastrar time",
        description: "Ocorreu um erro ao cadastrar o time. Tente novamente mais tarde.",
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
                    <Label htmlFor="nome">Nome do Time *</Label>
                    <Input
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Ex: Time de Natação Juvenil"
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
                        {carregandoModalidades ? (
                          <SelectItem value="carregando" disabled>Carregando...</SelectItem>
                        ) : modalidades.length > 0 ? (
                          modalidades.map((modalidade) => (
                            <SelectItem key={modalidade.id} value={modalidade.id}>
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
                    <Label htmlFor="categoria">Categoria *</Label>
                    <Select
                      value={formData.categoria}
                      onValueChange={(value) => handleSelectChange("categoria", value)}
                    >
                      <SelectTrigger id="categoria">
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
                    <Label htmlFor="tecnico">Técnico Responsável *</Label>
                    <Input
                      id="tecnico"
                      name="tecnico"
                      value={formData.tecnico}
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
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
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
                {formData.modalidade ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {carregandoAtletas ? (
                      <div className="col-span-full text-center py-8">
                        <p className="text-muted-foreground">Carregando atletas...</p>
                      </div>
                    ) : atletas.length > 0 ? (
                      atletas.map((atleta) => (
                        <div
                          key={atleta.id}
                          className={`border rounded-md p-4 cursor-pointer transition-colors ${
                            formData.atletas.includes(atleta.id)
                              ? "border-green-500 bg-green-50"
                              : "hover:border-gray-400"
                          }`}
                          onClick={() => handleAtletaToggle(atleta.id)}
                        >
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={formData.atletas.includes(atleta.id)}
                              onCheckedChange={() => handleAtletaToggle(atleta.id)}
                            />
                            <div>
                              <h3 className="font-medium">{atleta.user?.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {atleta.birth_date && new Date().getFullYear() - new Date(atleta.birth_date).getFullYear()} anos • {atleta.group || 'Sem categoria'}
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
                  <p className="text-sm text-muted-foreground">{formData.tecnico || "Não definido"}</p>
                </div>

                {formData.comissaoTecnica.map((membro, index) => (
                  <div key={index} className="border rounded-md p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">Membro {index + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeComissaoTecnica(index)}
                        disabled={formData.comissaoTecnica.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`membro-${index}-nome`}>Nome</Label>
                        <Input
                          id={`membro-${index}-nome`}
                          value={membro.nome}
                          onChange={(e) => handleComissaoTecnicaChange(index, "nome", e.target.value)}
                          placeholder="Nome do membro"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`membro-${index}-funcao`}>Função</Label>
                        <Input
                          id={`membro-${index}-funcao`}
                          value={membro.funcao}
                          onChange={(e) => handleComissaoTecnicaChange(index, "funcao", e.target.value)}
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
                {formData.locaisTreinamento.map((local, index) => (
                  <div key={index} className="border rounded-md p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">Local de Treinamento {index + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLocalTreinamento(index)}
                        disabled={formData.locaisTreinamento.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2 md:col-span-3">
                        <Label htmlFor={`local-${index}-espaco`}>Espaço</Label>
                        <Input
                          id={`local-${index}-espaco`}
                          value={local.espaco}
                          onChange={(e) => handleLocalTreinamentoChange(index, "espaco", e.target.value)}
                          placeholder="Ex: Piscina Olímpica, Quadra Poliesportiva"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`local-${index}-dias`}>Dias da Semana</Label>
                        <Input
                          id={`local-${index}-dias`}
                          value={local.dias}
                          onChange={(e) => handleLocalTreinamentoChange(index, "dias", e.target.value)}
                          placeholder="Ex: Segunda e Quarta"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`local-${index}-horario`}>Horário</Label>
                        <Input
                          id={`local-${index}-horario`}
                          value={local.horario}
                          onChange={(e) => handleLocalTreinamentoChange(index, "horario", e.target.value)}
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
