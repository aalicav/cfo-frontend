import { Metadata } from 'next'
import { AuthLayout } from '@/components/auth-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Login | CFO',
  description: 'Acesse sua conta no Centro de Formação Olímpica',
}

export default function LoginPage() {
  return (
    <AuthLayout title="Bem-vindo de volta" description="Faça login para acessar sua conta">
      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link
              href="/forgot-password"
              className="text-sm text-green-600 hover:text-green-700"
            >
              Esqueceu sua senha?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Entrar
        </Button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-4">
        Não tem uma conta?{' '}
        <Link
          href="/register"
          className="text-green-600 hover:text-green-700"
        >
          Cadastre-se
        </Link>
      </p>
    </AuthLayout>
  )
}
