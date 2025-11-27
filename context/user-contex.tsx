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
  roles?: string[]; 
}

interface UserContextType {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  updateUser: (data: Partial<User>) => void; // <--- 1. AGREGADO AQUÍ
  setUserAndToken: (user: User, token: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = "renova_auth";

export function UserProvider({ children }: { children: ReactNode }) {
  
  const [userState, setUserState] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (parsed?.user) {
        setUserState(parsed.user);
      }
      if (parsed?.token) {
        setToken(parsed.token);
      }
    } catch (err) {
      console.error("Error leyendo auth de localStorage:", err);
    }
  }, []);

  
  const setUser = (userData: User | null) => {
    setUserState(userData);

    if (typeof window !== "undefined") {
      if (userData === null) {
        const currentToken = token || ""; 
        if (!currentToken) {
             localStorage.removeItem(STORAGE_KEY);
        } else {
             localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userData, token: currentToken }));
        }
      } else {
        const currentToken = token || ""; 
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ user: userData, token: currentToken })
        );
      }
    }
  };

  // 2. IMPLEMENTACIÓN DE LA NUEVA FUNCIÓN
  const updateUser = (data: Partial<User>) => {
    if (!userState) return; // No podemos actualizar si no hay usuario

    // Crea un nuevo objeto combinando el usuario actual con los nuevos datos
    const updatedUser = { ...userState, ...data };
    
    setUserState(updatedUser);

    if (typeof window !== "undefined") {
        const currentToken = token || "";
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ user: updatedUser, token: currentToken })
        );
    }
  };

  const setUserAndToken = (userData: User, tokenValue: string) => {
    setUserState(userData);
    setToken(tokenValue);

    if (typeof window !== "undefined") {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user: userData, token: tokenValue })
      );
    }
  };

  const logout = () => {
    setUserState(null);
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user: userState,
        token,
        setUser,
        updateUser, // <--- 3. EXPUESTO AQUÍ
        setUserAndToken,
        logout,
        isLoggedIn: userState !== null,
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