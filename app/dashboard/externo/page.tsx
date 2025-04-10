import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, FileText } from "lucide-react"

export default function ExternoDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Portal do Usuário Externo</h1>
        <p className="text-muted-foreground">
          Solicite agendamentos e inscrições em atividades do Centro de Formação Olímpica.
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="schedule">Agendamentos</TabsTrigger>
          <TabsTrigger value="registration">Inscrições</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Solicitações pendentes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inscrições</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">Ativa em projeto</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Espaços Disponíveis</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Para agendamento</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Projetos Abertos</CardTitle>
                <CardDescription>Projetos com inscrições abertas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Natação para Iniciantes</p>
                      <p className="text-xs text-muted-foreground">Inscrições até 15/06/2025</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Atletismo Juvenil</p>
                      <p className="text-xs text-muted-foreground">Inscrições até 20/06/2025</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-yellow-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Ginástica Artística</p>
                      <p className="text-xs text-muted-foreground">Inscrições até 25/06/2025</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Status das Solicitações</CardTitle>
                <CardDescription>Acompanhe suas solicitações recentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-yellow-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Agendamento: Quadra Poliesportiva</p>
                      <p className="text-xs text-muted-foreground">Pendente - Solicitado em 05/06/2025</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-yellow-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Agendamento: Piscina Semi-Olímpica</p>
                      <p className="text-xs text-muted-foreground">Pendente - Solicitado em 06/06/2025</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Inscrição: Natação para Iniciantes</p>
                      <p className="text-xs text-muted-foreground">Aprovada - 01/06/2025</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-red-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Agendamento: Sala de Musculação</p>
                      <p className="text-xs text-muted-foreground">Recusada - 28/05/2025</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Solicitar Agendamento</CardTitle>
              <CardDescription>Agende o uso de espaços e instalações do centro</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Formulário de agendamento será exibido aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registration" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Inscrições em Projetos</CardTitle>
              <CardDescription>Inscreva-se em projetos e atividades disponíveis</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Formulário de inscrição será exibido aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
