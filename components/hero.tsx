"use client";
import { useRouter } from "next/navigation";
export function Hero() {
  const router = useRouter();
  return (
    <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-muted to-background">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6">
          Tecnología Premium a{" "}
          <span className="text-primary">Mejor Precio</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 text-balance">
          Descubre productos reacondicionados de las mejores marcas con
          garantía. Ahorra hasta 50% sin sacrificar calidad.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/taller")}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            Ir al Taller
          </button>
        </div>
      </div>

      <div className="mt-16 max-w-4xl mx-auto">
        <img
          src="/refurbished-electronics-store-modern-aesthetic.jpg"
          alt="Productos reacondicionados"
          className="w-full rounded-xl shadow-lg"
        />
      </div>
    </section>
  );
}
