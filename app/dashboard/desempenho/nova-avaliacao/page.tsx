"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { atletasMock } from "@/lib/atletas-mock"

export default function NovaAvaliacaoPage() {
  const router = useRouter()
  const [indicadores, setIndicadores] = useState([{ nome: "", valor: "", unidade: "%", referencia: "" }])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Em uma aplicação real, aqui seria feita a submissão para a API
    router.push("/dashboard/desempenho")
  }

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
                  <Label htmlFor="atleta">Atleta</Label>
                  <Select required>
                    <SelectTrigger id="atleta">
                      <SelectValue placeholder="Selecione o atleta" />
                    </SelectTrigger>
                    <SelectContent>
                      {atletasMock.map((atleta) => (
                        <SelectItem key={atleta.id} value={atleta.id}>
                          {atleta.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Avaliação</Label>
                  <Select required>
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
                  <Input type="date" id="data" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsavel">Responsável</Label>
                  <Input type="text" id="responsavel" placeholder="Nome do responsável" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modalidade">Modalidade</Label>
                  <Select required>
                    <SelectTrigger id="modalidade">
                      <SelectValue placeholder="Selecione a modalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="natacao">Natação</SelectItem>
                      <SelectItem value="atletismo">Atletismo</SelectItem>
                      <SelectItem value="ginastica">Ginástica</SelectItem>
                      <SelectItem value="judo">Judô</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="local">Local</Label>
                  <Input type="text" id="local" placeholder="Local da avaliação" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea id="observacoes" placeholder="Observações gerais sobre a avaliação" rows={3} />
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
                <Label htmlFor="categoria">Categoria</Label>
                <Select>
                  <SelectTrigger id="categoria">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sub15">Sub-15</SelectItem>
                    <SelectItem value="sub17">Sub-17</SelectItem>
                    <SelectItem value="sub20">Sub-20</SelectItem>
                    <SelectItem value="adulto">Adulto</SelectItem>
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
              <Button type="submit" className="bg-green-700 hover:bg-green-600">
                Salvar Avaliação
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}
