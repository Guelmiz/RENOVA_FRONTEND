"use client"

import { useUser } from "@/context/user-contex"
import Link from "next/link"

export default function ProfilePage() {
  const { user } = useUser()
  const previewUser = user || {
    fullName: "Alexa Rawles",
    username: "alexa.rawles",
    age: "27",
    phone: "+52 555 123 4567",
    birthDate: "1998-02-14",
    email: "alexarawles@gmail.com",
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/60 text-foreground pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top bar estilo dashboard */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold mt-1">
              Bienvenido, <span className="font-bold">{previewUser.fullName.split(" ")[0]}</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">{previewUser.fullName}</p>
              <p className="text-xs text-muted-foreground">{previewUser.email}</p>
            </div>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
              <span className="text-sm font-semibold text-primary">
                {previewUser.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Contenedor principal */}
        <section className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          {/* Encabezado de la tarjeta */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 sm:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center overflow-hidden">
                <span className="text-lg font-semibold text-primary">
                  {previewUser.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold">{previewUser.fullName}</h2>
                <p className="text-sm text-muted-foreground">{previewUser.email}</p>
                <p className="text-xs mt-1 text-muted-foreground">
                  Usuario: <span className="font-medium text-foreground">{previewUser.username}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-medium shadow-sm hover:bg-primary/90 transition"
            >
              Editar perfil
            </button>
          </div>

          {/* Cuerpo de la tarjeta */}
          <div className="px-6 sm:px-8 py-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre completo */}
              <FieldBlock label="Nombre completo" value={previewUser.fullName} />

              {/* Nick / Usuario */}
              <FieldBlock label="Nombre de usuario" value={previewUser.username} />


              {/* Teléfono */}
              <FieldBlock label="Teléfono" value={previewUser.phone} />

              {/* Fecha de nacimiento */}
              <FieldBlock label="Fecha de nacimiento" value={previewUser.birthDate} />

              {/* Email */}
              <FieldBlock label="Email" value={previewUser.email} />
            </div>

            {/* Sección inferior tipo “My email address” */}
            <div className="border-t border-border pt-6 space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">

              </h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-4 w-4 rounded-full border border-primary bg-primary/10" />
                  <div>
                    <p className="text-sm font-medium">{previewUser.email}</p>
                    <p className="text-xs text-muted-foreground">Correo verificado</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Botón regresar */}
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  )
}

// Componente pequeño para campos tipo input deshabilitado
function FieldBlock({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      <div className="w-full rounded-xl border border-border bg-muted/60 px-3 py-2.5 text-sm text-foreground/90">
        {value && value.trim() !== "" ? value : <span className="text-muted-foreground/70">Sin información</span>}
      </div>
    </div>
  )
}
