"use client";

import { useUser } from "../context/user-contex";
import {
  User as UserIcon,
  Phone,
  Calendar,
  MapPin,
  LogOut,
  ShieldCheck,
  PackagePlus,
} from "lucide-react";
import Link from "next/link";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export function UserProfile() {
  const { user, logout } = useUser();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    alert("Sesión cerrada exitosamente");
  };

  const rawImg = user.imagen?.trim() || "";
  const avatarSrc = rawImg.startsWith("http")
    ? rawImg
    : rawImg
    ? `${API_BASE}${rawImg}`
    : "";

  const initials =
    user.fullName
      ?.trim()
      .split(/\s+/)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || user.username.slice(0, 2).toUpperCase();

 
  const mainRole = (user.roles && user.roles[0]) || "Sin rol";
  const isRepresentante = mainRole === "Representante";

  return (
    <div className="bg-card border border-border rounded-lg shadow-lg p-8 max-w-5xl mx-auto">
      {/* Encabezado superior */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Bienvenid@, {user.fullName.split(" ")[0]}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold text-foreground">{user.fullName}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={user.fullName || user.username}
              className="w-12 h-12 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-foreground border border-border">
              {initials}
            </div>
          )}
        </div>
      </div>

      {/* Card principal */}
      <div className="bg-background border border-border rounded-2xl p-6 md:p-8">
        {/* Header de la card */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={user.fullName || user.username}
                className="w-16 h-16 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-lg font-semibold text-foreground border border-border">
                {initials}
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {user.fullName}
              </h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground">
                Usuario: <span className="font-semibold">@{user.username}</span>
              </p>

              {/* Mostrar Rol */}
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <ShieldCheck className="w-4 h-4" />
                Rol: <span className="font-semibold">{mainRole}</span>
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="px-5 py-2 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition">
              Editar perfil
            </button>

          
            <Link
              href={isRepresentante ? "/products" : "#"}
              aria-disabled={!isRepresentante}
              className={`px-5 py-2 rounded-full font-medium flex items-center justify-center gap-2 transition
                ${
                  isRepresentante
                    ? "bg-amber-600 text-white hover:bg-amber-700"
                    : "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none"
                }`}
              title={
                isRepresentante
                  ? "Subir nuevo producto"
                  : "Debes tener rol Representante para subir productos"
              }
            >
              <PackagePlus className="w-4 h-4" />
              Subir producto
            </Link>
          </div>
        </div>

        {/* Grid con la info del usuario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground tracking-wide">
              NOMBRE COMPLETO
            </label>
            <div className="w-full rounded-xl bg-muted/60 px-4 py-2.5 text-sm text-foreground">
              {user.fullName}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground tracking-wide">
              NOMBRE DE USUARIO
            </label>
            <div className="w-full rounded-xl bg-muted/60 px-4 py-2.5 text-sm text-foreground">
              {user.username}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground tracking-wide">
              TELÉFONO
            </label>
            <div className="w-full rounded-xl bg-muted/60 px-4 py-2.5 text-sm text-foreground">
              {user.phone || "No registrado"}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground tracking-wide">
              FECHA DE NACIMIENTO
            </label>
            <div className="w-full rounded-xl bg-muted/60 px-4 py-2.5 text-sm text-foreground">
              {user.birthDate || "No registrada"}
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold text-muted-foreground tracking-wide">
              EMAIL
            </label>
            <div className="w-full rounded-xl bg-muted/60 px-4 py-2.5 text-sm text-foreground">
              {user.email}
            </div>
          </div>
        </div>
      </div>

      {/* Acciones finales */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link
          href="/"
          className="flex-1 bg-secondary text-secondary-foreground px-6 py-2 rounded-lg hover:bg-secondary/90 transition font-medium text-center"
        >
          Volver al Inicio
        </Link>

        <button
          onClick={handleLogout}
          className="flex-1 flex items-center justify-center gap-2 bg-destructive/10 text-destructive px-6 py-2 rounded-lg hover:bg-destructive/20 transition font-medium"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
