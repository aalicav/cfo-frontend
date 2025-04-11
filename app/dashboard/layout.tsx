"use client"

import { useAuth } from '@/hooks/useAuth'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Trophy, 
  BarChart2, 
  FileText,
  Bell,
  Settings,
  HelpCircle,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Projetos',
    href: '/dashboard/projetos',
    icon: Trophy
  },
  {
    title: 'Modalidades',
    href: '/dashboard/modalidades',
    icon: Trophy
  },
  {
    title: 'Espaços',
    href: '/dashboard/espacos',
    icon: Calendar
  },
  {
    title: 'Atletas',
    href: '/dashboard/atletas',
    icon: Users
  },
  {
    title: 'Times',
    href: '/dashboard/times',
    icon: Users
  },
  {
    title: 'Agendamentos',
    href: '/dashboard/agendamentos',
    icon: Calendar
  },
  {
    title: 'Desempenho',
    href: '/dashboard/desempenho',
    icon: BarChart2
  },
  {
    title: 'Relatórios',
    href: '/dashboard/relatorios',
    icon: FileText
  }
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  
  // Se estiver carregando, não faz nada ainda
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }
  
  // Se não estiver autenticado, redireciona para o login
  if (!user) {
    redirect('/login')
  }
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 w-64 h-screen transition-transform",
        "bg-background border-r",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              CFO
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="space-y-1 p-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "flex-1 transition-all",
        isSidebarOpen ? "ml-64" : "ml-0"
      )}>
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-4 ml-auto">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
