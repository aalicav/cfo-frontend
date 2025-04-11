"use client";

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

interface DashboardSidebarProps {
  userRole: string;
  isCollapsed?: boolean;
}

export function DashboardSidebar({
  userRole,
  isCollapsed = false,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { state } = useSidebar();

  const menuItems = [
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
    },
    {
      title: "Notificações",
      href: "/dashboard/notifications",
      icon: Bell,
      roles: ["admin", "coach", "athlete"],
    },
  ];

  const filteredItems = menuItems.filter((item) =>
    item.roles.includes(userRole.toLowerCase())
  );

  return (
    <SidebarProvider defaultOpen={!isCollapsed}>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <span className="font-bold text-xl text-green-700">CFO</span>
            {state === "expanded" && (
              <span className="text-sm text-gray-600">Centro de Formação Olímpica</span>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {filteredItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              const hasSubItems = item.subItems && item.subItems.length > 0;

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={state === "collapsed" ? item.title : undefined}
                  >
                    <Link href={item.href}>
                      <Icon className="h-5 w-5" />
                      {state === "expanded" && (
                        <>
                          <span>{item.title}</span>
                          {hasSubItems && (
                            <ChevronDown className="ml-auto h-4 w-4" />
                          )}
                        </>
                      )}
                    </Link>
                  </SidebarMenuButton>

                  {hasSubItems && state === "expanded" && (
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.href}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === subItem.href}
                          >
                            <Link href={subItem.href}>
                              <ChevronRight className="h-4 w-4" />
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <SidebarGroup>
            <SidebarGroupLabel>Configurações</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard/settings"}
                    tooltip={state === "collapsed" ? "Configurações" : undefined}
                  >
                    <Link href="/dashboard/settings">
                      <Settings className="h-5 w-5" />
                      {state === "expanded" && <span>Configurações</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard/help"}
                    tooltip={state === "collapsed" ? "Ajuda" : undefined}
                  >
                    <Link href="/dashboard/help">
                      <HelpCircle className="h-5 w-5" />
                      {state === "expanded" && <span>Ajuda</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
