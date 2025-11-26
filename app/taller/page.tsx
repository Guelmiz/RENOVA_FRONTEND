"use client";

import { useState, useEffect } from "react";
import { TallerSection } from "@/components/tallersection";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export default function TalleresPage() {
  const [talleres, setTalleres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTalleres = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/talleres-publicos`);
        if (res.ok) {
          const data = await res.json();
          setTalleres(Array.isArray(data) ? data : data.data || []);
        }
      } catch (error) {
        console.error("Error cargando talleres", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTalleres();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="animate-pulse text-xl font-semibold text-gray-400">Cargando talleres...</div>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto pt-24 pb-12 px-4 space-y-12 min-h-screen">
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Nuestros Talleres Aliados</h1>
        <p className="text-muted-foreground mt-2">Encuentra productos reacondicionados de vendedores verificados.</p>
      </header>

      {talleres.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-500">No hay talleres con productos disponibles en este momento.</p>
        </div>
      ) : (
        talleres.map((taller, index) => (
          <TallerSection
            key={taller.tallerId}
            tallerId={taller.tallerId}
            tallerNombre={taller.tallerNombre}
            
           
            imagenPerfil={taller.imagenPerfil}
            
            rating={taller.rating}
            
            
            colorBorde={index % 2 === 0 ? "border-blue-500" : "border-green-400"}
            productos={taller.productos}
          />
        ))
      )}
    </main>
  );
}