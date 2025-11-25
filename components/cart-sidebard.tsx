"use client"

import { useState } from "react"
import { X, Trash2, Plus, Minus } from "lucide-react"
import { useCart } from "@/context/cart-contex"

export function CartSidebar() {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:opacity-90 transition flex items-center justify-center"
      >
        <div className="relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m10 0l2 9m-11 0h12m-12 0a1 1 0 100 2 1 1 0 000-2zm12 0a1 1 0 100 2 1 1 0 000-2z"
            />
          </svg>
          {items.length > 0 && (
            <span className="absolute top-0 right-0 -mr-2 -mt-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {items.length}
            </span>
          )}
        </div>
      </button>

      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 transition-opacity" onClick={() => setIsOpen(false)} />}

      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-lg z-50 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-2xl font-bold">Tu Carrito</h2>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-muted rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Tu carrito está vacío</p>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              Continuar Comprando
            </button>
          </div>
        ) : (
          <>
            <div className="p-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-border">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-primary font-bold text-lg">C${item.price}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-muted rounded transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-muted rounded transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto p-1 hover:bg-red-500/10 rounded transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border p-6 space-y-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">C${total.toFixed(2)}</span>
              </div>

              <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition font-semibold">
                Proceder al Checkout
              </button>

              <button
                onClick={clearCart}
                className="w-full border border-border text-foreground py-2 rounded-lg hover:bg-muted transition"
              >
                Limpiar Carrito
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
