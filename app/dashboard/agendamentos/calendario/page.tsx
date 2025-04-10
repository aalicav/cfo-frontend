"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ChevronLeft, ChevronRight, Download, Plus } from "lucide-react"
import { agendamentosMock } from "@/lib/agendamentos-mock"
import { espacosMock } from "@/lib/espacos-mock"
import { projetosMock } from "@/lib/projetos-mock"
import { cn } from "@/lib/utils"

export default function CalendarioAgendamentosPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"dia" | "semana" | "mes">("semana")
  const [espacoSelecionado, setEspacoSelecionado] = useState<string>("todos")
  const [projetoSelecionado, setProjetoSelecionado] = useState<string>("todos")
  const [tipoSelecionado, setTipoSelecionado] = useState<string>("todos")

  // Função para avançar ou retroceder no calendário
  const navegarCalendario = (direcao: "anterior" | "proximo") => {
    const novaData = new Date(currentDate)

    if (view === "dia") {
      novaData.setDate(novaData.getDate() + (direcao === "proximo" ? 1 : -1))
    } else if (view === "semana") {
      novaData.setDate(novaData.getDate() + (direcao === "proximo" ? 7 : -7))
    } else {
      novaData.setMonth(novaData.getMonth() + (direcao === "proximo" ? 1 : -1))
    }

    setCurrentDate(novaData)
  }

  // Função para formatar a data de exibição
  const formatarPeriodoExibicao = () => {
    const options: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" }

    if (view === "dia") {
      return currentDate.toLocaleDateString("pt-BR", { ...options, day: "numeric" })
    } else if (view === "semana") {
      const inicioSemana = new Date(currentDate)
      inicioSemana.setDate(currentDate.getDate() - currentDate.getDay())

      const fimSemana = new Date(inicioSemana)
      fimSemana.setDate(inicioSemana.getDate() + 6)

      const mesInicioSemana = inicioSemana.toLocaleDateString("pt-BR", { month: "long" })
      const mesFimSemana = fimSemana.toLocaleDateString("pt-BR", { month: "long" })

      return `${inicioSemana.getDate()} de ${mesInicioSemana} - ${fimSemana.getDate()} de ${mesFimSemana} de ${fimSemana.getFullYear()}`
    } else {
      return currentDate.toLocaleDateString("pt-BR", options)
    }
  }

  // Função para gerar os dias da semana
  const gerarDiasSemana = () => {
    const diasSemana = []
    const inicioSemana = new Date(currentDate)
    inicioSemana.setDate(currentDate.getDate() - currentDate.getDay())

    for (let i = 0; i < 7; i++) {
      const dia = new Date(inicioSemana)
      dia.setDate(inicioSemana.getDate() + i)
      diasSemana.push(dia)
    }

    return diasSemana
  }

  // Função para verificar se há agendamentos para um espaço em um horário específico
  const verificarAgendamento = (data: Date, hora: number) => {
    // Filtrando agendamentos pela data, hora e filtros selecionados
    return agendamentosMock.find((agendamento) => {
      const dataAgendamento = new Date(agendamento.data)
      const matchesEspaco = espacoSelecionado === "todos" || agendamento.espacoId === espacoSelecionado
      const matchesProjeto = projetoSelecionado === "todos" || agendamento.projetoId === projetoSelecionado
      const matchesTipo = tipoSelecionado === "todos" || agendamento.tipo === tipoSelecionado

      return (
        matchesEspaco &&
        matchesProjeto &&
        matchesTipo &&
        dataAgendamento.getDate() === data.getDate() &&
        dataAgendamento.getMonth() === data.getMonth() &&
        dataAgendamento.getFullYear() === data.getFullYear() &&
        agendamento.horaInicio <= hora &&
        agendamento.horaFim > hora
      )
    })
  }

  // Função para obter a cor do agendamento com base no tipo
  const getAgendamentoColor = (agendamento: any) => {
    if (!agendamento) return ""

    if (agendamento.status === "confirmado") {
      return agendamento.tipo === "interno" ? "bg-green-700 text-white" : "bg-purple-700 text-white"
    } else if (agendamento.status === "pendente") {
      return "bg-amber-500 text-white"
    } else if (agendamento.status === "rejeitado") {
      return "bg-red-500 text-white"
    } else if (agendamento.status === "conflito") {
      return "bg-orange-500 text-white"
    }

    return "bg-gray-500 text-white"
  }

  // Horários de funcionamento (8h às 22h)
  const horarios = Array.from({ length: 14 }, (_, i) => i + 8)

  // Filtrar espaços com base na seleção
  const espacosFiltrados =
    espacoSelecionado === "todos" ? espacosMock : espacosMock.filter((espaco) => espaco.id === espacoSelecionado)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/agendamentos">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Calendário de Agendamentos</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Link href="/dashboard/agendamentos/novo">
            <Button className="bg-green-700 hover:bg-green-600">
              <Plus className="mr-2 h-4 w-4" />
              Novo Agendamento
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Agenda de Utilização</CardTitle>
              <CardDescription>Visualize todos os agendamentos</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={espacoSelecionado} onValueChange={setEspacoSelecionado}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Selecione um espaço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os espaços</SelectItem>
                  {espacosMock.map((espaco) => (
                    <SelectItem key={espaco.id} value={espaco.id}>
                      {espaco.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={projetoSelecionado} onValueChange={setProjetoSelecionado}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Selecione um projeto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os projetos</SelectItem>
                  {projetosMock.map((projeto) => (
                    <SelectItem key={projeto.id} value={projeto.id}>
                      {projeto.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={tipoSelecionado} onValueChange={setTipoSelecionado}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="interno">Interno</SelectItem>
                  <SelectItem value="externo">Externo</SelectItem>
                </SelectContent>
              </Select>

              <Select value={view} onValueChange={(v: "dia" | "semana" | "mes") => setView(v)}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Visualização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dia">Diária</SelectItem>
                  <SelectItem value="semana">Semanal</SelectItem>
                  <SelectItem value="mes">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <Button variant="outline" size="icon" onClick={() => navegarCalendario("anterior")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-medium">{formatarPeriodoExibicao()}</h3>
            <Button variant="outline" size="icon" onClick={() => navegarCalendario("proximo")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {view === "semana" && (
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-8 gap-1">
                  {/* Cabeçalho com horários */}
                  <div className="sticky left-0 bg-white z-10 border-r">
                    <div className="h-12"></div>
                    {horarios.map((hora) => (
                      <div key={hora} className="h-16 flex items-center justify-center border-t">
                        <span className="text-sm font-medium">{hora}:00</span>
                      </div>
                    ))}
                  </div>

                  {/* Dias da semana */}
                  {gerarDiasSemana().map((dia, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="h-12 flex items-center justify-center font-medium border-b">
                        <div className="text-center">
                          <div className="text-sm">{dia.toLocaleDateString("pt-BR", { weekday: "short" })}</div>
                          <div
                            className={cn(
                              "text-sm rounded-full w-8 h-8 flex items-center justify-center mx-auto",
                              new Date().toDateString() === dia.toDateString() ? "bg-green-700 text-white" : "",
                            )}
                          >
                            {dia.getDate()}
                          </div>
                        </div>
                      </div>

                      {/* Células de horário para cada espaço */}
                      {espacosFiltrados.map((espaco) => (
                        <div key={`${espaco.id}-${index}`} className="flex flex-col">
                          {horarios.map((hora) => {
                            const agendamento = verificarAgendamento(dia, hora)
                            return (
                              <div
                                key={`${espaco.id}-${index}-${hora}`}
                                className={cn(
                                  "h-16 border-t p-1",
                                  agendamento ? "bg-green-50" : "hover:bg-gray-50 cursor-pointer",
                                )}
                                title={
                                  agendamento
                                    ? `${agendamento.titulo} - ${agendamento.responsavel}`
                                    : `Disponível - ${espaco.nome}`
                                }
                              >
                                {agendamento && (
                                  <Link href={`/dashboard/agendamentos/${agendamento.id}`}>
                                    <div
                                      className={cn(
                                        "rounded p-1 text-xs h-full overflow-hidden",
                                        getAgendamentoColor(agendamento),
                                      )}
                                    >
                                      <div className="font-medium">{agendamento.titulo}</div>
                                      <div>{agendamento.responsavel}</div>
                                      <div className="text-xs opacity-80">{espaco.nome}</div>
                                    </div>
                                  </Link>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === "dia" && (
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-[100px_1fr] gap-4">
                  {/* Coluna de horários */}
                  <div className="space-y-4">
                    <div className="h-12"></div>
                    {horarios.map((hora) => (
                      <div key={hora} className="h-16 flex items-center">
                        <span className="text-sm font-medium">{hora}:00</span>
                      </div>
                    ))}
                  </div>

                  {/* Coluna de agendamentos */}
                  <div className="space-y-4">
                    <div className="h-12 flex items-center justify-center font-medium">
                      <div className="text-center">
                        <div className="text-sm">{currentDate.toLocaleDateString("pt-BR", { weekday: "long" })}</div>
                        <div
                          className={cn(
                            "text-sm rounded-full w-8 h-8 flex items-center justify-center mx-auto",
                            new Date().toDateString() === currentDate.toDateString() ? "bg-green-700 text-white" : "",
                          )}
                        >
                          {currentDate.getDate()}
                        </div>
                      </div>
                    </div>

                    {horarios.map((hora) => (
                      <div key={hora} className="grid grid-cols-1 gap-2">
                        {espacosFiltrados.map((espaco) => {
                          const agendamento = verificarAgendamento(currentDate, hora)
                          return (
                            <div
                              key={`${espaco.id}-${hora}`}
                              className={cn(
                                "h-16 border rounded-md p-2",
                                agendamento ? "bg-green-50 border-green-200" : "hover:bg-gray-50 cursor-pointer",
                              )}
                              title={
                                agendamento
                                  ? `${agendamento.titulo} - ${agendamento.responsavel}`
                                  : `Disponível - ${espaco.nome}`
                              }
                            >
                              {!agendamento && <div className="text-xs text-muted-foreground">{espaco.nome}</div>}
                              {agendamento && (
                                <Link href={`/dashboard/agendamentos/${agendamento.id}`} className="block h-full">
                                  <div className="h-full flex flex-col">
                                    <div className="text-xs font-medium">{espaco.nome}</div>
                                    <div
                                      className={cn(
                                        "text-sm font-medium px-2 py-1 rounded mt-1",
                                        getAgendamentoColor(agendamento),
                                      )}
                                    >
                                      {agendamento.titulo}
                                    </div>
                                    <div className="text-xs mt-1">{agendamento.responsavel}</div>
                                  </div>
                                </Link>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === "mes" && (
            <div className="text-center p-12">
              <h3 className="text-lg font-medium">Visualização Mensal</h3>
              <p className="text-muted-foreground mt-2">A visualização mensal está em desenvolvimento.</p>
              <Button className="mt-4 bg-green-700 hover:bg-green-600" onClick={() => setView("semana")}>
                Voltar para Visualização Semanal
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Legenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded mr-2 bg-green-700"></div>
              <span className="text-sm">Agendamento Interno</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded mr-2 bg-purple-700"></div>
              <span className="text-sm">Agendamento Externo</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded mr-2 bg-amber-500"></div>
              <span className="text-sm">Pendente</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded mr-2 bg-orange-500"></div>
              <span className="text-sm">Conflito</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded mr-2 bg-red-500"></div>
              <span className="text-sm">Rejeitado</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded mr-2 bg-white border"></div>
              <span className="text-sm">Disponível</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
