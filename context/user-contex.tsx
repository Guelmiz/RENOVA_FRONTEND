"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export interface User {
  id?: string;
  fullName: string;
  phone: string;
  birthDate: string;
  username: string;
  email?: string;
  registeredAt?: string;
  imagen?: string;
  roles: string[]; 
}

interface UserContextType {
  user: User | null;
  token: string | null;
  setUserAndToken: (user: User, token: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = "renova_auth";

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);


  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (parsed?.user && parsed?.token) {
        setUser(parsed.user);
        setToken(parsed.token);
      }
    } catch (err) {
      console.error("Error leyendo auth de localStorage:", err);
    }
  }, []);

  const setUserAndToken = (userData: User, tokenValue: string) => {
    setUser(userData);
    setToken(tokenValue);

    if (typeof window !== "undefined") {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user: userData, token: tokenValue })
      );
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        setUserAndToken,
        logout,
        isLoggedIn: user !== null,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context;
}
