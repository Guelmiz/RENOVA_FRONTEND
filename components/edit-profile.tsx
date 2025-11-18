"use client"

import { useUser } from "@/context/user-contex"
import { useState } from "react"
import { ArrowLeft } from 'lucide-react'
import Link from "next/link"

export function EditProfile() {
  const { user, updateUser } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    age: user?.age || "",
    phone: user?.phone || "",
    birthDate: user?.birthDate || "",
    username: user?.username || "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!user) return null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "El nombre completo es requerido"
    }
    if (!formData.age || isNaN(Number(formData.age)) || Number(formData.age) < 13) {
      newErrors.age = "La edad debe ser mayor a 13 años"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido"
    }
    if (!formData.birthDate) {
      newErrors.birthDate = "La fecha de nacimiento es requerida"
    }
    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es requerido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    if (validateForm()) {
      updateUser(formData)
      setIsEditing(false)
      alert("Perfil actualizado exitosamente")
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/profile" className="text-primary hover:text-primary/90">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{isEditing ? "Editar Perfil" : "Mi Perfil"}</h1>
          <p className="text-muted-foreground">Gestiona tu información personal</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Nombre Completo */}
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium text-muted-foreground">
            Nombre Completo
          </label>
          {isEditing ? (
            <>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.fullName && <p className="text-destructive text-sm">{errors.fullName}</p>}
            </>
          ) : (
            <p className="text-lg font-semibold text-foreground">{user.fullName}</p>
          )}
        </div>

        {/* Nombre de Usuario */}
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium text-muted-foreground">
            Nombre de Usuario
          </label>
          {isEditing ? (
            <>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.username && <p className="text-destructive text-sm">{errors.username}</p>}
            </>
          ) : (
            <p className="text-lg font-semibold text-foreground">@{user.username}</p>
          )}
        </div>

        {/* Edad */}
        <div className="space-y-2">
          <label htmlFor="age" className="text-sm font-medium text-muted-foreground">
            Edad
          </label>
          {isEditing ? (
            <>
              <input
                id="age"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="13"
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.age && <p className="text-destructive text-sm">{errors.age}</p>}
            </>
          ) : (
            <p className="text-lg font-semibold text-foreground">{user.age} años</p>
          )}
        </div>

        {/* Teléfono */}
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-muted-foreground">
            Teléfono
          </label>
          {isEditing ? (
            <>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.phone && <p className="text-destructive text-sm">{errors.phone}</p>}
            </>
          ) : (
            <p className="text-lg font-semibold text-foreground">{user.phone}</p>
          )}
        </div>

        {/* Fecha de Nacimiento */}
        <div className="space-y-2">
          <label htmlFor="birthDate" className="text-sm font-medium text-muted-foreground">
            Fecha de Nacimiento
          </label>
          {isEditing ? (
            <>
              <input
                id="birthDate"
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.birthDate && <p className="text-destructive text-sm">{errors.birthDate}</p>}
            </>
          ) : (
            <p className="text-lg font-semibold text-foreground">{user.birthDate}</p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border my-8" />

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="flex-1 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition font-medium"
            >
              Guardar Cambios
            </button>
            <button
              onClick={() => {
                setIsEditing(false)
                setFormData({
                  fullName: user.fullName,
                  age: user.age,
                  phone: user.phone,
                  birthDate: user.birthDate,
                  username: user.username,
                })
                setErrors({})
              }}
              className="flex-1 bg-secondary text-secondary-foreground px-6 py-2 rounded-lg hover:bg-secondary/90 transition font-medium"
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition font-medium"
            >
              Editar Perfil
            </button>
            <Link
              href="/"
              className="flex-1 bg-secondary text-secondary-foreground px-6 py-2 rounded-lg hover:bg-secondary/90 transition font-medium text-center"
            >
              Volver al Inicio
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
