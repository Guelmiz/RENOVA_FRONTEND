"use client"

import Link from "next/link"

interface Producto {
  categoria: string
  nombre: string
  precio: number
  rating: number
  imagen: string
}

interface TallerSectionProps {
  tallerId: string | number
  tallerNombre: string
  icono: string
  rating: number
  anos: number
  colorBorde: string
  productos: Producto[]
}

export function TallerSection({
  tallerId,
  tallerNombre,
  icono,
  rating,
  anos,
  colorBorde,
  productos,
}: TallerSectionProps) {
  return (
    <section className={`border-t-4 ${colorBorde} mt-8 pt-6 pb-8`}>
      {/* Header del taller */}
      <div className="flex items-center justify-between px-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{icono}</div>
          <h2 className="text-xl font-semibold">{tallerNombre}</h2>
          <span className="text-sm text-muted-foreground">
            ⭐ {rating} — {anos} años en el mercado
          </span>
        </div>

        {/* 🔥 Botón NUEVO: redirige al taller específico */}
        <Link
          href={`/taller/${tallerId}`}
          className="rounded-lg bg-foreground text-background px-4 py-2 text-sm font-medium hover:bg-foreground/90 transition"
        >
          Ver Taller
        </Link>
      </div>

      {/* Productos */}
      <div className="flex flex-wrap gap-6 px-3">
        {productos.map((p, i) => (
          <div
            key={i}
            className="w-40 flex flex-col items-center text-center"
          >
            <img
              src={p.imagen}
              alt={p.nombre}
              className="h-28 w-28 object-contain mb-2"
            />
            <p className="text-sm font-semibold text-muted-foreground">
              {p.categoria}
            </p>
            <p className="text-sm">{p.nombre}</p>
            <p className="text-xs text-yellow-600">⭐ {p.rating}</p>
            <p className="text-base font-semibold">${p.precio.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
