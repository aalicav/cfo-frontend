"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="mt-6 text-3xl font-bold tracking-tight">
          Página não encontrada
        </h2>
        <p className="mt-4 text-muted-foreground">
          Desculpe, não conseguimos encontrar a página que você está procurando.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para a página inicial
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 