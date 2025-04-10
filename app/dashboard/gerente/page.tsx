import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FileText, Calendar, MapPin } from "lucide-react"

export default function GerenteDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Painel do Gerente</h1>
        <p className="text-muted-foreground">Gerencie espaços, projetos e equipes sob sua supervisão.</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="team">Equipe</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="spaces">Espaços</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Membros da Equipe</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">4 coordenadores, 8 instrutores</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">3 modalidades olímpicas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Espaços Gerenciados</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">2 piscinas, 3 quadras</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">Esta semana</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
                <CardDescription>Últimas ações na sua área</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Novo instrutor adicionado</p>
                      <p className="text-xs text-muted-foreground">Há 2 horas</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Projeto atualizado: Natação</p>
                      <p className="text-xs text-muted-foreground">Há 5 horas</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-yellow-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Agendamento aprovado: Piscina Olímpica</p>
                      <p className="text-xs text-muted-foreground">Ontem</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-purple-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Relatório mensal gerado</p>
                      <p className="text-xs text-muted-foreground">Há 2 dias</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Desempenho dos Projetos</CardTitle>
                <CardDescription>Métricas de desempenho dos projetos ativos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Natação</p>
                      <p className="text-sm font-medium">92%</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-full w-[92%] rounded-full bg-green-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Atletismo</p>
                      <p className="text-sm font-medium">78%</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-full w-[78%] rounded-full bg-yellow-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Ginástica</p>
                      <p className="text-sm font-medium">85%</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-full w-[85%] rounded-full bg-blue-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Equipe</CardTitle>
              <CardDescription>Gerencie coordenadores e instrutores sob sua supervisão</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Conteúdo do gerenciamento de equipe será exibido aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Projetos</CardTitle>
              <CardDescription>Visualize e gerencie projetos e modalidades</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Conteúdo do gerenciamento de projetos será exibido aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spaces" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Espaços</CardTitle>
              <CardDescription>Administre os espaços e instalações sob sua responsabilidade</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Conteúdo do gerenciamento de espaços será exibido aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios e Análises</CardTitle>
              <CardDescription>Visualize relatórios de desempenho e utilização</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Conteúdo dos relatórios será exibido aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
