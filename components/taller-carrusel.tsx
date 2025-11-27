"use client";

import { useState, useEffect } from "react";
import { Store, ImageOff } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

const FALLBACK_IMAGES = [
  { url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1080&auto=format&fit=crop", nombre: "Reparación Especializada" },
  { url: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1080&auto=format&fit=crop", nombre: "Tienda de Electrónica" },
  { url: "https://images.unsplash.com/photo-1588508065123-287b28e013da?q=80&w=1080&auto=format&fit=crop", nombre: "Equipos Refurbished" },
];

// Definimos la interfaz para el estado
interface TallerImage {
  url: string;
  nombre: string;
}

export function TallerCarousel() {
  // Ahora el estado guarda objetos, no solo strings
  const [images, setImages] = useState<TallerImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/talleres-publicos`);
        
        if (res.ok) {
          const data = await res.json();
          const lista = Array.isArray(data) ? data : data.data || [];
          
          // Mapeo robusto basado en tu controlador getTalleresPublicos
          const apiImages = lista
            .map((t: any) => {
                let url = t.imagenPerfil || t.imagen;
                // CORRECCIÓN IMPORTANTE: Si la URL es relativa (no empieza con http), le pegamos el API_BASE
                if (url && typeof url === 'string' && !url.startsWith('http')) {
                    url = `${API_BASE}${url}`;
                }
                
                return {
                    url: url,
                    nombre: t.tallerNombre || "Taller Aliado" // Usamos el nombre real del backend
                };
            })
            .filter((item: TallerImage) => item.url && item.url.length > 10);

          if (apiImages.length > 0) {
            setImages(apiImages);
          } else {
            console.log("No se encontraron imágenes válidas, usando fallback.");
            setImages(FALLBACK_IMAGES);
          }
        } else {
          setImages(FALLBACK_IMAGES);
        }
      } catch (error) {
        console.error("Error conectando con API carrusel:", error);
        setImages(FALLBACK_IMAGES);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [images]);

  const handleImageError = (index: number) => {
    const newImages = [...images];
    // Reemplazamos manteniendo la estructura de objeto
    newImages[index] = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
    setImages(newImages);
  };

  if (loading) {
    return (
      <div className="w-full h-64 md:h-[500px] bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center border border-gray-200">
        <Store className="w-12 h-12 text-gray-300" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 md:h-[500px] overflow-hidden rounded-2xl shadow-2xl bg-gray-900 group">
      {images.length === 0 ? (
        <div className="flex h-full items-center justify-center text-white/50 flex-col gap-2">
            <ImageOff className="w-12 h-12" />
            <p>No hay imágenes disponibles</p>
        </div>
      ) : (
        images.map((img, index) => (
          <div
            key={`${img.url}-${index}`} // Usamos img.url para la key
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={img.url}
              alt={img.nombre} // Ahora usamos el nombre real del taller
              className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
              onError={() => handleImageError(index)}
            />
            {/* Opcional: Mostrar el nombre del taller en la imagen */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white font-medium text-lg ml-2">{img.nombre}</p>
            </div>
          </div>
        ))
      )}

      {/* Indicadores */}
      {images.length > 1 && (
        <div className="absolute bottom-6 right-6 flex justify-end gap-2 z-20">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 shadow-sm backdrop-blur-sm ${
                idx === currentIndex 
                  ? "bg-white w-8" 
                  : "bg-white/40 w-2 hover:bg-white/80"
              }`}
              aria-label={`Ver imagen ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}