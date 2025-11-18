import { CheckCircle2, Zap, Shield, Leaf } from "lucide-react"

export function Benefits() {
  const benefits = [
    {
      icon: CheckCircle2,
      title: "Calidad Verificada",
      description: "Cada producto pasa rigurosos controles de calidad antes de llegar a ti.",
    },
    {
      icon: Zap,
      title: "Ahorra Hasta 50%",
      description: "Productos de las mejores marcas a fracción del precio original.",
    },
    {
      icon: Shield,
      title: "Garantía Completa",
      description: "Garantía de 1 año en todos nuestros productos reacondicionados.",
    },
    {
      icon: Leaf,
      title: "Eco-Amigable",
      description: "Reduce tu huella de carbono reutilizando electrónica de calidad.",
    },
  ]

  return (
    <section id="beneficios" className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">¿Por Qué Elegir RENOVA?</h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Te ofrecemos la mejor combinación de calidad, precio y servicio al cliente
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon
            return (
              <div key={idx} className="bg-card rounded-lg p-6 border border-border hover:border-primary transition">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
