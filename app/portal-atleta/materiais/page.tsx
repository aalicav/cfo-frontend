"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, FileText, Video, Download, ExternalLink, BookOpen } from "lucide-react"
import { AtletaPortalLayout } from "@/components/atleta-portal-layout"

export default function PortalAtletaMateriaisPage() {
  return (
    <AtletaPortalLayout>
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/portal-atleta/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Materiais de Apoio</h1>
            <p className="text-muted-foreground">Acesse materiais de treinamento, apostilas e vídeos</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar materiais por título, categoria ou descrição..."
            className="pl-8"
          />
        </div>

        <Tabs defaultValue="todos" className="space-y-4">
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="treinos">Treinos</TabsTrigger>
            <TabsTrigger value="videos">Vídeos</TabsTrigger>
            <TabsTrigger value="apostilas">Apostilas</TabsTrigger>
            <TabsTrigger value="nutrição">Nutrição</TabsTrigger>
          </TabsList>

          <TabsContent value="todos" className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Materiais Recentes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-0">
                    <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-700 p-2 rounded-md">
                          <Video className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Técnica de Nado Crawl</h3>
                          <p className="text-xs text-muted-foreground">Vídeo • Natação</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500">Novo</Badge>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Vídeo demonstrativo da técnica correta do nado crawl, com foco na posição da cabeça e respiração.
                      </p>
                      <div className="flex justify-between items-center">
                        <Button variant="outline" size="sm" className="text-green-700">
                          <ExternalLink className="h-4 w-4 mr-1" /> Assistir
                        </Button>
                        <span className="text-xs text-muted-foreground">Adicionado: 18/03/2025</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-0">
                    <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100 text-purple-700 p-2 rounded-md">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Plano de Treino Semanal</h3>
                          <p className="text-xs text-muted-foreground">Documento • Natação</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500">Novo</Badge>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Plano detalhado de treinos para a semana, com foco na preparação para o Campeonato Estadual.
                      </p>
                      <div className="flex justify-between items-center">
                        <Button variant="outline" size="sm" className="text-green-700">
                          <Download className="h-4 w-4 mr-1" /> Baixar PDF
                        </Button>
                        <span className="text-xs text-muted-foreground">Adicionado: 20/03/2025</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-0">
                    <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 text-green-700 p-2 rounded-md">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Guia de Nutrição para Atletas</h3>
                          <p className="text-xs text-muted-foreground">Apostila • Nutrição</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Guia completo de nutrição para atletas de alto rendimento, com dicas de alimentação pré e pós-treino.
                      </p>
                      <div className="flex justify-between items-center">
                        <Button variant="outline" size="sm" className="text-green-700">
                          <Download className="h-4 w-4 mr-1" /> Baixar PDF
                        </Button>
                        <span className="text-xs text-muted-foreground">Adicionado: 15/03/2025</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Materiais Recomendados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-0">
                    <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-700 p-2 rounded-md">
                          <Video className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Exercícios de Fortalecimento</h3>
                          <p className="text-xs text-muted-foreground">Vídeo • Preparação Física</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Série de exercícios para fortalecimento muscular específico para nadadores.
                      </p>
                      <div className="flex justify-between items-center">
                        <Button variant="outline" size="sm" className="text-green-700">
                          <ExternalLink className="h-4 w-4 mr-1" /> Assistir
                        </Button>
                        \
