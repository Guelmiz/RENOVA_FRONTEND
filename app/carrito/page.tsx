"use client"

import { useState } from "react"
import { Trash2, TicketPercent } from "lucide-react"

type CartItem = {
  id: number
  title: string
  subtitle: string
  brand: string
  price: number
  oldPrice?: number
  badge?: string
  months?: number
  rating: number
  reviews: number
  image: string
  quantity: number
}

const INITIAL_ITEMS: CartItem[] = [
  {
    id: 1,
    title: "iPhone 13 Pro 128Gb",
    subtitle: "Apple",
    brand: "Apple",
    price: 550.99,
    oldPrice: 789.99,
    badge: "Excelente",
    months: 12,
    rating: 4.9,
    reviews: 120,
    image: "/iphone13.png",
    quantity: 1,
  },
  {
    id: 2,
    title: "MacBook Air M1 256GB",
    subtitle: "Apple",
    brand: "Apple",
    price: 700.1,
    oldPrice: 1129.99,
    badge: "Top ventas",
    months: 24,
    rating: 4.8,
    reviews: 85,
    image: "/macbook.png",
    quantity: 1,
  },
  {
    id: 3,
    title: "Samsung Galaxy S22 Ultra 256GB",
    subtitle: "Samsung",
    brand: "Samsung",
    price: 330.5,
    oldPrice: 499.99,
    badge: "Bueno",
    months: 12,
    rating: 4.7,
    reviews: 73,
    image: "/s22.png",
    quantity: 1,
  },
]

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS)
  const [discountCode, setDiscountCode] = useState("")
  const [appliedCode, setAppliedCode] = useState<string | null>(null)

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const productsDiscount = items.reduce((acc, item) => {
    if (!item.oldPrice) return acc
    return acc + (item.oldPrice - item.price) * item.quantity
  }, 0)

  const ivaRate = 0.15
  const iva = subtotal * ivaRate
  const total = subtotal + iva - productsDiscount
  const totalSaved = productsDiscount
  const totalHeaderSavings = 1000 

  const handleRemove = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleApplyCode = () => {
    if (!discountCode.trim()) return
    setAppliedCode(discountCode.trim().toUpperCase())
  }

  return (
    <main className="min-h-screen bg-muted/40 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header ahorro total */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Carrito de compras</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
          {/* Columna izquierda: lista de productos */}
          <section className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {items.length} producto{items.length !== 1 && "s"} en su carrito
            </p>

            {items.map((item) => (
              <article
                key={item.id}
                className="bg-white border border-border rounded-2xl shadow-sm p-4 flex gap-4"
              >
                {/* Imagen */}
                <div className="w-24 sm:w-32 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="max-h-24 object-contain"
                  />
                </div>

                {/* Info principal */}
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {item.badge && (
                      <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs font-semibold">
                        {item.badge}
                      </span>
                    )}
                    {item.months && (
                      <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-xs">
                        {item.months} meses
                      </span>
                    )}
                  </div>

                  <h2 className="text-sm sm:text-base font-semibold">
                    {item.title}
                  </h2>
                  <p className="text-xs text-muted-foreground">{item.brand}</p>

                  {/* Rating + cuotas */}
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>⭐ {item.rating}</span>
                    <span>•</span>
                    <span>{item.reviews} reseñas</span>
                    <span>•</span>
                    <span>1 pago</span>
                  </div>

                  {/* Precio + ahorro */}
                  <div className="mt-2 flex flex-wrap items-baseline gap-2">
                    <p className="text-lg font-bold text-foreground">
                      ${item.price.toFixed(2)}
                    </p>
                    {item.oldPrice && (
                      <>
                        <p className="text-sm line-through text-muted-foreground">
                          ${item.oldPrice.toFixed(2)}
                        </p>
                        <span className="text-xs font-semibold text-emerald-600">
                          Ahorras ${(item.oldPrice - item.price).toFixed(2)}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="text-muted-foreground hover:text-red-500 transition"
                    title="Eliminar del carrito"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 text-xs mt-2">
                    <button
                      type="button"
                      className="px-2 rounded border border-border hover:bg-muted/60 transition"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      className="px-2 rounded border border-border hover:bg-muted/60 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {items.length === 0 && (
              <div className="bg-white border border-dashed border-border rounded-2xl p-6 text-center text-sm text-muted-foreground">
                Tu carrito está vacío. Agrega productos para continuar.
              </div>
            )}
          </section>

          {/* Columna derecha: código + resumen */}
          <section className="space-y-4">
            {/* Código de descuento */}

            {/* Resumen del pedido */}
            <div className="bg-white border border-border rounded-2xl shadow-sm p-4 space-y-3">
              <h2 className="text-base font-semibold">Resumen del Pedido</h2>

              <div className="space-y-1 text-sm">
                <Row label="Subtotal" value={subtotal} />
                <Row label="Descuento productos" value={-productsDiscount} accent />
                <Row label={`IVA (${Math.round(ivaRate * 100)}%)`} value={iva} />
              </div>

              <div className="border-t border-border pt-3 mt-2">
                <Row label="Total" value={total} bold />
              </div>

              <p className="text-xs text-emerald-600 mt-1">
                Total ahorrado: ${totalSaved.toFixed(2)}
              </p>
            </div>

            {/* Botón generar ticket */}
            <button
              type="button"
              className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 text-black px-4 py-3 text-sm font-semibold shadow hover:bg-amber-300 transition"
            >
              <TicketPercent className="w-4 h-4" />
              Generar ticket de pago
            </button>
          </section>
        </div>
      </div>
    </main>
  )
}

function Row({
  label,
  value,
  bold,
  accent,
}: {
  label: string
  value: number
  bold?: boolean
  accent?: boolean
}) {
  const base = bold ? "font-semibold text-base" : "text-sm"
  const color = accent ? "text-emerald-600" : "text-foreground"
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`${base} ${color}`}>
        {accent && "-"}${Math.abs(value).toFixed(2)}
      </span>
    </div>
  )
}
