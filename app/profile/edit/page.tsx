"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUser } from "@/context/user-contex"
import { Camera } from "lucide-react" 
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000"
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function EditProfilePage() {
  const { user, token, setUserAndToken } = useUser()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  if (!user) {
    router.push("/login")
    return null
  }

  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    username: user.username || "",
    phone: user.phone || "",
    birthDate: user.birthDate || "",
    email: user.email || "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.imagen || null)

  const [showConfirmEdit, setShowConfirmEdit] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const uploadToCloudinary = async (file: File) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) throw new Error("Faltan credenciales de Cloudinary");

    const formDataCloud = new FormData();
    formDataCloud.append("file", file);
    formDataCloud.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formDataCloud }
    );

    if (!res.ok) throw new Error("Error subiendo imagen");
    const data = await res.json();
    return data.secure_url;
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleEditClick = () => {
    setError(null)
    setShowConfirmEdit(true)
  }

  const handleCancelEdit = () => {
    setShowConfirmEdit(false)
    if (selectedFile) {
        setSelectedFile(null)
        setPreviewUrl(user.imagen || null)
    }
  }

  const handleConfirmEdit = async () => {
    setShowConfirmEdit(false)
    setIsSubmitting(true)
    setError(null)

    try {
      let finalImageUrl = user.imagen; 
      if (selectedFile) {
        try {
            finalImageUrl = await uploadToCloudinary(selectedFile);
        } catch (uploadErr) {
            throw new Error("Falló la subida de la imagen. Intenta de nuevo.");
        }
      }
      const body = {
        nombreUsuario: formData.username,
        email: formData.email,
        nombreCompleto: formData.fullName,
        telefono: formData.phone || null,
        fechaNacimiento: formData.birthDate || null,
        imagen: finalImageUrl 
      }
      const res = await fetch(`${API_BASE}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || "Error al actualizar usuario")
      }

      const data = await res.json()
      const updated = data?.data?.usuario || data

      if (updated) {
        const updatedFrontUser = {
          id: updated.id,
          username: updated.nombreUsuario,
          email: updated.email,
          fullName: updated.persona?.nombreCompleto ?? formData.fullName,
          phone: String(updated.persona?.telefono ?? formData.phone ?? ""),
          birthDate: updated.persona?.fechaNacimiento ?? formData.birthDate,
          registeredAt: user.registeredAt,
          roles: user.roles ?? [], 
          imagen: updated.imagen ?? finalImageUrl 
        }

        setUserAndToken(updatedFrontUser, token ?? "")
      }

      router.push("/profile")
    } catch (err: any) {
      console.error("Error al actualizar usuario:", err)
      setError(err.message || "Error al actualizar usuario")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/60 text-foreground pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold mt-1">
              Editar perfil de{" "}
              <span className="font-bold">{user.fullName.split(" ")[0]}</span>
            </h1>
          </div>
        </header>

        <section className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 sm:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              
            
              <div 
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-primary/30 flex items-center justify-center overflow-hidden cursor-pointer group bg-background"
                onClick={() => fileInputRef.current?.click()}
                title="Cambiar foto de perfil"
              >
     
                <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange}
                />

              
                {previewUrl ? (
                    <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-2xl sm:text-3xl font-bold text-primary">
                    {user.fullName.charAt(0).toUpperCase()}
                    </span>
                )}

          
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white w-8 h-8" />
                </div>
              </div>
              

              <div>
                <h2 className="text-xl font-semibold">{formData.fullName}</h2>
                <p className="text-sm text-muted-foreground">{formData.email}</p>
                <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-primary hover:underline mt-1"
                >
                    Cambiar foto
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleEditClick}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-medium shadow-sm hover:bg-primary/90 disabled:opacity-60 transition"
            >
              {isSubmitting ? "Guardando..." : "Confirmar cambios"}
            </button>
          </div>

          <div className="px-6 sm:px-8 py-8 space-y-8">
            {error && (
              <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/40 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EditableField
                label="Nombre completo"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
              <EditableField
                label="Nombre de usuario"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
              <EditableField
                label="Teléfono"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <EditableField
                label="Fecha de nacimiento"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
              />
              <EditableField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        <div className="flex justify-between items-center">
          <Link
            href="/profile"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition"
          >
            ← Cancelar y volver al perfil
          </Link>
        </div>
      </div>

      {showConfirmEdit && (
        <ConfirmEditModal
          onCancel={handleCancelEdit}
          onConfirm={handleConfirmEdit}
          loading={isSubmitting}
          hasNewImage={!!selectedFile}
        />
      )}
    </main>
  )
}

function EditableField({ label, name, value, onChange, type = "text" }: any) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-border bg-muted/60 px-3 py-2.5 text-sm text-foreground/90 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary"
      />
    </div>
  )
}

function ConfirmEditModal({ onCancel, onConfirm, loading, hasNewImage }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card shadow-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Confirmar edición</h2>
        <p className="text-sm text-muted-foreground">
          {hasNewImage 
            ? "Se actualizará tu foto de perfil y tus datos personales. ¿Continuar?"
            : "Se guardarán los cambios realizados en tu perfil. ¿Deseas continuar?"
          }
        </p>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-full border border-border bg-muted hover:bg-muted/80 disabled:opacity-60 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition"
          >
            {loading ? "Subiendo y Guardando..." : "Sí, guardar"}
          </button>
        </div>
      </div>
    </div>
  )
}