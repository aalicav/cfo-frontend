"use client"

import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, isLoading, logout } = useAuth()
  
  // Se estiver carregando, não faz nada ainda
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }
  
  // Se não estiver autenticado, redireciona para o login
  if (!user) {
    redirect('/login')
  }

  // Usar o role do usuário autenticado, ou 'external' como padrão
  const userRole = user?.role || 'external'
  
  const handleLogout = async () => {
    await logout()
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-white px-4 md:px-6">
        <DashboardSidebar userRole={userRole} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Sair</span>
          </Button>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden md:block md:w-64">{/* Espaço reservado para o sidebar fixo */}</aside>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
