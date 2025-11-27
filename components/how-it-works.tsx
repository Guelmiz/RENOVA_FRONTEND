export function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Busca",
      description: "Explora nuestro amplio catálogo de productos certificados",
    },
    {
      number: "2",
      title: "Verifica",
      description: "Revisa las especificaciones técnicas y estado de cada artículo",
    },
    {
      number: "3",
      title: "Compra",
      description: "Realiza tu pedido de forma segura con múltiples opciones de pago",
    },
    {
      number: "4",
      title: "Disfruta",
      description: "Recibe tu producto con embalaje protegido en 3-5 días hábiles",
    },
  ]

  return (
    <section id="nosotros" className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Cómo Funciona</h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Un proceso simple y seguro desde la búsqueda hasta la entrega
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              <div className="bg-card rounded-lg p-6 border border-border text-center h-full flex flex-col items-center justify-center">
                <div className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-primary/30 transform -translate-y-1/2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
