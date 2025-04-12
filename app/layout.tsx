import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

// A metadata não pode ser exportada de um componente cliente
// Essa informação será gerenciada pelo Next.js automaticamente
// baseada em configurações de outro arquivo

export const metadata: Metadata = {
  title: "Centro de Formação Olímpica",
  description: "Sistema de gerenciamento do Centro de Formação Olímpica",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <div className="flex h-screen w-full bg-background overflow-hidden">
              {/* O conteúdo principal será renderizado com o posicionamento adequado */}
              <main className="flex-1 h-full overflow-auto">
                <div className="relative min-h-screen">
                  <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:bg-[url('/images/grid-dark.svg')] pointer-events-none" />
                  <div className="relative z-10">
                    {children}
                  </div>
                </div>
              </main>
            </div>
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
