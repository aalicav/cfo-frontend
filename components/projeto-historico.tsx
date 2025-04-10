"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, FileText, User, CheckCircle2, Settings, AlertCircle } from "lucide-react"

interface ProjetoHistoricoProps {
  projetoId: string
}

export function ProjetoHistorico({ projetoId }: ProjetoHistoricoProps) {
  const [eventos, setEventos] = useState([
    {
      id: 1,
      tipo: "criacao",
      titulo: "Projeto criado",
      descricao: "O projeto foi criado no sistema.",
      data: "01/01/2025",
      hora: "09:15",
      usuario: "Carlos Mendes",
    },
    {
      id: 2,
      tipo: "documento",
      titulo: "Documento adicionado",
      descricao: "O documento 'Plano_do_Projeto.pdf' foi adicionado.",
      data: "01/01/2025",
      hora: "10:30",
      usuario: "Carlos Mendes",
    },
    {
      id: 3,
      tipo: "documento",
      titulo: "Documento adicionado",
      descricao: "O documento 'Cronograma.xlsx' foi adicionado.",
      data: "05/01/2025",
      hora: "14:20",
      usuario: "Carlos Mendes",
    },
    {
      id: 4,
      tipo: "status",
      titulo: "Status alterado",
      descricao: "O status do projeto foi alterado de 'Planejado' para 'Em andamento'.",
      data: "15/01/2025",
      hora: "08:45",
      usuario: "Carlos Mendes",
    },
    {
      id: 5,
      tipo: "meta",
      titulo: "Meta concluída",
      descricao: "A meta 'Inscrever 50 participantes' foi marcada como concluída.",
      data: "15/02/2025",
      hora: "16:30",
      usuario: "Ana Silva",
    },
    {
      id: 6,
      tipo: "documento",
      titulo: "Documento adicionado",
      descricao: "O documento 'Lista_Participantes.xlsx' foi adicionado.",
      data: "15/02/2025",
      hora: "16:45",
      usuario: "Ana Silva",
    },
    {
      id: 7,
      tipo: "meta",
      titulo: "Meta concluída",
      descricao: "A meta 'Realizar avaliação inicial' foi marcada como concluída.",
      data: "30/03/2025",
      hora: "11:20",
      usuario: "Pedro Santos",
    },
    {
      id: 8,
      tipo: "documento",
      titulo: "Documento adicionado",
      descricao: "O documento 'Relatorio_Trimestral_1.pdf' foi adicionado.",
      data: "30/03/2025",
      hora: "15:10",
      usuario: "Carlos Mendes",
    },
    {
      id: 9,
      tipo: "alerta",
      titulo: "Alerta de cronograma",
      descricao: "O prazo para a meta 'Completar primeiro ciclo de treinamento' está próximo.",
      data: "15/05/2025",
      hora: "09:00",
      usuario: "Sistema",
    },
    {
      id: 10,
      tipo: "documento",
      titulo: "Documento adicionado",
      descricao: "O documento 'Fotos_Atividades.zip' foi adicionado.",
      data: "15/04/2025",
      hora: "14:30",
      usuario: "Pedro Santos",
    },
  ])

  const [filtroTipo, setFiltroTipo] = useState<string | null>(null)

  const eventosFiltrados = filtroTipo ? eventos.filter((evento) => evento.tipo === filtroTipo) : eventos

  const getIconByTipo = (tipo: string) => {
    switch (tipo) {
      case "criacao":
        return <Settings className="h-4 w-4" />
      case "documento":
        return <FileText className="h-4 w-4" />
      case "status":
        return <Clock className="h-4 w-4" />
      case "meta":
        ;/>
      case "status":
        return <Clock className="h-4 w-4" />
      case "meta":
        return <CheckCircle2 className="h-4 w-4" />
      case "alerta":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">Histórico de Ações</h3>
          <p className="text-sm text-muted-foreground">Registro de atividades e alterações no projeto</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filtroTipo === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltroTipo(null)}
            className={filtroTipo === null ? "bg-green-700 hover:bg-green-600" : ""}
          >
            Todos
          </Button>
          <Button
            variant={filtroTipo === "documento" ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltroTipo("documento")}
            className={filtroTipo === "documento" ? "bg-green-700 hover:bg-green-600" : ""}
          >
            Documentos
          </Button>
          <Button
            variant={filtroTipo === "meta" ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltroTipo("meta")}
            className={filtroTipo === "meta" ? "bg-green-700 hover:bg-green-600" : ""}
          >
            Metas
          </Button>
          <Button
            variant={filtroTipo === "status" ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltroTipo("status")}
            className={filtroTipo === "status" ? "bg-green-700 hover:bg-green-600" : ""}
          >
            Status
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="relative border-l-2 border-gray-200 pl-6 ml-3 space-y-6">
            {eventosFiltrados.map((evento, index) => (
              <div key={evento.id} className="relative">
                <div className="absolute -left-[31px] mt-1.5 h-4 w-4 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      evento.tipo === "alerta"
                        ? "bg-orange-500"
                        : evento.tipo === "meta"
                          ? "bg-green-500"
                          : "bg-blue-500"
                    }`}
                  />
                </div>
                <div className="mb-1 flex items-center">
                  <Badge variant="outline" className="mr-2">
                    {evento.data} - {evento.hora}
                  </Badge>
                  <Badge
                    className={`${
                      evento.tipo === "documento"
                        ? "bg-blue-500"
                        : evento.tipo === "meta"
                          ? "bg-green-500"
                          : evento.tipo === "status"
                            ? "bg-purple-500"
                            : evento.tipo === "alerta"
                              ? "bg-orange-500"
                              : "bg-gray-500"
                    }`}
                  >
                    <div className="flex items-center">
                      {getIconByTipo(evento.tipo)}
                      <span className="ml-1">
                        {evento.tipo === "documento"
                          ? "Documento"
                          : evento.tipo === "meta"
                            ? "Meta"
                            : evento.tipo === "status"
                              ? "Status"
                              : evento.tipo === "criacao"
                                ? "Criação"
                                : evento.tipo === "alerta"
                                  ? "Alerta"
                                  : evento.tipo}
                      </span>
                    </div>
                  </Badge>
                </div>
                <h4 className="font-medium">{evento.titulo}</h4>
                <p className="text-sm text-muted-foreground">{evento.descricao}</p>
                <p className="text-xs text-muted-foreground mt-1">Por: {evento.usuario}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
