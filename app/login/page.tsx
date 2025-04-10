"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FiMail, FiLock, FiUser, FiArrowRight } from "react-icons/fi"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login, isLoading, error, clearError } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Background com imagem e gradiente */}
      <div className="hidden md:flex md:w-1/2 bg-green-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/images/olympic-training.jpg')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative flex flex-col justify-center items-center p-12 text-white z-10">
          <div className="mb-8">
            <Image 
              src="/images/cfo-logo-white.png" 
              alt="CFO Logo" 
              width={120} 
              height={120}
              className="mx-auto"
            />
          </div>
          <h2 className="text-4xl font-bold mb-6 text-center">Centro de Formação Olímpica</h2>
          <p className="text-xl mb-8 text-center max-w-md">
            Sua jornada para a excelência esportiva começa aqui. Faça login para acessar o sistema.
          </p>
          <div className="space-y-4 max-w-md">
            <div className="flex items-center p-4 bg-white bg-opacity-10 rounded-lg">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <FiUser className="text-white text-xl" />
              </div>
              <div>
                <h3 className="font-medium">Perfis Personalizados</h3>
                <p className="text-sm text-gray-200">Dashboard específico para cada tipo de usuário</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-white bg-opacity-10 rounded-lg">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Agendamentos Simplificados</h3>
                <p className="text-sm text-gray-200">Marque seus horários de treino com facilidade</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário de login */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <Card className="w-full max-w-md border-none shadow-xl">
          <CardHeader className="space-y-2 pb-4">
            <div className="md:hidden flex justify-center mb-4">
              <Image 
                src="/images/cfo-logo.png" 
                alt="CFO Logo" 
                width={80} 
                height={80}
              />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-gray-800">Bem-vindo de volta</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Entre com seus dados para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-6 bg-red-50 text-red-800 border-red-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FiMail />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nome@exemplo.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      clearError()
                    }}
                    className="pl-10 py-6 bg-gray-100 border-gray-200 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700">Senha</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-green-600 hover:text-green-800 font-medium"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FiLock />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      clearError()
                    }}
                    className="pl-10 py-6 bg-gray-100 border-gray-200 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full py-6 bg-green-600 hover:bg-green-700 text-white font-medium text-lg transition-all duration-200 ease-in-out flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
                {!isLoading && <FiArrowRight />}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pb-8 pt-2">
            <div className="text-center text-sm text-gray-600">
              Não tem uma conta?{" "}
              <Link href="/register" className="text-green-600 hover:text-green-800 font-medium">
                Registre-se
              </Link>
            </div>
            <div className="text-xs text-center text-gray-500 mt-4">
              © {new Date().getFullYear()} Centro de Formação Olímpica. Todos os direitos reservados.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
