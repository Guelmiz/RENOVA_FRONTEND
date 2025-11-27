import Link from "next/link";
import { Star, User } from "lucide-react";

interface Product {
  categoria: string;
  nombre: string;
  rating: number;
  precio: number;
  imagen: string;
}

interface TallerSectionProps {
  tallerId: number | string;
  tallerNombre: string;
  imagenPerfil?: string | null; 
  rating: number;
  colorBorde: string;
  productos: Product[];
}

export function TallerSection({
  tallerId,
  tallerNombre,
  imagenPerfil,
  rating,
  colorBorde,
  productos,
}: TallerSectionProps) {
  return (
    <section className="space-y-6">
      {/* Encabezado del Taller */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          
          {/* FOTO DE PERFIL */}
          <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-100">
            {imagenPerfil ? (
              <img 
                src={imagenPerfil} 
                alt={tallerNombre} 
                className="w-full h-full object-cover"
              />
            ) : (
           
              <User className="w-6 h-6 text-gray-400" />
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              {tallerNombre}
            </h2>
            
            {/* RATING (Sin los años) */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-medium text-foreground">{rating}</span>
              {/* Texto de años eliminado */}
            </div>
          </div>
        </div>

        <Link 
            href={`/taller/${tallerId}`} 
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
        >
          Ver Taller
        </Link>
      </div>

      {/* Grid de Productos (Manteniendo tu diseño) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productos.map((prod, idx) => (
          <div key={idx} className="group flex flex-col items-center text-center space-y-3">
            {/* Card Imagen */}
            <div className={`relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 border-2 ${colorBorde} p-4 transition-transform duration-300 group-hover:scale-105`}>
                {prod.imagen ? (
                    <img 
                        src={prod.imagen} 
                        alt={prod.nombre} 
                        className="h-full w-full object-contain mix-blend-multiply" 
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">Sin imagen</div>
                )}
            </div>

            {/* Info Producto */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{prod.categoria}</p>
              <h3 className="font-medium text-foreground line-clamp-1">{prod.nombre}</h3>
              
              <div className="flex items-center justify-center gap-1 text-xs text-yellow-500">
                <Star className="w-3 h-3 fill-current" />
                <span>{prod.rating}</span>
              </div>
              
              <p className="text-lg font-bold text-foreground">
                ${Number(prod.precio).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Separador visual opcional */}
      <hr className="border-gray-100 mt-12" />
    </section>
  );
}