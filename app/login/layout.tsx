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
    <div className="flex flex-col items-center justify-center h-screen">
      {children}
    </div>
  )
} 