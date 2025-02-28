'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function GoogleCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (token) {
      // Salvar o token nos cookies
      document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; ${process.env.NODE_ENV === 'production' ? 'secure; ' : ''}`
      
      // Redirecionar para a página de dashboard
      router.push('/dashboard/introduction')
    } else {
      // Se não houver token, redirecionar para a página inicial
      router.push('/')
    }
  }, [router, searchParams])

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <p>Redirecionando...</p>
    </div>
  )
} 