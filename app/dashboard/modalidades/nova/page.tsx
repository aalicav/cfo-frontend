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

export default function NovaModalidadePage() {
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    tipo: "",
    nivel: "",
    faixaEtaria: "",
    descricao: "",
    requisitos: [""],
  })

  const [imagem, setImagem] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRequisitoChange = (index: number, value: string) => {
    const newRequisitos = [...formData.requisitos]
    newRequisitos[index] = value
    setFormData((prev) => ({ ...prev, requisitos: newRequisitos }))
  }

  const addRequisito = () => {
    setFormData((prev) => ({ ...prev, requisitos: [...prev.requisitos, ""] }))
  }

  const removeRequisito = (index: number) => {
    const newRequisitos = [...formData.requisitos]
    newRequisitos.splice(index, 1)
    setFormData((prev) => ({ ...prev, requisitos: newRequisitos }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Simulando upload de imagem
    const imageUrl = URL.createObjectURL(file)
    setImagem(imageUrl)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validação básica
    if (!formData.nome || !formData.categoria) {
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
        title: "Modalidade criada com sucesso",
        description: "A nova modalidade foi adicionada ao sistema.",
      })
      router.push("/dashboard/modalidades")
    }, 1500)
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
                <Label htmlFor="nome">Nome da Modalidade *</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Ex: Natação"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria *</Label>
                <Select value={formData.categoria} onValueChange={(value) => handleSelectChange("categoria", value)}>
                  <SelectTrigger id="categoria">
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
                <Label htmlFor="tipo">Tipo</Label>
                <Select value={formData.tipo} onValueChange={(value) => handleSelectChange("tipo", value)}>
                  <SelectTrigger id="tipo">
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
                <Label htmlFor="nivel">Nível</Label>
                <Select value={formData.nivel} onValueChange={(value) => handleSelectChange("nivel", value)}>
                  <SelectTrigger id="nivel">
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
                <Label htmlFor="faixaEtaria">Faixa Etária Recomendada</Label>
                <Input
                  id="faixaEtaria"
                  name="faixaEtaria"
                  value={formData.faixaEtaria}
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
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  placeholder="Descreva a modalidade, suas características e objetivos..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Requisitos</Label>
                {formData.requisitos.map((requisito, index) => (
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
                      disabled={formData.requisitos.length === 1}
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
                  {imagem ? (
                    <div className="relative aspect-video">
                      <img
                        src={imagem || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => setImagem(null)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center cursor-pointer">
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Clique para adicionar uma imagem</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG ou JPEG (máx. 5MB)</p>
                      </div>
                      <Input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push("/dashboard/modalidades")}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-green-700 hover:bg-green-600" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Modalidade"}
          </Button>
        </div>
      </form>
    </div>
  )
}
