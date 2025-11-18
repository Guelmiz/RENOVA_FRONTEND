"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, LogOut, User } from "lucide-react";
import { useUser } from "@/context/user-contex";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isLoggedIn, user, logout } = useUser();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };
  const router = useRouter();
  return (
    <header className="fixed w-full top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-primary-foreground" />
          </div>
          <span
            onClick={() => router.push("/")}
            onMouseDown={() => console.log("mousedown")}
            className="
    text-xl font-bold text-primary
    cursor-pointer
    hover:opacity-80
    active:scale-95
    transition
    duration-150
  "
          >
            RENOVA
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="/#productos"
            className="text-foreground hover:text-primary transition"
          >
            Productos
          </a>
          <a
            href="/#beneficios"
            className="text-foreground hover:text-primary transition"
          >
            Beneficios
          </a>
          <a
            href="/#nosotros"
            className="text-foreground hover:text-primary transition"
          >
            Nosotros
          </a>
          <a
            href="/#contacto"
            className="text-foreground hover:text-primary transition"
          >
            Contacto
          </a>
          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition">
            Comprar
          </button>

          {isLoggedIn && user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 text-foreground hover:text-primary transition font-medium"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-sm">{user.username}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-foreground hover:bg-primary hover:text-primary-foreground transition rounded-t-lg"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Ver Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-foreground hover:bg-primary hover:text-primary-foreground transition rounded-b-lg flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-foreground hover:text-primary transition font-medium"
            >
              Inicia Sesión
            </Link>
          )}
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-4">
            <a
              href="#productos"
              className="block text-foreground hover:text-primary transition"
            >
              Productos
            </a>
            <a
              href="#beneficios"
              className="block text-foreground hover:text-primary transition"
            >
              Beneficios
            </a>
            <a
              href="#nosotros"
              className="block text-foreground hover:text-primary transition"
            >
              Nosotros
            </a>
            <a
              href="#contacto"
              className="block text-foreground hover:text-primary transition"
            >
              Contacto
            </a>
            <button
              onClick={() => router.push("/taller")}
              className="w-full bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition"
            >
              Comprar
            </button>

            {isLoggedIn && user ? (
              <div className="space-y-2 pt-2 border-t border-border">
                <Link
                  href="/profile"
                  className="block text-foreground hover:text-primary transition font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Ver Perfil ({user.username})
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-foreground hover:text-primary transition font-medium flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="block text-foreground hover:text-primary transition font-medium"
              >
                Inicia Sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
