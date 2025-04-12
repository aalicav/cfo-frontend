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
    <div className="min-h-screen w-full bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl opacity-50" />
      <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-l from-primary/20 to-indigo-500/20 blur-3xl opacity-50" />
      
      {/* Elementos decorativos */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary/10 mix-blend-multiply blur-3xl animate-blob" />
      <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-secondary/10 mix-blend-multiply blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute bottom-40 left-1/3 w-64 h-64 rounded-full bg-accent/10 mix-blend-multiply blur-3xl animate-blob animation-delay-4000" />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          {children}
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Centro de Formação Olímpica &copy; {new Date().getFullYear()}</p>
          <div className="mt-2 flex justify-center space-x-2">
            <span className="inline-block w-3 h-3 rounded-full bg-primary"></span>
            <span className="inline-block w-3 h-3 rounded-full bg-secondary"></span>
            <span className="inline-block w-3 h-3 rounded-full bg-accent"></span>
            <span className="inline-block w-3 h-3 rounded-full bg-destructive"></span>
          </div>
        </div>
      </div>
    </div>
  )
} 