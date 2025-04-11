'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import { ClientLayout } from '@/components/client-layout';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <ClientLayout>
        {children}
      </ClientLayout>
    </AuthProvider>
  );
} 