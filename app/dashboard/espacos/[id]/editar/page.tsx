"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, Plus, X, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { espacosService, Espaco } from "@/services/espacos.service"

interface FormData {
  name: string;
  type: string;
  capacity: string;
  location: string;
  description: string;
  resources: string[];
  is_active: boolean;
}

export default function EditarEspacoPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const id = params.id as string

  const [formData, setFormData] = useState<FormData>({
    name: "",
    type: "",
    capacity: "",
    location: "",
    description: "",
    resources: [""],
    is_active: true
  })

  const [imagens, setImagens] = useState<File[]>([])
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([])
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [tipos, setTipos] = useState<string[]>([])
  const [isLoadingTipos, setIsLoadingTipos] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar dados do espaço
  const carregarEspaco = useCallback(async () => {
    if (!id) return

    try {
      setIsLoading(true)
      const espacoData = await espacosService.obter(id)
      
      if (espacoData) {
        setFormData({
          name: espacoData.name || "",
          type: espacoData.type || "",
          capacity: espacoData.capacity ? String(espacoData.capacity) : "",
          location: espacoData.location || "",
          description: espacoData.description || "",
          resources: [""], // O backend atual não suporta recursos
          is_active: espacoData.is_active !== undefined ? Boolean(espacoData.is_active) : true
        })

        if (espacoData.image_url) {
          setOriginalImageUrl(espacoData.image_url)
          setImagesPreviews([espacoData.image_url])
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados do espaço:", error)
      setError("Não foi possível carregar os dados do espaço.")
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do espaço. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [id, toast])

  // Carregar tipos de espaços disponíveis
  const carregarTipos = useCallback(async () => {
    try {
      setIsLoadingTipos(true)
      const tiposData = await espacosService.getTipos()
      setTipos(tiposData || [])
    } catch (error) {
      console.error("Erro ao carregar tipos de espaços:", error)
      toast({
        title: "Erro ao carregar tipos",
        description: "Não foi possível carregar os tipos de espaços disponíveis.",
        variant: "destructive",
      })
      setTipos(["quadra", "piscina", "ginasio", "sala", "pista", "campo", "outro"]) // Fallback
    } finally {
      setIsLoadingTipos(false)
    }
  }, [toast])

  useEffect(() => {
    carregarEspaco()
    carregarTipos()
  }, [carregarEspaco, carregarTipos])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRecursoChange = (index: number, value: string) => {
    const newRecursos = [...formData.resources]
    newRecursos[index] = value
    setFormData((prev) => ({ ...prev, resources: newRecursos }))
  }

  const addRecurso = () => {
    setFormData((prev) => ({ ...prev, resources: [...prev.resources, ""] }))
  }

  const removeRecurso = (index: number) => {
    const newRecursos = [...formData.resources]
    newRecursos.splice(index, 1)
    setFormData((prev) => ({ ...prev, resources: newRecursos }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newImages: File[] = []
    const newPreviews: string[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast({
          title: "Arquivo muito grande",
          description: `A imagem ${file.name} excede o tamanho máximo de 5MB.`,
          variant: "destructive",
        })
        continue
      }
      
      newImages.push(file)
      newPreviews.push(URL.createObjectURL(file))
    }

    // Limpa a imagem anterior ao adicionar novas
    if (newImages.length > 0) {
      setImagens(newImages)
      setImagesPreviews(newPreviews)
      setOriginalImageUrl(null)
    }
  }

  const removeImagem = (index: number) => {
    // Se é a imagem original, limpa completamente
    if (index === 0 && originalImageUrl && imagesPreviews.length === 1) {
      setOriginalImageUrl(null)
      setImagesPreviews([])
      setImagens([])
      return
    }
    
    // Caso contrário, remove apenas a imagem específica
    if (imagesPreviews[index]) {
      // Revoke object URL para evitar memory leaks (apenas se não for a URL original)
      if (!originalImageUrl || originalImageUrl !== imagesPreviews[index]) {
        URL.revokeObjectURL(imagesPreviews[index])
      }
    }
    
    const newImagens = [...imagens]
    const newPreviews = [...imagesPreviews]
    
    newImagens.splice(index, 1)
    newPreviews.splice(index, 1)
    
    setImagens(newImagens)
    setImagesPreviews(newPreviews)
  }

  // Função para fazer upload de imagens (simulada)
  const uploadImages = async (): Promise<string[]> => {
    // Em uma implementação real, aqui seria feito o upload para um serviço de armazenamento
    // e retornaria as URLs das imagens. Por enquanto, apenas simulamos.
    
    // Simulando um atraso de upload
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Retorna URLs fictícias
    return imagens.map((_, index) => `/uploads/espaco-${Date.now()}-${index}.jpg`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validação básica
    if (!formData.name || !formData.type || !formData.capacity || !formData.location) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Preparar dados para envio
      const dadosEnvio: Partial<Espaco> = {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        capacity: parseInt(formData.capacity),
        location: formData.location,
        is_active: formData.is_active
      }

      // Se houver imagens novas, fazer o upload e adicionar a URL da primeira como image_url
      if (imagens.length > 0) {
        const imageUrls = await uploadImages()
        dadosEnvio.image_url = imageUrls[0] // Usa a primeira imagem como principal
      } else if (originalImageUrl === null) {
        // Se a imagem original foi removida e não foi adicionada uma nova, limpa o campo
        dadosEnvio.image_url = undefined
      }

      // Enviar para a API
      const espacoAtualizado = await espacosService.atualizar(id, dadosEnvio)
      
      toast({
        title: "Espaço atualizado com sucesso",
        description: "As alterações foram salvas com sucesso.",
      })
      
      // Redirecionar para a página de detalhes do espaço
      router.push(`/dashboard/espacos/${id}`)
    } catch (error) {
      console.error("Erro ao atualizar espaço:", error)
      toast({
        title: "Erro ao atualizar espaço",
        description: "Ocorreu um erro ao salvar os dados. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-green-700" />
        <p className="text-muted-foreground">Carregando dados do espaço...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold">Erro ao carregar dados</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => router.push("/dashboard/espacos")}>Voltar para lista de espaços</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/espacos/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Editar Espaço</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Atualize as informações básicas do espaço</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Espaço *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Quadra Poliesportiva 1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Espaço *</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange("type", value)}
                  disabled={isLoadingTipos}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder={isLoadingTipos ? "Carregando tipos..." : "Selecione o tipo de espaço"} />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingTipos ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Carregando...</span>
                      </div>
                    ) : (
                      tipos.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacidade (pessoas) *</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="Ex: 100"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Localização *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Ex: Bloco A, Piso 1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="is_active">Status</Label>
                <Select 
                  value={formData.is_active ? "true" : "false"} 
                  onValueChange={(value) => handleSelectChange("is_active", value === "true" ? "true" : "false")}
                >
                  <SelectTrigger id="is_active">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Disponível</SelectItem>
                    <SelectItem value="false">Indisponível</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Detalhes Adicionais</CardTitle>
              <CardDescription>Atualize mais informações sobre o espaço</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descreva o espaço, suas características e finalidades..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Recursos e Equipamentos</Label>
                {formData.resources.map((recurso, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={recurso}
                      onChange={(e) => handleRecursoChange(index, e.target.value)}
                      placeholder="Ex: Rede de vôlei, Tabela de basquete, etc."
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRecurso(index)}
                      disabled={formData.resources.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addRecurso}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Recurso
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Imagens do Espaço</CardTitle>
              <CardDescription>Atualize as fotos do espaço para melhor visualização</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {imagesPreviews.map((imagem, index) => (
                  <div key={index} className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={imagem || "/placeholder.svg"}
                      alt={`Imagem ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => removeImagem(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}

                <label className="flex flex-col items-center justify-center aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Clique para adicionar imagens</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG ou JPEG (máx. 5MB)</p>
                  </div>
                  <Input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push(`/dashboard/espacos/${id}`)}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-green-700 hover:bg-green-600" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </div>
  )
} 