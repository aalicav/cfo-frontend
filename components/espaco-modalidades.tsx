"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { modalidadesMock } from "@/lib/modalidades-mock"

interface EspacoModalidadesProps {
  espacoId: string
}

export function EspacoModalidades({ espacoId }: EspacoModalidadesProps) {
  // Simulação de modalidades associadas a este espaço
  const [modalidadesAssociadas, setModalidadesAssociadas] = useState(
    modalidadesMock.filter((_, index) => index % 3 === 0).map((m) => m.id),
  )

  const [dialogAberto, setDialogAberto] = useState(false)
  const [modalidadeSelecionada, setModalidadeSelecionada] = useState("")

  const modalidadesDisponiveis = modalidadesMock.filter((m) => !modalidadesAssociadas.includes(m.id))

  const adicionarModalidade = () => {
    if (modalidadeSelecionada) {
      setModalidadesAssociadas([...modalidadesAssociadas, modalidadeSelecionada])
      setModalidadeSelecionada("")
      setDialogAberto(false)
    }
  }

  const removerModalidade = (id: string) => {
    setModalidadesAssociadas(modalidadesAssociadas.filter((m) => m !== id))
  }

  return (
    <div>
      {modalidadesAssociadas.length > 0 ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {modalidadesAssociadas.map((id) => {
              const modalidade = modalidadesMock.find((m) => m.id === id)
              if (!modalidade) return null

              return (
                <Badge key={id} variant="outline" className="flex items-center gap-1 py-1.5 px-3">
                  <span>{modalidade.nome}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 hover:bg-transparent"
                    onClick={() => removerModalidade(id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )
            })}
          </div>

          <Button variant="outline" size="sm" className="mt-4" onClick={() => setDialogAberto(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Modalidade
          </Button>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Nenhuma modalidade associada a este espaço.</p>
          <Button className="bg-green-700 hover:bg-green-600" onClick={() => setDialogAberto(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Associar Modalidade
          </Button>
        </div>
      )}

      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Associar Modalidade</DialogTitle>
            <DialogDescription>Selecione uma modalidade para associar a este espaço.</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Select value={modalidadeSelecionada} onValueChange={setModalidadeSelecionada}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma modalidade" />
              </SelectTrigger>
              <SelectContent>
                {modalidadesDisponiveis.length > 0 ? (
                  modalidadesDisponiveis.map((modalidade) => (
                    <SelectItem key={modalidade.id} value={modalidade.id}>
                      {modalidade.nome}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    Todas as modalidades já estão associadas
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogAberto(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-green-700 hover:bg-green-600"
              onClick={adicionarModalidade}
              disabled={!modalidadeSelecionada}
            >
              Associar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
