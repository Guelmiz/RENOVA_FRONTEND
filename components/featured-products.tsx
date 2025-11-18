"use client"

import { Star, ShoppingCart } from "lucide-react"
import { useCart } from "@/context/cart-contex"

export function FeaturedProducts() {
  const { addToCart } = useCart()

  const products = [
    {
      id: "1",
      name: "MacBook Air M1",
      price: 799,
      originalPrice: 1199,
      rating: 4.8,
      reviews: 124,
      image: "/macbook-air-m1.jpg",
    },
    {
      id: "2",
      name: "iPhone 13 Pro",
      price: 449,
      originalPrice: 999,
      rating: 4.9,
      reviews: 89,
      image: "/iphone-13-pro.png",
    },
    {
      id: "3",
      name: 'Samsung TV 55"',
      price: 349,
      originalPrice: 699,
      rating: 4.7,
      reviews: 156,
      image: "/samsung-tv-55.jpg",
    },
    {
      id: "4",
      name: 'iPad Pro 12.9"',
      price: 599,
      originalPrice: 1099,
      rating: 4.8,
      reviews: 102,
      image: "/ipad-pro.png",
    },
  ]

  return (
    <section id="productos" className="py-20 px-4 bg-muted/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Productos Destacados</h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Nuestros artículos más populares con las mejores valoraciones de clientes
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary transition group"
            >
              <div className="relative overflow-hidden h-48 bg-muted">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  -40%
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">({product.reviews})</span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-primary">${product.price}</span>
                  <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                </div>

                <button
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      originalPrice: product.originalPrice,
                      image: product.image,
                    })
                  }
                  className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Agregar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
