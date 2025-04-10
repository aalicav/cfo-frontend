import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calendar, ClipboardList, BarChart } from "lucide-react"

export default function InstrutorDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Painel do Instrutor</h1>
        <p className="text-muted-foreground">Gerencie treinos e acompanhe o desempenho dos atletas.</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="training">Treinos</TabsTrigger>
          <TabsTrigger value="athletes">Atletas</TabsTrigger>
          <TabsTrigger value="evaluations">Avaliações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Atletas</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">Sob sua supervisão</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Treinos Agendados</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Esta semana</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avaliações</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Pendentes para realizar</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Horas Trabalhadas</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32h</div>
                <p className="text-xs text-muted-foreground">Nesta semana</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Agenda do Dia</CardTitle>
                <CardDescription>Seus compromissos para hoje</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Treino de Natação - Turma A</p>
                      <p className="text-xs text-muted-foreground">09:00 - 10:30</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Avaliação Individual - Carlos Silva</p>
                      <p className="text-xs text-muted-foreground">11:00 - 12:00</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-yellow-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Reunião com Coordenador</p>
                      <p className="text-xs text-muted-foreground">13:30 - 14:00</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-purple-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Treino de Natação - Turma B</p>
                      <p className="text-xs text-muted-foreground">15:00 - 16:30</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Desempenho dos Atletas</CardTitle>
                <CardDescription>Progresso médio por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Técnica</p>
                      <p className="text-sm font-medium">82%</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-full w-[82%] rounded-full bg-green-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Resistência</p>
                      <p className="text-sm font-medium">75%</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-full w-[75%] rounded-full bg-yellow-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Velocidade</p>
                      <p className="text-sm font-medium">68%</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-full w-[68%] rounded-full bg-blue-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Disciplina</p>
                      <p className="text-sm font-medium">90%</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-full w-[90%] rounded-full bg-purple-500" />
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
              <CardTitle>Gerenciamento de Treinos</CardTitle>
              <CardDescription>Planeje e acompanhe os treinos dos atletas</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Conteúdo do gerenciamento de treinos será exibido aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="athletes" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Atletas</CardTitle>
              <CardDescription>Lista de atletas e acompanhamento individual</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Conteúdo da lista de atletas será exibido aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluations" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Avaliações</CardTitle>
              <CardDescription>Registre e acompanhe o desempenho dos atletas</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Conteúdo das avaliações será exibido aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
