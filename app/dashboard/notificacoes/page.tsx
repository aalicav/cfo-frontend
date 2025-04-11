"use client"

import React, { useEffect, useState } from 'react'
import { 
  ArrowLeft, 
  Bell, 
  Check, 
  Loader2, 
  Trash2 
} from 'lucide-react'
import { notificacoesService } from '@/services'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Notificacao {
  id: string
  type: string
  data: {
    title: string
    message: string
    action?: string
    url?: string
    icon?: string
  }
  read_at: string | null
  created_at: string
  updated_at: string
}

export default function NotificacoesPage() {
  const [todasNotificacoes, setTodasNotificacoes] = useState<Notificacao[]>([])
  const [naoLidas, setNaoLidas] = useState<Notificacao[]>([])
  const [loading, setLoading] = useState(true)
  const [abaAtiva, setAbaAtiva] = useState('todas')
  const router = useRouter()

  const carregarNotificacoes = async () => {
    try {
      setLoading(true)
      
      // Carregar todas as notificações
      const respostaTodas = await notificacoesService.listar()
      if (respostaTodas) {
        setTodasNotificacoes(respostaTodas)
      }

      // Carregar notificações não lidas
      const respostaNaoLidas = await notificacoesService.listarNaoLidas()
      if (respostaNaoLidas) {
        setNaoLidas(respostaNaoLidas)
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarNotificacoes()
  }, [])

  const formatarData = (data: string) => {
    const dataObj = new Date(data)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dataObj)
  }

  const handleMarcarComoLida = async (id: string) => {
    try {
      await notificacoesService.marcarComoLida(id)
      carregarNotificacoes()
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error)
    }
  }

  const handleMarcarTodasComoLidas = async () => {
    try {
      await notificacoesService.marcarTodasComoLidas()
      carregarNotificacoes()
    } catch (error) {
      console.error('Erro ao marcar todas notificações como lidas:', error)
    }
  }

  const handleExcluir = async (id: string) => {
    try {
      await notificacoesService.excluir(id)
      carregarNotificacoes()
    } catch (error) {
      console.error('Erro ao excluir notificação:', error)
    }
  }

  const handleExcluirTodas = async () => {
    try {
      await notificacoesService.excluirTodas()
      carregarNotificacoes()
    } catch (error) {
      console.error('Erro ao excluir todas as notificações:', error)
    }
  }

  const handleNotificacaoClick = (notificacao: Notificacao) => {
    if (!notificacao.read_at) {
      handleMarcarComoLida(notificacao.id)
    }
    
    if (notificacao.data.url) {
      router.push(notificacao.data.url)
    }
  }

  const notificacoesAtuais = abaAtiva === 'todas' ? todasNotificacoes : naoLidas

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Notificações</h1>
        </div>
        <div className="flex gap-2">
          {naoLidas.length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleMarcarTodasComoLidas}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Marcar todas como lidas
            </Button>
          )}
          
          {todasNotificacoes.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Limpar tudo
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir todas as notificações?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Todas as suas notificações serão excluídas permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleExcluirTodas} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <Tabs defaultValue="todas" onValueChange={setAbaAtiva}>
            <TabsList>
              <TabsTrigger value="todas" className="flex items-center gap-2">
                Todas
                <Badge variant="secondary">{todasNotificacoes.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="nao-lidas" className="flex items-center gap-2">
                Não lidas
                <Badge variant="destructive">{naoLidas.length}</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : notificacoesAtuais.length > 0 ? (
            <div className="space-y-4">
              {notificacoesAtuais.map((notificacao) => (
                <div key={notificacao.id}>
                  <div className="flex items-start justify-between gap-4 py-4">
                    <div 
                      className="flex-1 cursor-pointer" 
                      onClick={() => handleNotificacaoClick(notificacao)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="shrink-0">
                          <Bell className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                            <h3 className={`font-medium ${!notificacao.read_at ? 'text-primary' : ''}`}>
                              {notificacao.data.title}
                            </h3>
                            <span className="text-xs text-muted-foreground">
                              {formatarData(notificacao.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notificacao.data.message}
                          </p>
                          {notificacao.data.action && (
                            <span className="text-xs text-primary mt-1 inline-block">
                              {notificacao.data.action}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notificacao.read_at && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleMarcarComoLida(notificacao.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleExcluir(notificacao.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Nenhuma notificação</h3>
              <p className="text-muted-foreground mt-1">
                {abaAtiva === 'todas' 
                  ? 'Você não tem nenhuma notificação ainda' 
                  : 'Você não tem notificações não lidas'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
