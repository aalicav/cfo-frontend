"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MainSidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  User, 
  Menu, 
  ChevronLeft, 
  ChevronRight, 
  Loader2,
  Home
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import NotificationsDropdown from "@/components/notifications-dropdown";
import { ModeToggle } from "@/components/mode-toggle";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<{label: string; path: string}[]>([]);

  // Verificar se estamos em uma página de autenticação ou erro
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/_not-found";
    
  // Verificar se estamos no dashboard
  const isDashboardPage = pathname?.startsWith('/dashboard') || 
                          pathname?.startsWith('/portal-atleta') || 
                          pathname?.startsWith('/espacos');

  // Gerar breadcrumbs baseado no pathname
  useEffect(() => {
    if (pathname) {
      const pathSegments = pathname.split('/').filter(segment => segment);
      
      // Determina onde começar os breadcrumbs
      let basePath = '/dashboard';
      let baseLabel = 'Dashboard';
      
      if (pathname.startsWith('/portal-atleta')) {
        basePath = '/portal-atleta';
        baseLabel = 'Portal do Atleta';
      } else if (pathname.startsWith('/espacos')) {
        basePath = '/espacos';
        baseLabel = 'Espaços';
      }
      
      // Inicializa com Home
      const crumbs = [{
        label: 'Home',
        path: '/dashboard'
      }];
      
      // Adiciona o segmento base se não for dashboard ou se não estiver na raiz do dashboard
      if (baseLabel !== 'Dashboard' || pathname !== '/dashboard') {
        crumbs.push({
          label: baseLabel,
          path: basePath
        });
      }
      
      // Adiciona segmentos intermediários
      let currentPath = basePath;
      pathSegments.forEach((segment, index) => {
        // Pula o primeiro segmento que já foi processado acima
        if (index === 0 && (segment === 'dashboard' || segment === 'portal-atleta' || segment === 'espacos')) {
          return;
        }
        
        currentPath += `/${segment}`;
        crumbs.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
          path: currentPath
        });
      });

      setBreadcrumbs(crumbs);
    }
  }, [pathname]);

  // Para páginas de autenticação, renderizar diretamente o conteúdo
  if (isAuthPage) {
    return <div className="min-h-screen flex flex-col">{children}</div>;
  }

  try {
    // Tentar usar o hook de autenticação (pode falhar durante SSR)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { user, isLoading, logout } = useAuth();

    // Durante o carregamento inicial ou se não houver usuário, renderizar apenas o conteúdo
    if (isLoading) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Carregando...</p>
        </div>
      );
    }
    
    if (!user) {
      return <div className="min-h-screen flex flex-col">{children}</div>;
    }

    // Obter o papel do usuário considerando os diferentes formatos
    const userRole =
      user.role ||
      (user.roles && user.roles.length > 0 ? user.roles[0].name : null) ||
      user.type ||
      "user";

    const handleLogout = async () => {
      try {
        setIsLogoutLoading(true);
        await logout();
      } catch (error) {
        console.error("Erro ao realizar logout:", error);
      } finally {
        setIsLogoutLoading(false);
      }
    };

    const toggleSidebar = () => {
      setIsSidebarCollapsed(prev => !prev);
    };

    // Layout completo para usuários autenticados
    return (
      <div className="flex min-h-screen bg-background">
        {/* Sidebar para desktop - usando DashboardSidebar para páginas do dashboard */}
        <div className={cn(
          "hidden md:block transition-all duration-300",
          !isDashboardPage && "md:w-64"
        )}>
          {isDashboardPage ? (
            <SidebarProvider>
              <MainSidebar
                userRole={userRole}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={toggleSidebar}
              />
            </SidebarProvider>
          ) : (
            <SidebarProvider defaultOpen={!isSidebarCollapsed}>
              <MainSidebar
                userRole={userRole}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={toggleSidebar}
              />
            </SidebarProvider>
          )}
        </div>

        {/* Conteúdo principal */}
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          isDashboardPage && !isSidebarCollapsed ? "md:ml-64" : (isDashboardPage && isSidebarCollapsed ? "md:ml-16" : "")
        )}>
          {/* Header */}
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <ScrollArea className="h-full py-6">
                    {isDashboardPage ? (
                      <SidebarProvider>
                        <MainSidebar userRole={userRole} />
                      </SidebarProvider>
                    ) : (
                      <SidebarProvider defaultOpen>
                        <MainSidebar userRole={userRole} />
                      </SidebarProvider>
                    )}
                  </ScrollArea>
                </SheetContent>
              </Sheet>
              
              <div className="hidden md:block">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleSidebar}
                  className="transition-colors"
                >
                  {isSidebarCollapsed ? 
                    <ChevronRight className="h-5 w-5" /> : 
                    <ChevronLeft className="h-5 w-5" />
                  }
                </Button>
              </div>
              
              <div className="flex items-center gap-2 ml-2">
                <Button variant="ghost" size="icon" asChild className="h-9 w-9">
                  <Link href="/dashboard">
                    <Home className="h-5 w-5" />
                  </Link>
                </Button>
                
                <Link href="/dashboard" className="hidden md:flex items-center">
                  <span className="font-bold text-xl text-primary">CFO</span>
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
                    <Avatar className="h-9 w-9 border border-border hover:border-primary transition-colors">
                      <AvatarImage
                        src={user.profile_photo_url}
                        alt={user.name}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-background" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/perfil" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    disabled={isLogoutLoading}
                    className="cursor-pointer"
                  >
                    {isLogoutLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Saindo...</span>
                      </>
                    ) : (
                      <>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sair</span>
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Breadcrumbs */}
          {breadcrumbs.length > 1 && (
            <div className="px-4 md:px-6 py-3 border-b bg-muted/30">
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    return (
                      <React.Fragment key={crumb.path}>
                        {isLast ? (
                          <BreadcrumbItem>
                            <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                          </BreadcrumbItem>
                        ) : (
                          <BreadcrumbItem>
                            <BreadcrumbLink href={crumb.path}>
                              {crumb.label}
                            </BreadcrumbLink>
                          </BreadcrumbItem>
                        )}
                        {!isLast && <BreadcrumbSeparator />}
                      </React.Fragment>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          )}

          {/* Conteúdo */}
          <main className="flex-1">
            <div className="py-6 md:py-8 px-4 md:px-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    );
  } catch (error) {
    // Fallback caso ocorra um erro ao usar o useAuth
    console.error("Erro ao renderizar layout:", error);
    return (
      <div className="min-h-screen flex flex-col">
        {children}
      </div>
    );
  }
}
