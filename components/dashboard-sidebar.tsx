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
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardSidebarProps {
  userRole: string;
  isCollapsed?: boolean;
}

export function DashboardSidebar({
  userRole,
  isCollapsed = false,
}: DashboardSidebarProps) {
  const pathname = usePathname();

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
    },
    {
      title: "Agenda",
      href: "/dashboard/schedule",
      icon: Calendar,
      roles: ["admin", "coach", "athlete"],
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
    {
      title: "Configurações",
      href: "/dashboard/settings",
      icon: Settings,
      roles: ["admin", "coach", "athlete"],
    },
    {
      title: "Ajuda",
      href: "/dashboard/help",
      icon: HelpCircle,
      roles: ["admin", "coach", "athlete"],
    },
  ];

  const filteredItems = menuItems.filter((item) =>
    item.roles.includes(userRole.toLowerCase())
  );

  return (
    <TooltipProvider>
      <nav className="space-y-1">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-100",
                    isActive ? "bg-green-50 text-green-700" : "text-gray-700",
                    isCollapsed ? "justify-center" : ""
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {item.title}
                </TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </nav>
    </TooltipProvider>
  );
}
