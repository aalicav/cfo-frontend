"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Redireciona para a página específica do perfil se estiver na raiz do dashboard
    if (pathname === "/dashboard") {
      // Em uma aplicação real, isso seria baseado no perfil do usuário autenticado
      // Por padrão, redirecionamos para o perfil de usuário externo
      router.push("/dashboard/externo")
    }
  }, [pathname, router])

  return null
}
