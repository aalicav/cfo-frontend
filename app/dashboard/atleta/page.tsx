import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Award, Clock } from "lucide-react"

export default function AtletaDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Portal do Atleta</h1>
        <p className="text-muted-foreground">Acompanhe seu desempenho, treinamentos e competições.</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="training">Treinamentos</TabsTrigger>
          <TabsTrigger value="performance">Desempenho</TabsTrigger>
          <TabsTrigger value="competitions">Competições</TabsTrigger>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próximo Treino</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Hoje, 15:00</div>
                <p className="text-xs text-muted-foreground">Natação - Piscina Olímpica</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próxima Competição</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15/06/2025</div>
                <p className="text-xs text-muted-foreground">Campeonato Estadual</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Horas Treinadas</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24h</div>
                <p className="text-xs text-muted-foreground">Neste mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Medalhas</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">2 ouro, 1 prata, 2 bronze</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Agenda Semanal</CardTitle>
                <CardDescription>Seus próximos treinamentos e eventos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Treino de Natação</p>
                      <p className="text-xs text-muted-foreground">Hoje, 15:00 - 17:00</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Preparação Física</p>
                      <p className="text-xs text-muted-foreground">Amanhã, 09:00 - 10:30</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-yellow-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Avaliação de Desempenho</p>
                      <p className="text-xs text-muted-foreground">Quarta, 14:00 - 15:00</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-purple-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Treino Técnico</p>
                      <p className="text-xs text-muted-foreground">Sexta, 16:00 - 18:00</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Evolução de Desempenho</CardTitle>
                <CardDescription>Seus resultados nas últimas avaliações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Velocidade</p>
                      <p className="text-sm font-medium">85%</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-full w-[85%] rounded-full bg-green-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Resistência</p>
                      <p className="text-sm font-medium">72%</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-full w-[72%] rounded-full bg-yellow-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Técnica</p>
                      <p className="text-sm font-medium">90%</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-full w-[90%] rounded-full bg-blue-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="training" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Plano de Treinamento</CardTitle>
              <CardDescription>Seu plano de treinamento personalizado</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Conteúdo do plano de treinamento será exibido aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Desempenho</CardTitle>
              <CardDescription>Acompanhe sua evolução e métricas de desempenho</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Conteúdo da análise de desempenho será exibido aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitions" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Competições</CardTitle>
              <CardDescription>Calendário de competições e resultados</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Conteúdo das competições será exibido aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Perfil do Atleta</CardTitle>
              <CardDescription>Suas informações pessoais e configurações</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Conteúdo do perfil será exibido aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
