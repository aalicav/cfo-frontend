import { Metadata } from 'next'
import { AuthLayout } from '@/components/auth-layout'

export const metadata: Metadata = {
  title: 'Login | CFO',
  description: 'Acesse sua conta no Centro de Formação Olímpica',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthLayout>
      {children}
    </AuthLayout>
  )
} 