"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface User {
  fullName: string
  age: string
  phone: string
  birthDate: string
  username: string
  email?: string
  registeredAt?: string
}

interface UserContextType {
  user: User | null
  setUser: (user: User) => void
  updateUser: (updates: Partial<User>) => void
  logout: () => void
  isLoggedIn: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)

  const setUser = (userData: User) => {
    setUserState(userData)
  }

  const updateUser = (updates: Partial<User>) => {
    setUserState((prevUser) => {
      if (!prevUser) return null
      return { ...prevUser, ...updates }
    })
  }

  const logout = () => {
    setUserState(null)
  }

  return (
    <UserContext.Provider value={{ user, setUser, updateUser, logout, isLoggedIn: user !== null }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within UserProvider")
  }
  return context
}
