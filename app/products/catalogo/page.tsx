"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Edit, Plus, Package, Search, X, Save, AlertCircle, 
  CheckCircle, XCircle // Nuevos iconos
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export default function MyProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // --- ESTADO PARA LA NOTIFICACIÓN (TOAST) ---
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchMyProducts();
  }, []);

  // Función para mostrar notificaciones temporales
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    // Ocultar automáticamente después de 3 segundos
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const getToken = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      const session = localStorage.getItem("renova_auth");
      if (session) {
        try {
           token = JSON.parse(session).token;
        } catch (e) {}
      }
    }
    return token;
  };

  const fetchMyProducts = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/productos/mis-productos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data.data || []);
      }
    } catch (error) {
      console.error("Error cargando productos", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (id: string, updatedData: any) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/productos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        // Actualizar la lista localmente
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
        );
        
        setEditingProduct(null); // Cerrar modal
        
        // --- USAMOS EL TOAST EN VEZ DE ALERT ---
        showToast("Producto actualizado correctamente", "success");
      } else {
        const err = await res.json();
        showToast(err.message || "No se pudo actualizar", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error de conexión con el servidor", "error");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-foreground relative">
      
      {/* --- NOTIFICACIÓN FLOTANTE (TOAST) --- */}
      {toast && toast.show && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl border animate-in slide-in-from-bottom-5 fade-in duration-300 
          ${toast.type === 'success' 
            ? 'bg-white border-emerald-100 text-emerald-800' 
            : 'bg-white border-red-100 text-red-800'
          }`}
        >
          <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="font-bold text-sm">{toast.type === 'success' ? '¡Éxito!' : 'Error'}</h4>
            <p className="text-sm opacity-90">{toast.message}</p>
          </div>
          <button onClick={() => setToast(null)} className="ml-4 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Productos</h1>
            <p className="text-gray-500 mt-1">Gestiona tu inventario y catálogo</p>
          </div>
          <Link
            href="/products/nuevo"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Nuevo Producto
          </Link>
        </div>

        {/* Buscador */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-center gap-2 font-medium text-gray-600">
            <Package className="w-5 h-5 text-primary" />
            <span>{filteredProducts.length} Total</span>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-10">Cargando productos...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-500">No se encontraron productos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const mainImage = product.imagenes?.find((img: any) => img.esPrincipal)?.url || product.imagenes?.[0]?.url;

              return (
                <div key={product.id} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    {mainImage ? (
                      <img src={mainImage} alt={product.titulo} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
                    )}
                    <div className="absolute top-3 left-3">
                      {!product.activo ? (
                        <span className="bg-red-500/90 text-white text-xs font-bold px-2 py-1 rounded-lg backdrop-blur-sm">INACTIVO</span>
                      ) : (
                        <span className="bg-emerald-500/90 text-white text-xs font-bold px-2 py-1 rounded-lg backdrop-blur-sm">ACTIVO</span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 flex-1">{product.titulo}</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-lg font-bold text-gray-900">C${Number(product.precio).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-3 mt-auto">
                      <span>Stock: <span className="font-medium text-gray-700">{product.stock}</span></span>
                      
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" /> Editar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Edición */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaveProduct}
        />
      )}
    </main>
  );
}

// --- COMPONENTE MODAL ---
function EditProductModal({ product, onClose, onSave }: { product: any; onClose: () => void; onSave: (id: string, data: any) => void }) {
  const [form, setForm] = useState({
    titulo: product.titulo,
    precio: product.precio,
    stock: product.stock,
    descripcion: product.descripcion || "",
    activo: product.activo,
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    await onSave(product.id, {
      titulo: form.titulo,
      descripcion: form.descripcion,
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock),
      activo: form.activo,
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Editar Producto</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Nombre del producto</label>
            <input
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Precio (C$)</label>
              <input
                type="number"
                name="precio"
                step="0.01"
                min="0"
                value={form.precio}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-primary/50 outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                name="stock"
                min="0"
                value={form.stock}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-primary/50 outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              name="descripcion"
              rows={3}
              value={form.descripcion}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-primary/50 outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div className="flex items-center gap-2">
                <AlertCircle className={`w-5 h-5 ${form.activo ? "text-emerald-500" : "text-red-500"}`} />
                <span className="text-sm font-medium text-gray-700">
                    Estado: {form.activo ? "Visible al público" : "Oculto"}
                </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="activo"
                checked={form.activo}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition flex items-center gap-2 disabled:opacity-70"
            >
              <Save className="w-4 h-4" />
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}