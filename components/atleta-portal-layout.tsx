"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Home, Calendar, Award, LineChart, FileText, MessageSquare, User, LogOut, Menu, Bell } from "lucide-react"

interface AtletaPortalLayoutProps {
  children: React.ReactNode
}

export function AtletaPortalLayout({ children }: AtletaPortalLayoutProps) {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Verificar se o usuário está na página de login ou em outra página do portal
    setIsLoggedIn(pathname !== "/portal-atleta" && pathname?.startsWith("/portal-atleta"))
  }, [pathname])

  if (!isLoggedIn) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-white px-4 md:px-6">
        <div className="flex items-center gap-2 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader className="border-b pb-4">
                <SheetTitle>Portal do Atleta</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 py-4">
                <MobileNavLink
                  href="/portal-atleta/dashboard"
                  icon={<Home className="mr-2 h-4 w-4" />}
                  active={pathname === "/portal-atleta/dashboard"}
                >
                  Início
                </MobileNavLink>
                <MobileNavLink
                  href="/portal-atleta/agenda"
                  icon={<Calendar className="mr-2 h-4 w-4" />}
                  active={pathname === "/portal-atleta/agenda"}
                >
                  Agenda
                </MobileNavLink>
                <MobileNavLink
                  href="/portal-atleta/competicoes"
                  icon={<Award className="mr-2 h-4 w-4" />}
                  active={pathname === "/portal-atleta/competicoes"}
                >
                  Competições
                </MobileNavLink>
                <MobileNavLink
                  href="/portal-atleta/desempenho"
                  icon={<LineChart className="mr-2 h-4 w-4" />}
                  active={pathname === "/portal-atleta/desempenho"}
                >
                  Desempenho
                </MobileNavLink>
                <MobileNavLink
                  href="/portal-atleta/documentos"
                  icon={<FileText className="mr-2 h-4 w-4" />}
                  active={pathname === "/portal-atleta/documentos"}
                >
                  Documentos
                </MobileNavLink>
                <MobileNavLink
                  href="/portal-atleta/mensagens"
                  icon={<MessageSquare className="mr-2 h-4 w-4" />}
                  active={pathname === "/portal-atleta/mensagens"}
                >
                  Mensagens
                </MobileNavLink>
                <MobileNavLink
                  href="/portal-atleta/perfil"
                  icon={<User className="mr-2 h-4 w-4" />}
                  active={pathname === "/portal-atleta/perfil"}
                >
                  Meu Perfil
                </MobileNavLink>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/portal-atleta/dashboard" className="flex items-center gap-2">
            <span className="font-bold text-green-700">Portal do Atleta</span>
          </Link>
        </div>
        <div className="hidden md:flex md:items-center md:gap-6">
          <Link href="/portal-atleta/dashboard" className="flex items-center gap-2">
            <span className="font-bold text-green-700">Portal do Atleta</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/portal-atleta/dashboard"
              className={`text-sm font-medium ${
                pathname === "/portal-atleta/dashboard" ? "text-green-700" : "text-muted-foreground"
              } hover:text-green-700`}
            >
              Início
            </Link>
            <Link
              href="/portal-atleta/agenda"
              className={`text-sm font-medium ${
                pathname === "/portal-atleta/agenda" ? "text-green-700" : "text-muted-foreground"
              } hover:text-green-700`}
            >
              Agenda
            </Link>
            <Link
              href="/portal-atleta/competicoes"
              className={`text-sm font-medium ${
                pathname === "/portal-atleta/competicoes" ? "text-green-700" : "text-muted-foreground"
              } hover:text-green-700`}
            >
              Competições
            </Link>
            <Link
              href="/portal-atleta/desempenho"
              className={`text-sm font-medium ${
                pathname === "/portal-atleta/desempenho" ? "text-green-700" : "text-muted-foreground"
              } hover:text-green-700`}
            >
              Desempenho
            </Link>
            <Link
              href="/portal-atleta/documentos"
              className={`text-sm font-medium ${
                pathname === "/portal-atleta/documentos" ? "text-green-700" : "text-muted-foreground"
              } hover:text-green-700`}
            >
              Documentos
            </Link>
            <Link
              href="/portal-atleta/mensagens"
              className={`text-sm font-medium ${
                pathname === "/portal-atleta/mensagens" ? "text-green-700" : "text-muted-foreground"
              } hover:text-green-700`}
            >
              Mensagens
            </Link>
          </nav>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notificações</span>
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-medium">Notificações</span>
                <Button variant="ghost" size="sm" className="text-xs h-auto p-0">
                  Marcar todas como lidas
                </Button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <div className="p-4 border-b bg-blue-50">
                  <div className="flex items-start gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Novo treino agendado</p>
                      <p className="text-xs text-muted-foreground">Treino de Natação amanhã às 15:00</p>
                      <p className="text-xs text-muted-foreground mt-1">Há 10 minutos</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-b bg-blue-50">
                  <div className="flex items-start gap-2">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                      <Award className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nova competição</p>
                      <p className="text-xs text-muted-foreground">Você foi inscrito no Campeonato Estadual</p>
                      <p className="text-xs text-muted-foreground mt-1">Há 2 horas</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-b bg-blue-50">
                  <div className="flex items-start gap-2">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nova mensagem</p>
                      <p className="text-xs text-muted-foreground">Mensagem do seu treinador: "Parabéns pelo..."</p>
                      <p className="text-xs text-muted-foreground mt-1">Há 1 dia</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-b">
                  <div className="flex items-start gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Documento atualizado</p>
                      <p className="text-xs text-muted-foreground">Seu atestado médico foi atualizado</p>
                      <p className="text-xs text-muted-foreground mt-1">Há 3 dias</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2 border-t">
                <Button variant="ghost" size="sm" className="w-full text-xs justify-center">
                  Ver todas as notificações
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="sr-only">Perfil</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center gap-2 p-2">
                <div className="flex flex-col space-y-0.5">
                  <span className="text-sm font-medium">João da Silva</span>
                  <span className="text-xs text-muted-foreground">joao.silva@email.com</span>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/portal-atleta/perfil">
                  <User className="mr-2 h-4 w-4" />
                  Meu Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/portal-atleta/configuracoes">
                  <User className="mr-2 h-4 w-4" />
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/portal-atleta">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}

interface MobileNavLinkProps {
  href: string
  icon: React.ReactNode
  active: boolean
  children: React.ReactNode
}

function MobileNavLink({ href, icon, active, children }: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center px-3 py-2 rounded-md ${
        active ? "bg-green-50 text-green-700" : "text-muted-foreground hover:bg-gray-100"
      }`}
    >
      {icon}
      {children}
    </Link>
  )
}
