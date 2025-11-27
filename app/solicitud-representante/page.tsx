"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-contex";
import { UploadCloud, CheckCircle, FileText, Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function SolicitudPage() {
  const { user, token } = useUser();
  const router = useRouter();
  
  const [motivo, setMotivo] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState("RUC");
  const [loading, setLoading] = useState(false);

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET!);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, { method: "POST", body: formData });
    const data = await res.json();
    return data.secure_url; // o data.url para pdfs
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !motivo) return alert("Completa todos los campos");
    if (!token) return alert("Inicia sesión");

    setLoading(true);
    try {
      // 1. Subir archivo
      const url = await uploadToCloudinary(file);

      // 2. Enviar al backend
      const payload = {
        motivo,
        documentos: [{ tipo: docType, ruta: url }]
      };

      const res = await fetch(`${API_BASE}/api/solicitudes`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Solicitud enviada con éxito. Te notificaremos cuando sea revisada.");
        router.push("/");
      } else {
        const err = await res.json();
        alert(err.message || "Error al enviar");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 flex justify-center items-center">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Conviértete en Vendedor</h1>
          <p className="text-gray-500 mt-2">Envíanos tus datos para verificar tu taller.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Motivo de solicitud</label>
            <textarea 
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
              placeholder="Cuéntanos sobre tu taller..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento</label>
            <select 
              className="w-full border border-gray-300 rounded-xl p-3 bg-white"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
            >
              <option value="RUC">RUC</option>
              <option value="Carta_autorizacion">Carta de Autorización</option>
              <option value="Correo_corporativo">Correo Corporativo</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Documento de Soporte</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition relative">
                <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    accept=".pdf,.jpg,.png,.jpeg"
                />
                {file ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-600 font-medium">
                        <CheckCircle className="w-5 h-5" /> {file.name}
                    </div>
                ) : (
                    <div className="text-gray-400">
                        <UploadCloud className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Click para subir PDF o Imagen</p>
                    </div>
                )}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-70 flex justify-center gap-2"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            Enviar Solicitud
          </button>
        </form>
      </div>
    </main>
  );
}