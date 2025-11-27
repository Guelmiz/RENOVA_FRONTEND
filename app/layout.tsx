import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from 'next/font/google'
import { CartProvider } from "@/context/cart-contex"
import { UserProvider } from "@/context/user-contex"
import { CartSidebar } from "@/components/cart-sidebard"
import { ConditionalHeader } from "@/components/conditional-header"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RENOVA - Productos Reacondicionados",
  description: "Compra productos reacondicionados de calidad con garantía",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
        <UserProvider>
          <CartProvider>
            <ConditionalHeader />
            {children}
            <CartSidebar />
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  )
}
