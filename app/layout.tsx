'use client';

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import { usePathname } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CFO - Centro de Formação Olímpica',
  description: 'Sistema de gerenciamento do Centro de Formação Olímpica',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { logout, user } = useAuth()
  
  // Verificar se estamos em uma página de autenticação
  const isAuthPage = 
    pathname === '/login' || 
    pathname === '/register' || 
    pathname === '/forgot-password' ||
    pathname === '/reset-password'

  // Usar o role do usuário autenticado, ou 'external' como padrão
  const userRole = user?.role || 'external'

  const handleLogout = async () => {
    await logout()
  }

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          {!isAuthPage ? (
            // Layout com sidebar e navbar para páginas que não são de autenticação
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
          ) : (
            // Layout limpo para páginas de autenticação
            <>{children}</>
          )}
        </Providers>
      </body>
    </html>
  )
}
