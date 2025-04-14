"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, MapPin, Users, Clock, Edit, ArrowLeft, Building, Loader2 } from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { EspacoGaleria } from "@/components/espaco-galeria"
import { EspacoModalidades } from "@/components/espaco-modalidades"
import { espacosService, Espaco } from "@/services/espacos.service"
import { useToast } from "@/hooks/use-toast"

export default function EspacoDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const id = params.id as string
  
  const [espaco, setEspaco] = useState<Espaco | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Carregar dados do espaço
  const carregarEspaco = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const espacoData = await espacosService.obter(id);
      if (espacoData) {
        setEspaco(espacoData);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do espaço:", error);
      setError("Não foi possível carregar os dados do espaço. Tente novamente mais tarde.");
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do espaço. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    carregarEspaco()
  }, [carregarEspaco])

  // Verifica se está carregando
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-green-700" />
        <p className="text-muted-foreground">Carregando dados do espaço...</p>
      </div>
    )
  }

  // Verifica se ocorreu algum erro
  if (error || !espaco) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold">Espaço não encontrado</h2>
        <p className="text-muted-foreground mb-4">{error || "O espaço que você está procurando não existe."}</p>
        <Button onClick={() => router.push("/dashboard/espacos")}>Voltar para lista de espaços</Button>
      </div>
    )
  }

  // Função para mapear o status do espaço para texto legível
  const getStatusText = (status?: string | boolean) => {
    if (status === true || status === "active" || status === "available") return "Disponível"
    if (status === "maintenance") return "Em Manutenção"
    if (status === false || status === "inactive" || status === "unavailable") return "Indisponível"
    return "Desconhecido"
  }

  // Função para mapear o status do espaço para uma classe CSS
  const getStatusClass = (status?: string | boolean) => {
    if (status === true || status === "active" || status === "available") return "bg-green-500"
    if (status === "maintenance") return "bg-orange-500"
    if (status === false || status === "inactive" || status === "unavailable") return "bg-red-500"
    return "bg-gray-500"
  }

  // Lista de imagens do espaço (se disponível) ou um placeholder
  const imagens = espaco.image_url ? [espaco.image_url] : ["/placeholder.svg"]

  // Dados mockados para a visualização. Em uma implementação real, estes dados viriam da API
  const recursos = [
    "Piso emborrachado de alta performance",
    "Tabelas de basquete retráteis",
    "Redes de vôlei e futsal",
    "Sistema de som",
    "Vestiários masculino e feminino",
  ]

  const manutencoes = [
    {
      tipo: "Manutenção Preventiva",
      data: "15/07/2025",
      descricao: "Revisão do piso e equipamentos",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/espacos">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{espaco.name}</h1>
          <Badge
            className={`ml-2 ${getStatusClass(espaco.is_active)}`}
          >
            {getStatusText(espaco.is_active)}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/espacos/${id}/agenda`}>
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Ver Agenda
            </Button>
          </Link>
          <Link href={`/dashboard/espacos/${id}/editar`}>
            <Button className="bg-green-700 hover:bg-green-600">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-0">
              <EspacoGaleria imagens={imagens} nome={espaco.name} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações do Espaço</CardTitle>
              <CardDescription>Detalhes e características do espaço</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p>{espaco.type || "Não especificado"}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Capacidade</p>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p>{espaco.capacity ? `${espaco.capacity} pessoas` : "Não especificada"}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Localização</p>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p>{espaco.location || "Não especificada"}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p>{getStatusText(espaco.is_active)}</p>
                  </div>
                </div>
              </div>

              {espaco.description && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Descrição</h3>
                    <p className="text-muted-foreground">{espaco.description}</p>
                  </div>
                </>
              )}

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Recursos e Equipamentos</h3>
                {recursos.length > 0 ? (
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {recursos.map((recurso, index) => (
                      <li key={index}>{recurso}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">Nenhum recurso cadastrado.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="modalidades">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="modalidades">Modalidades Associadas</TabsTrigger>
              <TabsTrigger value="projetos">Projetos Associados</TabsTrigger>
            </TabsList>
            <TabsContent value="modalidades" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <EspacoModalidades espacoId={id} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="projetos" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum projeto associado a este espaço.</p>
                    <Link href="/dashboard/projetos/novo">
                      <Button className="mt-4 bg-green-700 hover:bg-green-600">Criar Novo Projeto</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Disponibilidade</CardTitle>
              <CardDescription>Verifique a disponibilidade do espaço</CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarComponent mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Horários disponíveis em {date?.toLocaleDateString()}</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start text-green-700">
                    08:00 - 10:00
                  </Button>
                  <Button variant="outline" className="justify-start text-green-700">
                    10:00 - 12:00
                  </Button>
                  <Button variant="outline" className="justify-start text-red-500" disabled>
                    12:00 - 14:00
                  </Button>
                  <Button variant="outline" className="justify-start text-red-500" disabled>
                    14:00 - 16:00
                  </Button>
                  <Button variant="outline" className="justify-start text-green-700">
                    16:00 - 18:00
                  </Button>
                  <Button variant="outline" className="justify-start text-green-700">
                    18:00 - 20:00
                  </Button>
                </div>
                <div className="mt-4">
                  <Link href={`/dashboard/espacos/${id}/agendar`}>
                    <Button className="w-full bg-green-700 hover:bg-green-600">Solicitar Agendamento</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximas Manutenções</CardTitle>
              <CardDescription>Manutenções programadas</CardDescription>
            </CardHeader>
            <CardContent>
              {manutencoes && manutencoes.length > 0 ? (
                <div className="space-y-3">
                  {manutencoes.map((manutencao, index) => (
                    <div key={index} className="flex items-start space-x-3 border-b pb-3 last:border-0">
                      <div className="bg-orange-100 text-orange-700 p-2 rounded-md">
                        <CalendarIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{manutencao.tipo}</p>
                        <p className="text-sm text-muted-foreground">{manutencao.data}</p>
                        <p className="text-xs text-muted-foreground mt-1">{manutencao.descricao}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Nenhuma manutenção programada.</p>
                  <Link href={`/dashboard/espacos/${id}/manutencao`}>
                    <Button variant="outline" className="mt-2">
                      Agendar Manutenção
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Uso</CardTitle>
              <CardDescription>Utilização nos últimos 30 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Taxa de Ocupação</p>
                    <p className="text-sm font-medium">75%</p>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div className="h-full w-[75%] rounded-full bg-green-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Agendamentos</p>
                    <p className="text-sm font-medium">42</p>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div className="h-full w-[65%] rounded-full bg-blue-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Horas Utilizadas</p>
                    <p className="text-sm font-medium">128h</p>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div className="h-full w-[80%] rounded-full bg-purple-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
