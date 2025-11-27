"use client";

import { useEffect, useState } from "react";
import { Star, ShoppingCart, Loader2 } from "lucide-react";
import { useCart } from "@/context/cart-contex";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export function FeaturedProducts() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/productos/top`);
        if (res.ok) {
          const data = await res.json();
         
          setProducts(Array.isArray(data) ? data : data.data || []);
        }
      } catch (error) {
        console.error("Error cargando destacados", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTop();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4 bg-muted/30 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    );
  }

  if (products.length === 0) return null; 

  return (
    <section id="destacados" className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-foreground">
          Favoritos de la Comunidad
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Descubre los productos reacondicionados mejor valorados por nuestros clientes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
          {products.map((product) => {
            const mainImage = product.imagenes?.find((img: any) => img.esPrincipal)?.url || product.imagenes?.[0]?.url;
            const rating = product.ratingPromedio || 0;
            const reviewsCount = product.totalResenas || 0;

            return (
              <div
                key={product.id}
                className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
              >
                {/* Área de Imagen Clickable */}
                <Link href={`/products/${product.id}`} className="relative overflow-hidden h-64 bg-white p-4 flex items-center justify-center">
                  {mainImage ? (
                    <img
                      src={mainImage}
                      alt={product.titulo}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
                    />
                  ) : (
                    <span className="text-gray-300 font-medium">Sin Imagen</span>
                  )}
                  
                  {/* Etiqueta Top */}
                  <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                     <Star className="w-3 h-3 fill-current" /> Mejor valorado
                  </div>
                </Link>

                {/* Info */}
                <div className="p-5 flex flex-col flex-grow">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-bold text-lg mb-2 truncate text-foreground hover:text-primary transition-colors" title={product.titulo}>
                        {product.titulo}
                    </h3>
                  </Link>

                  {/* Estrellas */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.round(rating) ? "fill-current" : "text-gray-200"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">({reviewsCount} reviews)</span>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground uppercase font-semibold">Precio</span>
                        <span className="text-xl font-extrabold text-primary">C${Number(product.precio).toFixed(2)}</span>
                    </div>

                    <button
                      onClick={() =>
                        addToCart({
                          id: product.id,
                          name: product.titulo,
                          price: Number(product.precio),
                          image: mainImage,
                          maxQuantity: product.stock 
                        })
                      }
                      className="bg-primary text-primary-foreground p-3 rounded-xl hover:opacity-90 transition shadow-md active:scale-95"
                      title="Agregar al carrito"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}