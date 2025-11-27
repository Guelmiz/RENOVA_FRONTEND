"use client";

import { useState, useRef, useEffect } from "react";

const TABS = ["Básico", "Imágenes", "Garantía"] as const;
type TabKey = (typeof TABS)[number];

export default function SubirProductoPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("Básico");

  return (
    <main className="min-h-screen bg-muted/40 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Título */}
        <header>
          <h1 className="text-3xl font-bold text-foreground">
            Sube tus Productos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Completa la información para listar tu producto en el catálogo en
            línea
          </p>
        </header>

        {/* Tabs */}
        <nav className="flex bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-foreground text-background"
                      : "bg-transparent text-muted-foreground hover:bg-muted/70"
                  }`}
              >
                {tab}
              </button>
            );
          })}
        </nav>

        {/* Card principal */}
        <section className="bg-white border border-border rounded-3xl shadow-md px-6 sm:px-10 py-8">
          {/* Encabezado card */}
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-8">
            <div>
              {activeTab === "Básico" && (
                <>
                  <h2 className="text-xl font-semibold text-foreground">
                    Información Básica del producto
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Datos principales del producto a subir
                  </p>
                </>
              )}

              {activeTab === "Imágenes" && (
                <>
                  <h2 className="text-xl font-semibold text-foreground">
                    Imágenes del Producto
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Sube imágenes de alta calidad que muestren el estado real
                    del producto
                  </p>
                </>
              )}

              {activeTab === "Garantía" && (
                <>
                  <h2 className="text-xl font-semibold text-foreground">
                    Garantía y Políticas
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Información sobre garantía y políticas de devolución
                  </p>
                </>
              )}
            </div>
          </div>

          {activeTab === "Básico" && <BasicForm />}
          {activeTab === "Imágenes" && <ImagesForm />}
          {activeTab === "Garantía" && <GarantiaForm />}
        </section>
      </div>
    </main>
  );
}

function BasicForm() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Columna izquierda (form) */}
      <div className="md:col-span-2 space-y-4 ">
        <Field label="Nombre del producto">
          <input
            type="text"
            className="input-like w-full border-2"
            placeholder="Iphone 13 Pro Max 256 Gb"
          />
        </Field>

        <Field label="Marca del producto">
          <input
            type="text"
            className="input-like w-full border-2"
            placeholder="Apple"
          />
        </Field>

        <Field label="Categoría del Producto">
          <select className="input-like w-full border-2">
            <option value="">Selecciona una categoría</option>
            <option value="smartphones">Smartphones</option>
            <option value="tablets">Tablets</option>
            <option value="accesorios">Accesorios</option>
          </select>
        </Field>

        <Field label="Estado del Producto">
          <select className="input-like w-full border-2">
            <option value="">Selecciona el estado</option>
            <option value="nuevo">Nuevo</option>
            <option value="semi">Seminuevo</option>
            <option value="usado">Usado</option>
          </select>
        </Field>

        <Field label="Descripción">
          <input
            type="text"
            className="input-like w-full border-2"
            placeholder="Opcional*"
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Precio">
            <input
              type="number"
              min={0}
              className="input-like border-2"
              defaultValue={1}
            />
          </Field>

          <Field label="Stock disponible">
            <input
              type="number"
              min={0}
              className="input-like border-2"
              defaultValue={1}
            />
          </Field>
        </div>

        {/* Botones inferiores izquierda */}
      </div>

      {/* Columna derecha (detalles) */}
      <aside className="space-y-5">
        <div className="space-y-1.5">
          <h3 className="text-sm font-semibold text-foreground">
            Detalles o limitaciones
          </h3>
          <textarea
            className="input-like border-2 min-h-[350px] min-w-[280px] resize-none"
            placeholder="Menciona cualquier defecto estético, cosmético, funcional o limitante de producto"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg bg-foreground text-background px-5 py-2.5 text-sm font-semibold hover:bg-foreground/90 transition"
          >
            Publicar Artículo
          </button>
        </div>
      </aside>
    </div>
  );
}

function ImagesForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return;
    const arr = Array.from(incoming);
    setFiles((prev) => [...prev, ...arr]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full justify-between gap-8">
      <div className="space-y-6">
        {/* Caja de subir imagen (click + drag&drop) */}
        <div
          className="border-2 border-dashed border-border rounded-xl py-10 px-4 flex flex-col items-center justify-center text-center bg-muted/40 cursor-pointer hover:bg-muted/70 transition"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <div className="flex flex-col items-center gap-3">
            <span className="text-2xl" role="img" aria-hidden="true">
              ⬆️
            </span>
            <p className="text-sm font-medium text-foreground">Subir Imagen</p>
            <p className="text-xs text-muted-foreground">
              Arrastra y suelta tus imágenes aquí o haz clic para seleccionar
              archivos
            </p>
          </div>
        </div>

        {/* Grid de previsualizaciones */}
        {previews.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">
              Previsualización
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {previews.map((src, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-lg overflow-hidden border border-border bg-muted"
                >
                  <img
                    src={src}
                    alt={`preview-${idx}`}
                    className="h-28 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="absolute top-1 right-1 text-xs px-2 py-1 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bloque azul con tips */}
        <div className="rounded-xl bg-blue-50 border border-blue-100 px-5 py-4 text-sm text-blue-900">
          <p className="font-semibold mb-2">Consejos para mejores fotos:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Incluye fotos desde todos los ángulos</li>
            <li>Muestra claramente cualquier defecto o marca de uso</li>
            <li>Usa buena iluminación natural</li>
            <li>La primera imagen será la principal en el listado</li>
          </ul>
        </div>
      </div>

      {/* Botones inferiores (igual que maqueta) */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg bg-foreground text-background px-5 py-2.5 text-sm font-semibold hover:bg-foreground/90 transition"
        >
          Publicar Artículo
        </button>
      </div>
    </div>
  );
}

function GarantiaForm() {
  return (
    <div className="space-y-6">
      {/* Selects de arriba */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Periodo de Garantía">
          <select className="input-like">
            <option value="">Selecciona periodo</option>
            <option value="3m">3 meses</option>
            <option value="6m">6 meses</option>
            <option value="12m">12 meses</option>
            <option value="sin-garantia">Sin garantía</option>
          </select>
        </Field>
        <Field label="Pruebas y Verificaciones">
          <select className="input-like">
            <option value="">Selecciona Prueba o Verificacion</option>
            <option value="3m">Pantalla Funcional</option>
            <option value="6m">Bateria Funcional</option>
            <option value="12m">Certficacion contra defectos</option>
            <option value="sin-garantia">Sin garantía</option>
          </select>
        </Field>
    
      </div>

      {/* Detalles de la garantía */}



      {/* Compromiso de calidad */}
      <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-5 py-4 text-sm text-emerald-900">
        <p className="font-semibold mb-1">Compromiso de Calidad</p>
        <p>
          Todos nuestros productos reacondicionados pasan por un proceso
          riguroso de inspección y pruebas para garantizar su funcionamiento
          óptimo.
        </p>
      </div>

      {/* Botones inferiores */}
      <div className="flex items-center justify-between mt-4">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg bg-foreground text-background px-5 py-2.5 text-sm font-semibold hover:bg-foreground/90 transition"
        >
          Publicar Artículo
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function CheckboxOption({ label }: { label: string }) {
  return (
    <label className="inline-flex items-center gap-2 text-xs sm:text-sm">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-border text-foreground focus:ring-0"
      />
      <span>{label}</span>
    </label>
  );
}
