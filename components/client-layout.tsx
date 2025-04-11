"use client";

import { usePathname } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { LogOut, User, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import NotificationsDropdown from "@/components/notifications-dropdown";
import { ModeToggle } from "@/components/mode-toggle";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Verificar se estamos em uma página de autenticação ou erro
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/_not-found";

  // Para páginas de autenticação, renderizar diretamente o conteúdo
  if (isAuthPage) {
    return <div className="min-h-screen flex flex-col">{children}</div>;
  }

  try {
    // Tentar usar o hook de autenticação (pode falhar durante SSR)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { user, isLoading, logout } = useAuth();

    // Durante o carregamento inicial ou se não houver usuário, renderizar apenas o conteúdo
    if (isLoading || !user) {
      return <div className="min-h-screen flex flex-col">{children}</div>;
    }

    // Obter o papel do usuário considerando os diferentes formatos
    const userRole =
      user.role ||
      (user.roles && user.roles.length > 0 ? user.roles[0].name : null) ||
      user.type ||
      "user";

    const handleLogout = async () => {
      await logout();
    };

    // Layout completo para usuários autenticados
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar para desktop */}
        <div className="hidden md:block">
          <SidebarProvider defaultOpen={!isSidebarCollapsed}>
            <DashboardSidebar
              userRole={userRole}
              isCollapsed={isSidebarCollapsed}
            />
          </SidebarProvider>
        </div>

        {/* Conteúdo principal */}
        <SidebarInset>
          {/* Header */}
          <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
            <div className="flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <ScrollArea className="h-full py-6">
                    <SidebarProvider defaultOpen>
                      <DashboardSidebar userRole={userRole} />
                    </SidebarProvider>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
              
              <div className="hidden md:block ml-4">
                <Link href="/dashboard" className="flex items-center">
                  <span className="font-bold text-xl">CFO</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <NotificationsDropdown />
              <ModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-9 w-9 relative"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={user.profile_photo_url}
                        alt={user.name}
                      />
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

          {/* Conteúdo */}
          <main className="flex-1">
            <div className="container py-6 md:py-8 px-4 md:px-6">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    );
  } catch (error) {
    // Fallback caso ocorra um erro ao usar o useAuth
    return <div className="min-h-screen flex flex-col">{children}</div>;
  }
}
