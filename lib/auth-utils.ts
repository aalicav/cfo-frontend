// Tipos para os perfis de usuário
export type UserRole = "admin" | "gerente" | "coordenador" | "instrutor" | "atleta" | "externo"

// Interface para o usuário
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  permissions: string[]
}

// Mapeamento de permissões por perfil
export const rolePermissions: Record<UserRole, string[]> = {
  admin: [
    "users.view",
    "users.create",
    "users.edit",
    "users.delete",
    "projects.view",
    "projects.create",
    "projects.edit",
    "projects.delete",
    "spaces.view",
    "spaces.create",
    "spaces.edit",
    "spaces.delete",
    "schedules.view",
    "schedules.create",
    "schedules.edit",
    "schedules.delete",
    "performance.view",
    "performance.create",
    "performance.edit",
    "settings.view",
    "settings.edit",
    "audit.view",
  ],
  gerente: [
    "users.view",
    "users.create",
    "users.edit",
    "projects.view",
    "projects.create",
    "projects.edit",
    "spaces.view",
    "spaces.create",
    "spaces.edit",
    "schedules.view",
    "schedules.create",
    "schedules.edit",
    "performance.view",
    "performance.create",
    "performance.edit",
  ],
  coordenador: [
    "projects.view",
    "projects.create",
    "projects.edit",
    "spaces.view",
    "schedules.view",
    "schedules.create",
    "schedules.edit",
    "performance.view",
    "performance.create",
    "performance.edit",
  ],
  instrutor: [
    "projects.view",
    "spaces.view",
    "schedules.view",
    "schedules.create",
    "performance.view",
    "performance.create",
    "performance.edit",
  ],
  atleta: ["schedules.view", "performance.view"],
  externo: ["schedules.view", "schedules.create"],
}

// Função para verificar se um usuário tem uma permissão específica
export function hasPermission(user: User, permission: string): boolean {
  return user.permissions.includes(permission)
}

// Função para verificar se um usuário tem acesso a uma rota específica
export function canAccessRoute(user: User, route: string): boolean {
  // Mapeamento de rotas para permissões necessárias
  const routePermissions: Record<string, string> = {
    "/dashboard/usuarios": "users.view",
    "/dashboard/projetos": "projects.view",
    "/dashboard/modalidades": "projects.view",
    "/dashboard/agendamentos": "schedules.view",
    "/dashboard/desempenho": "performance.view",
    "/dashboard/configuracoes": "settings.view",
    "/dashboard/auditoria": "audit.view",
  }

  // Se a rota não estiver no mapeamento, permitir acesso
  if (!routePermissions[route]) {
    return true
  }

  // Verificar se o usuário tem a permissão necessária
  return hasPermission(user, routePermissions[route])
}

// Função para obter um usuário mock com base no perfil
export function getMockUser(role: UserRole): User {
  return {
    id: `user-${Math.random().toString(36).substr(2, 9)}`,
    name: `Usuário ${role.charAt(0).toUpperCase() + role.slice(1)}`,
    email: `${role}@cfo.example.com`,
    role,
    permissions: rolePermissions[role],
  }
}
