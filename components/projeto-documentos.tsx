"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Upload, Download, Trash2, Plus, File } from "lucide-react"
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

interface ProjetoDocumentosProps {
  projetoId: string
}

export function ProjetoDocumentos({ projetoId }: ProjetoDocumentosProps) {
  const [documentos, setDocumentos] = useState([
    {
      id: 1,
      nome: "Plano_do_Projeto.pdf",
      tipo: "Planejamento",
      tamanho: "2.4 MB",
      dataUpload: "01/01/2025",
      autor: "Carlos Mendes",
    },
    {
      id: 2,
      nome: "Cronograma.xlsx",
      tipo: "Planejamento",
      tamanho: "1.2 MB",
      dataUpload: "05/01/2025",
      autor: "Carlos Mendes",
    },
    {
      id: 3,
      nome: "Lista_Participantes.xlsx",
      tipo: "Participantes",
      tamanho: "0.8 MB",
      dataUpload: "15/02/2025",
      autor: "Ana Silva",
    },
    {
      id: 4,
      nome: "Relatorio_Trimestral_1.pdf",
      tipo: "Relatório",
      tamanho: "3.5 MB",
      dataUpload: "30/03/2025",
      autor: "Carlos Mendes",
    },
    {
      id: 5,
      nome: "Fotos_Atividades.zip",
      tipo: "Mídia",
      tamanho: "15.7 MB",
      dataUpload: "15/04/2025",
      autor: "Pedro Santos",
    },
  ])

  const [filtroTipo, setFiltroTipo] = useState("todos")
  const [dialogAberto, setDialogAberto] = useState(false)
  const [novoDocumento, setNovoDocumento] = useState({
    nome: "",
    tipo: "",
  })
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null)

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
      autor: "Usuário Atual",
    }

    setDocumentos((prev) => [...prev, novoDoc])
    setNovoDocumento({ nome: "", tipo: "" })
    setArquivoSelecionado(null)
    setDialogAberto(false)
  }

  const removerDocumento = (id: number) => {
    setDocumentos((prev) => prev.filter((doc) => doc.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">Documentos do Projeto</h3>
          <p className="text-sm text-muted-foreground">Arquivos e documentação relacionados ao projeto</p>
        </div>
        <div className="flex gap-2">
          <Select value={filtroTipo} onValueChange={setFiltroTipo}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="Planejamento">Planejamento</SelectItem>
              <SelectItem value="Relatório">Relatório</SelectItem>
              <SelectItem value="Participantes">Participantes</SelectItem>
              <SelectItem value="Mídia">Mídia</SelectItem>
              <SelectItem value="Financeiro">Financeiro</SelectItem>
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
                <DialogDescription>Faça upload de um novo documento para o projeto</DialogDescription>
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
                          <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, XLSX, ZIP (máx. 20MB)</p>
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
                      <SelectItem value="Planejamento">Planejamento</SelectItem>
                      <SelectItem value="Relatório">Relatório</SelectItem>
                      <SelectItem value="Participantes">Participantes</SelectItem>
                      <SelectItem value="Mídia">Mídia</SelectItem>
                      <SelectItem value="Financeiro">Financeiro</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <p className="text-xs text-muted-foreground">
                        Adicionado em {documento.dataUpload} por {documento.autor}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="mr-2">
                    {documento.tipo}
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
                        {documento.tamanho}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{documento.nome.split(".").pop()?.toUpperCase()}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Visualizar
                    </Button>
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
                ? "Não há documentos cadastrados para este projeto."
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
