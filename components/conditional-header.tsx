"use client"

import { usePathname } from "next/navigation"
import { Header } from "./header"

export function ConditionalHeader() {
  const pathname = usePathname()
  if (pathname === "/login" || pathname === "/register" || pathname =="/profile" || pathname =="/profile/edit") {
    return null
  }

  return <Header />
}
