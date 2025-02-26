'use client'
import { createContext, useEffect, useState } from "react";
import { getUser } from "@/lib/auth";

type User = {
  id: number
  username: string
  email: string
}

type AuthContextType = {
  user: User | null
  setUser: (user: User | null) => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => { },
});

export function AuthProvider({ children, }: Readonly<{ children: React.ReactNode; }>) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    async function getUserData() {
      const userData = await getUser();
      setUser(userData);
    }

    getUserData()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}