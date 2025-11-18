"use client"

import { useUser } from "../context/user-contex"
import { User, Phone, Calendar, MapPin, LogOut } from "lucide-react"
import Link from "next/link"

export function UserProfile() {
  const { user, logout } = useUser()

  if (!user) return null

  const handleLogout = () => {
    logout()
    alert("Sesión cerrada exitosamente")
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Mi Perfil</h1>
          <p className="text-muted-foreground">Información de tu cuenta</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-lg hover:bg-destructive/20 transition"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre Completo */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <User className="w-4 h-4" />
            Nombre Completo
          </label>
          <p className="text-lg font-semibold text-foreground">{user.fullName}</p>
        </div>

        {/* Nombre de Usuario */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Nombre de Usuario
          </label>
          <p className="text-lg font-semibold text-foreground">@{user.username}</p>
        </div>

        {/* Edad */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Edad</label>
          <p className="text-lg font-semibold text-foreground">{user.age} años</p>
        </div>

        {/* Teléfono */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Teléfono
          </label>
          <p className="text-lg font-semibold text-foreground">{user.phone}</p>
        </div>

        {/* Fecha de Nacimiento */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Fecha de Nacimiento
          </label>
          <p className="text-lg font-semibold text-foreground">{user.birthDate}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border my-8" />

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="flex-1 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition font-medium">
          Editar Perfil
        </button>
        <Link
          href="/"
          className="flex-1 bg-secondary text-secondary-foreground px-6 py-2 rounded-lg hover:bg-secondary/90 transition font-medium text-center"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  )
}
