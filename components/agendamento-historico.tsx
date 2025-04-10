"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, XCircle, AlertCircle, User, Calendar, Edit } from "lucide-react"

interface AgendamentoHistoricoProps {
  agendamentoId: string
}

export function AgendamentoHistorico({ agendamentoId }: AgendamentoHistoricoProps) {
  // Dados simulados para o histórico de ações
  const historicoAcoes = [
    {
      id: "hist-001",
      agendamentoId: agendamentoId,
      acao: "criacao",
      descricao: "Agendamento criado",
      usuario: "Maria Silva",
      cargo: "Coordenadora",
      data: "2025-06-01T10:30:00",
    },
    {
      id: "hist-002",
      agendamentoId: agendamentoId,
      acao: "atualizacao",
      descricao: "Horário atualizado de 14:00-16:00 para 14:00-17:00",
      usuario: "João Pereira",
      cargo: "Administrador",
      data: "2025-06-02T09:15:00",
    },
    {
      id: "hist-003",
      agendamentoId: agendamentoId,
      acao: "aprovacao",
      descricao: "Agendamento aprovado",
      usuario: "Carlos Mendes",
      cargo: "Gerente",
      data: "2025-06-03T14:20:00",
    },
    {
      id: "hist-004",
      agendamentoId: agendamentoId,
      acao: "notificacao",
      descricao: "Notificação enviada para o responsável",
      usuario: "Sistema",
      cargo: "Automático",
      data: "2025-06-03T14:21:00",
    },
    {
      id: "hist-005",
      agendamentoId: agendamentoId,
      acao: "conflito",
      descricao: "Conflito detectado com outro agendamento",
      usuario: "Sistema",
      cargo: "Automático",
      data: "2025-06-04T08:00:00",
    },
    {
      id: "hist-006",
      agendamentoId: agendamentoId,
      acao: "resolucao",
      descricao: "Conflito resolvido - outro agendamento foi realocado",
      usuario: "Ana Oliveira",
      cargo: "Coordenadora",
      data: "2025-06-04T10:30:00",
    },
  ]

  // Ordenar histórico por data (mais recente primeiro)
  const historicoOrdenado = [...historicoAcoes].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())

  // Função para formatar data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return (
      data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }) +
      " " +
      data.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    )
  }

  // Função para obter ícone da ação
  const getAcaoIcon = (acao: string) => {
    switch (acao) {
      case "criacao":
        return <Calendar className="h-4 w-4 text-blue-500" />
      case "atualizacao":
        return <Edit className="h-4 w-4 text-amber-500" />
      case "aprovacao":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejeicao":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "notificacao":
        return <Clock className="h-4 w-4 text-purple-500" />
      case "conflito":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "resolucao":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <User className="h-4 w-4 text-gray-500" />
    }
  }

  // Função para obter cor de badge da ação
  const getAcaoBadgeClass = (acao: string) => {
    switch (acao) {
      case "criacao":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "atualizacao":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      case "aprovacao":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "rejeicao":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "notificacao":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      case "conflito":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case "resolucao":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Ações</CardTitle>
        <CardDescription>Registro de todas as ações realizadas neste agendamento</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {historicoOrdenado.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <p>Nenhuma ação registrada para este agendamento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {historicoOrdenado.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                <div className="mt-1">{getAcaoIcon(item.acao)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getAcaoBadgeClass(item.acao)}>
                        {item.acao === "criacao" && "Criação"}
                        {item.acao === "atualizacao" && "Atualização"}
                        {item.acao === "aprovacao" && "Aprovação"}
                        {item.acao === "rejeicao" && "Rejeição"}
                        {item.acao === "notificacao" && "Notificação"}
                        {item.acao === "conflito" && "Conflito"}
                        {item.acao === "resolucao" && "Resolução"}
                      </Badge>
                      <span className="text-sm font-medium">{item.usuario}</span>
                      <span className="text-xs text-muted-foreground">({item.cargo})</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatarData(item.data)}</span>
                  </div>
                  <p className="text-sm">{item.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
