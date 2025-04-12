"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MainSidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  User, 
  Menu, 
  ChevronLeft, 
  ChevronRight, 
  Loader2,
  Home,
  Settings,
  Users,
  BarChart4,
  ClipboardList,
  Calendar,
  Trophy,
  BookOpen,
  Building,
  LucideIcon
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
import { SidebarProvider } from "@/components/ui/sidebar";
import NotificationsDropdown from "@/components/notifications-dropdown";
import { ModeToggle } from "@/components/mode-toggle";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface ClientLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  submenu?: MenuItem[];
  exact?: boolean;
}

// Menu items para a versão mobile e desktop
const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart4,
    exact: true,
  },
  {
    title: "Atletas",
    href: "/dashboard/atletas",
    icon: Users,
  },
  {
    title: "Times",
    href: "/dashboard/times",
    icon: Building,
  },
  {
    title: "Competições",
    href: "/dashboard/competicoes",
    icon: Trophy,
  },
  {
    title: "Eventos",
    href: "/dashboard/eventos",
    icon: Calendar,
  },
  {
    title: "Relatórios",
    href: "/dashboard/relatorios",
    icon: ClipboardList,
  },
  {
    title: "Documentação",
    href: "/dashboard/docs",
    icon: BookOpen,
  },
  {
    title: "Configurações",
    href: "/dashboard/configuracoes",
    icon: Settings,
  },
];

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<{label: string; path: string}[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Verificar se estamos em uma página de autenticação ou erro
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/_not-found";
    
  // Verificar se estamos no dashboard
  const isDashboardPage = Boolean(pathname?.startsWith('/dashboard'));

  // Fechar sidebar mobile ao mudar de rota
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  // Gerar breadcrumbs baseado no pathname
  useEffect(() => {
    if (pathname) {
      const pathSegments = pathname.split('/').filter(segment => segment);
      
      // Inicializa com Home
      const crumbs = [{
        label: 'Home',
        path: '/dashboard'
      }];

      // Adiciona segmentos intermediários
      let currentPath = '';
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        
        // Não adicionar o primeiro segmento se for dashboard (já foi adicionado como Home)
        if (index === 0 && segment === 'dashboard') return;
        
        // Formatar o nome para exibição
        const displayName = segment
          .replace(/-/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        crumbs.push({
          label: displayName,
          path: currentPath
        });
      });

      setBreadcrumbs(crumbs);
    }
  }, [pathname]);

  // Verificar se um item está ativo
  const isItemActive = (item: MenuItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname === item.href || pathname?.startsWith(item.href + '/');
  };

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
        {/* SidebarProvider envolvendo todo o layout para compartilhar o estado */}
        <SidebarProvider>
          {/* Sidebar para desktop */}
          <div className={cn(
            "hidden md:block transition-all duration-300 fixed top-0 left-0 bottom-0 z-40 bg-blue-950 border-r border-blue-900 shadow-md",
            isSidebarCollapsed ? "w-[80px]" : "w-[240px]"
          )}>
            <MainSidebar
              userRole={userRole}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={toggleSidebar}
            />
          </div>

          {/* Conteúdo principal */}
          <div className={cn(
            "flex-1 flex flex-col transition-all duration-300",
            isSidebarCollapsed ? "md:pl-[80px]" : "md:pl-[240px]"
          )}>
            {/* Header */}
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
                  <SheetTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="md:hidden"
                    >
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent 
                    side="left" 
                    className="w-[280px] p-0 z-50 bg-blue-950" 
                  >
                    {/* Menu Mobile Estilizado */}
                    <div className="h-full flex flex-col">
                      <div className="p-6 border-b border-blue-900 bg-[#0c1c36] flex items-center">
                        <Link href="/dashboard" onClick={() => setIsMobileSidebarOpen(false)} className="flex items-center">
                          <span className="font-bold text-2xl text-white">CFO</span>
                          <span className="ml-2 text-sm text-white/90">Centro de Formação Olímpica</span>
                        </Link>
                      </div>
                      <ScrollArea className="flex-1 p-4">
                        <div className="py-2">
                          <h4 className="mb-2 px-2 text-xs font-semibold text-white/90 uppercase tracking-wider">
                            Menu Principal
                          </h4>
                          <nav className="space-y-1.5">
                            {menuItems.map((item) => {
                              const active = isItemActive(item);
                              return (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  onClick={() => setIsMobileSidebarOpen(false)}
                                  className={cn(
                                    "flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm font-medium transition-all duration-200 group relative",
                                    active 
                                      ? "bg-blue-700 text-white shadow-md" 
                                      : "text-white hover:bg-blue-900 hover:text-white"
                                  )}
                                >
                                  <item.icon className={cn(
                                    "h-5 w-5 transition-colors",
                                    active 
                                      ? "text-white" 
                                      : "text-white/90 group-hover:text-white"
                                  )} />
                                  <span>{item.title}</span>
                                  {active && (
                                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-white"></span>
                                  )}
                                </Link>
                              );
                            })}
                          </nav>
                        </div>
                      </ScrollArea>
                      <div className="p-4 border-t border-blue-900 bg-[#0c1c36]">
                        <div className="flex items-center gap-3 mb-3 px-3 py-2">
                          <Avatar className="h-10 w-10 border-2 border-white/20">
                            <AvatarFallback className="bg-blue-700 text-white font-medium">
                              {user?.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user.name}</p>
                            <p className="text-xs text-white/80">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            variant="outline" 
                            className="w-full justify-center gap-2 bg-blue-700 text-white border-blue-800 hover:bg-blue-600 hover:text-white" 
                            onClick={() => {
                              setIsMobileSidebarOpen(false);
                              router.push('/dashboard/perfil');
                            }}
                            size="sm"
                          >
                            <User className="h-4 w-4" />
                            <span>Perfil</span>
                          </Button>
                          <Button 
                            variant="destructive" 
                            className="w-full justify-center gap-2" 
                            onClick={() => {
                              setIsMobileSidebarOpen(false);
                              handleLogout();
                            }}
                            disabled={isLogoutLoading}
                            size="sm"
                          >
                            {isLogoutLoading ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Saindo...</span>
                              </>
                            ) : (
                              <>
                                <LogOut className="h-4 w-4" />
                                <span>Sair</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                
                <div className="hidden md:block">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleSidebar}
                    className="transition-colors"
                    aria-label={isSidebarCollapsed ? "Expandir menu" : "Recolher menu"}
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
                          src={user?.profile_photo_url}
                          alt={user?.name}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user?.name?.charAt(0)}
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
              <div className="p-4 md:p-6 h-full">
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
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
