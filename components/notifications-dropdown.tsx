import React, { useEffect, useState } from 'react'
import { Bell, Check } from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { notificacoesService } from '@/services'
import { useRouter } from 'next/navigation'

interface Notificacao {
  id: string
  data: {
    title: string
    message: string
    action?: string
    url?: string
    icon?: string
  }
  read_at: string | null
  created_at: string
}

export default function NotificationsDropdown() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
  const [loading, setLoading] = useState(true)
  const [contagem, setContagem] = useState(0)
  const router = useRouter()

  const carregarNotificacoes = async () => {
    try {
      setLoading(true)
      const resposta = await notificacoesService.listarNaoLidas({ per_page: 5 })
      if (resposta) {
        setNotificacoes(resposta)
        setContagem(resposta.length)
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarNotificacoes()
    
    // Atualizar notificações a cada 1 minuto
    const intervalo = setInterval(carregarNotificacoes, 60000)
    return () => clearInterval(intervalo)
  }, [])

  const handleMarcarComoLida = async (id: string) => {
    try {
      await notificacoesService.marcarComoLida(id)
      carregarNotificacoes()
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error)
    }
  }

  const handleClick = (notificacao: Notificacao) => {
    handleMarcarComoLida(notificacao.id)
    
    if (notificacao.data.url) {
      router.push(notificacao.data.url)
    }
  }

  const formatarData = (data: string) => {
    const dataObj = new Date(data)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dataObj)
  }

  const handleVerTodas = () => {
    router.push('/dashboard/notificacoes')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {contagem > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] min-h-[1.25rem] flex items-center justify-center text-xs">
              {contagem > 9 ? '9+' : contagem}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">Notificações</p>
            <p className="text-xs text-muted-foreground">
              {contagem > 0 ? `Você tem ${contagem} notificações não lidas` : 'Nenhuma notificação não lida'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {loading ? (
            // Esqueleto de carregamento
            Array(3).fill(0).map((_, i) => (
              <DropdownMenuItem key={i} className="flex flex-col items-start gap-1 p-3 cursor-default">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </DropdownMenuItem>
            ))
          ) : notificacoes.length > 0 ? (
            notificacoes.map((notificacao) => (
              <DropdownMenuItem 
                key={notificacao.id} 
                className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                onClick={() => handleClick(notificacao)}
              >
                <div className="flex justify-between w-full">
                  <span className="font-medium">{notificacao.data.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatarData(notificacao.created_at)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {notificacao.data.message}
                </p>
                {notificacao.data.action && (
                  <span className="text-xs text-primary">
                    {notificacao.data.action}
                  </span>
                )}
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Nenhuma notificação disponível
            </div>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-center cursor-pointer justify-center text-primary"
          onClick={handleVerTodas}
        >
          Ver todas as notificações
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 