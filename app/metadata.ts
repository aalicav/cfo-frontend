import type { Metadata } from 'next'

// Metadados padrão para toda a aplicação
export const metadata: Metadata = {
  title: {
    default: 'CFO - Centro de Formação Olímpica',
    template: '%s | CFO - Centro de Formação Olímpica'
  },
  description: 'Sistema de gerenciamento do Centro de Formação Olímpica',
  authors: [{ name: 'CFO' }],
  creator: 'CFO',
  publisher: 'CFO',
  applicationName: 'Sistema CFO',
  keywords: ['esporte', 'formação', 'olímpica', 'atletas', 'gerenciamento'],
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#171717' },
  ],
  colorScheme: 'light dark',
} 