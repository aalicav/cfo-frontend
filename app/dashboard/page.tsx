"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Users, 
  Calendar, 
  Trophy, 
  BarChart2,
  TrendingUp,
  Clock,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { dashboardService } from "@/services/dashboards.service"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Redireciona para a página específica do perfil se estiver na raiz do dashboard
    if (pathname === "/dashboard") {
      // Em uma aplicação real, isso seria baseado no perfil do usuário autenticado
      // Por padrão, redirecionamos para o perfil de usuário externo
      router.push("/dashboard/externo")
    }
  }, [pathname, router])
  
  useEffect(() => {
    const carregarEstatisticas = async () => {
      try {
        setLoading(true)
        const data = await dashboardService.getEstatisticas()
        setStats(data)
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error)
        setError("Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.")
      } finally {
        setLoading(false)
      }
    }
    
    carregarEstatisticas()
  }, [])

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold">Ops! Algo deu errado</h3>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Informações e estatísticas sobre o Centro de Formação Olímpica</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Última atualização: {new Date().toLocaleString('pt-BR')}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Atletas</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_atletas || 0}</div>
            <div className="flex items-center pt-1">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              <p className="text-xs text-green-600">
                +12% em relação ao mês anterior
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <Trophy className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.projetos_ativos || 0}</div>
            <div className="flex items-center pt-1">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              <p className="text-xs text-green-600">
                +2 novos projetos este mês
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.agendamentos_hoje || 0}</div>
            <div className="flex items-center pt-1">
              <p className="text-xs text-muted-foreground">
                8 agendamentos em andamento
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Desempenho Médio</CardTitle>
            <BarChart2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.desempenho_medio || 0}%</div>
            <div className="flex items-center pt-1">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              <p className="text-xs text-green-600">
                +5% em relação ao mês anterior
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
            <CardDescription>Desempenho nos últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] flex items-center justify-center bg-gray-50 dark:bg-gray-900/20 rounded-md">
              <div className="text-center space-y-2">
                <BarChart2 className="h-10 w-10 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">Dados de desempenho serão exibidos aqui</p>
                <Button variant="outline" size="sm">Ver Relatório Completo</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas atividades registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats?.atividades_recentes && stats.atividades_recentes.length > 0 ? (
                stats.atividades_recentes.map((atividade: any) => (
                  <div key={atividade.id} className="flex items-center border-b border-gray-100 dark:border-gray-800 pb-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`https://avatar.vercel.sh/${atividade.id}-${atividade.tipo}.png`} alt={atividade.atleta || ""} />
                      <AvatarFallback>
                        {(atividade.atleta || "").substr(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {atividade.descricao}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {atividade.atleta}
                      </p>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                      {new Date(atividade.data).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground text-sm">Nenhuma atividade recente</p>
              )}
              
              <div className="text-center pt-4">
                <Link href="/dashboard/atividades">
                  <Button variant="ghost" size="sm">Ver todas as atividades</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
            <CardDescription>Eventos agendados para os próximos dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats?.proximos_eventos && stats.proximos_eventos.length > 0 ? (
                stats.proximos_eventos.map((evento: any) => (
                  <div key={evento.id} className="flex items-center border-b border-gray-100 dark:border-gray-800 pb-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mr-3">
                      <Calendar className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium leading-none">
                        {evento.titulo}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {evento.local} - {evento.horario}
                      </p>
                    </div>
                    <div className="ml-4">
                      <Badge variant="outline" className={
                        evento.tipo === 'treinamento' 
                          ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                      }>
                        {evento.tipo === 'treinamento' ? 'Treinamento' : 'Competição'}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground text-sm">Nenhum evento próximo</p>
              )}
              
              <div className="text-center pt-4">
                <Link href="/dashboard/agendamentos">
                  <Button variant="ghost" size="sm">Ver agenda completa</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Atualizações recentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats?.notificacoes && stats.notificacoes.length > 0 ? (
                stats.notificacoes.map((notificacao: any) => (
                  <div key={notificacao.id} className="flex items-center border-b border-gray-100 dark:border-gray-800 pb-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-3"></div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium leading-none">
                        {notificacao.titulo}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {notificacao.descricao}
                      </p>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                      {new Date(notificacao.data).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground text-sm">Nenhuma notificação pendente</p>
              )}
              
              <div className="text-center pt-4">
                <Link href="/dashboard/notificacoes">
                  <Button variant="ghost" size="sm">Ver todas as notificações</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Informações e estatísticas sobre o Centro de Formação Olímpica</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-12 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px] w-full rounded-md" />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-10 ml-auto" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
