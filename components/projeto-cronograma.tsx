"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Plus, X, CheckCircle2, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ProjetoCronogramaProps {
  projetoId: string
}

export function ProjetoCronograma({ projetoId }: ProjetoCronogramaProps) {
  const [atividades, setAtividades] = useState([
    {
      id: 1,
      titulo: "Inscrições e Seleção",
      dataInicio: new Date(2025, 0, 15),
      dataFim: new Date(2025, 1, 15),
      status: "concluido",
      responsavel: "Carlos Mendes",
      descricao: "Período de inscrições e seleção dos participantes do projeto.",
    },
    {
      id: 2,
      titulo: "Avaliação Inicial",
      dataInicio: new Date(2025, 1, 20),
      dataFim: new Date(2025, 1, 28),
      status: "concluido",
      responsavel: "Ana Silva",
      descricao: "Avaliação inicial dos participantes para definição de grupos e níveis.",
    },
    {
      id: 3,
      titulo: "Primeiro Ciclo de Treinamento",
      dataInicio: new Date(2025, 2, 1),
      dataFim: new Date(2025, 5, 30),
      status: "em_andamento",
      responsavel: "Pedro Santos",
      descricao: "Primeiro ciclo de treinamentos técnicos e preparação física.",
    },
    {
      id: 4,
      titulo: "Competição Regional",
      dataInicio: new Date(2025, 7, 15),
      dataFim: new Date(2025, 7, 15),
      status: "planejado",
      responsavel: "Carlos Mendes",
      descricao: "Participação na competição regional da modalidade.",
    },
    {
      id: 5,
      titulo: "Segundo Ciclo de Treinamento",
      dataInicio: new Date(2025, 8, 1),
      dataFim: new Date(2025, 10, 30),
      status: "planejado",
      responsavel: "Pedro Santos",
      descricao: "Segundo ciclo de treinamentos com foco em aperfeiçoamento técnico.",
    },
    {
      id: 6,
      titulo: "Avaliação Final",
      dataInicio: new Date(2025, 11, 1),
      dataFim: new Date(2025, 11, 15),
      status: "planejado",
      responsavel: "Ana Silva",
      descricao: "Avaliação final dos participantes e do projeto.",
    },
  ])

  const [novaAtividade, setNovaAtividade] = useState({
    titulo: "",
    dataInicio: new Date(),
    dataFim: new Date(),
    responsavel: "",
    descricao: "",
    status: "planejado",
  })

  const [dialogAberto, setDialogAberto] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNovaAtividade((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (status: string) => {
    setNovaAtividade((prev) => ({ ...prev, status }))
  }

  const adicionarAtividade = () => {
    if (!novaAtividade.titulo || !novaAtividade.responsavel) return

    setAtividades((prev) => [
      ...prev,
      {
        ...novaAtividade,
        id: Math.max(0, ...prev.map((a) => a.id)) + 1,
      },
    ])

    setNovaAtividade({
      titulo: "",
      dataInicio: new Date(),
      dataFim: new Date(),
      responsavel: "",
      descricao: "",
      status: "planejado",
    })

    setDialogAberto(false)
  }

  const removerAtividade = (id: number) => {
    setAtividades((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Cronograma de Atividades</h3>
          <p className="text-sm text-muted-foreground">Planejamento e acompanhamento das atividades do projeto</p>
        </div>
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button className="bg-green-700 hover:bg-green-600">
              <Plus className="mr-2 h-4 w-4" />
              Nova Atividade
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Atividade</DialogTitle>
              <DialogDescription>Preencha os dados da nova atividade do cronograma</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  name="titulo"
                  value={novaAtividade.titulo}
                  onChange={handleInputChange}
                  placeholder="Ex: Treinamento Técnico"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(novaAtividade.dataInicio, "dd/MM/yyyy", { locale: ptBR })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={novaAtividade.dataInicio}
                        onSelect={(date) => date && setNovaAtividade((prev) => ({ ...prev, dataInicio: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Data de Término</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(novaAtividade.dataFim, "dd/MM/yyyy", { locale: ptBR })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={novaAtividade.dataFim}
                        onSelect={(date) => date && setNovaAtividade((prev) => ({ ...prev, dataFim: date }))}
                        initialFocus
                        disabled={(date) => date < novaAtividade.dataInicio}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsavel">Responsável</Label>
                <Input
                  id="responsavel"
                  name="responsavel"
                  value={novaAtividade.responsavel}
                  onChange={handleInputChange}
                  placeholder="Ex: Carlos Mendes"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  name="descricao"
                  value={novaAtividade.descricao}
                  onChange={handleInputChange}
                  placeholder="Descreva a atividade brevemente"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={novaAtividade.status === "planejado" ? "default" : "outline"}
                    size="sm"
                    className={novaAtividade.status === "planejado" ? "bg-blue-500 hover:bg-blue-600" : ""}
                    onClick={() => handleStatusChange("planejado")}
                  >
                    Planejado
                  </Button>
                  <Button
                    type="button"
                    variant={novaAtividade.status === "em_andamento" ? "default" : "outline"}
                    size="sm"
                    className={novaAtividade.status === "em_andamento" ? "bg-green-500 hover:bg-green-600" : ""}
                    onClick={() => handleStatusChange("em_andamento")}
                  >
                    Em Andamento
                  </Button>
                  <Button
                    type="button"
                    variant={novaAtividade.status === "concluido" ? "default" : "outline"}
                    size="sm"
                    className={novaAtividade.status === "concluido" ? "bg-gray-500 hover:bg-gray-600" : ""}
                    onClick={() => handleStatusChange("concluido")}
                  >
                    Concluído
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogAberto(false)}>
                Cancelar
              </Button>
              <Button className="bg-green-700 hover:bg-green-600" onClick={adicionarAtividade}>
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {atividades.map((atividade) => (
          <Card key={atividade.id} className="overflow-hidden">
            <div className="flex items-center p-2 bg-gray-50 border-b">
              <Badge
                className={`mr-2 ${
                  atividade.status === "planejado"
                    ? "bg-blue-500"
                    : atividade.status === "em_andamento"
                      ? "bg-green-500"
                      : "bg-gray-500"
                }`}
              >
                {atividade.status === "planejado"
                  ? "Planejado"
                  : atividade.status === "em_andamento"
                    ? "Em andamento"
                    : "Concluído"}
              </Badge>
              <h4 className="font-medium flex-1">{atividade.titulo}</h4>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removerAtividade(atividade.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      {format(atividade.dataInicio, "dd/MM/yyyy", { locale: ptBR })} a{" "}
                      {format(atividade.dataFim, "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      Duração:{" "}
                      {Math.ceil(
                        (atividade.dataFim.getTime() - atividade.dataInicio.getTime()) / (1000 * 60 * 60 * 24),
                      )}{" "}
                      dias
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Responsável</p>
                      <p className="text-sm text-muted-foreground">{atividade.responsavel}</p>
                    </div>
                  </div>
                </div>
              </div>
              {atividade.descricao && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">{atividade.descricao}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
