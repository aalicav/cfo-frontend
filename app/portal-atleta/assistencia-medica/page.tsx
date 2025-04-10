"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, User, FileText, Plus } from "lucide-react"
import { AtletaPortalLayout } from "@/components/atleta-portal-layout"

export default function PortalAtletaAssistenciaMedicaPage() {
  const [activeTab, setActiveTab] = useState<"historico" | "nova">("historico")

  return (
    <AtletaPortalLayout>
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/portal-atleta/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assistência Médica</h1>
            <p className="text-muted-foreground">Solicite atendimento médico e acompanhe seu histórico</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={activeTab === "historico" ? "default" : "outline"}
              onClick={() => setActiveTab("historico")}
              className={activeTab === "historico" ? "bg-green-700 hover:bg-green-600" : ""}
            >
              Histórico de Atendimentos
            </Button>
            <Button
              variant={activeTab === "nova" ? "default" : "outline"}
              onClick={() => setActiveTab("nova")}
              className={activeTab === "nova" ? "bg-green-700 hover:bg-green-600" : ""}
            >
              Nova Solicitação
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500">2 Atendimentos Realizados</Badge>
            <Badge className="bg-yellow-500">1 Solicitação Pendente</Badge>
          </div>
        </div>

        {activeTab === "historico" ? (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Solicitação Pendente</CardTitle>
                <CardDescription>Solicitação aguardando agendamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-md bg-yellow-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Dor no ombro direito</h4>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Solicitado em: 20/03/2025</span>
                      </div>
                    </div>
                    <Badge className="bg-yellow-500">Pendente</Badge>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm">
                      Estou sentindo dor no ombro direito durante os treinos de natação, principalmente nos movimentos
                      de rotação.
                    </p>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Tipo:</span> Fisioterapia
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Urgência:</span> Média
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Histórico de Atendimentos</CardTitle>
                <CardDescription>Atendimentos médicos realizados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Avaliação Fisioterápica</h4>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Data: 15/02/2025</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Horário: 14:30</span>
                      </div>
                    </div>
                    <Badge className="bg-green-500">Realizado</Badge>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center mt-1">
                      <User className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm">Profissional: Dra. Márcia Santos - Fisioterapeuta</span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium">Diagnóstico:</p>
                      <p className="text-sm">
                        Tensão muscular na região lombar. Recomendado exercícios específicos e alongamentos.
                      </p>
                    </div>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="text-green-700">
                        <FileText className="h-4 w-4 mr-1" /> Ver Relatório Completo
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Consulta Médica</h4>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Data: 10/01/2025</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Horário: 10:00</span>
                      </div>
                    </div>
                    <Badge className="bg-green-500">Realizado</Badge>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center mt-1">
                      <User className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm">Profissional: Dr. Roberto Mendes - Médico Esportivo</span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium">Diagnóstico:</p>
                      <p className="text-sm">
                        Avaliação de rotina. Atleta em boas condições de saúde. Liberado para atividades de alta
                        intensidade.
                      </p>
                    </div>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="text-green-700">
                        <FileText className="h-4 w-4 mr-1" /> Ver Relatório Completo
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Nova Solicitação de Atendimento</CardTitle>
              <CardDescription>Preencha o formulário para solicitar assistência médica</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Atendimento</Label>
                  <Select required>
                    <SelectTrigger id="tipo">
                      <SelectValue placeholder="Selecione o tipo de atendimento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medico">Consulta Médica</SelectItem>
                      <SelectItem value="fisioterapia">Fisioterapia</SelectItem>
                      <SelectItem value="nutricional">Avaliação Nutricional</SelectItem>
                      <SelectItem value="psicologico">Atendimento Psicológico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="urgencia">Nível de Urgência</Label>
                  <Select required>
                    <SelectTrigger id="urgencia">
                      <SelectValue placeholder="Selecione o nível de urgência" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa - Acompanhamento de rotina</SelectItem>
                      <SelectItem value="media">Média - Atenção necessária</SelectItem>
                      <SelectItem value="alta">Alta - Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="titulo">Título/Assunto</Label>
                  <Input id="titulo" placeholder="Ex: Dor no joelho, Avaliação nutricional, etc." required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descreva detalhadamente o motivo da solicitação, sintomas, quando começou, etc."
                    rows={5}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="disponibilidade">Disponibilidade para Atendimento</Label>
                  <Textarea
                    id="disponibilidade"
                    placeholder="Informe os dias e horários que você está disponível para o atendimento"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Anexar Documentos (opcional)</Label>
                  <div className="border rounded-md p-4 text-center">
                    <Button variant="outline" type="button" className="mx-auto">
                      <Plus className="h-4 w-4 mr-2" /> Adicionar Arquivo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Você pode anexar exames, laudos ou outros documentos relevantes (máx. 5MB)
                    </p>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => setActiveTab("historico")}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-700 hover:bg-green-600">
                Enviar Solicitação
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </AtletaPortalLayout>
  )
}
