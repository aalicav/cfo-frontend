"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { atletasService, avaliacoesService } from "@/services/api"
import { Atleta } from "@/types"
import { useToast } from "@/hooks/use-toast"

export default function NovaAvaliacaoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const atletaId = searchParams.get('atleta')
  const { toast } = useToast()
  const [indicadores, setIndicadores] = useState([{ nome: "", valor: "", unidade: "%", referencia: "" }])
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    atleta_id: atletaId || "",
    tipo: "",
    data: "",
    responsavel: "",
    modalidade: "",
    local: "",
    observacoes: ""
  })

  useEffect(() => {
    const carregarAtletas = async () => {
      setIsLoading(true)
      try {
        const response = await atletasService.listar()
        if (response && response.data) {
          setAtletas(response.data)
        }
      } catch (error) {
        console.error("Erro ao carregar atletas:", error)
        setError("Ocorreu um erro ao carregar os atletas. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    carregarAtletas()
  }, [])

  const adicionarIndicador = () => {
    setIndicadores([...indicadores, { nome: "", valor: "", unidade: "%", referencia: "" }])
  }

  const removerIndicador = (index: number) => {
    const novosIndicadores = [...indicadores]
    novosIndicadores.splice(index, 1)
    setIndicadores(novosIndicadores)
  }

  const atualizarIndicador = (index: number, campo: string, valor: string) => {
    const novosIndicadores = [...indicadores]
    novosIndicadores[index] = { ...novosIndicadores[index], [campo]: valor }
    setIndicadores(novosIndicadores)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const mapTipoToBackend = (tipo: string): 'Física' | 'Técnica' | 'Médica' => {
    switch (tipo) {
      case "fisica": return "Física"
      case "tecnica": return "Técnica"
      case "medica": return "Médica"
      default: return "Física"
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    // Validação
    if (!formData.atleta_id || !formData.tipo || !formData.data || !formData.responsavel) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      })
      setIsSaving(false)
      return
    }

    try {
      // Preparar dados para o backend
      const dadosAvaliacao = {
        athlete_id: formData.atleta_id,
        type: mapTipoToBackend(formData.tipo),
        evaluation_date: formData.data,
        title: `Avaliação ${mapTipoToBackend(formData.tipo)}`,
        created_by: null, // Será preenchido pelo backend com o usuário autenticado
        observations: formData.observacoes,
        status: "pending" as 'pending',
        indicators: indicadores.map(indicador => ({
          name: indicador.nome,
          value: indicador.valor,
          unit: indicador.unidade,
          reference: indicador.referencia || null,
          description: null,
          observation: null
        }))
      }

      // Enviar para a API
      await avaliacoesService.criar(dadosAvaliacao)
      
      toast({
        title: "Avaliação criada",
        description: "A avaliação foi criada com sucesso",
      })
      
      router.push("/dashboard/desempenho")
    } catch (error) {
      console.error("Erro ao criar avaliação:", error)
      toast({
        title: "Erro ao criar avaliação",
        description: "Ocorreu um erro ao salvar a avaliação. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Carregando dados...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    )
  }

  // Obter modalidades únicas dos atletas
  const modalidades = Array.from(new Set(atletas.flatMap(atleta => atleta.modalities || [])))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/desempenho">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Nova Avaliação</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Informações da Avaliação</CardTitle>
              <CardDescription>Preencha os dados da avaliação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="atleta_id">Atleta</Label>
                  <Select 
                    value={formData.atleta_id} 
                    onValueChange={value => handleSelectChange("atleta_id", value)}
                    required
                  >
                    <SelectTrigger id="atleta_id">
                      <SelectValue placeholder="Selecione o atleta" />
                    </SelectTrigger>
                    <SelectContent>
                      {atletas.map((atleta) => (
                        <SelectItem key={atleta.id} value={atleta.id}>
                          {atleta.user?.name || "Atleta sem nome"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Avaliação</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={value => handleSelectChange("tipo", value)}
                    required
                  >
                    <SelectTrigger id="tipo">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fisica">Física</SelectItem>
                      <SelectItem value="tecnica">Técnica</SelectItem>
                      <SelectItem value="medica">Médica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data">Data da Avaliação</Label>
                  <Input 
                    type="date" 
                    id="data" 
                    name="data"
                    value={formData.data}
                    onChange={handleInputChange}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsavel">Responsável</Label>
                  <Input 
                    type="text" 
                    id="responsavel" 
                    name="responsavel"
                    value={formData.responsavel}
                    onChange={handleInputChange}
                    placeholder="Nome do responsável" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modalidade">Modalidade</Label>
                  <Select
                    value={formData.modalidade}
                    onValueChange={value => handleSelectChange("modalidade", value)}
                    required
                  >
                    <SelectTrigger id="modalidade">
                      <SelectValue placeholder="Selecione a modalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {modalidades.map((modalidade) => (
                        <SelectItem key={modalidade} value={modalidade}>
                          {modalidade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="local">Local</Label>
                  <Input 
                    type="text" 
                    id="local" 
                    name="local"
                    value={formData.local}
                    onChange={handleInputChange}
                    placeholder="Local da avaliação" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea 
                  id="observacoes" 
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  placeholder="Observações gerais sobre a avaliação" 
                  rows={3} 
                />
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
              <CardDescription>Opções adicionais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="protocolo">Protocolo de Avaliação</Label>
                <Select>
                  <SelectTrigger id="protocolo">
                    <SelectValue placeholder="Selecione o protocolo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="padrao">Protocolo Padrão CFO</SelectItem>
                    <SelectItem value="especifico">Protocolo Específico</SelectItem>
                    <SelectItem value="personalizado">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="checkbox" id="notificar" className="mr-2" />
                  <Label htmlFor="notificar">Notificar atleta</Label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="comparar" className="mr-2" />
                  <Label htmlFor="comparar">Comparar com avaliação anterior</Label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="relatorio" className="mr-2" />
                  <Label htmlFor="relatorio">Gerar relatório</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Indicadores</CardTitle>
                <CardDescription>Registre os indicadores medidos na avaliação</CardDescription>
              </div>
              <Button type="button" variant="outline" onClick={adicionarIndicador}>
                <Plus className="h-4 w-4 mr-2" /> Adicionar Indicador
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {indicadores.map((indicador, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-md">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`indicador-${index}-nome`}>Nome do Indicador</Label>
                      <Input
                        type="text"
                        id={`indicador-${index}-nome`}
                        value={indicador.nome}
                        onChange={(e) => atualizarIndicador(index, "nome", e.target.value)}
                        placeholder="Ex: Resistência, Força, Velocidade"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`indicador-${index}-valor`}>Valor</Label>
                      <Input
                        type="text"
                        id={`indicador-${index}-valor`}
                        value={indicador.valor}
                        onChange={(e) => atualizarIndicador(index, "valor", e.target.value)}
                        placeholder="Ex: 80"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`indicador-${index}-unidade`}>Unidade</Label>
                      <Select
                        value={indicador.unidade}
                        onValueChange={(value) => atualizarIndicador(index, "unidade", value)}
                      >
                        <SelectTrigger id={`indicador-${index}-unidade`}>
                          <SelectValue placeholder="Unidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="%">Porcentagem (%)</SelectItem>
                          <SelectItem value="s">Segundos (s)</SelectItem>
                          <SelectItem value="kg">Quilogramas (kg)</SelectItem>
                          <SelectItem value="cm">Centímetros (cm)</SelectItem>
                          <SelectItem value="m">Metros (m)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`indicador-${index}-referencia`}>Valor de Referência</Label>
                      <Input
                        type="text"
                        id={`indicador-${index}-referencia`}
                        value={indicador.referencia}
                        onChange={(e) => atualizarIndicador(index, "referencia", e.target.value)}
                        placeholder="Ex: 75"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removerIndicador(index)}
                        disabled={indicadores.length === 1}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.push("/dashboard/desempenho")}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-green-700 hover:bg-green-600"
                disabled={isSaving}
              >
                {isSaving ? "Salvando..." : "Salvar Avaliação"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}
