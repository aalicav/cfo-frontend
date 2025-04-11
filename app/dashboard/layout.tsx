"use client"

import { useAuth } from '@/hooks/useAuth'
import { redirect } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  
  // Se estiver carregando, não faz nada ainda
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }
  
  // Se não estiver autenticado, redireciona para o login
  if (!user) {
    redirect('/login')
  }
  
  // O restante do layout (sidebar, cabeçalho, etc) agora está no RootLayout
  return (
    <>{children}</>
  )
}
