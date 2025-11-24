import Link from "next/link"
import { notFound } from "next/navigation"

type Producto = {
  categoria: string
  nombre: string
  precio: number
  rating: number
  imagen: string
}

type Taller = {
  id: string
  nombre: string
  icono: string
  rating: number
  anos: number
  descripcion: string
  ubicacion?: string
  productos: Producto[]
}

const TALLERES: Record<string, Taller> = {
  "1": {
    id: "1",
    nombre: "Taller 1",
    icono: "🏁",
    rating: 4.2,
    anos: 5,
    descripcion: "Especialistas en celulares, laptops y línea blanca reacondicionada.",
    ubicacion: "Texcoco, Estado de México",
    productos: [
      {
        categoria: "Celulares",
        nombre: "Iphone 11 64GB",
        rating: 4.4,
        precio: 250.1,
        imagen: "/iphone11.png",
      },
      {
        categoria: "Laptops",
        nombre: "Dell Inspiron 3520",
        rating: 4.6,
        precio: 315.99,
        imagen: "/dell.png",
      },
      {
        categoria: "Tablets",
        nombre: "Xiaomi Redmi Pad SE",
        rating: 4.2,
        precio: 135.8,
        imagen: "/redmi.png",
      },
      {
        categoria: "Refrigeradoras",
        nombre: "LG 12CP VT34WPP",
        rating: 4.8,
        precio: 350.1,
        imagen: "/lg_fridge.png",
      },
      {
        categoria: "Smart TV",
        nombre: "Smart UHD 4K LG 65”",
        rating: 4.7,
        precio: 570.6,
        imagen: "/lg_tv.png",
      },
    ],
  },
  "2": {
    id: "2",
    nombre: "Taller 2",
    icono: "🛠️",
    rating: 4.9,
    anos: 10,
    descripcion: "Reacondicionamiento avanzado, audio, congeladores y equipos para el hogar.",
    ubicacion: "CDMX",
    productos: [
      {
        categoria: "Celulares",
        nombre: "Samsung Galaxy A36",
        rating: 4.1,
        precio: 200.1,
        imagen: "/galaxyA36.png",
      },
      {
        categoria: "Laptops",
        nombre: "HP 15-fd0231la",
        rating: 4.3,
        precio: 286.99,
        imagen: "/hp.png",
      },
      {
        categoria: "Parlantes",
        nombre: "LG XBOOM XL5T",
        rating: 4.8,
        precio: 254.3,
        imagen: "/lg_xboom.png",
      },
      {
        categoria: "Congeladoras",
        nombre: "Telstar 11CP",
        rating: 4.0,
        precio: 192.25,
        imagen: "/telstar.png",
      },
      {
        categoria: "Cafeteras",
        nombre: "Black + Decker Cafetera",
        rating: 4.8,
        precio: 45.6,
        imagen: "/cafetera.png",
      },
    ],
  },
  "3": {
    id: "3",
    nombre: "Taller 3",
    icono: "🅺",
    rating: 4.5,
    anos: 3,
    descripcion: "Enfoque en cocina y línea blanca: lavadoras, microondas, freidoras y más.",
    ubicacion: "Puebla",
    productos: [
      {
        categoria: "Lavadoras",
        nombre: "LG Lavadora 23 KG",
        rating: 4.7,
        precio: 320.28,
        imagen: "/lavadora_lg.png",
      },
      {
        categoria: "Microondas",
        nombre: "LG NeoChef",
        rating: 4.9,
        precio: 100.0,
        imagen: "/microondas.png",
      },
      {
        categoria: "Freidoras",
        nombre: "Power XL Freidora de aire",
        rating: 4.4,
        precio: 60.4,
        imagen: "/freidora.png",
      },
      {
        categoria: "Extractores",
        nombre: "Oster Extractor 1.2Lts",
        rating: 4.4,
        precio: 90.15,
        imagen: "/extractor.png",
      },
      {
        categoria: "Smart TV",
        nombre: "Hisense TV LED 32”",
        rating: 4.8,
        precio: 150.35,
        imagen: "/hisense32.png",
      },
    ],
  },
}

export default function TallerDetailPage({ params }: { params: { id: string } }) {
  const taller = TALLERES[params.id]
  if (!taller) {
    return notFound()
  }

  return (
    <main className="min-h-screen bg-muted/40 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumb / volver */}
        <div className="text-sm text-muted-foreground">
          <Link href="/talleres" className="hover:underline">
            Talleres
          </Link>{" "}
          / <span className="text-foreground">{taller.nombre}</span>
        </div>

        {/* Hero del taller */}
        <section className="bg-white rounded-3xl border border-border shadow-md px-6 sm:px-10 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-foreground text-background flex items-center justify-center text-2xl">
              {taller.icono}
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-semibold">{taller.nombre}</h1>
              <p className="text-sm text-muted-foreground">{taller.descripcion}</p>
              <div className="flex flex-wrap gap-3 text-xs mt-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-800 px-3 py-1">
                  ⭐ {taller.rating} calificación promedio
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1">
                  ⏱ {taller.anos} años en el mercado
                </span>
                {taller.ubicacion && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-800 px-3 py-1">
                    📍 {taller.ubicacion}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 text-xs sm:text-sm">
            <p className="text-muted-foreground">
              ✅ Productos reacondicionados certificados
            </p>
            <p className="text-muted-foreground">
              🚚 Envíos a todo el país (aplícan restricciones)
            </p>
            <Link
              href="/subir-producto"
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-foreground text-background px-4 py-2 text-sm font-medium hover:bg-foreground/90 transition"
            >
              Publicar producto en este taller
            </Link>
          </div>
        </section>

        {/* Filtros simples (solo visuales por ahora) */}
        <section className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1.5 rounded-full bg-white border border-border text-xs sm:text-sm hover:bg-muted transition">
              Todos
            </button>
            <button className="px-3 py-1.5 rounded-full bg-white border border-border text-xs sm:text-sm hover:bg-muted transition">
              Mayor precio
            </button>
            <button className="px-3 py-1.5 rounded-full bg-white border border-border text-xs sm:text-sm hover:bg-muted transition">
              Menor precio
            </button>
            <button className="px-3 py-1.5 rounded-full bg-white border border-border text-xs sm:text-sm hover:bg-muted transition">
              Mejor calificados
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Buscar en este taller..."
              className="w-48 sm:w-64 input-like"
            />
          </div>
        </section>

        {/* Grid de productos */}
        <section className="bg-white rounded-3xl border border-border shadow-md px-4 sm:px-6 py-6">
          <h2 className="text-lg font-semibold mb-4">Productos de {taller.nombre}</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {taller.productos.map((p, idx) => (
              <article
                key={idx}
                className="group rounded-2xl border border-border/70 bg-background hover:border-foreground/40 hover:-translate-y-1 transition transform p-3 flex flex-col"
              >
                <div className="w-full h-28 flex items-center justify-center mb-2">
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    className="max-h-24 object-contain"
                  />
                </div>

                <p className="text-xs font-semibold text-muted-foreground">
                  {p.categoria}
                </p>
                <p className="text-sm font-medium line-clamp-2">{p.nombre}</p>

                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-yellow-600">⭐ {p.rating}</span>
                </div>

                <p className="mt-1 text-base font-semibold text-foreground">
                  ${p.precio.toFixed(2)}
                </p>

                <button
                  type="button"
                  className="mt-3 text-xs sm:text-sm font-medium text-foreground border border-border rounded-lg py-1.5 px-2 hover:bg-muted transition"
                >
                  Ver detalles
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
