export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-bold text-lg mb-4">RENOVA</h3>
            <p className="text-sm opacity-75">Tu tienda de confianza para productos reacondicionados de calidad.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Compra</h4>
            <ul className="space-y-2 text-sm opacity-75">
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  Categorías
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  Ofertas
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  Garantía
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm opacity-75">
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Políticas</h4>
            <ul className="space-y-2 text-sm opacity-75">
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  Términos
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  Devoluciones
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 text-center text-sm opacity-75">
          <p>&copy; 2025 RENOVA. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
