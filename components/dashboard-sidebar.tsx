"use client";

import React, { Fragment, useEffect, useState } from "react";
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
import { motion } from "framer-motion";

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
}

export function DashboardSidebar({
  userRole,
  isCollapsed = false,
  onToggleCollapse,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const [unreadMessages, setUnreadMessages] = useState(3);
  const [unreadNotifications, setUnreadNotifications] = useState(5);

  useEffect(() => {
    // Vamos manter a sincronização apenas por props
    // O estado interno do sidebar será gerenciado pelo componente pai
  }, [isCollapsed]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simula flutuação nas notificações para demonstração
      setUnreadMessages(Math.floor(Math.random() * 5));
      setUnreadNotifications(Math.floor(Math.random() * 7));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: ["admin", "coach", "athlete"],
    },
    {
      title: "Atletas",
      href: "/dashboard/athletes",
      icon: Users,
      roles: ["admin", "coach"],
      subItems: [
        { title: "Lista de Atletas", href: "/dashboard/athletes/list" },
        { title: "Cadastrar Atleta", href: "/dashboard/athletes/create" },
        { title: "Desempenho", href: "/dashboard/athletes/performance" },
      ],
    },
    {
      title: "Agenda",
      href: "/dashboard/schedule",
      icon: Calendar,
      roles: ["admin", "coach", "athlete"],
      subItems: [
        { title: "Calendário", href: "/dashboard/schedule/calendar" },
        { title: "Treinos", href: "/dashboard/schedule/trainings" },
        { title: "Competições", href: "/dashboard/schedule/competitions" },
      ],
    },
    {
      title: "Relatórios",
      href: "/dashboard/reports",
      icon: BarChart2,
      roles: ["admin", "coach"],
    },
    {
      title: "Documentos",
      href: "/dashboard/documents",
      icon: FileText,
      roles: ["admin", "coach", "athlete"],
    },
    {
      title: "Mensagens",
      href: "/dashboard/messages",
      icon: MessageSquare,
      roles: ["admin", "coach", "athlete"],
      notificationCount: unreadMessages,
    },
    {
      title: "Notificações",
      href: "/dashboard/notificacoes",
      icon: Bell,
      roles: ["admin", "coach", "athlete"],
      notificationCount: unreadNotifications,
    },
  ];

  const filteredItems = menuItems.filter((item) =>
    item.roles.includes(userRole.toLowerCase())
  );

  const handleToggleSidebar = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    }
  };

  return (
    <Sidebar className="border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarHeader className="flex justify-between items-center">
        <div className="flex items-center gap-2 p-2">
          <span className={cn(
            "font-bold text-xl text-primary transition-opacity duration-200",
            state === "collapsed" && "opacity-0"
          )}>CFO</span>
          {state === "expanded" && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-muted-foreground"
            >
              Centro de Formação Olímpica
            </motion.span>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="mx-2"
          onClick={handleToggleSidebar}
        >
          {state === "expanded" ? 
            <ChevronLeftIcon className="h-4 w-4" /> : 
            <ChevronRightIcon className="h-4 w-4" />
          }
        </Button>
      </SidebarHeader>

      <SidebarContent className="px-1">
        <SidebarMenu>
          {filteredItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const hasNotifications = item.notificationCount && item.notificationCount > 0;

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={state === "collapsed" ? item.title : undefined}
                  className={cn(
                    "group transition-colors duration-200",
                    isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  )}
                >
                  <Link href={item.href} className="relative">
                    <Icon className={cn(
                      "h-5 w-5 transition-transform duration-200",
                      isActive && "text-primary"
                    )} />
                    
                    {hasNotifications && (
                      <Badge 
                        variant="destructive" 
                        className={cn(
                          "absolute -top-1.5 -right-1.5 h-4 min-w-4 px-0.5 flex items-center justify-center text-[10px]",
                          state === "expanded" && hasSubItems && "right-5"
                        )}
                      >
                        {item.notificationCount}
                      </Badge>
                    )}
                    
                    {state === "expanded" && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-between flex-1"
                      >
                        <span className={cn(
                          "ml-2",
                          isActive && "font-medium text-primary"
                        )}>
                          {item.title}
                        </span>
                        {hasSubItems && (
                          <ChevronDown className={cn(
                            "ml-auto h-4 w-4 transition-transform", 
                            isActive && "transform rotate-180"
                          )} />
                        )}
                      </motion.div>
                    )}
                  </Link>
                </SidebarMenuButton>

                {hasSubItems && state === "expanded" && item.subItems && (
                  <SidebarMenuSub>
                    {item.subItems.map((subItem) => {
                      const isSubActive = pathname === subItem.href;
                      
                      return (
                        <SidebarMenuSubItem key={subItem.href}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isSubActive}
                            className={cn(
                              "transition-colors duration-200",
                              isSubActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
                            )}
                          >
                            <Link href={subItem.href} className="pl-1">
                              <ChevronRight className={cn(
                                "h-4 w-4",
                                isSubActive && "text-primary"
                              )} />
                              <span className={cn(
                                "ml-2",
                                isSubActive && "font-medium text-primary"
                              )}>
                                {subItem.title}
                              </span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="mt-auto">
        <SidebarGroup>
          <SidebarGroupLabel>
            {state === "expanded" ? "Configurações" : ""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/settings"}
                  tooltip={state === "collapsed" ? "Configurações" : undefined}
                  className={cn(
                    "transition-colors duration-200",
                    pathname === "/dashboard/settings" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  )}
                >
                  <Link href="/dashboard/settings">
                    <Settings className="h-5 w-5" />
                    {state === "expanded" && (
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="ml-2"
                      >
                        Configurações
                      </motion.span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/help"}
                  tooltip={state === "collapsed" ? "Ajuda" : undefined}
                  className={cn(
                    "transition-colors duration-200",
                    pathname === "/dashboard/help" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  )}
                >
                  <Link href="/dashboard/help">
                    <HelpCircle className="h-5 w-5" />
                    {state === "expanded" && (
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="ml-2"
                      >
                        Ajuda
                      </motion.span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
