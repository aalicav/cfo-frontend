import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Login | CFO - Centro de Formação Olímpica',
  description: 'Acesse sua conta no sistema do Centro de Formação Olímpica',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Lado esquerdo - Imagem e informações */}
      <div className="hidden md:flex flex-col w-1/2 bg-green-700 text-white p-8 relative">
        <div className="relative z-10">
          {/* Logo */}
          <div className="mb-12">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">CFO</span>
              <span>Centro de Formação Olímpica</span>
            </Link>
          </div>
          
          {/* Conteúdo principal */}
          <div className="flex flex-col h-full justify-center">
            <h1 className="text-4xl font-bold mb-6">Formando campeões olímpicos do futuro</h1>
            <p className="text-lg mb-8 max-w-md">
              Nossa missão é identificar, desenvolver e lapidar talentos esportivos para representar o Brasil nos maiores palcos do esporte mundial.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-auto">
              <div className="bg-green-600/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-1">+2000</h3>
                <p className="text-sm text-gray-100">Atletas formados</p>
              </div>
              <div className="bg-green-600/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-1">+25</h3>
                <p className="text-sm text-gray-100">Modalidades olímpicas</p>
              </div>
              <div className="bg-green-600/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-1">+150</h3>
                <p className="text-sm text-gray-100">Medalhas conquistadas</p>
              </div>
              <div className="bg-green-600/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-1">+30</h3>
                <p className="text-sm text-gray-100">Anos de história</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Imagem de fundo com sobreposição */}
        <div className="absolute inset-0 opacity-15 bg-fixed" style={{ 
          backgroundImage: "url('/images/olympic-training.jpg')", 
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />
      </div>
      
      {/* Lado direito - Formulário */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-12 bg-gray-50">
        <Card className="w-full max-w-md p-8 shadow-lg">
          {children}
        </Card>
      </div>
    </div>
  )
} 