import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import { ClientLayout } from '@/components/client-layout'

const inter = Inter({ subsets: ['latin'] })

// A metadata não pode ser exportada de um componente cliente
// Essa informação será gerenciada pelo Next.js automaticamente
// baseada em configurações de outro arquivo

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  )
}
