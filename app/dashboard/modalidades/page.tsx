"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Users, Calendar, MapPin } from "lucide-react"
import { modalidadesMock } from "@/lib/modalidades-mock"

export default function ModalidadesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const modalidadesFiltradas = modalidadesMock.filter(
    (modalidade) =>
      modalidade.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      modalidade.categoria.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modalidades Esportivas</h1>
          <p className="text-muted-foreground">
            Gerencie as modalidades esportivas oferecidas no Centro de Formação Olímpica.
          </p>
        </div>
        <Link href="/dashboard/modalidades/nova">
          <Button className="bg-green-700 hover:bg-green-600">
            <Plus className="mr-2 h-4 w-4" /> Nova Modalidade
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar modalidades..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modalidadesFiltradas.map((modalidade) => (
          <Card key={modalidade.id} className="overflow-hidden h-full hover:shadow-md transition-shadow">
            <div className="aspect-video w-full relative bg-gray-100">
              <img
                src={modalidade.imagem || "/placeholder.svg?height=400&width=600"}
                alt={modalidade.nome}
                className="object-cover w-full h-full"
              />
              <Badge className="absolute top-2 right-2 bg-green-700">{modalidade.categoria}</Badge>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{modalidade.nome}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{modalidade.descricao}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Abrir menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link href={`/dashboard/modalidades/${modalidade.id}`} className="w-full">
                        Ver detalhes
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/dashboard/modalidades/${modalidade.id}/editar`} className="w-full">
                        Editar
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{modalidade.atletas || Math.floor(Math.random() * 50) + 10} atletas cadastrados</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{modalidade.projetos || Math.floor(Math.random() * 5) + 1} projetos ativos</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{modalidade.espacos || Math.floor(Math.random() * 3) + 1} espaços associados</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Link href={`/dashboard/modalidades/${modalidade.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                  Ver Detalhes
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {modalidadesFiltradas.length === 0 && (
        <div className="text-center p-12 border rounded-lg">
          <h3 className="text-lg font-medium">Nenhuma modalidade encontrada</h3>
          <p className="text-muted-foreground mt-2">
            Não foram encontradas modalidades com os critérios de busca informados.
          </p>
          <Link href="/dashboard/modalidades/nova">
            <Button className="mt-4 bg-green-700 hover:bg-green-600">
              <Plus className="mr-2 h-4 w-4" /> Cadastrar Nova Modalidade
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
