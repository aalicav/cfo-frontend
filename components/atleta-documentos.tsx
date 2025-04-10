"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Upload, Download, Trash2, Plus, File, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface AtletaDocumentosProps {
  atletaId: string
}

export function AtletaDocumentos({ atletaId }: AtletaDocumentosProps) {
  const [documentos, setDocumentos] = useState([
    {
      id: 1,
      nome: "Atestado_Médico.pdf",
      tipo: "Atestado Médico",
      tamanho: "1.2 MB",
      dataUpload: "15/01/2025",
      validade: "15/01/2026",
      status: "valido",
    },
    {
      id: 2,
      nome: "RG_CPF.pdf",
      tipo: "Documentos Pessoais",
      tamanho: "0.8 MB",
      dataUpload: "10/01/2025",
      validade: "Permanente",
      status: "valido",
    },
    {
      id: 3,
      nome: "Autorização_Responsável.pdf",
      tipo: "Autorização",
      tamanho: "0.5 MB",
      dataUpload: "10/01/2025",
      validade: "31/12/2025",
      status: "valido",
    },
    {
      id: 4,
      nome: "Ficha_Inscrição.pdf",
      tipo: "Inscrição",
      tamanho: "0.7 MB",
      dataUpload: "05/01/2025",
      validade: "Permanente",
      status: "valido",
    },
  ])

  const [filtroTipo, setFiltroTipo] = useState("todos")
  const [dialogAberto, setDialogAberto] = useState(false)
  const [novoDocumento, setNovoDocumento] = useState({
    nome: "",
    tipo: "",
    validade: new Date(),
  })
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null)
  const [validadePermanente, setValidadePermanente] = useState(false)

  const documentosFiltrados = documentos.filter((doc) => filtroTipo === "todos" || doc.tipo === filtroTipo)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setArquivoSelecionado(file)
      setNovoDocumento((prev) => ({ ...prev, nome: file.name }))
    }
  }

  const handleUpload = () => {
    if (!arquivoSelecionado || !novoDocumento.tipo) return

    // Simulando upload
    const novoDoc = {
      id: Math.max(0, ...documentos.map((d) => d.id)) + 1,
      nome: novoDocumento.nome,
      tipo: novoDocumento.tipo,
      tamanho: `${(arquivoSelecionado.size / (1024 * 1024)).toFixed(1)} MB`,
      dataUpload: new Date().toLocaleDateString("pt-BR"),
      validade: validadePermanente ? "Permanente" : format(novoDocumento.validade, "dd/MM/yyyy", { locale: ptBR }),
      status: "valido",
    }

    setDocumentos((prev) => [...prev, novoDoc])
    setNovoDocumento({ nome: "", tipo: "", validade: new Date() })
    setArquivoSelecionado(null)
    setValidadePermanente(false)
    setDialogAberto(false)
  }

  const removerDocumento = (id: number) => {
    setDocumentos((prev) => prev.filter((doc) => doc.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">Documentos do Atleta</h3>
          <p className="text-sm text-muted-foreground">Documentos e arquivos relacionados ao atleta</p>
        </div>
        <div className="flex gap-2">
          <Select value={filtroTipo} onValueChange={setFiltroTipo}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="Atestado Médico">Atestado Médico</SelectItem>
              <SelectItem value="Documentos Pessoais">Documentos Pessoais</SelectItem>
              <SelectItem value="Autorização">Autorização</SelectItem>
              <SelectItem value="Inscrição">Inscrição</SelectItem>
              <SelectItem value="Outro">Outro</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
            <DialogTrigger asChild>
              <Button className="bg-green-700 hover:bg-green-600">
                <Plus className="mr-2 h-4 w-4" />
                Novo Documento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Documento</DialogTitle>
                <DialogDescription>Faça upload de um novo documento para o atleta</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Arquivo</Label>
                  <div className="border-2 border-dashed rounded-md p-6">
                    {arquivoSelecionado ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-8 w-8 mr-2 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{arquivoSelecionado.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(arquivoSelecionado.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setArquivoSelecionado(null)
                            setNovoDocumento((prev) => ({ ...prev, nome: "" }))
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center cursor-pointer">
                        <div className="flex flex-col items-center justify-center p-4 text-center">
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">Clique para selecionar um arquivo</p>
                          <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, JPG (máx. 10MB)</p>
                        </div>
                        <Input type="file" className="hidden" onChange={handleFileChange} />
                      </label>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Documento</Label>
                  <Select
                    value={novoDocumento.tipo}
                    onValueChange={(value) => setNovoDocumento((prev) => ({ ...prev, tipo: value }))}
                  >
                    <SelectTrigger id="tipo">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Atestado Médico">Atestado Médico</SelectItem>
                      <SelectItem value="Documentos Pessoais">Documentos Pessoais</SelectItem>
                      <SelectItem value="Autorização">Autorização</SelectItem>
                      <SelectItem value="Inscrição">Inscrição</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="validade">Data de Validade</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="validadePermanente"
                        checked={validadePermanente}
                        onChange={(e) => setValidadePermanente(e.target.checked)}
                        className="mr-1"
                      />
                      <Label htmlFor="validadePermanente" className="text-sm font-normal">
                        Permanente
                      </Label>
                    </div>
                  </div>
                  {!validadePermanente && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {format(novoDocumento.validade, "dd/MM/yyyy", { locale: ptBR })}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={novoDocumento.validade}
                          onSelect={(date) => date && setNovoDocumento((prev) => ({ ...prev, validade: date }))}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogAberto(false)}>
                  Cancelar
                </Button>
                <Button
                  className="bg-green-700 hover:bg-green-600"
                  onClick={handleUpload}
                  disabled={!arquivoSelecionado || !novoDocumento.tipo}
                >
                  Fazer Upload
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        {documentosFiltrados.length > 0 ? (
          documentosFiltrados.map((documento) => (
            <Card key={documento.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center p-4 border-b bg-gray-50">
                  <div className="flex items-center flex-1">
                    <File className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{documento.nome}</p>
                      <p className="text-xs text-muted-foreground">Adicionado em {documento.dataUpload}</p>
                    </div>
                  </div>
                  <Badge
                    className={
                      documento.status === "valido"
                        ? "bg-green-500 mr-2"
                        : documento.status === "pendente"
                          ? "bg-yellow-500 mr-2"
                          : "bg-red-500 mr-2"
                    }
                  >
                    {documento.status === "valido"
                      ? "Válido"
                      : documento.status === "pendente"
                        ? "Pendente"
                        : "Vencido"}
                  </Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" title="Download">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Remover" onClick={() => removerDocumento(documento.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2">
                        {documento.tipo}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{documento.tamanho}</p>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Validade: {documento.validade}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center p-12 border rounded-lg">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhum documento encontrado</h3>
            <p className="text-muted-foreground mt-2">
              {filtroTipo === "todos"
                ? "Não há documentos cadastrados para este atleta."
                : `Não há documentos do tipo "${filtroTipo}" cadastrados.`}
            </p>
            <Button className="mt-4 bg-green-700 hover:bg-green-600" onClick={() => setDialogAberto(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Documento
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
