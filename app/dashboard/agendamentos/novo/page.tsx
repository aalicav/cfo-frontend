"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Info } from "lucide-react"
import { espacosMock } from "@/lib/espacos-mock"
import { projetosMock } from "@/lib/projetos-mock"

export default function NovoAgendamentoPage() {
  const router = useRouter()
  const [tipoAgendamento, setTipoAgendamento] = useState<"interno" | "externo">("interno")
  const [recorrente, setRecorrente] = useState(false)
  const [padraoRecorrencia, setPadraoRecorrencia] = useState<"semanal" | "quinzenal" | "mensal">("semanal")
  const [diasSemana, setDiasSemana] = useState<string[]>([])

  // Função para lidar com a seleção de dias da semana
  const handleDiaSemanaChange = (dia: string) => {
    setDiasSemana((prev) => (prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]))
  }

  // Função para simular o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui seria implementada a lógica real de criação do agendamento
    // Por enquanto, apenas redirecionamos para a lista de agendamentos
    router.push("/dashboard/agendamentos")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/agendamentos">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Novo Agendamento</h1>
        </div>
      </div>

      <Tabs
        defaultValue="interno"
        className="space-y-4"
        onValueChange={(value) => setTipoAgendamento(value as "interno" | "externo")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="interno">Agendamento Interno</TabsTrigger>
          <TabsTrigger value="externo">Agendamento Externo</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <TabsContent value="interno" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Agendamento Interno</CardTitle>
                  <CardDescription>Crie um agendamento para uso interno dos espaços do CFO</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="titulo">Título do Agendamento</Label>
                      <Input id="titulo" placeholder="Ex: Treino de Basquete Juvenil" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="responsavel">Responsável</Label>
                      <Input id="responsavel" placeholder="Nome do responsável" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contato">Contato</Label>
                      <Input id="contato" placeholder="Telefone ou e-mail" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="setor">Setor</Label>
                      <Select>
                        <SelectTrigger id="setor">
                          <SelectValue placeholder="Selecione o setor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="coordenacao">Coordenação Técnica</SelectItem>
                          <SelectItem value="administrativo">Administrativo</SelectItem>
                          <SelectItem value="treinamento">Treinamento</SelectItem>
                          <SelectItem value="fisioterapia">Fisioterapia</SelectItem>
                          <SelectItem value="nutricao">Nutrição</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="projeto">Projeto Vinculado</Label>
                      <Select>
                        <SelectTrigger id="projeto">
                          <SelectValue placeholder="Selecione um projeto (opcional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nenhum">Nenhum</SelectItem>
                          {projetosMock.map((projeto) => (
                            <SelectItem key={projeto.id} value={projeto.id}>
                              {projeto.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="externo" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Agendamento Externo</CardTitle>
                  <CardDescription>Solicite um agendamento para uso de espaços por parceiros externos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="titulo-externo">Título do Evento</Label>
                      <Input id="titulo-externo" placeholder="Ex: Campeonato Estadual de Natação" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instituicao">Instituição</Label>
                      <Input id="instituicao" placeholder="Nome da instituição solicitante" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="responsavel-externo">Responsável</Label>
                      <Input id="responsavel-externo" placeholder="Nome do responsável" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contato-externo">Contato</Label>
                      <Input id="contato-externo" placeholder="Telefone ou e-mail" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="documento">Documento</Label>
                      <Input id="documento" type="file" className="cursor-pointer" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipo-evento">Tipo de Evento</Label>
                      <Select>
                        <SelectTrigger id="tipo-evento">
                          <SelectValue placeholder="Selecione o tipo de evento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="competicao">Competição</SelectItem>
                          <SelectItem value="treinamento">Treinamento</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="evento">Evento Social</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Agendamento</CardTitle>
                <CardDescription>Informe os detalhes do espaço e horário desejados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="espaco">Espaço</Label>
                    <Select required>
                      <SelectTrigger id="espaco">
                        <SelectValue placeholder="Selecione o espaço" />
                      </SelectTrigger>
                      <SelectContent>
                        {espacosMock.map((espaco) => (
                          <SelectItem key={espaco.id} value={espaco.id}>
                            {espaco.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="data">Data</Label>
                    <Input id="data" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hora-inicio">Hora de Início</Label>
                    <Select required>
                      <SelectTrigger id="hora-inicio">
                        <SelectValue placeholder="Selecione a hora" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 14 }, (_, i) => i + 8).map((hora) => (
                          <SelectItem key={hora} value={hora.toString()}>
                            {hora}:00
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hora-fim">Hora de Término</Label>
                    <Select required>
                      <SelectTrigger id="hora-fim">
                        <SelectValue placeholder="Selecione a hora" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 14 }, (_, i) => i + 8).map((hora) => (
                          <SelectItem key={hora} value={hora.toString()}>
                            {hora}:00
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea id="descricao" placeholder="Descreva o objetivo e detalhes do agendamento" rows={3} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="recorrente"
                      checked={recorrente}
                      onCheckedChange={(checked) => setRecorrente(checked === true)}
                    />
                    <Label htmlFor="recorrente" className="font-normal cursor-pointer">
                      Agendamento recorrente
                    </Label>
                  </div>
                </div>

                {recorrente && (
                  <div className="space-y-4 p-4 border rounded-md bg-muted/50">
                    <div className="space-y-2">
                      <Label>Padrão de Recorrência</Label>
                      <RadioGroup
                        value={padraoRecorrencia}
                        onValueChange={(value) => setPadraoRecorrencia(value as "semanal" | "quinzenal" | "mensal")}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="semanal" id="semanal" />
                          <Label htmlFor="semanal" className="font-normal cursor-pointer">
                            Semanal
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="quinzenal" id="quinzenal" />
                          <Label htmlFor="quinzenal" className="font-normal cursor-pointer">
                            Quinzenal
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mensal" id="mensal" />
                          <Label htmlFor="mensal" className="font-normal cursor-pointer">
                            Mensal
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {(padraoRecorrencia === "semanal" || padraoRecorrencia === "quinzenal") && (
                      <div className="space-y-2">
                        <Label>Dias da Semana</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map((dia) => (
                            <div key={dia} className="flex items-center space-x-2">
                              <Checkbox
                                id={`dia-${dia}`}
                                checked={diasSemana.includes(dia)}
                                onCheckedChange={() => handleDiaSemanaChange(dia)}
                              />
                              <Label htmlFor={`dia-${dia}`} className="font-normal cursor-pointer">
                                {dia}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="data-fim">Data de Término</Label>
                      <Input id="data-fim" type="date" />
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <Info className="h-4 w-4 mr-2" />
                      <span>Agendamentos recorrentes estão sujeitos à disponibilidade e aprovação para cada data.</span>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/dashboard/agendamentos">Cancelar</Link>
                </Button>
                <Button type="submit" className="bg-green-700 hover:bg-green-600">
                  Solicitar Agendamento
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </Tabs>
    </div>
  )
}
