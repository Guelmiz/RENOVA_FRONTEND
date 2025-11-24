import { TallerSection } from "@/components/tallersection"

export default function TalleresPage() {
  return (
    <main className="max-w-6xl mx-auto pt-24 pb-12 px-4 space-y-12">

      {/* Taller 1 */}
      <TallerSection
      tallerId={1}
        tallerNombre="Taller 1"
        icono="🏁"
        rating={4.2}
        anos={5}
        colorBorde="border-blue-500"
        productos={[
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
        ]}
      />

      {/* Taller 2 */}
      <TallerSection
      tallerId={2}
        tallerNombre="Taller 2"
        icono="🛠️"
        rating={4.9}
        anos={10}
        colorBorde="border-green-400"
        productos={[
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
        ]}
      />

      {/* Taller 3 */}
      <TallerSection
      tallerId={3}
        tallerNombre="Taller 3"
        icono="🅺"
        rating={4.5}
        anos={3}
        colorBorde="border-green-300"
        productos={[
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
        ]}
      />

    </main>
  )
}
