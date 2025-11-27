
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { User, Star, MapPin, Clock, CheckCircle } from "lucide-react"; // Iconos bonitos

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export default function TallerDetailPage() {
  const params = useParams();
  const id = params?.id as string; // Obtenemos el ID de la URL

  const [taller, setTaller] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchTaller = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/talleres/${id}`);
        if (res.ok) {
          const data = await res.json();
          setTaller(data.data || data); // Ajuste según tu estructura de respuesta
        } else {
          setTaller(null);
        }
      } catch (error) {
        console.error("Error cargando taller", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaller();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="animate-pulse text-xl font-semibold text-gray-400">
          Cargando perfil del taller...
        </div>
      </div>
    );
  }

  if (!taller) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Taller no encontrado
        </h2>
        <Link href="/talleres" className="text-primary hover:underline">
          Volver a la lista
        </Link>
      </div>
    );
  }

  // Filtrado local de productos del taller
  const filteredProducts = taller.productos.filter((p: any) =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-muted/40 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumb / volver */}
        <div className="text-sm text-muted-foreground">
          <Link href="/talleres" className="hover:underline">
            Talleres
          </Link>{" "}
          / <span className="text-foreground font-medium">{taller.nombre}</span>
        </div>

        {/* Hero del taller */}
        <section className="bg-white rounded-3xl border border-border shadow-sm px-6 sm:px-10 py-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            {/* Avatar Taller */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 border-4 border-white shadow-md overflow-hidden flex-shrink-0">
              {taller.imagen ? (
                <img
                  src={taller.imagen}
                  alt={taller.nombre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                  <User className="w-10 h-10" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                {taller.nombre}
              </h1>
              <p className="text-sm text-muted-foreground max-w-md">
                {taller.descripcion}
              </p>

              <div className="flex flex-wrap gap-3 text-xs sm:text-sm mt-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 text-yellow-700 px-3 py-1 border border-yellow-100 font-medium">
                  <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                  {taller.rating} Calificación
                </span>
                {/* Solo mostramos antigüedad si es > 0 */}
                {taller.anos > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 px-3 py-1 border border-blue-100 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {taller.anos} años activo
                  </span>
                )}
                {taller.ubicacion && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-700 px-3 py-1 border border-gray-200 font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    {taller.ubicacion}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 text-xs sm:text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-gray-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Productos
              verificados
            </p>
            <p className="text-gray-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Garantía
              Renova
            </p>
          </div>
        </section>

        {/* Barra de Filtros y Buscador */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-800">
            Catálogo del Taller ({filteredProducts.length})
          </h2>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar en este taller..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </section>

        {/* Grid de productos */}
        <section className="bg-white rounded-3xl border border-border shadow-sm p-6 min-h-[400px]">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <p>No se encontraron productos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredProducts.map((p: any) => (
                <Link
                  href={`/products/${p.id}`}
                  key={p.id}
                  className="group block"
                >
                  <article className="h-full rounded-2xl border border-gray-100 bg-white hover:shadow-lg hover:-translate-y-1 transition duration-300 p-3 flex flex-col">
                    {/* Imagen */}
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3">
                      {p.imagen ? (
                        <img
                          src={p.imagen}
                          alt={p.nombre}
                          className="w-full h-full object-cover mix-blend-multiply"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                          Sin Foto
                        </div>
                      )}
                    </div>

                    <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">
                      {p.categoria}
                    </p>

                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-auto group-hover:text-primary transition-colors">
                      {p.nombre}
                    </h3>

                    <div className="mt-3 flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400">Precio</span>
                        <span className="text-lg font-bold text-gray-900">
                          C${p.precio.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        {p.rating.toFixed(1)}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
