"use client"

import React, { useState } from 'react'
import { Metadata } from 'next'
import { AuthLayout } from '@/components/auth-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Loader2, AlertCircle, Mail, Lock, ArrowRight, UserPlus } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos')
      return
    }
    
    try {
      setError(null)
      await login(email, password)
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Erro ao fazer login:', err)
      setError(err?.message || 'Falha ao fazer login. Verifique suas credenciais.')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card/40 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg p-8"
      >
        <div className="flex flex-col items-center space-y-2 mb-8">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Bem-vindo de volta</h1>
          <p className="text-sm text-muted-foreground text-center">Faça login para acessar sua conta</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Alert variant="destructive" className="mb-6 border-destructive/20 bg-destructive/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-medium">{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label 
              htmlFor="email" 
              className={cn(
                "transition-colors duration-200",
                focusedField === 'email' ? "text-primary" : "text-foreground"
              )}
            >
              E-mail
            </Label>
            <div className="relative">
              <Mail className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200",
                focusedField === 'email' ? "text-primary" : "text-muted-foreground"
              )} />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                disabled={isLoading}
                required
                className={cn(
                  "pl-10 transition-all duration-200 border-border/60",
                  focusedField === 'email' && "border-primary ring-1 ring-primary/20"
                )}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label 
                htmlFor="password"
                className={cn(
                  "transition-colors duration-200",
                  focusedField === 'password' ? "text-primary" : "text-foreground"
                )}
              >
                Senha
              </Label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
              >
                Esqueceu sua senha?
              </Link>
            </div>
            <div className="relative">
              <Lock className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200",
                focusedField === 'password' ? "text-primary" : "text-muted-foreground"
              )} />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                disabled={isLoading}
                required
                className={cn(
                  "pl-10 transition-all duration-200 border-border/60",
                  focusedField === 'password' && "border-primary ring-1 ring-primary/20"
                )}
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className={cn(
              "w-full transition-all duration-300 group hover:shadow-md",
              isLoading 
                ? "bg-primary/80" 
                : "bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary/80"
            )}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                Entrar
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </form>
        
        <div className="relative mt-8 pt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/40"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="outline" className="bg-background/50 hover:bg-background/80 transition-colors border-border/50">
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
            Google
          </Button>
          <Button variant="outline" className="bg-background/50 hover:bg-background/80 transition-colors border-border/50">
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.5 21.5h11v-1h-11v1zM5 19h13v-1H5v1zm0-2h13v-1H5v1zM17.24 3.27c-0.383-0.483-0.8-0.867-1.26-1.15-0.453-0.29-0.933-0.437-1.437-0.437-0.503 0-0.97 0.147-1.393 0.44C12.727 2.373 12.327 2.753 12 3.207c-0.313-0.453-0.693-0.833-1.14-1.123C10.413 1.8 9.94 1.653 9.437 1.653c-0.5 0-0.977 0.153-1.43 0.46C7.557 2.42 7.14 2.807 6.77 3.28 6.403 3.75 6.113 4.293 5.907 4.913 5.7 5.533 5.597 6.177 5.597 6.847c0 1.503 0.337 3.027 1.013 4.573 0.627 1.44 1.551 2.913 2.747 4.407v0.01l0.387 0.43c0.083 0.097 0.177 0.193 0.283 0.293 0.107 0.1 0.207 0.197 0.3 0.287l0.327 0.27c0.433 0.327 0.997 0.49 1.727 0.49 0.8 0 1.397-0.177 1.803-0.527 0.083-0.07 0.2-0.173 0.35-0.31 0.15-0.137 0.233-0.213 0.267-0.233l0.367-0.37h0.02c1.213-1.497 2.143-2.973 2.8-4.43 0.657-1.453 0.987-2.97 0.987-4.543 0-0.677-0.093-1.327-0.287-1.95S17.617 3.75 17.24 3.27z" />
            </svg>
            Apple
          </Button>
        </div>
        
        <p className="text-center text-sm text-muted-foreground mt-6 flex items-center justify-center">
          Não tem uma conta?{' '}
          <Link
            href="/register"
            className="ml-1 text-primary hover:text-primary/80 hover:underline transition-colors inline-flex items-center gap-1"
          >
            <span>Cadastre-se</span>
            <UserPlus className="h-3 w-3" />
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
