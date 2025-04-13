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
import { ArrowLeft, Upload, Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { modalidadesService, Modalidade } from "@/services/modalidades.service"

// Interface estendida para incluir campos extras do formulário
interface ModalidadeExtendida extends Modalidade {
  type?: string;
  level?: string;
  age_range?: string;
  requirements?: string[];
}

export default function NovaModalidadePage() {
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState<Partial<ModalidadeExtendida>>({
    name: "",
    category: "",
    description: "",
    is_active: true,
  })

  const [requisitos, setRequisitos] = useState<string[]>([""])
  const [imagem, setImagem] = useState<File | null>(null)
  const [imagemPreview, setImagemPreview] = useState<string | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRequisitoChange = (index: number, value: string) => {
    const newRequisitos = [...requisitos]
    newRequisitos[index] = value
    setRequisitos(newRequisitos)
  }

  const addRequisito = () => {
    setRequisitos((prev) => [...prev, ""])
  }

  const removeRequisito = (index: number) => {
    const newRequisitos = [...requisitos]
    newRequisitos.splice(index, 1)
    setRequisitos(newRequisitos)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Armazenar o arquivo para envio futuro
    setImagem(file)
    
    // Criar preview da imagem
    const imageUrl = URL.createObjectURL(file)
    setImagemPreview(imageUrl)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validação básica
    if (!formData.name || !formData.category) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Filtrar requisitos vazios
      const requisitosFiltrados = requisitos.filter(req => req.trim() !== '')
      
      // Preparar dados para envio
      const dadosEnvio: Partial<ModalidadeExtendida> = {
        ...formData,
        requirements: requisitosFiltrados.length > 0 ? requisitosFiltrados : undefined,
      }
      
      // Em um caso real, aqui seria feito o upload da imagem para um servidor
      // e o URL retornado seria adicionado ao objeto dadosEnvio como image_url
      if (imagem) {
        // Simulação: em produção, isso seria substituído por um upload real
        dadosEnvio.image_url = imagemPreview
      }
      
      // Enviar para a API
      const novaModalidade = await modalidadesService.criar(dadosEnvio)
      
      toast({
        title: "Modalidade criada com sucesso",
        description: "A nova modalidade foi adicionada ao sistema.",
      })
      
      router.push("/dashboard/modalidades")
    } catch (error: any) {
      console.error("Erro ao criar modalidade:", error)
      toast({
        title: "Erro ao criar modalidade",
        description: error.response?.data?.message || "Ocorreu um erro ao criar a modalidade. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/modalidades">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Nova Modalidade</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Preencha as informações básicas da modalidade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Modalidade *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Natação"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aquática">Aquática</SelectItem>
                    <SelectItem value="Coletiva">Coletiva</SelectItem>
                    <SelectItem value="Individual">Individual</SelectItem>
                    <SelectItem value="Combate">Combate</SelectItem>
                    <SelectItem value="Raquete">Raquete</SelectItem>
                    <SelectItem value="Ginástica">Ginástica</SelectItem>
                    <SelectItem value="Atletismo">Atletismo</SelectItem>
                    <SelectItem value="Outra">Outra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select value={formData.type || ""} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Individual">Individual</SelectItem>
                    <SelectItem value="Coletiva">Coletiva</SelectItem>
                    <SelectItem value="Individual/Coletiva">Individual/Coletiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Nível</Label>
                <Select value={formData.level || ""} onValueChange={(value) => handleSelectChange("level", value)}>
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Iniciante">Iniciante</SelectItem>
                    <SelectItem value="Intermediário">Intermediário</SelectItem>
                    <SelectItem value="Avançado">Avançado</SelectItem>
                    <SelectItem value="Iniciante a Avançado">Iniciante a Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age_range">Faixa Etária Recomendada</Label>
                <Input
                  id="age_range"
                  name="age_range"
                  value={formData.age_range || ""}
                  onChange={handleChange}
                  placeholder="Ex: 7 anos ou mais"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Detalhes Adicionais</CardTitle>
              <CardDescription>Forneça mais informações sobre a modalidade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  placeholder="Descreva a modalidade, suas características e objetivos..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Requisitos</Label>
                {requisitos.map((requisito, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={requisito}
                      onChange={(e) => handleRequisitoChange(index, e.target.value)}
                      placeholder="Ex: Atestado médico, equipamentos específicos, etc."
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRequisito(index)}
                      disabled={requisitos.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addRequisito}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Requisito
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Imagem da Modalidade</Label>
                <div className="border-2 border-dashed rounded-md p-4">
                  {imagemPreview ? (
                    <div className="relative aspect-video">
                      <img
                        src={imagemPreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => {
                          setImagem(null)
                          setImagemPreview(undefined)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center cursor-pointer">
                      <div className="flex flex-col items-center justify-center p-6 text-center">
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Clique para fazer upload da imagem</p>
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG ou SVG (máx. 2MB)</p>
                      </div>
                      <Input 
                        type="file" 
                        className="hidden" 
                        accept="image/jpeg,image/png,image/svg+xml"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" className="bg-green-700 hover:bg-green-600" disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar Modalidade"}
          </Button>
        </div>
      </form>
    </div>
  )
}
