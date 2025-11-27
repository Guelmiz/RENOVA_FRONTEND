"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, LogOut, User } from "lucide-react";
import { useUser } from "@/context/user-contex";
import { logoutRequest } from "../app/services/auth";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isLoggedIn, user, logout, token } = useUser();
  const router = useRouter();

  const isRepresentante = user?.roles?.some(
    (r) => String(r).toUpperCase() === "REPRESENTANTE"
  );
  const isAdmin = user?.roles?.some(
    (r) =>
      String(r).toUpperCase() === "ADMINISTRADOR" ||
      String(r).toUpperCase() === "ADMIN"
  );

  const handleLogout = async () => {
    try {
      if (token) await logoutRequest(token);
    } catch (err) {
      console.error(err);
    } finally {
      logout();
      setShowUserMenu(false);
      setIsOpen(false);
      router.push("/");
    }
  };

  const renderAvatar = () => {
    if (user?.imagen)
      return <img src={user.imagen} className="w-full h-full object-cover" />;
    return <User className="w-4 h-4 text-primary-foreground" />;
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-primary-foreground" />
          </div>
          <span
            onClick={() => router.push("/")}
            className="text-xl font-bold text-primary cursor-pointer"
          >
            RENOVA
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <a href="/#productos" className="text-foreground hover:text-primary">
            Productos
          </a>
          <a href="/#beneficios" className="text-foreground hover:text-primary">
            Beneficios
          </a>

          <button
            onClick={() => router.push("/products")}
            className="bg-primary text-primary-foreground px-5 py-2 rounded-lg hover:opacity-90 text-sm font-medium"
          >
            Comprar
          </button>

          <div className="border-l border-gray-200 pl-4 flex items-center gap-4">
            {isLoggedIn && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 font-medium"
                >
                  <div className="w-9 h-9 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center overflow-hidden">
                    {renderAvatar()}
                  </div>
                  <span className="text-sm max-w-[100px] truncate">
                    {user.username}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Ver Perfil
                    </Link>

                    {isRepresentante && (
                      <Link
                        href="/products/catalogo"
                        className="block px-4 py-2 text-sm hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Mis Productos
                      </Link>
                    )}
                    {!isRepresentante && !isAdmin && (
                      <Link
                        href="/solicitud-representante"
                        className="block px-4 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        ¡Quiero vender en Renova!
                      </Link>
                    )}
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-amber-700 font-bold hover:bg-amber-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Panel de Control
                      </Link>
                    )}

                    <div className="h-px bg-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium hover:text-primary"
              >
                Inicia Sesión
              </Link>
            )}
          </div>
        </div>

        {/* Móvil */}
        <div className="flex items-center gap-4 md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>
    </header>
  );
}
