"use client";

import React, { Fragment, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  Calendar,
  Settings,
  BarChart2,
  FileText,
  MessageSquare,
  Bell,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  PanelLeftIcon,
  LogOut,
  UserCircle,
  Search,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  SidebarTrigger,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DashboardSidebarProps {
  userRole: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface MenuItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
  subItems?: { title: string; href: string }[];
  notificationCount?: number;
  keywords?: string[]; // Para busca
}

export function MainSidebar({
  userRole,
  isCollapsed = false,
  onToggleCollapse,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const [unreadMessages, setUnreadMessages] = useState(3);
  const [unreadNotifications, setUnreadNotifications] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { user, logout } = useAuth();
  
  // Inicializar menus expandidos com base no caminho atual
  useEffect(() => {
    const openStates: Record<string, boolean> = {};
    menuItems.forEach(item => {
      if (item.subItems && (pathname === item.href || pathname.startsWith(item.href + '/'))) {
        openStates[item.href] = true;
      }
    });
    setOpenMenus(openStates);
  }, [pathname]);
  
  // Mostrar botão flutuante quando a sidebar estiver colapsada (após um delay)
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isCollapsed) {
      timeout = setTimeout(() => {
        setShowFloatingButton(true);
      }, 300);
    } else {
      setShowFloatingButton(false);
    }
    
    return () => clearTimeout(timeout);
  }, [isCollapsed]);

  // Simula obtenção de dados de notificações (em um caso real, viria de uma API)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simula flutuação nas notificações para demonstração
      setUnreadMessages(Math.floor(Math.random() * 5));
      setUnreadNotifications(Math.floor(Math.random() * 7));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Atatalho de teclado para foco na busca
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K ou Cmd+K para focar na busca
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
      
      // Escape para fechar a busca
      if (e.key === 'Escape' && isSearchFocused) {
        if (searchInputRef.current) {
          searchInputRef.current.blur();
          setSearchQuery("");
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchFocused]);

  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: ["admin", "coach", "athlete"],
      keywords: ["início", "home", "painel", "principal"],
    },
    {
      title: "Atletas",
      href: "/portal-atleta",
      icon: Users,
      roles: ["admin", "coach"],
      keywords: ["jogadores", "esportistas", "alunos", "cadastro"],
      subItems: [
        { title: "Lista de Atletas", href: "/portal-atleta/lista" },
        { title: "Cadastrar Atleta", href: "/portal-atleta/cadastro" },
        { title: "Desempenho", href: "/portal-atleta/desempenho" },
      ],
    },
    {
      title: "Espaços",
      href: "/espacos",
      icon: Calendar,
      roles: ["admin", "coach", "athlete"],
      keywords: ["locais", "quadras", "instalações", "ambientes", "reservas"],
      subItems: [
        { title: "Disponíveis", href: "/espacos/disponiveis" },
        { title: "Reservados", href: "/espacos/reservados" },
        { title: "Agendar", href: "/espacos/agendar" },
      ],
    },
    {
      title: "Relatórios",
      href: "/dashboard/relatorios",
      icon: BarChart2,
      roles: ["admin", "coach"],
      keywords: ["estatísticas", "gráficos", "análises", "dados"],
    },
    {
      title: "Documentos",
      href: "/dashboard/documentos",
      icon: FileText,
      roles: ["admin", "coach", "athlete"],
      keywords: ["arquivos", "pdfs", "contratos", "termos"],
    },
    {
      title: "Mensagens",
      href: "/dashboard/mensagens",
      icon: MessageSquare,
      roles: ["admin", "coach", "athlete"],
      notificationCount: unreadMessages,
      keywords: ["chat", "comunicação", "e-mail", "contato"],
    },
    {
      title: "Notificações",
      href: "/dashboard/notificacoes",
      icon: Bell,
      roles: ["admin", "coach", "athlete"],
      notificationCount: unreadNotifications,
      keywords: ["alertas", "avisos", "informações", "updates"],
    },
  ];

  // Filtra itens por papel do usuário e busca
  const filteredItems = menuItems
    .filter((item) => item.roles.includes(userRole.toLowerCase()))
    .filter((item) => {
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      const matchesTitle = item.title.toLowerCase().includes(query);
      const matchesKeywords = item.keywords?.some(keyword => 
        keyword.toLowerCase().includes(query)
      );
      const matchesSubItems = item.subItems?.some(subItem => 
        subItem.title.toLowerCase().includes(query)
      );
      
      return matchesTitle || matchesKeywords || matchesSubItems;
    });

  const handleToggleSidebar = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    }
  };
  
  const handleToggleSubmenu = (href: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [href]: !prev[href]
    }));
  };
  
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };
  
  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Determina a frase do estado de busca
  const getSearchStatusText = () => {
    if (searchQuery && filteredItems.length === 0) {
      return "Nenhum resultado encontrado";
    }
    if (searchQuery) {
      return `${filteredItems.length} resultado${filteredItems.length !== 1 ? 's' : ''}`;
    }
    return "Pesquisar no menu";
  };

  return (
    <>
      {/* Sidebar principal */}
      <Sidebar 
        className={cn(
          "border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ease-in-out shadow-md",
          state === "expanded" ? "w-64" : "w-16",
          "h-screen fixed left-0 top-0 z-40 overflow-hidden"
        )}
      >
        <SidebarHeader className="flex justify-between items-center p-3 border-b">
          <AnimatePresence mode="wait">
            {state === "expanded" ? (
              <motion.div
                key="full-logo"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2"
              >
                <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  C
                </span>
                <span className="font-bold text-xl text-primary">
                  CFO
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="mini-logo"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center"
              >
                <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  C
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-full p-1 hover:bg-primary/10"
                  onClick={handleToggleSidebar}
                >
                  {state === "expanded" ? (
                    <ChevronLeftIcon className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {state === "expanded" ? "Recolher menu" : "Expandir menu"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </SidebarHeader>

        {/* Pesquisa */}
        <div className={cn(
          "px-3 py-3",
          state === "collapsed" && "hidden"
        )}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              type="search"
              placeholder="Pesquisar... (Ctrl+K)"
              className="pl-8 bg-muted/40 focus:bg-background border-muted-foreground/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-1 px-2 py-1 text-xs text-muted-foreground">
                {getSearchStatusText()}
              </div>
            )}
          </div>
        </div>

        <SidebarContent className="px-2 py-2 overflow-y-auto h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`sidebar-content-${state}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SidebarMenu>
                {filteredItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  const isOpen = openMenus[item.href] || false;
                  const Icon = item.icon;
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const hasNotifications = item.notificationCount && item.notificationCount > 0;

                  return (
                    <SidebarMenuItem key={item.href}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {hasSubItems ? (
                              <SidebarMenuButton
                                isActive={isActive}
                                className={cn(
                                  "group transition-all duration-200 my-1 rounded-md overflow-hidden w-full",
                                  isActive 
                                    ? "bg-primary/10 text-primary shadow-sm" 
                                    : "hover:bg-muted"
                                )}
                                onClick={() => handleToggleSubmenu(item.href)}
                              >
                                <div className="relative py-2">
                                  {isActive && (
                                    <motion.div
                                      layoutId="sidebar-active-indicator"
                                      className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                  )}
                                  
                                  <div className={cn(
                                    "flex items-center gap-3",
                                    state === "collapsed" && "justify-center"
                                  )}>
                                    <Icon className={cn(
                                      "h-5 w-5 transition-transform duration-200",
                                      isActive ? "text-primary" : "text-muted-foreground",
                                      state === "expanded" ? "mx-3" : "mx-auto"
                                    )} />
                                    
                                    {hasNotifications && (
                                      <Badge 
                                        variant="destructive" 
                                        className={cn(
                                          "absolute -top-1 -right-1 h-4 min-w-4 px-0.5 flex items-center justify-center text-[10px] animate-pulse",
                                          state === "expanded" && "right-3"
                                        )}
                                      >
                                        {item.notificationCount}
                                      </Badge>
                                    )}
                                    
                                    {state === "expanded" && (
                                      <span className={cn(
                                        "transition-colors duration-200",
                                        isActive ? "font-medium text-primary" : "text-foreground"
                                      )}>
                                        {item.title}
                                      </span>
                                    )}
                                  </div>
                                  
                                  {hasSubItems && state === "expanded" && (
                                    <ChevronDown 
                                      className={cn(
                                        "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-transform duration-300", 
                                        isOpen && "transform rotate-180",
                                        "text-muted-foreground"
                                      )} 
                                    />
                                  )}
                                </div>
                              </SidebarMenuButton>
                            ) : (
                              <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                className={cn(
                                  "group transition-all duration-200 my-1 rounded-md overflow-hidden",
                                  isActive 
                                    ? "bg-primary/10 text-primary shadow-sm" 
                                    : "hover:bg-muted"
                                )}
                              >
                                <Link href={item.href} className="relative py-2">
                                  {isActive && (
                                    <motion.div
                                      layoutId="sidebar-active-indicator"
                                      className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                  )}
                                  
                                  <div className={cn(
                                    "flex items-center gap-3",
                                    state === "collapsed" && "justify-center"
                                  )}>
                                    <Icon className={cn(
                                      "h-5 w-5 transition-transform duration-200",
                                      isActive ? "text-primary" : "text-muted-foreground",
                                      state === "expanded" ? "mx-3" : "mx-auto"
                                    )} />
                                    
                                    {hasNotifications && (
                                      <Badge 
                                        variant="destructive" 
                                        className={cn(
                                          "absolute -top-1 -right-1 h-4 min-w-4 px-0.5 flex items-center justify-center text-[10px] animate-pulse",
                                          state === "expanded" && "right-3"
                                        )}
                                      >
                                        {item.notificationCount}
                                      </Badge>
                                    )}
                                    
                                    {state === "expanded" && (
                                      <span className={cn(
                                        "transition-colors duration-200",
                                        isActive ? "font-medium text-primary" : "text-foreground"
                                      )}>
                                        {item.title}
                                      </span>
                                    )}
                                  </div>
                                </Link>
                              </SidebarMenuButton>
                            )}
                          </TooltipTrigger>
                          {state === "collapsed" && (
                            <TooltipContent side="right">
                              {item.title}
                              {hasNotifications && (
                                <span className="ml-2 text-xs">
                                  ({item.notificationCount} {item.notificationCount === 1 ? 'nova' : 'novas'})
                                </span>
                              )}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>

                      {hasSubItems && state === "expanded" && item.subItems && (
                        <AnimatePresence>
                          {isOpen && (
                            <SidebarMenuSub>
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                {item.subItems.map((subItem) => {
                                  const isSubActive = pathname === subItem.href;

                                  return (
                                    <SidebarMenuSubItem key={subItem.href}>
                                      <SidebarMenuSubButton
                                        asChild
                                        isActive={isSubActive}
                                        className={cn(
                                          "transition-colors duration-200 rounded-md overflow-hidden",
                                          isSubActive 
                                            ? "bg-primary/5 text-primary" 
                                            : "hover:bg-muted"
                                        )}
                                      >
                                        <Link href={subItem.href} className="pl-10 py-1.5 relative">
                                          {isSubActive && (
                                            <motion.div
                                              layoutId="sidebar-subitem-indicator"
                                              className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full opacity-70"
                                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                          )}
                                          <span className={cn(
                                            "text-sm",
                                            isSubActive ? "font-medium text-primary" : "text-muted-foreground"
                                          )}>
                                            {subItem.title}
                                          </span>
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  );
                                })}
                              </motion.div>
                            </SidebarMenuSub>
                          )}
                        </AnimatePresence>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </motion.div>
          </AnimatePresence>
        </SidebarContent>

        <SidebarFooter className="mt-auto border-t py-3">
          {state === "expanded" ? (
            <div className="px-3 space-y-3">
              <div className="flex items-center space-x-3 px-2">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarImage src={user?.profile_photo_url} alt={user?.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 px-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 bg-background"
                  asChild
                >
                  <Link href="/dashboard/perfil">
                    <UserCircle className="h-4 w-4 mr-1" />
                    Perfil
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 bg-background"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sair
                </Button>
              </div>
              
              <div className="text-xs text-center text-muted-foreground pt-2">
                v1.0.0 &copy; 2023 CFO
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-2 space-y-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="h-8 w-8 border-2 border-primary/10 cursor-pointer hover:border-primary/30 transition-colors">
                      <AvatarImage src={user?.profile_photo_url} alt={user?.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {user?.name}<br/>
                    <span className="text-xs text-muted-foreground">
                      {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                    </span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Sair
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>
      
      {/* Botão flutuante para reabrir a sidebar quando colapsada */}
      <AnimatePresence>
        {showFloatingButton && isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed left-0 top-20 z-50"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="h-8 rounded-r-full pl-1.5 pr-2 shadow-md border border-l-0 border-input"
                    onClick={handleToggleSidebar}
                  >
                    <PanelLeftIcon className="h-4 w-4 mr-1" />
                    <span className="text-xs">Menu</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Abrir o menu
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
