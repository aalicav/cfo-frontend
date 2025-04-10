import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-green-700 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Centro de Formação Olímpica</h1>
            <div className="space-x-2">
              <Link href="/login">
                <Button variant="outline" className="text-white border-white hover:bg-green-600">
                  Entrar
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="text-white border-white hover:bg-green-600">
                  Registrar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <section className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Bem-vindo ao Sistema de Gerenciamento do CFO</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Plataforma integrada para administração, coordenação e acompanhamento de atividades esportivas e formação de
            atletas olímpicos.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Projetos</CardTitle>
              <CardDescription>Administre projetos e modalidades esportivas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Ferramentas para coordenadores e gerentes acompanharem o desenvolvimento de projetos esportivos.
              </p>
              <Link href="/login">
                <Button className="w-full bg-green-700 hover:bg-green-600">Acessar</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Portal do Atleta</CardTitle>
              <CardDescription>Acompanhe seu desempenho e calendário</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Acesso a informações de treinamento, competições e avaliações de desempenho.</p>
              <Link href="/login">
                <Button className="w-full bg-green-700 hover:bg-green-600">Acessar</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agendamento de Espaços</CardTitle>
              <CardDescription>Solicite o uso de instalações esportivas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Reserva de quadras, piscinas e outros espaços para treinamentos e eventos.</p>
              <Link href="/login">
                <Button className="w-full bg-green-700 hover:bg-green-600">Acessar</Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Centro de Formação Olímpica. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
