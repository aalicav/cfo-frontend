'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import { usePathname } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { LogOut, User, Menu } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { ScrollArea } from '@/components/ui/scroll-area'

const inter = Inter({ subsets: ['latin'] })

// A metadata não pode ser exportada de um componente cliente
// Essa informação será gerenciada pelo Next.js automaticamente
// baseada em configurações de outro arquivo

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, isLoading, logout } = useAuth()
  
  // Verificar se estamos em uma página de autenticação
  const isAuthPage = 
    pathname === '/login' || 
    pathname === '/register' || 
    pathname === '/forgot-password' ||
    pathname === '/reset-password'

  // Se for uma página de autenticação ou não houver usuário, não mostrar o layout completo
  if (isAuthPage || !user) {
    return (
      <html lang="pt-BR">
        <body className={inter.className}>
          <Providers>
            <div className="min-h-screen flex flex-col">
              {children}
            </div>
          </Providers>
        </body>
      </html>
    )
  }
  
  // Obter o papel do usuário considerando os diferentes formatos
  const userRole = user.role || 
                  (user.roles && user.roles.length > 0 ? user.roles[0].name : null) || 
                  user.type || 
                  'user'
  
  const handleLogout = async () => {
    await logout()
  }

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 flex h-16 items-center border-b bg-white px-4 md:px-6">
              {/* Mobile sidebar trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <ScrollArea className="h-full py-6">
                    <DashboardSidebar userRole={userRole} />
                  </ScrollArea>
                </SheetContent>
              </Sheet>
              
              {/* Logo */}
              <div className="ml-2 md:ml-0 flex items-center">
                <Link href="/dashboard" className="flex items-center space-x-2">
                  <span className="font-bold text-xl text-green-700">CFO</span>
                  <span className="hidden md:inline-block">Centro de Formação Olímpica</span>
                </Link>
              </div>
              
              {/* User dropdown and actions */}
              <div className="flex flex-1 items-center justify-end space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 relative">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.profile_photo_url} alt={user.name} />
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring ring-white" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <Link href="/dashboard/perfil">Perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
            
            {/* Main content */}
            <div className="flex flex-1">
              {/* Sidebar - hidden on mobile */}
              <div className="hidden md:block w-64 border-r bg-gray-50">
                <ScrollArea className="h-[calc(100vh-4rem)]">
                  <DashboardSidebar userRole={userRole} />
                </ScrollArea>
              </div>
              
              {/* Main content */}
              <main className="flex-1">
                <div className="container py-6 md:py-8 px-4 md:px-6">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
