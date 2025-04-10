"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EspacoGaleriaProps {
  imagens: string[]
  nome: string
}

export function EspacoGaleria({ imagens, nome }: EspacoGaleriaProps) {
  const [imagemAtual, setImagemAtual] = useState(0)
  const [modoGaleria, setModoGaleria] = useState(false)

  const proximaImagem = () => {
    setImagemAtual((prev) => (prev === imagens.length - 1 ? 0 : prev + 1))
  }

  const imagemAnterior = () => {
    setImagemAtual((prev) => (prev === 0 ? imagens.length - 1 : prev - 1))
  }

  const abrirGaleria = (index: number) => {
    setImagemAtual(index)
    setModoGaleria(true)
  }

  const fecharGaleria = () => {
    setModoGaleria(false)
  }

  return (
    <>
      <div className="relative">
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={imagens[imagemAtual] || "/placeholder.svg"}
            alt={`${nome} - Imagem ${imagemAtual + 1}`}
            className="w-full h-full object-cover"
          />
        </div>

        {imagens.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={imagemAnterior}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={proximaImagem}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      <div className="grid grid-cols-5 gap-2 mt-2">
        {imagens.map((imagem, index) => (
          <div
            key={index}
            className={cn(
              "aspect-video cursor-pointer rounded-md overflow-hidden",
              imagemAtual === index ? "ring-2 ring-green-700" : "",
            )}
            onClick={() => abrirGaleria(index)}
          >
            <img
              src={imagem || "/placeholder.svg"}
              alt={`${nome} - Miniatura ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {modoGaleria && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={fecharGaleria}
          >
            <X className="h-6 w-6" />
          </Button>

          <div className="relative max-w-4xl w-full">
            <img
              src={imagens[imagemAtual] || "/placeholder.svg"}
              alt={`${nome} - Imagem ${imagemAtual + 1}`}
              className="w-full h-auto max-h-[80vh] object-contain"
            />

            {imagens.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white"
                  onClick={imagemAnterior}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white"
                  onClick={proximaImagem}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            <div className="text-center text-white mt-4">
              {imagemAtual + 1} / {imagens.length}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
