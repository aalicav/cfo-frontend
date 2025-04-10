"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FiMail, FiLock, FiUser, FiArrowRight, FiUserPlus } from "react-icons/fi"
import { HiOutlineAcademicCap, HiOutlineUserGroup } from "react-icons/hi"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [type, setType] = useState("external")
  const { register, isLoading, error, clearError } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await register({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
      type,
    })
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Background com imagem e gradiente - Visível apenas em telas médias e grandes */}
      <div className="hidden md:flex md:w-1/2 bg-green-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/images/olympic-athletes.jpg')] bg-cover bg-center mix-blend-overlay"></div>
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
          <h2 className="text-4xl font-bold mb-6 text-center">Junte-se à comunidade CFO</h2>
          <p className="text-xl mb-8 text-center max-w-md">
            Faça parte da nossa comunidade esportiva. Registre-se para acessar recursos exclusivos.
          </p>
          
          <div className="grid grid-cols-1 gap-4 max-w-md w-full">
            <div className="flex items-center p-4 bg-white bg-opacity-10 rounded-lg">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <HiOutlineAcademicCap className="text-white text-xl" />
              </div>
              <div>
                <h3 className="font-medium">Para Atletas</h3>
                <p className="text-sm text-gray-200">Acesse seu progresso, treinamentos e calendário</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-white bg-opacity-10 rounded-lg">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <HiOutlineUserGroup className="text-white text-xl" />
              </div>
              <div>
                <h3 className="font-medium">Para Instrutores</h3>
                <p className="text-sm text-gray-200">Gerencie suas turmas e atividades esportivas</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-white bg-opacity-10 rounded-lg">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <FiUser className="text-white text-xl" />
              </div>
              <div>
                <h3 className="font-medium">Para Visitantes</h3>
                <p className="text-sm text-gray-200">Agende uso de instalações e participe de eventos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário de registro */}
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
            <CardTitle className="text-2xl font-bold text-center text-gray-800">Criar uma conta</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Preencha seus dados para criar sua conta no CFO
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-6 bg-red-50 text-red-800 border-red-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">Nome completo</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FiUser />
                  </div>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      clearError()
                    }}
                    className="pl-10 py-6 bg-gray-100 border-gray-200 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>
              
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
                <Label htmlFor="type" className="text-gray-700">Tipo de usuário</Label>
                <Select
                  value={type}
                  onValueChange={(value) => {
                    setType(value)
                    clearError()
                  }}
                >
                  <SelectTrigger id="type" className="bg-gray-100 border-gray-200 focus:ring-green-500 focus:border-green-500 py-6">
                    <SelectValue placeholder="Selecione o tipo de usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="external">Visitante Externo</SelectItem>
                    <SelectItem value="athlete">Atleta</SelectItem>
                    <SelectItem value="instructor">Instrutor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Senha</Label>
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
              
              <div className="space-y-2">
                <Label htmlFor="password_confirmation" className="text-gray-700">Confirme a senha</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FiLock />
                  </div>
                  <Input
                    id="password_confirmation"
                    type="password"
                    placeholder="••••••••"
                    value={passwordConfirmation}
                    onChange={(e) => {
                      setPasswordConfirmation(e.target.value)
                      clearError()
                    }}
                    className="pl-10 py-6 bg-gray-100 border-gray-200 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full mt-6 py-6 bg-green-600 hover:bg-green-700 text-white font-medium text-lg transition-all duration-200 ease-in-out flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? "Registrando..." : "Criar conta"}
                {!isLoading && <FiUserPlus />}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pb-8 pt-2">
            <div className="text-center text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-green-600 hover:text-green-800 font-medium">
                Faça login
              </Link>
            </div>
            <div className="text-xs text-center text-gray-500 mt-2">
              © {new Date().getFullYear()} Centro de Formação Olímpica. Todos os direitos reservados.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
