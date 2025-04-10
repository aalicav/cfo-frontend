"use client"

import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { redirect } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, isLoading } = useAuth()
  
  // Se estiver carregando, não faz nada ainda
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }
  
  // Se não estiver autenticado, redireciona para o login
  if (!user) {
    redirect('/login')
  }
  
  // Verificar se o usuário tem acesso à rota atual baseado no role
  const pathSegments = pathname.split('/')
  if (pathSegments.length > 2) {
    const roleFromPath = pathSegments[2]
    if (["admin", "manager", "coordinator", "instructor", "athlete", "external"].includes(roleFromPath)) {
      // Se o usuário não tem o role necessário para a rota, redireciona para dashboard geral
      if (user.role !== roleFromPath && roleFromPath !== 'perfil') {
        redirect('/dashboard')
      }
    }
  }

  return (
    <>{children}</>
  )
}
