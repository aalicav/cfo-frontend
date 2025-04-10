import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { MapPin, Users, Calendar, Search, Filter } from "lucide-react"
import { espacosMock } from "@/lib/espacos-mock"

export default function EspacosPublicosPage() {
  // Filtramos apenas espaços disponíveis para visualização pública
  const espacosDisponiveis = espacosMock.filter((espaco) => espaco.status === "disponivel")

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Espaços Disponíveis</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Conheça os espaços e instalações do Centro de Formação Olímpica disponíveis para uso.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar espaços..." className="pl-8" />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select defaultValue="todos">
            <SelectTrigger className="w-full md:w-[180px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <span>Tipo</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="quadra">Quadra</SelectItem>
              <SelectItem value="piscina">Piscina</SelectItem>
              <SelectItem value="ginasio">Ginásio</SelectItem>
              <SelectItem value="sala">Sala</SelectItem>
              <SelectItem value="pista">Pista</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {espacosDisponiveis.map((espaco) => (
          <Card key={espaco.id} className="overflow-hidden h-full hover:shadow-md transition-shadow">
            <div className="aspect-video w-full relative bg-gray-100">
              <img
                src={espaco.imagens[0] || "/placeholder.svg"}
                alt={espaco.nome}
                className="object-cover w-full h-full"
              />
              <Badge className="absolute top-2 right-2 bg-green-500">Disponível</Badge>
            </div>
            <CardContent className="p-4">
              <div>
                <h3 className="font-semibold text-lg">{espaco.nome}</h3>
                <p className="text-sm text-muted-foreground">{espaco.tipo}</p>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{espaco.localizacao}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Capacidade: {espaco.capacidade} pessoas</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{espaco.horarioFuncionamento}</span>
                </div>
              </div>
              <div className="mt-4">
                <Link href={`/espacos/${espaco.id}`}>
                  <Button className="w-full bg-green-700 hover:bg-green-600">Ver Detalhes</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-4">Interessado em agendar um espaço para seu evento ou atividade?</p>
        <Link href="/login">
          <Button className="bg-green-700 hover:bg-green-600">Faça login para solicitar agendamento</Button>
        </Link>
      </div>
    </div>
  )
}
