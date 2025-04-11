import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { FiUser } from 'react-icons/fi'

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Lado esquerdo - Imagem e informações */}
      <div className="hidden md:flex flex-col w-1/2 bg-green-700 text-white p-8 relative">
        <div className="relative z-10">
          {/* Logo */}
          <div className="mb-12">
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/images/cfo-logo-white.png" 
                alt="CFO Logo" 
                width={40} 
                height={40}
              />
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
            
            <div className="space-y-4 max-w-md">
              <div className="flex items-center p-4 bg-white bg-opacity-10 rounded-lg">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                  <FiUser className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="font-medium">Perfis Personalizados</h3>
                  <p className="text-sm text-gray-200">Dashboard específico para cada tipo de usuário</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-white bg-opacity-10 rounded-lg">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Agendamentos Simplificados</h3>
                  <p className="text-sm text-gray-200">Marque seus horários de treino com facilidade</p>
                </div>
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