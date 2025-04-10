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
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Plus, X, Upload, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { modalidadesMock } from "@/lib/modalidades-mock"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function NovoAtletaPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("dados-pessoais")
  const [dataNascimento, setDataNascimento] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    nome: "",
    genero: "",
    documento: "",
    email: "",
    telefone: "",
    endereco: "",
    altura: "",
    peso: "",
    tipoSanguineo: "",
    observacoes: "",
    modalidades: [] as string[],
    contatosEmergencia: [{ nome: "", parentesco: "", telefone: "" }],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleModalidadeToggle = (modalidade: string) => {
    setFormData((prev) => {
      const modalidades = [...prev.modalidades]
      if (modalidades.includes(modalidade)) {
        return { ...prev, modalidades: modalidades.filter((m) => m !== modalidade) }
      } else {
        return { ...prev, modalidades: [...modalidades, modalidade] }
      }
    })
  }

  const handleContatoChange = (index: number, field: string, value: string) => {
    const newContatos = [...formData.contatosEmergencia]
    newContatos[index] = { ...newContatos[index], [field]: value }
    setFormData((prev) => ({ ...prev, contatosEmergencia: newContatos }))
  }

  const addContato = () => {
    setFormData((prev) => ({
      ...prev,
      contatosEmergencia: [...prev.contatosEmergencia, { nome: "", parentesco: "", telefone: "" }],
    }))
  }

  const removeContato = (index: number) => {
    const newContatos = [...formData.contatosEmergencia]
    newContatos.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      contatosEmergencia: newContatos.length ? newContatos : [{ nome: "", parentesco: "", telefone: "" }],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validação básica
    if (!formData.nome || !formData.documento || !dataNascimento) {
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
        title: "Atleta cadastrado com sucesso",
        description: "O novo atleta foi adicionado ao sistema.",
      })
      router.push("/dashboard/atletas")
    }, 1500)
  }

  const nextTab = () => {
    if (activeTab === "dados-pessoais") setActiveTab("contatos")
    else if (activeTab === "contatos") setActiveTab("modalidades")
    else if (activeTab === "modalidades") setActiveTab("documentos")
  }

  const prevTab = () => {
    if (activeTab === "documentos") setActiveTab("modalidades")
    else if (activeTab === "modalidades") setActiveTab("contatos")
    else if (activeTab === "contatos") setActiveTab("dados-pessoais")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/atletas">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Novo Atleta</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dados-pessoais">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="contatos">Contatos</TabsTrigger>
            <TabsTrigger value="modalidades">Modalidades</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
          </TabsList>

          <TabsContent value="dados-pessoais">
            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
                <CardDescription>Preencha os dados pessoais do atleta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Nome completo do atleta"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {dataNascimento
                            ? format(dataNascimento, "dd/MM/yyyy", { locale: ptBR })
                            : "Selecione uma data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={dataNascimento}
                          onSelect={setDataNascimento}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="genero">Gênero</Label>
                    <Select value={formData.genero} onValueChange={(value) => handleSelectChange("genero", value)}>
                      <SelectTrigger id="genero">
                        <SelectValue placeholder="Selecione o gênero" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Masculino">Masculino</SelectItem>
                        <SelectItem value="Feminino">Feminino</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documento">Documento (CPF) *</Label>
                    <Input
                      id="documento"
                      name="documento"
                      value={formData.documento}
                      onChange={handleChange}
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleChange}
                      placeholder="Endereço completo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="altura">Altura (cm)</Label>
                    <Input
                      id="altura"
                      name="altura"
                      type="number"
                      value={formData.altura}
                      onChange={handleChange}
                      placeholder="Ex: 175"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="peso">Peso (kg)</Label>
                    <Input
                      id="peso"
                      name="peso"
                      type="number"
                      value={formData.peso}
                      onChange={handleChange}
                      placeholder="Ex: 70"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipoSanguineo">Tipo Sanguíneo</Label>
                    <Select
                      value={formData.tipoSanguineo}
                      onValueChange={(value) => handleSelectChange("tipoSanguineo", value)}
                    >
                      <SelectTrigger id="tipoSanguineo">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleChange}
                    placeholder="Informações adicionais relevantes"
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

          <TabsContent value="contatos">
            <Card>
              <CardHeader>
                <CardTitle>Contatos de Emergência</CardTitle>
                <CardDescription>Adicione contatos para casos de emergência</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.contatosEmergencia.map((contato, index) => (
                  <div key={index} className="border rounded-md p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">Contato {index + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeContato(index)}
                        disabled={formData.contatosEmergencia.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`contato-${index}-nome`}>Nome</Label>
                        <Input
                          id={`contato-${index}-nome`}
                          value={contato.nome}
                          onChange={(e) => handleContatoChange(index, "nome", e.target.value)}
                          placeholder="Nome do contato"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`contato-${index}-parentesco`}>Parentesco</Label>
                        <Input
                          id={`contato-${index}-parentesco`}
                          value={contato.parentesco}
                          onChange={(e) => handleContatoChange(index, "parentesco", e.target.value)}
                          placeholder="Ex: Mãe, Pai, Responsável"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`contato-${index}-telefone`}>Telefone</Label>
                        <Input
                          id={`contato-${index}-telefone`}
                          value={contato.telefone}
                          onChange={(e) => handleContatoChange(index, "telefone", e.target.value)}
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button type="button" variant="outline" className="w-full" onClick={addContato}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Contato
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

          <TabsContent value="modalidades">
            <Card>
              <CardHeader>
                <CardTitle>Modalidades</CardTitle>
                <CardDescription>Selecione as modalidades que o atleta pratica</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {modalidadesMock.map((modalidade) => (
                    <div
                      key={modalidade.id}
                      className={`border rounded-md p-4 cursor-pointer transition-colors ${
                        formData.modalidades.includes(modalidade.nome)
                          ? "border-green-500 bg-green-50"
                          : "hover:border-gray-400"
                      }`}
                      onClick={() => handleModalidadeToggle(modalidade.nome)}
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={formData.modalidades.includes(modalidade.nome)}
                          onCheckedChange={() => handleModalidadeToggle(modalidade.nome)}
                        />
                        <div>
                          <h3 className="font-medium">{modalidade.nome}</h3>
                          <p className="text-sm text-muted-foreground">{modalidade.categoria}</p>
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

          <TabsContent value="documentos">
            <Card>
              <CardHeader>
                <CardTitle>Documentos</CardTitle>
                <CardDescription>Faça upload dos documentos necessários</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Atestado Médico</h3>
                    <div className="border-2 border-dashed rounded-md p-6">
                      <label className="flex flex-col items-center justify-center cursor-pointer">
                        <div className="flex flex-col items-center justify-center p-4 text-center">
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">Clique para fazer upload do atestado médico</p>
                          <p className="text-xs text-muted-foreground mt-1">PDF, JPG ou PNG (máx. 5MB)</p>
                        </div>
                        <Input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Documento de Identidade (RG/CPF)</h3>
                    <div className="border-2 border-dashed rounded-md p-6">
                      <label className="flex flex-col items-center justify-center cursor-pointer">
                        <div className="flex flex-col items-center justify-center p-4 text-center">
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">Clique para fazer upload do documento</p>
                          <p className="text-xs text-muted-foreground mt-1">PDF, JPG ou PNG (máx. 5MB)</p>
                        </div>
                        <Input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Autorização (para menores de idade)</h3>
                    <div className="border-2 border-dashed rounded-md p-6">
                      <label className="flex flex-col items-center justify-center cursor-pointer">
                        <div className="flex flex-col items-center justify-center p-4 text-center">
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">Clique para fazer upload da autorização</p>
                          <p className="text-xs text-muted-foreground mt-1">PDF, JPG ou PNG (máx. 5MB)</p>
                        </div>
                        <Input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button type="button" variant="outline" onClick={prevTab}>
                    Voltar
                  </Button>
                  <Button type="submit" className="bg-green-700 hover:bg-green-600" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar Atleta"}
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
