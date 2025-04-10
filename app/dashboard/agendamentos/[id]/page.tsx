"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Edit,
  Trash,
  XCircle,
  AlertCircle,
  MessageSquare,
} from "lucide-react"
import { agendamentosMock } from "@/lib/agendamentos-mock"
import { espacosMock } from "@/lib/espacos-mock"
import { projetosMock } from "@/lib/projetos-mock"
import { cn } from "@/lib/utils"
import { AgendamentoRecorrencia } from "@/components/agendamento-recorrencia"
import { AgendamentoHistorico } from "@/components/agendamento-historico"

export default function AgendamentoDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const [motivoRejeicao, setMotivoRejeicao] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogAction, setDialogAction] = useState<"aprovar" | "rejeitar" | "cancelar" | "excluir">("aprovar")

  // Encontrar o agendamento pelo ID
  const agendamento = agendamentosMock.find((a) => a.id === params.id)

  if (!agendamento) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold">Agendamento não encontrado</h2>
        <p className="text-muted-foreground mb-4">O agendamento solicitado não existe ou foi removido.</p>
        <Button asChild>
          <Link href="/dashboard/agendamentos">Voltar para Agendamentos</Link>
        </Button>
      </div>
    )
  }

  // Encontrar o espaço relacionado
  const espaco = espacosMock.find((e) => e.id === agendamento.espacoId)

  // Encontrar o projeto relacionado, se houver
  const projeto = agendamento.projetoId ? projetosMock.find((p) => p.id === agendamento.projetoId) : null

  // Formatar data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return data.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
  }

  // Formatar hora
  const formatarHora = (hora: number) => {
    return `${hora}:00`
  }

  // Obter ícone de status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmado":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "pendente":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "rejeitado":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "conflito":
        return <AlertCircle className="h-5 w-5 text-orange-500" />
      default:
        return null
    }
  }

  // Obter cor de badge de status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "confirmado":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "pendente":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      case "rejeitado":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "conflito":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      default:
        return ""
    }
  }

  // Abrir diálogo de ação
  const handleOpenDialog = (action: "aprovar" | "rejeitar" | "cancelar" | "excluir") => {
    setDialogAction(action)
    setDialogOpen(true)
  }

  // Executar ação de agendamento
  const handleExecuteAction = () => {
    // Aqui seria implementada a lógica real de aprovação, rejeição, etc.
    // Por enquanto, apenas fechamos o diálogo e redirecionamos
    setDialogOpen(false)

    if (dialogAction === "excluir") {
      router.push("/dashboard/agendamentos")
    }
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
          <h1 className="text-3xl font-bold tracking-tight">{agendamento.titulo}</h1>
        </div>
        <div className="flex gap-2">
          {agendamento.status === "pendente" && (
            <>
              <Button
                variant="outline"
                className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900"
                onClick={() => handleOpenDialog("aprovar")}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Aprovar
              </Button>
              <Button
                variant="outline"
                className="bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900"
                onClick={() => handleOpenDialog("rejeitar")}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Rejeitar
              </Button>
            </>
          )}
          {agendamento.status === "confirmado" && (
            <Button
              variant="outline"
              className="bg-amber-100 text-amber-800 hover:bg-amber-200 hover:text-amber-900"
              onClick={() => handleOpenDialog("cancelar")}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          )}
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="outline"
            className="text-red-600 hover:text-red-700"
            onClick={() => handleOpenDialog("excluir")}
          >
            <Trash className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Agendamento</CardTitle>
              <CardDescription>Informações completas sobre o agendamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(agendamento.status)}
                  <Badge variant="outline" className={getStatusBadgeClass(agendamento.status)}>
                    {agendamento.status === "confirmado" && "Confirmado"}
                    {agendamento.status === "pendente" && "Pendente"}
                    {agendamento.status === "rejeitado" && "Rejeitado"}
                    {agendamento.status === "conflito" && "Conflito"}
                  </Badge>
                </div>
                <Badge
                  variant="outline"
                  className={
                    agendamento.tipo === "interno" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                  }
                >
                  {agendamento.tipo === "interno" ? "Agendamento Interno" : "Agendamento Externo"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Responsável</h3>
                  <p className="text-base">{agendamento.responsavel}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Contato</h3>
                  <p className="text-base">{agendamento.contato || "Não informado"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Data</h3>
                  <p className="text-base">{formatarData(agendamento.data)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Horário</h3>
                  <p className="text-base">
                    {formatarHora(agendamento.horaInicio)} - {formatarHora(agendamento.horaFim)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Espaço</h3>
                  <p className="text-base">{espaco?.nome || "Não encontrado"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Projeto Vinculado</h3>
                  <p className="text-base">{projeto?.nome || "Não vinculado a projeto"}</p>
                </div>
                {agendamento.recorrente && (
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Recorrência</h3>
                    <p className="text-base">
                      {agendamento.padraoRecorrencia === "semanal" && "Semanal"}
                      {agendamento.padraoRecorrencia === "quinzenal" && "Quinzenal"}
                      {agendamento.padraoRecorrencia === "mensal" && "Mensal"}
                      {agendamento.diasRecorrencia && ` (${agendamento.diasRecorrencia})`}
                    </p>
                  </div>
                )}
                {agendamento.status === "rejeitado" && agendamento.motivoRejeicao && (
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Motivo da Rejeição</h3>
                    <p className="text-base text-red-600">{agendamento.motivoRejeicao}</p>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Descrição</h3>
                <p className="text-base">{agendamento.descricao || "Nenhuma descrição fornecida."}</p>
              </div>

              {agendamento.observacoes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Observações</h3>
                  <p className="text-base">{agendamento.observacoes}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href={`/dashboard/espacos/${agendamento.espacoId}`}>Ver Detalhes do Espaço</Link>
              </Button>
              {agendamento.projetoId && (
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/projetos/${agendamento.projetoId}`}>Ver Projeto Vinculado</Link>
                </Button>
              )}
            </CardFooter>
          </Card>

          <Tabs defaultValue="recorrencia" className="space-y-4">
            <TabsList>
              <TabsTrigger value="recorrencia">Recorrência</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
            </TabsList>
            <TabsContent value="recorrencia" className="space-y-4">
              <AgendamentoRecorrencia agendamento={agendamento} />
            </TabsContent>
            <TabsContent value="historico" className="space-y-4">
              <AgendamentoHistorico agendamentoId={agendamento.id} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Exportar para Calendário
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Enviar Mensagem
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações do Espaço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {espaco ? (
                <>
                  <div className="aspect-video bg-muted rounded-md overflow-hidden">
                    <img
                      src={espaco.imagens?.[0] || "/placeholder.svg?height=200&width=400"}
                      alt={espaco.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-lg">{espaco.nome}</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Capacidade:</span>
                      <span className="text-sm ml-2">{espaco.capacidade} pessoas</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Tipo:</span>
                      <span className="text-sm ml-2">{espaco.tipo}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Localização:</span>
                      <span className="text-sm ml-2">{espaco.localizacao}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/dashboard/espacos/${espaco.id}`}>Ver Detalhes Completos</Link>
                  </Button>
                </>
              ) : (
                <p className="text-muted-foreground">Informações do espaço não disponíveis.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === "aprovar" && "Aprovar Agendamento"}
              {dialogAction === "rejeitar" && "Rejeitar Agendamento"}
              {dialogAction === "cancelar" && "Cancelar Agendamento"}
              {dialogAction === "excluir" && "Excluir Agendamento"}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === "aprovar" && "Tem certeza que deseja aprovar este agendamento?"}
              {dialogAction === "rejeitar" && "Por favor, informe o motivo da rejeição:"}
              {dialogAction === "cancelar" && "Tem certeza que deseja cancelar este agendamento?"}
              {dialogAction === "excluir" && "Esta ação não pode ser desfeita. Tem certeza?"}
            </DialogDescription>
          </DialogHeader>

          {dialogAction === "rejeitar" && (
            <Textarea
              placeholder="Informe o motivo da rejeição"
              value={motivoRejeicao}
              onChange={(e) => setMotivoRejeicao(e.target.value)}
            />
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleExecuteAction}
              className={cn(
                dialogAction === "aprovar" && "bg-green-700 hover:bg-green-600",
                dialogAction === "rejeitar" && "bg-red-700 hover:bg-red-600",
                dialogAction === "cancelar" && "bg-amber-700 hover:bg-amber-600",
                dialogAction === "excluir" && "bg-red-700 hover:bg-red-600",
              )}
            >
              {dialogAction === "aprovar" && "Aprovar"}
              {dialogAction === "rejeitar" && "Rejeitar"}
              {dialogAction === "cancelar" && "Confirmar Cancelamento"}
              {dialogAction === "excluir" && "Confirmar Exclusão"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
