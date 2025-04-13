"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Loader2, Pencil, Trash2, CheckCircle, XCircle, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  projetosService, 
  Projeto, 
  MetaProjeto,
  EspacoProjeto 
} from "@/services/projetos.service"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { formatDistanceToNow } from "date-fns"

export default function DetalheProjetoPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [loadingAction, setLoadingAction] = useState(false)
  const [projeto, setProjeto] = useState<Projeto | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [activeTab, setActiveTab] = useState("resumo")
  const [metasEditando, setMetasEditando] = useState<number[]>([])

  useEffect(() => {
    carregarProjeto()
  }, [id])

  const carregarProjeto = async () => {
    try {
      setLoading(true)
      const data = await projetosService.obter(id as string)
      if (data) {
        setProjeto(data)
      }
    } catch (error) {
      console.error("Erro ao carregar projeto:", error)
      toast({
        title: "Erro ao carregar projeto",
        description: "Não foi possível obter os dados do projeto.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const alterarStatusMeta = async (metaId: number | string, isCompleted: boolean) => {
    if (!projeto || !metaId) return

    try {
      setLoadingAction(true)
      const metasAtualizadas = projeto.goals?.map(meta => 
        meta.id === metaId 
          ? { ...meta, is_completed: isCompleted } 
          : meta
      ) || []

      await projetosService.gerenciarMetas(id as string, metasAtualizadas)
      
      toast({
        title: "Meta atualizada",
        description: isCompleted ? "Meta marcada como concluída." : "Meta marcada como pendente.",
      })
      
      // Atualizar o estado local
      setProjeto(prev => {
        if (!prev) return null
        return {
          ...prev,
          goals: prev.goals?.map(meta => 
            meta.id === metaId 
              ? { ...meta, is_completed: isCompleted } 
              : meta
          )
        }
      })
    } catch (error) {
      console.error("Erro ao atualizar meta:", error)
      toast({
        title: "Erro ao atualizar meta",
        description: "Não foi possível alterar o status da meta.",
        variant: "destructive",
      })
    } finally {
      setLoadingAction(false)
    }
  }

  const alterarStatusProjeto = async (status: 'planned' | 'in_progress' | 'completed') => {
    if (!projeto) return

    try {
      setLoadingAction(true)
      const result = await projetosService.atualizar(id as string, { status })
      
      setProjeto(prev => prev ? { ...prev, status } : null)
      
      toast({
        title: "Status atualizado",
        description: `O projeto agora está ${
          status === 'planned' ? 'planejado' :
          status === 'in_progress' ? 'em andamento' : 'concluído'
        }.`,
      })
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível alterar o status do projeto.",
        variant: "destructive",
      })
    } finally {
      setLoadingAction(false)
    }
  }

  const excluirProjeto = async () => {
    try {
      setLoadingAction(true)
      await projetosService.excluir(id as string)
      
      toast({
        title: "Projeto excluído",
        description: "O projeto foi removido com sucesso.",
      })
      
      router.push("/dashboard/projetos")
    } catch (error) {
      console.error("Erro ao excluir projeto:", error)
      toast({
        title: "Erro ao excluir projeto",
        description: "Não foi possível excluir o projeto.",
        variant: "destructive",
      })
    } finally {
      setLoadingAction(false)
      setConfirmDelete(false)
    }
  }

  // Funções de renderização
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "planned":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Planejado</Badge>
      case "in_progress":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Em andamento</Badge>
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Concluído</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const renderProgressBar = () => {
    if (!projeto) return <Progress value={0} className="h-2" />

    const completedGoals = projeto.goals?.filter(meta => meta.is_completed).length || 0
    const totalGoals = projeto.goals?.length || 0
    const progressPercentage = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0

    return <Progress value={progressPercentage} className="h-2" />
  }

  const formatarData = (dataString?: string) => {
    if (!dataString) return "Data não definida"
    try {
      const data = new Date(dataString)
      return format(data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    } catch (e) {
      return dataString
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/projetos">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Skeleton className="h-9 w-64" />
        </div>

        <div className="grid gap-6">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (!projeto) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/projetos">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Projeto não encontrado</h1>
        </div>

        <Alert variant="destructive">
          <AlertDescription>
            Não foi possível encontrar o projeto solicitado. Verifique se o ID está correto ou se o projeto existe.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/projetos">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{projeto.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/projetos/${id}/editar`}>
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </Link>
          </Button>
          <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Excluir Projeto</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja excluir o projeto "{projeto.name}"? Esta ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmDelete(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={excluirProjeto} disabled={loadingAction}>
                  {loadingAction ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Excluindo...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {renderStatusBadge(projeto.status)}
                <span className="text-sm font-normal text-muted-foreground">
                  {projeto.type || "Sem tipo definido"}
                </span>
              </CardTitle>
              <CardDescription>
                <div className="mt-2">
                  <span className="font-medium">Responsável:</span> {projeto.responsible}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  <Calendar className="h-3 w-3 inline-block mr-1" />
                  {formatarData(projeto.start_date)} até {formatarData(projeto.end_date)}
                </div>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm">Alterar status:</div>
              <Button
                variant={projeto.status === "planned" ? "default" : "outline"}
                size="sm"
                onClick={() => alterarStatusProjeto("planned")}
                disabled={loadingAction || projeto.status === "planned"}
              >
                Planejado
              </Button>
              <Button
                variant={projeto.status === "in_progress" ? "default" : "outline"}
                size="sm"
                onClick={() => alterarStatusProjeto("in_progress")}
                disabled={loadingAction || projeto.status === "in_progress"}
              >
                Em andamento
              </Button>
              <Button
                variant={projeto.status === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => alterarStatusProjeto("completed")}
                disabled={loadingAction || projeto.status === "completed"}
              >
                Concluído
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="resumo">Resumo</TabsTrigger>
              <TabsTrigger value="espacos">Espaços</TabsTrigger>
              <TabsTrigger value="metas">Metas e Indicadores</TabsTrigger>
            </TabsList>

            <TabsContent value="resumo">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Descrição</h3>
                  <div className="text-sm text-muted-foreground whitespace-pre-line">
                    {projeto.description || "Nenhuma descrição disponível."}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Informações Gerais</h3>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-muted-foreground">Modalidade:</div>
                        <div>{projeto.modality}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-muted-foreground">Público-alvo:</div>
                        <div>{projeto.target_audience || "Não especificado"}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-muted-foreground">Participantes previstos:</div>
                        <div>{projeto.expected_participants || "Não especificado"}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-muted-foreground">Data de início:</div>
                        <div>{formatarData(projeto.start_date)}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-muted-foreground">Data de término:</div>
                        <div>{formatarData(projeto.end_date)}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Progresso</h3>
                    <div className="space-y-3">
                      {renderProgressBar()}
                      <div className="text-sm text-center">
                        {projeto.goals?.filter(m => m.is_completed).length || 0} de {projeto.goals?.length || 0} metas cumpridas
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="font-medium mb-2">Espaços Utilizados</h3>
                      <div className="space-y-2">
                        {projeto.spaces && projeto.spaces.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {projeto.spaces.map((espaco) => (
                              <Badge key={espaco.id} variant="secondary">
                                {espaco.space?.name || "Espaço sem nome"}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">Nenhum espaço associado.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="espacos">
              {projeto.spaces && projeto.spaces.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projeto.spaces.map((espaco) => (
                    <div key={espaco.id} className="border rounded-md p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-16 w-16 rounded-md bg-gray-100 flex-shrink-0 overflow-hidden">
                          <img
                            src={espaco.space?.image_url || "/placeholder.svg"}
                            alt={espaco.space?.name || "Espaço"}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{espaco.space?.name || "Espaço sem nome"}</h3>
                          <p className="text-sm text-muted-foreground">{espaco.space?.type || "Tipo não definido"}</p>
                          {espaco.space?.capacity && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Capacidade: {espaco.space.capacity} pessoas
                            </p>
                          )}
                          {espaco.notes && (
                            <div className="mt-2">
                              <p className="text-xs font-medium">Observações:</p>
                              <p className="text-xs text-muted-foreground">
                                {espaco.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Nenhum espaço associado a este projeto.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    asChild
                  >
                    <Link href={`/dashboard/projetos/${id}/editar`}>
                      Adicionar espaços
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="metas">
              <div className="space-y-4">
                {projeto.goals && projeto.goals.length > 0 ? (
                  projeto.goals.map((meta) => (
                    <div key={meta.id} className="border rounded-md p-4">
                      <div className="flex justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{meta.description}</h3>
                            {meta.is_completed ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Concluída
                              </Badge>
                            ) : meta.target_date && new Date(meta.target_date) < new Date() ? (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                Atrasada
                              </Badge>
                            ) : null}
                          </div>
                          {meta.target_date && (
                            <p className="text-xs text-muted-foreground">
                              Data prevista: {formatarData(meta.target_date)}
                            </p>
                          )}
                          {meta.indicators && meta.indicators.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs font-medium mb-1">Indicadores:</p>
                              <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                                {meta.indicators.map((indicador, idx) => (
                                  <li key={idx}>{indicador}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="flex items-start gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className={meta.is_completed ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                            disabled={loadingAction || !meta.id}
                            onClick={() => meta.id && alterarStatusMeta(meta.id, !meta.is_completed)}
                          >
                            {loadingAction && metasEditando.includes(Number(meta.id)) ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : meta.is_completed ? (
                              <XCircle className="h-4 w-4" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Nenhuma meta definida para este projeto.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      asChild
                    >
                      <Link href={`/dashboard/projetos/${id}/editar`}>
                        Adicionar metas
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
