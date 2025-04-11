import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { 
  Trophy, 
  Users, 
  Calendar, 
  BarChart2, 
  FileText, 
  MessageSquare,
  Bell,
  Settings,
  HelpCircle,
  ArrowRight
} from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">CFO</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-foreground hover:text-green-600">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-green-600 hover:bg-green-700">
                Registrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
                Centro de Formação Olímpica
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8"
            >
              Plataforma integrada para administração, coordenação e acompanhamento de atividades esportivas e formação de atletas olímpicos.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-x-4"
            >
              <Link href="/login">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Começar agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="container space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">
              Recursos Principais
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Explore as principais funcionalidades do sistema
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Gestão de Projetos
                </CardTitle>
                <CardDescription>Administre projetos e modalidades esportivas</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Ferramentas para coordenadores e gerentes acompanharem o desenvolvimento de projetos esportivos.
                </p>
                <Badge variant="outline" className="mt-4 bg-green-50 text-green-700">
                  Em destaque
                </Badge>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-green-600" />
                  Portal do Atleta
                </CardTitle>
                <CardDescription>Acompanhe seu desempenho e calendário</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Acesso a informações de treinamento, competições e avaliações de desempenho.
                </p>
                <Badge variant="outline" className="mt-4 bg-green-50 text-green-700">
                  Novo
                </Badge>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Agendamento de Espaços
                </CardTitle>
                <CardDescription>Solicite o uso de instalações esportivas</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Reserva de quadras, piscinas e outros espaços para treinamentos e eventos.
                </p>
                <Badge variant="outline" className="mt-4 bg-green-50 text-green-700">
                  Popular
                </Badge>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © {new Date().getFullYear()} Centro de Formação Olímpica. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
