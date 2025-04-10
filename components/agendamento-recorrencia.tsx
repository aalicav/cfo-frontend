"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react"

interface AgendamentoRecorrenciaProps {
  agendamento: any
}

export function AgendamentoRecorrencia({ agendamento }: AgendamentoRecorrenciaProps) {
  const [expandido, setExpandido] = useState(false)

  // Se o agendamento não for recorrente, mostramos uma mensagem
  if (!agendamento.recorrente) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recorrência</CardTitle>
          <CardDescription>Informações sobre a recorrência deste agendamento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <p>Este agendamento não possui recorrência configurada.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Função para gerar datas de recorrência simuladas
  const gerarDatasRecorrencia = () => {
    const datasRecorrencia = []
    const dataInicial = new Date(agendamento.data)
    const dataFinal = agendamento.dataFimRecorrencia
      ? new Date(agendamento.dataFimRecorrencia)
      : new Date(dataInicial.getTime() + 60 * 24 * 60 * 60 * 1000) // 60 dias após a data inicial

    const dataAtual = new Date(dataInicial)

    // Incremento baseado no padrão de recorrência
    const incremento =
      agendamento.padraoRecorrencia === "semanal" ? 7 : agendamento.padraoRecorrencia === "quinzenal" ? 14 : 30 // mensal (aproximado)

    while (dataAtual <= dataFinal) {
      // Para padrões semanais e quinzenais, verificamos se o dia da semana está incluído
      const diaSemana = dataAtual.toLocaleDateString("pt-BR", { weekday: "long" })
      const diaIncluido = !agendamento.diasRecorrencia || agendamento.diasRecorrencia.includes(diaSemana)

      if (diaIncluido) {
        // Geramos status aleatórios para simulação
        const statusOptions = ["confirmado", "pendente", "rejeitado"]
        const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)]

        datasRecorrencia.push({
          data: new Date(dataAtual),
          status: randomStatus,
        })
      }

      dataAtual.setDate(dataAtual.getDate() + incremento)
    }

    return datasRecorrencia
  }

  const datasRecorrencia = gerarDatasRecorrencia()
  const datasParaExibir = expandido ? datasRecorrencia : datasRecorrencia.slice(0, 5)

  // Função para formatar data
  const formatarData = (data: Date) => {
    return data.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  // Função para obter ícone de status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmado":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pendente":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "rejeitado":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  // Função para obter cor de badge de status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "confirmado":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "pendente":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      case "rejeitado":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recorrência</CardTitle>
        <CardDescription>
          Este agendamento se repete{" "}
          {agendamento.padraoRecorrencia === "semanal"
            ? "semanalmente"
            : agendamento.padraoRecorrencia === "quinzenal"
              ? "quinzenalmente"
              : "mensalmente"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>
            Padrão:{" "}
            <span className="font-medium">
              {agendamento.padraoRecorrencia === "semanal"
                ? "Semanal"
                : agendamento.padraoRecorrencia === "quinzenal"
                  ? "Quinzenal"
                  : "Mensal"}
            </span>
          </span>
          {agendamento.diasRecorrencia && (
            <span className="text-muted-foreground">({agendamento.diasRecorrencia})</span>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Ocorrências</h3>
          <div className="space-y-2">
            {datasParaExibir.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  <span className="text-sm">{formatarData(item.data)}</span>
                </div>
                <Badge variant="outline" className={getStatusBadgeClass(item.status)}>
                  {item.status === "confirmado" && "Confirmado"}
                  {item.status === "pendente" && "Pendente"}
                  {item.status === "rejeitado" && "Rejeitado"}
                </Badge>
              </div>
            ))}
          </div>

          {datasRecorrencia.length > 5 && (
            <Button variant="outline" className="w-full mt-2" onClick={() => setExpandido(!expandido)}>
              {expandido ? "Mostrar Menos" : `Ver Mais ${datasRecorrencia.length - 5} Ocorrências`}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
