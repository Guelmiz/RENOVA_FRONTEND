"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-contex";
import { useUser } from "@/context/user-contex";
import { CheckCircle, Loader2, FileText, ArrowLeft } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart(); 
  const { user, token } = useUser();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null); 

  const handleConfirmOrder = async () => {
    if (!token) return alert("Sesión expirada");

    setLoading(true);
    try {
      // 1. Crear Pedido
      const res = await fetch(`${API_BASE}/api/pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        const pedidoId = data.data?.id || data.id;
        setOrderSuccess(pedidoId); 
        clearCart(); 
      } else {
        alert("Error: " + (data.message || "No se pudo procesar el pedido"));
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
      setLoading(false);
    }
  };

  const handleDownloadTicket = () => {
    if (!orderSuccess || !token) return;
    
    fetch(`${API_BASE}/api/pedidos/${orderSuccess}/ticket`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ticket-${orderSuccess.substring(0, 8)}.pdf`;
        a.click();
      })
      .catch((err) => console.error("Error descargando PDF", err));
  };

  // --- VISTA DE ÉXITO ---
  if (orderSuccess) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-lg max-w-md w-full border border-gray-100 animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-gray-500 mb-8">
            Tu orden ha sido procesada exitosamente. Por favor descarga tu
            ticket.
          </p>

          <button
            onClick={handleDownloadTicket}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2 mb-3"
          >
            <FileText className="w-5 h-5" /> Descargar Ticket PDF
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full text-gray-500 py-3 rounded-xl font-medium hover:bg-gray-50 transition"
          >
            Volver al inicio
          </button>
        </div>
      </main>
    );
  }

  // --- VISTA DE RESUMEN (CHECKOUT) ---
  if (items.length === 0) {
    return (
      <main className="min-h-screen pt-24 px-4 text-center">
        <h2 className="text-2xl font-bold">Tu carrito está vacío</h2>
        <button
          onClick={() => router.push("/products/catalogo")}
          className="mt-4 text-primary hover:underline"
        >
          Ir al catálogo
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Finalizar Compra
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">
                  Resumen del pedido
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image && (
                        <img
                          src={item.image}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        Cant: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-gray-900">
                      C$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Datos del Cliente (Visual) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-800 mb-4">
                Datos de Facturación
              </h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Cliente:</span> {user?.fullName}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {user?.email}
                </p>
                <p>
                  <span className="font-medium">Método:</span> Pago en Sucursal
                  (Ticket)
                </p>
              </div>
            </div>
          </div>

          {/* Total y Botón */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">C$ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-100">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary">
                  C$ {total.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleConfirmOrder}
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Confirmar Pedido"
                )}
              </button>

              <p className="text-xs text-center text-gray-400 mt-4">
                Al confirmar, se generará un ticket para que retires tu
                producto.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
