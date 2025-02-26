'use client'
import { Button } from '@/components/ui/button'
import { AuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'
import { SignOutAction } from '@/lib/auth'

export default function Introduction() {
  const { user } = useContext(AuthContext)
  const router = useRouter();
  const { setUser } = useContext(AuthContext);

  async function handleLogout() {
    await SignOutAction();
    setUser(null);
    router.push('/');
  }

  return (
    <div className='w-full h-screen flex flex-col items-center justify-center'>
      <div className='text-center py-4'>
        <p className='font-medium'>{user?.username}</p>
        <p>{user?.email}</p>
      </div>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  )
}