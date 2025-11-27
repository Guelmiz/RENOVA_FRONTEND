"use client"
import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, Mail, Phone, Calendar, Lock, Eye, EyeOff, Image as ImageIcon } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000"

export default function RegisterPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    phone: "",
    birthDate: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: ""
  })


  const [imageFile, setImageFile] = useState<File | null>(null)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // 👇 NUEVO: manejar el cambio de archivo
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setImageFile(file)
  }

  const validateForm = () => {
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.birthDate ||
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Por favor completa todos los campos")
      return false
    }

    if (!formData.email.includes("@")) {
      setError("Por favor ingresa un correo electrónico válido")
      return false
    }

    if (formData.phone.length < 8) {
      setError("Por favor ingresa un teléfono válido")
      return false
    }

    if (formData.username.length < 3) {
      setError("El nombre de usuario debe tener al menos 3 caracteres")
      return false
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsLoading(true)

    try {
      if (!validateForm()) {
        setIsLoading(false)
        return
      }

      // 1️⃣ Primero registramos al usuario (JSON como antes)
      const res = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombreUsuario: formData.username,
          email: formData.email,
          password: formData.password,
          nombreCompleto: formData.fullName,
          telefono: formData.phone,
          fechaNacimiento: formData.birthDate,
          rolNombre: "CLIENTE",
        }),
      })

      const data = await res.json().catch(() => ({} as any))

      if (!res.ok) {
        setError(data?.message || "Error al registrarse. Intenta de nuevo.")
        setIsLoading(false)
        return
      }

  
      const userId: string | undefined = data?.data?.usuario?.id

      if (imageFile && userId) {
        const imageFormData = new FormData()
        imageFormData.append("imagen", imageFile)

        try {
          const imgRes = await fetch(`${API_BASE}/api/usuarios/${userId}/imagen`, {
            method: "POST",
            body: imageFormData,
          })

          if (!imgRes.ok) {
            // No rompemos el registro si falla la imagen, solo avisamos por consola
            const imgErr = await imgRes.json().catch(() => ({}))
            console.error("Error subiendo imagen de usuario:", imgErr)
          }
        } catch (imgErr) {
          console.error("Error de red al subir imagen:", imgErr)
        }
      }

    
      setSuccess(true)
      setFormData({
        fullName: "",
        age: "",
        phone: "",
        birthDate: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        image: ""
      })
      setImageFile(null)

      setTimeout(() => {
        router.push("/login")
      }, 1000)
    } catch (err) {
      console.error(err)
      setError("Error al registrarse. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-primary/10 p-3 rounded-lg mb-4">
            <h1 className="text-3xl font-bold text-primary">RENOVA</h1>
          </div>
          <p className="text-muted-foreground">Crea tu cuenta para comenzar</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-lg shadow-lg p-8 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-secondary/10 border border-secondary/30 text-secondary px-4 py-3 rounded-lg text-sm">
              ¡Registro completado exitosamente! Redirigiendo...
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1: Full Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-foreground">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Juan Pérez"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* (Edad la tienes vacía, la puedes usar o quitar) */}
            </div>

            {/* Row 2: Phone and Birth Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phone */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                  Teléfono
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="88887777"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Birth Date */}
              <div className="space-y-2">
                <label htmlFor="birthDate" className="block text-sm font-medium text-foreground">
                  Fecha de Nacimiento
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-lm font-medium text-foreground">
                Nombre de Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="juanperez123"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* 👇 NUEVO: Campo de imagen opcional */}
            <div className="space-y-2">
              <label htmlFor="image" className="block text-sm font-medium text-foreground">
                Foto de perfil (opcional)
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-primary/10 file:text-sm file:text-primary hover:file:bg-primary/20"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Row 3: Password and Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 rounded border-border accent-primary mt-1"
                disabled={isLoading}
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                Acepto los términos y condiciones y la política de privacidad
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? "Registrando..." : "Crear Cuenta"}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition">
            Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  )
}
