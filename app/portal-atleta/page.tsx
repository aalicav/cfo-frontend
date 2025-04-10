"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AtletaPortalLayout } from "@/components/atleta-portal-layout"

export default function PortalAtletaPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [lembrar, setLembrar] = useState(false)
  const [recuperacao, setRecuperacao] = useState("")
  const [activeTab, setActiveTab] = useState("login")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Em uma aplicação real, aqui seria feita a autenticação
    router.push("/portal-atleta/dashboard")
  }

  const handleRecuperacao = (e: React.FormEvent) => {
    e.preventDefault()
    // Em uma aplicação real, aqui seria enviado o email de recuperação
    alert("Um email de recuperação foi enviado para " + recuperacao)
    setActiveTab("login")
  }

  return (
    <AtletaPortalLayout>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-green-700">Portal do Atleta</h1>
            <p className="text-muted-foreground">Centro de Formação Olímpica</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Acesso ao Portal</CardTitle>
              <CardDescription>Entre com suas credenciais para acessar o portal do atleta</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="recuperar">Recuperar Senha</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu.email@exemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="senha">Senha</Label>
                      </div>
                      <Input
                        id="senha"
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="lembrar"
                        checked={lembrar}
                        onChange={(e) => setLembrar(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="lembrar" className="text-sm font-normal">
                        Lembrar de mim
                      </Label>
                    </div>
                    <Button type="submit" className="w-full bg-green-700 hover:bg-green-600">
                      Entrar
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="recuperar">
                  <form onSubmit={handleRecuperacao} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="recuperacao">Email</Label>
                      <Input
                        id="recuperacao"
                        type="email"
                        placeholder="seu.email@exemplo.com"
                        value={recuperacao}
                        onChange={(e) => setRecuperacao(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-green-700 hover:bg-green-600">
                      Recuperar Senha
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Não tem acesso? Entre em contato com a coordenação do CFO para solicitar seu cadastro.</p>
            <div className="mt-4">
              <Link href="/" className="text-green-700 hover:underline">
                Voltar para o site principal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AtletaPortalLayout>
  )
}
