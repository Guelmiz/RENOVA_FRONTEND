"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-contex";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useUser();
  const router = useRouter();
  const [showConfirmEdit, setShowConfirmEdit] = useState(false);


  const previewUser = user || {
    fullName: "Alexa Rawles",
    username: "alexa.rawles",
    age: "27",
    phone: "+52 555 123 4567",
    birthDate: "1998-02-14",
    email: "alexarawles@gmail.com",
    imagen: "", 
  };

  const roles: string[] = Array.isArray(user?.roles) ? user!.roles : [];
  const mainRole = roles[0] ?? "Sin rol";
  const isRepresentante = roles.includes("Representante");
  const canUpload = !!user && isRepresentante;

  const handleEditClick = () => {
    setShowConfirmEdit(true);
  };

  const handleCancelEdit = () => {
    setShowConfirmEdit(false);
  };

  const handleConfirmEdit = () => {
    setShowConfirmEdit(false);
    router.push("/profile/edit");
  };

  const handleUploadClick = () => {
    if (!canUpload) return;
    router.push("/products/nuevo");
  };


  const renderAvatar = (wClass: string, hClass: string, textSize: string) => {
    if (previewUser.imagen && previewUser.imagen.trim() !== "") {
      return (
        <img
          src={previewUser.imagen}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      );
    }


    return (
      <span className={`${textSize} font-semibold text-primary`}>
        {previewUser.fullName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()}
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/60 text-foreground pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top bar estilo dashboard */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold mt-1">
              Bienvenid@ ,{" "}
              <span className="font-bold">
                {previewUser.fullName.split(" ")[0]}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">{previewUser.fullName}</p>
              <p className="text-xs text-muted-foreground">
                {previewUser.email}
              </p>
            </div>
            
            {/* AVATAR PEQUEÑO (HEADER) */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
               {renderAvatar("w-full", "h-full", "text-sm")}
            </div>

          </div>
        </header>

        {/* Contenedor principal */}
        <section className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          {/* Encabezado de la tarjeta */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 sm:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              
          
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center overflow-hidden">
                {renderAvatar("w-full", "h-full", "text-lg")}
              </div>

              <div>
                <h2 className="text-xl font-semibold">{previewUser.fullName}</h2>
                <p className="text-sm text-muted-foreground">
                  {previewUser.email}
                </p>
                <p className="text-xs mt-1 text-muted-foreground">
                  Usuario:{" "}
                  <span className="font-medium text-foreground">
                    {previewUser.username}
                  </span>
                </p>

    
                {user && (
                  <p className="text-xs mt-1 text-muted-foreground">
                    Rol:{" "}
                    <span className="font-medium text-foreground">
                      {mainRole}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleEditClick}
                className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-medium shadow-sm hover:bg-primary/90 transition"
              >
                Editar perfil
              </button>

            
              <button
                type="button"
                onClick={handleUploadClick}
                disabled={!canUpload}
                title={
                  canUpload
                    ? "Subir nuevo producto"
                    : user
                    ? "Solo un usuario con rol Representante puede subir productos"
                    : "Inicia sesión para poder subir productos"
                }
                className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium shadow-sm transition
                  ${
                    canUpload
                      ? "bg-amber-600 text-white hover:bg-amber-700"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
              >
                <span className="mr-2 text-base">＋</span>
                Subir producto
              </button>
            </div>
          </div>

          {/* Cuerpo de la tarjeta */}
          <div className="px-6 sm:px-8 py-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre completo */}
              <FieldBlock label="Nombre completo" value={previewUser.fullName} />

              {/* Nick / Usuario */}
              <FieldBlock
                label="Nombre de usuario"
                value={previewUser.username}
              />

              {/* Teléfono */}
              <FieldBlock label="Teléfono" value={previewUser.phone} />

              {/* Fecha de nacimiento */}
              <FieldBlock
                label="Fecha de nacimiento"
                value={previewUser.birthDate}
              />

              {/* Email */}
              <FieldBlock label="Email" value={previewUser.email} />
            </div>

            {/* Sección inferior tipo “My email address” */}
            <div className="border-t border-border pt-6 space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Mi correo principal
              </h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-4 w-4 rounded-full border border-primary bg-primary/10" />
                  <div>
                    <p className="text-sm font-medium">{previewUser.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Correo verificado
                    </p>
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


      {showConfirmEdit && (
        <ConfirmEditModal
          onCancel={handleCancelEdit}
          onConfirm={handleConfirmEdit}
        />
      )}
    </main>
  );
}
function FieldBlock({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      <div className="w-full rounded-xl border border-border bg-muted/60 px-3 py-2.5 text-sm text-foreground/90">
        {value && value.trim() !== "" ? (
          value
        ) : (
          <span className="text-muted-foreground/70">Sin información</span>
        )}
      </div>
    </div>
  );
}


function ConfirmEditModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card shadow-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">¿Editar tu perfil?</h2>
        <p className="text-sm text-muted-foreground">
          Vas a pasar al formulario donde podrás actualizar tus datos
          personales. ¿Deseas continuar?
        </p>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-full border border-border bg-muted hover:bg-muted/80 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition"
          >
            Sí, editar
          </button>
        </div>
      </div>
    </div>
  );
}