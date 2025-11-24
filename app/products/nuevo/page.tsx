"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation"; // Para redirigir al terminar
import { CheckCircle, XCircle, X } from "lucide-react"; // Iconos para el Toast

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

const TABS = ["Básico", "Imágenes", "Garantía"] as const;
type TabKey = (typeof TABS)[number];

export default function SubirProductoPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("Básico");
  const [loading, setLoading] = useState(false);

  // --- ESTADO PARA TOAST (Notificaciones) ---
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const [formData, setFormData] = useState({
    nombre: "",
    marca: "",
    categoriaId: "",
    descripcion: "",
    precio: 1,
    stock: 1,
  });

  const [files, setFiles] = useState<File[]>([]);
  const [principalIndex, setPrincipalIndex] = useState<number>(0);
  const [selectedPruebas, setSelectedPruebas] = useState<string[]>([]);
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);

  const uploadToCloudinary = async (file: File) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error("Faltan las credenciales de Cloudinary en el .env");
    }

    const formDataCloud = new FormData();
    formDataCloud.append("file", file);
    formDataCloud.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formDataCloud }
    );

    if (!res.ok) throw new Error("Error subiendo imagen a Cloudinary");
    
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async () => {
    // 1. Validaciones
    if (!formData.nombre || !formData.categoriaId) {
      showToast("Faltan datos básicos (Nombre o Categoría)", "error");
      return;
    }

    // 2. Obtener Token (Lógica robusta renova_auth)
    let token = null;
    try {
        const sessionData = localStorage.getItem("renova_auth");
        if (sessionData) {
            const parsedData = JSON.parse(sessionData);
            token = parsedData.token || (parsedData.state && parsedData.state.token);
        }
    } catch (e) {
        console.error("Error leyendo auth:", e);
    }

    if (!token) {
      showToast("Tu sesión expiró. Por favor inicia sesión.", "error");
      return;
    }

    try {
      setLoading(true);

      // 3. Subir Imágenes
      const uploadedImages = await Promise.all(
        files.map(async (file, index) => ({
          url: await uploadToCloudinary(file),
          esPrincipal: index === principalIndex,
        }))
      );

      // 4. Payload
      const payload = {
        titulo: formData.nombre,
        marca: formData.marca,
        stock: Number(formData.stock),
        precio: Number(formData.precio),
        descripcion: formData.descripcion,
        categoriaId: formData.categoriaId,
        imagenes: uploadedImages,
        pruebas: selectedPruebas,
        certificaciones: selectedCerts,
      };

      // 5. Enviar al Backend
      const res = await fetch(`${API_BASE}/api/productos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast("¡Producto publicado exitosamente!", "success");
        
        // Esperamos un poco para que el usuario lea el mensaje y luego redirigimos
        setTimeout(() => {
            // Opción A: Ir a "Mis Productos" para verlo
            router.push("/products/my-products");
            
            // Opción B: Recargar si quieres seguir subiendo (descomenta la siguiente linea)
            // window.location.reload();
        }, 2000);

      } else {
        const err = await res.json();
        showToast(err.message || "Hubo un error al guardar", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error de conexión con el servidor", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted/40 pt-24 pb-12 px-4 relative">
      
      {/* --- TOAST NOTIFICATION --- */}
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

      <div className="max-w-5xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-foreground">
            Sube tus Productos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Completa la información para listar tu producto en el catálogo en línea
          </p>
        </header>

        {/* Navegación por Tabs */}
        <nav className="flex bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-foreground text-background"
                  : "bg-transparent text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Contenido Principal */}
        <section className="bg-white border border-border rounded-3xl shadow-md px-6 sm:px-10 py-8">
          
          <div className="mb-8">
            {activeTab === "Básico" && (
              <div>
                <h2 className="text-xl font-semibold text-foreground">Información Básica</h2>
                <p className="text-xs text-muted-foreground">Datos principales del producto</p>
              </div>
            )}
            {activeTab === "Imágenes" && (
              <div>
                <h2 className="text-xl font-semibold text-foreground">Imágenes del Producto</h2>
                <p className="text-xs text-muted-foreground">Sube fotos de alta calidad</p>
              </div>
            )}
            {activeTab === "Garantía" && (
              <div>
                <h2 className="text-xl font-semibold text-foreground">Pruebas y Certificaciones</h2>
                <p className="text-xs text-muted-foreground">Selecciona las pruebas realizadas</p>
              </div>
            )}
          </div>

          {/* Formularios */}
          {activeTab === "Básico" && (
            <BasicForm
              formData={formData}
              setFormData={setFormData}
              changeTab={() => setActiveTab("Imágenes")}
            />
          )}

          {activeTab === "Imágenes" && (
            <ImagesForm
              files={files}
              setFiles={setFiles}
              principalIndex={principalIndex}
              setPrincipalIndex={setPrincipalIndex}
              changeTab={() => setActiveTab("Garantía")}
            />
          )}

          {activeTab === "Garantía" && (
            <GarantiaForm
              selectedPruebas={selectedPruebas}
              setSelectedPruebas={setSelectedPruebas}
              selectedCerts={selectedCerts}
              setSelectedCerts={setSelectedCerts}
              onSubmit={handleSubmit}
              loading={loading}
            />
          )}
        </section>
      </div>
    </main>
  );
}

function BasicForm({ formData, setFormData, changeTab }: any) {
  const [categorias, setCategorias] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/categorias`)
      .then((res) => res.json())
      .then((data) => {
        if(Array.isArray(data)) setCategorias(data);
        else console.error("La respuesta de categorías no es un array", data);
      })
      .catch(console.error);
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        <Field label="Nombre del producto">
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            type="text"
            className="input-like w-full border-2 p-2 rounded-md"
            placeholder="Iphone 13 Pro Max 256 Gb"
          />
        </Field>

        <Field label="Marca del producto">
          <input
            name="marca"
            value={formData.marca}
            onChange={handleChange}
            type="text"
            className="input-like w-full border-2 p-2 rounded-md"
            placeholder="Apple"
          />
        </Field>

        <Field label="Categoría del Producto">
          <select
            name="categoriaId"
            value={formData.categoriaId}
            onChange={handleChange}
            className="input-like w-full border-2 p-2 rounded-md bg-white"
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Descripción">
          <input
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            type="text"
            className="input-like w-full border-2 p-2 rounded-md"
            placeholder="Breve descripción..."
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Precio">
            <input
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              type="number"
              min={0}
              className="input-like border-2 p-2 rounded-md w-full"
            />
          </Field>
          <Field label="Stock disponible">
            <input
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              type="number"
              min={0}
              className="input-like border-2 p-2 rounded-md w-full"
            />
          </Field>
        </div>
      </div>

      <aside className="space-y-5">
        <div className="space-y-1.5">
          <h3 className="text-sm font-semibold text-foreground">Detalles</h3>
          <textarea
            readOnly
            className="input-like border-2 min-h-[350px] min-w-[280px] resize-none bg-gray-50 p-2 rounded-md"
            value={`Vista Previa:\n\nProducto: ${formData.nombre}\nMarca: ${formData.marca}\nPrecio: C$${formData.precio}`}
          />
        </div>
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={changeTab}
            className="bg-foreground text-background px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition"
          >
            Siguiente
          </button>
        </div>
      </aside>
    </div>
  );
}

function ImagesForm({ files, setFiles, principalIndex, setPrincipalIndex, changeTab }: any) {
  const [previews, setPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const urls = files.map((file: File) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url: string) => URL.revokeObjectURL(url));
  }, [files]);

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    setFiles((prev: any) => [...prev, ...Array.from(incoming)]);
  };

  const handleRemove = (index: number) => {
    setFiles((prev: any) => prev.filter((_: any, i: number) => i !== index));
    if (index === principalIndex) setPrincipalIndex(0);
  };

  return (
    <div className="flex flex-col h-full justify-between gap-8">
      <div className="space-y-6">
        <div
          className="border-2 border-dashed border-border rounded-xl py-10 px-4 flex flex-col items-center justify-center text-center bg-muted/40 cursor-pointer hover:bg-muted/70 transition"
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <span className="text-2xl">⬆️</span>
          <p className="text-sm font-medium mt-2">Subir Imágenes</p>
        </div>

        {previews.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold">
              Haz clic en la imagen para hacerla Principal (Borde Azul)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {previews.map((src, idx) => (
                <div
                  key={idx}
                  onClick={() => setPrincipalIndex(idx)}
                  className={`relative group rounded-lg overflow-hidden border-4 cursor-pointer transition-all ${
                    idx === principalIndex
                      ? "border-blue-500 shadow-md"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={src}
                    className="h-28 w-full object-cover"
                    alt="preview"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(idx);
                    }}
                    className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    X
                  </button>
                  {idx === principalIndex && (
                    <div className="absolute bottom-0 w-full bg-blue-500 text-white text-[10px] text-center py-0.5">
                      PRINCIPAL
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={changeTab}
          className="bg-foreground text-background px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

function GarantiaForm({ selectedPruebas, setSelectedPruebas, selectedCerts, setSelectedCerts, onSubmit, loading }: any) {
  const [pruebas, setPruebas] = useState<any[]>([]);
  const [certificaciones, setCertificaciones] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/pruebas`).then((r) => r.json()).then((data) => { if(Array.isArray(data)) setPruebas(data); }).catch(console.error);
    fetch(`${API_BASE}/api/certificaciones`).then((r) => r.json()).then((data) => { if(Array.isArray(data)) setCertificaciones(data); }).catch(console.error);
  }, []);

  const toggle = (id: string, list: string[], setList: any) => {
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-8">
        <Field label="Certificaciones (Selección Múltiple)">
          <div className="flex flex-wrap gap-2 p-4 border-2 rounded-xl bg-muted/10 min-h-[80px]">
            {certificaciones.length === 0 && <p className="text-sm text-gray-400">Cargando o sin datos...</p>}
            {certificaciones.map((cert) => {
              const isSelected = selectedCerts.includes(cert.id);
              return (
                <button
                  key={cert.id}
                  type="button"
                  onClick={() => toggle(cert.id, selectedCerts, setSelectedCerts)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                    isSelected ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {isSelected ? "✓ " : "+ "} {cert.nombre}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Pruebas Realizadas (Selección Múltiple)">
          <div className="flex flex-wrap gap-2 p-4 border-2 rounded-xl bg-muted/10 min-h-[80px]">
            {pruebas.length === 0 && <p className="text-sm text-gray-400">Cargando o sin datos...</p>}
            {pruebas.map((prueba) => {
              const isSelected = selectedPruebas.includes(prueba.id);
              return (
                <button
                  key={prueba.id}
                  type="button"
                  onClick={() => toggle(prueba.id, selectedPruebas, setSelectedPruebas)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                    isSelected ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {isSelected ? "✓ " : "+ "} {prueba.nombre}
                </button>
              );
            })}
          </div>
        </Field>
      </div>

      <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-5 py-4 text-sm text-emerald-900">
        <p className="font-semibold mb-1">Compromiso de Calidad</p>
        <p>Al publicar, confirmas que el producto cumple con las pruebas seleccionadas.</p>
      </div>

      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg bg-foreground text-background px-8 py-3 text-sm font-bold hover:bg-foreground/90 transition disabled:opacity-50"
        >
          {loading ? "Publicando..." : "Publicar Artículo Completo"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}