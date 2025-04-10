"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Menu, Users, Calendar, FileText, Home, Settings, BarChart, Shield, BookOpen, User, Bell } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  roles: string[]
}

const navItems: NavItem[] = [
  {
    title: "Início",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
    roles: ["admin", "manager", "coordinator", "instructor", "athlete", "external"],
  },
  {
    title: "Usuários",
    href: "/dashboard/usuarios",
    icon: <Users className="h-5 w-5" />,
    roles: ["admin", "manager"],
  },
  {
    title: "Projetos",
    href: "/dashboard/projetos",
    icon: <FileText className="h-5 w-5" />,
    roles: ["admin", "manager", "coordinator"],
  },
  {
    title: "Modalidades",
    href: "/dashboard/modalidades",
    icon: <BookOpen className="h-5 w-5" />,
    roles: ["admin", "manager", "coordinator", "instructor"],
  },
  {
    title: "Agendamentos",
    href: "/dashboard/agendamentos",
    icon: <Calendar className="h-5 w-5" />,
    roles: ["admin", "manager", "coordinator", "instructor", "athlete", "external"],
  },
  {
    title: "Desempenho",
    href: "/dashboard/desempenho",
    icon: <BarChart className="h-5 w-5" />,
    roles: ["admin", "manager", "coordinator", "instructor", "athlete"],
  },
  {
    title: "Relatórios",
    href: "/dashboard/relatorios",
    icon: <FileText className="h-5 w-5" />,
    roles: ["admin", "manager", "coordinator"],
  },
  {
    title: "Notificações",
    href: "/dashboard/notificacoes",
    icon: <Bell className="h-5 w-5" />,
    roles: ["admin", "manager", "coordinator", "instructor", "athlete", "external"],
  },
  {
    title: "Perfil",
    href: "/dashboard/perfil",
    icon: <User className="h-5 w-5" />,
    roles: ["admin", "manager", "coordinator", "instructor", "athlete", "external"],
  },
  {
    title: "Configurações",
    href: "/dashboard/configuracoes",
    icon: <Settings className="h-5 w-5" />,
    roles: ["admin"],
  },
  {
    title: "Auditoria",
    href: "/dashboard/auditoria",
    icon: <Shield className="h-5 w-5" />,
    roles: ["admin"],
  },
]

interface DashboardSidebarProps {
  userRole: string
}

export function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [open, setOpen] = useState(false)

  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole))

  const NavLinks = () => (
    <>
      <div className="mb-4 px-4 py-2">
        <h2 className="text-lg font-semibold">CFO Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          {userRole === "admin" && "Administrador Geral"}
          {userRole === "manager" && "Gerente de Área"}
          {userRole === "coordinator" && "Coordenador de Projeto"}
          {userRole === "instructor" && "Instrutor"}
          {userRole === "athlete" && "Atleta"}
          {userRole === "external" && "Usuário Externo"}
        </p>
      </div>
      <div className="space-y-1 px-2">
        {filteredNavItems.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
            <Button variant="ghost" className={cn("w-full justify-start", pathname === item.href && "bg-muted")}>
              {item.icon}
              <span className="ml-2">{item.title}</span>
            </Button>
          </Link>
        ))}
      </div>
    </>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <ScrollArea className="h-full py-6">
            <NavLinks />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className="hidden border-r bg-gray-50/40 md:block md:w-64">
      <ScrollArea className="h-full py-6">
        <NavLinks />
      </ScrollArea>
    </div>
  )
}
