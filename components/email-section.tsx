'use client'

import { Mail } from 'lucide-react'
// 1. ELIMINAMOS EL IMPORT DEL BOTÓN
// import { Button } from '@/components/ui/button' 

export default function EmailSection() {
  return (
    <section className="mt-8">
      <h2 className="mb-6 text-lg font-semibold text-foreground">
        My email Address
      </h2>

      {/* Email Card */}
      <div className="flex items-start gap-4 rounded-lg bg-card p-6 shadow-sm">
        <div className="flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="flex-grow">
          <p className="font-medium text-foreground">alexarawles@gmail.com</p>
          <p className="text-sm text-muted-foreground">1 month ago</p>
        </div>
      </div>

      {/* Add Email Button */}
      <div className="mt-4">
        {/* 2. USAMOS LA ETIQUETA <button> ESTÁNDAR CON CLASES TAILWIND */}
        <button
          type="button"
          className="
            inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors 
            h-10 px-4 py-2 
            border
            text-primary border-primary/20 
            hover:bg-primary/10 hover:border-primary/30
            focus:outline-none focus:ring-2 focus:ring-primary/20
          "
        >
          + Add Email Address
        </button>
      </div>
    </section>
  )
}