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

export default function NovoEspacoPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nome: "",
    tipo: "",
    capacidade: "",
    localizacao: "",
    horarioFuncionamento: "",
    descricao: "",
    recursos: [""],
  })

  const [imagens, setImagens] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRecursoChange = (index: number, value: string) => {
    const newRecursos = [...formData.recursos]
    newRecursos[index] = value
    setFormData((prev) => ({ ...prev, recursos: newRecursos }))
  }

  const addRecurso = () => {
    setFormData((prev) => ({ ...prev, recursos: [...prev.recursos, ""] }))
  }

  const removeRecurso = (index: number) => {
    const newRecursos = [...formData.recursos]
    newRecursos.splice(index, 1)
    setFormData((prev) => ({ ...prev, recursos: newRecursos }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // Simulando upload de imagens
    const newImagens = [...imagens]
    for (let i = 0; i < files.length; i++) {
      // Em uma aplicação real, aqui seria feito o upload para um servidor
      // e retornaria a URL da imagem
      const imageUrl = URL.createObjectURL(files[i])
      newImagens.push(imageUrl)
    }
    setImagens(newImagens)
  }

  const removeImagem = (index: number) => {
    const newImagens = [...imagens]
    newImagens.splice(index, 1)
    setImagens(newImagens)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validação básica
    if (!formData.nome || !formData.tipo || !formData.capacidade || !formData.localizacao) {
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
        title: "Espaço criado com sucesso",
        description: "O novo espaço foi adicionado ao sistema.",
      })
      router.push("/dashboard/espacos")
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/espacos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Novo Espaço</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Preencha as informações básicas do espaço</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Espaço *</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Ex: Quadra Poliesportiva 1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Espaço *</Label>
                <Select value={formData.tipo} onValueChange={(value) => handleSelectChange("tipo", value)}>
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Selecione o tipo de espaço" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quadra">Quadra</SelectItem>
                    <SelectItem value="piscina">Piscina</SelectItem>
                    <SelectItem value="ginasio">Ginásio</SelectItem>
                    <SelectItem value="sala">Sala</SelectItem>
                    <SelectItem value="pista">Pista</SelectItem>
                    <SelectItem value="campo">Campo</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacidade">Capacidade (pessoas) *</Label>
                <Input
                  id="capacidade"
                  name="capacidade"
                  type="number"
                  value={formData.capacidade}
                  onChange={handleChange}
                  placeholder="Ex: 100"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="localizacao">Localização *</Label>
                <Input
                  id="localizacao"
                  name="localizacao"
                  value={formData.localizacao}
                  onChange={handleChange}
                  placeholder="Ex: Bloco A, Piso 1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="horarioFuncionamento">Horário de Funcionamento</Label>
                <Input
                  id="horarioFuncionamento"
                  name="horarioFuncionamento"
                  value={formData.horarioFuncionamento}
                  onChange={handleChange}
                  placeholder="Ex: 08:00 às 22:00"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Detalhes Adicionais</CardTitle>
              <CardDescription>Forneça mais informações sobre o espaço</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  placeholder="Descreva o espaço, suas características e finalidades..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Recursos e Equipamentos</Label>
                {formData.recursos.map((recurso, index) => (
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
                      disabled={formData.recursos.length === 1}
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
              <CardDescription>Adicione fotos do espaço para melhor visualização</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {imagens.map((imagem, index) => (
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
          <Button variant="outline" type="button" onClick={() => router.push("/dashboard/espacos")}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-green-700 hover:bg-green-600" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Espaço"}
          </Button>
        </div>
      </form>
    </div>
  )
}
