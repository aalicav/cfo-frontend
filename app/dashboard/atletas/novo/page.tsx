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
import { atletasService } from "@/services/api"
import { Atleta } from "@/types"
import { CriarAtletaPayload } from "@/services/atletas.service"

export default function NovoAtletaPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("dados-pessoais")
  const [dataNascimento, setDataNascimento] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<CriarAtletaPayload>({
    status: "active",
    joined_at: new Date().toISOString().split('T')[0],
    modalities: [],
    is_professional: false,
    has_health_insurance: false,
    name: "",
    email: "",
    document_number: "",
    phone: "",
    address: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value ? Number(value) : undefined }))
  }

  const handleSelectChange = (name: string, value: string) => {
    if (value === "" && name === "status") {
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value === "" ? undefined : value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleModalidadeToggle = (modalidade: string) => {
    setFormData((prev) => {
      const modalities = [...(prev.modalities || [])]
      if (modalities.includes(modalidade)) {
        return { ...prev, modalities: modalities.filter((m) => m !== modalidade) }
      } else {
        return { ...prev, modalities: [...modalities, modalidade] }
      }
    })
  }

  const handleContatoChange = (field: string, value: string) => {
    if (field === "emergency_contact_name") {
      setFormData((prev) => ({ ...prev, emergency_contact_name: value }))
    } else if (field === "emergency_contact_phone") {
      setFormData((prev) => ({ ...prev, emergency_contact_phone: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Preencher a data de nascimento se estiver definida e ainda não foi adicionada ao formData
      const dadosEnvio: CriarAtletaPayload = {
        ...formData
      }

      // Validação básica
      if (!dadosEnvio.document_number) {
        toast({
          title: "Erro de validação",
          description: "Por favor, preencha o número do documento.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }
      
      // Remover campos vazios para evitar problemas na API
      Object.keys(dadosEnvio).forEach(key => {
        const k = key as keyof CriarAtletaPayload;
        if (dadosEnvio[k] === "" || dadosEnvio[k] === undefined) {
          delete dadosEnvio[k as keyof CriarAtletaPayload];
        }
      });
      
      // Chamar o serviço para criar o atleta
      const novoAtleta = await atletasService.criar(dadosEnvio)
      
      toast({
        title: "Atleta cadastrado com sucesso",
        description: "O novo atleta foi adicionado ao sistema.",
      })
      
      router.push("/dashboard/atletas")
    } catch (error: any) {
      console.error("Erro ao cadastrar atleta:", error)
      
      toast({
        title: "Erro ao cadastrar atleta",
        description: error.response?.data?.message || "Ocorreu um erro ao cadastrar o atleta. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleChange}
                      placeholder="Nome completo do atleta"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-left font-normal"
                          type="button"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {dataNascimento
                            ? format(dataNascimento, "dd/MM/yyyy", { locale: ptBR })
                            : "Selecione uma data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={dataNascimento}
                          onSelect={(date) => {
                            setDataNascimento(date);
                            if (date) {
                              setFormData(prev => ({
                                ...prev,
                                birth_date: format(date, 'yyyy-MM-dd')
                              }));
                            }
                          }}
                          initialFocus
                          disabled={(date) => 
                            date > new Date() || 
                            date < new Date('1900-01-01')
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gênero</Label>
                    <Select 
                      value={formData.gender || ""} 
                      onValueChange={(value) => handleSelectChange("gender", value)}
                    >
                      <SelectTrigger id="gender">
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
                    <Label htmlFor="document_number">Documento (CPF) *</Label>
                    <Input
                      id="document_number"
                      name="document_number"
                      value={formData.document_number || ""}
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
                      value={formData.email || ""}
                      onChange={handleChange}
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleChange}
                      placeholder="Endereço completo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city || ""}
                      onChange={handleChange}
                      placeholder="Cidade"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state || ""}
                      onChange={handleChange}
                      placeholder="Estado"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Altura (cm)</Label>
                    <Input
                      id="height"
                      name="height"
                      type="number"
                      value={formData.height || ""}
                      onChange={handleNumberChange}
                      placeholder="Ex: 175"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      value={formData.weight || ""}
                      onChange={handleNumberChange}
                      placeholder="Ex: 70"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="blood_type">Tipo Sanguíneo</Label>
                    <Select 
                      value={formData.blood_type || ""} 
                      onValueChange={(value) => handleSelectChange("blood_type", value)}
                    >
                      <SelectTrigger id="blood_type">
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

                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nacionalidade</Label>
                    <Input
                      id="nationality"
                      name="nationality"
                      value={formData.nationality || ""}
                      onChange={handleChange}
                      placeholder="Ex: Brasileira"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medical_conditions">Condições Médicas</Label>
                  <Textarea
                    id="medical_conditions"
                    name="medical_conditions"
                    value={formData.medical_conditions || ""}
                    onChange={handleChange}
                    placeholder="Informações sobre condições médicas relevantes"
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies">Alergias</Label>
                  <Textarea
                    id="allergies"
                    name="allergies"
                    value={formData.allergies || ""}
                    onChange={handleChange}
                    placeholder="Informações sobre alergias"
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="is_professional" 
                      checked={Boolean(formData.is_professional)}
                      onCheckedChange={(checked) => {
                        if (typeof checked === 'boolean') {
                          handleCheckboxChange("is_professional", checked);
                        }
                      }}
                    />
                    <Label htmlFor="is_professional">Atleta Profissional</Label>
                  </div>
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
                <div className="border rounded-md p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergency_contact_name">Nome do Contato de Emergência</Label>
                      <Input
                        id="emergency_contact_name"
                        value={formData.emergency_contact_name || ""}
                        onChange={(e) => handleContatoChange("emergency_contact_name", e.target.value)}
                        placeholder="Nome do contato"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="emergency_contact_phone">Telefone de Emergência</Label>
                      <Input
                        id="emergency_contact_phone"
                        value={formData.emergency_contact_phone || ""}
                        onChange={(e) => handleContatoChange("emergency_contact_phone", e.target.value)}
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="has_health_insurance" 
                      checked={Boolean(formData.has_health_insurance)}
                      onCheckedChange={(checked) => {
                        if (typeof checked === 'boolean') {
                          handleCheckboxChange("has_health_insurance", checked);
                        }
                      }}
                    />
                    <Label htmlFor="has_health_insurance">Possui Plano de Saúde</Label>
                  </div>
                </div>

                {formData.has_health_insurance && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="health_insurance_provider">Plano de Saúde</Label>
                      <Input
                        id="health_insurance_provider"
                        name="health_insurance_provider"
                        value={formData.health_insurance_provider || ""}
                        onChange={handleChange}
                        placeholder="Nome da operadora"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="health_insurance_number">Número da Carteirinha</Label>
                      <Input
                        id="health_insurance_number"
                        name="health_insurance_number"
                        value={formData.health_insurance_number || ""}
                        onChange={handleChange}
                        placeholder="Número da carteirinha"
                      />
                    </div>
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
                        formData.modalities?.includes(modalidade.nome)
                          ? "border-green-500 bg-green-50"
                          : "hover:border-gray-400"
                      }`}
                      onClick={() => handleModalidadeToggle(modalidade.nome)}
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={Boolean(formData.modalities?.includes(modalidade.nome))}
                          onCheckedChange={() => handleModalidadeToggle(modalidade.nome)}
                          id={`modalidade-${modalidade.id}`}
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
                <CardDescription>Configure informações adicionais e documentos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="registration_number">Número de Registro</Label>
                    <Input
                      id="registration_number"
                      name="registration_number"
                      value={formData.registration_number || ""}
                      onChange={handleChange}
                      placeholder="Número de identificação único"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="document_type">Tipo de Documento</Label>
                    <Select 
                      value={formData.document_type || ""} 
                      onValueChange={(value) => handleSelectChange("document_type", value)}
                    >
                      <SelectTrigger id="document_type">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CPF">CPF</SelectItem>
                        <SelectItem value="RG">RG</SelectItem>
                        <SelectItem value="Passaporte">Passaporte</SelectItem>
                        <SelectItem value="CNH">CNH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => handleSelectChange("status", value as "active" | "inactive" | "suspended" | "pending")}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="suspended">Suspenso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes || ""}
                    onChange={handleChange}
                    placeholder="Informações adicionais relevantes"
                    className="min-h-[100px]"
                  />
                </div>

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
                    <h3 className="font-medium mb-2">Documento de Identidade</h3>
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
