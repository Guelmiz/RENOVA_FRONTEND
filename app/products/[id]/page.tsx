"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/context/user-contex";
import { useCart } from "@/context/cart-contex";
import {
  ShoppingCart,
  Star,
  ShieldCheck,
  Check,
  ChevronLeft,
  User,
  Store,
  Loader2,
  Eye,
  EyeOff,
  ShieldAlert,
  CheckCircle,
  XCircle,
  X,
  AlertTriangle,
} from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token } = useUser();
  const { addToCart } = useCart(); // Contexto del carrito
  const id = params?.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Estados UI
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Reseña");

  // Estados reseña
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // --- ESTADO PARA EL MODAL DE MODERACIÓN ---
  const [reviewToModerate, setReviewToModerate] = useState<{
    id: string;
    status: string;
  } | null>(null);

  // --- ESTADO PARA NOTIFICACIONES (TOAST) ---
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Verificar si es ADMIN
  const isAdmin = user?.roles?.some(
    (r) =>
      String(r).toUpperCase() === "ADMINISTRADOR" ||
      String(r).toUpperCase() === "ADMIN"
  );

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/productos/${id}`);
      if (res.ok) {
        const data = await res.json();
        const prodData = data.data || data;
        setProduct(prodData);

        const mainImg =
          prodData.imagenes?.find((img: any) => img.esPrincipal)?.url ||
          prodData.imagenes?.[0]?.url;
        setSelectedImage(mainImg);
      }
    } catch (error) {
      console.error("Error de conexión", error);
      showToast("Error al cargar el producto", "error");
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal de confirmación
  const openModerateModal = (reviewId: string, currentStatus: string) => {
    setReviewToModerate({ id: reviewId, status: currentStatus });
  };

  // Confirmar acción de moderación
  const confirmModeration = async () => {
    if (!reviewToModerate) return;

    const newStatus =
      reviewToModerate.status === "aprobado" ? "rechazado" : "aprobado";

    try {
      const res = await fetch(
        `${API_BASE}/api/resenas/${reviewToModerate.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ estado: newStatus }),
        }
      );

      if (res.ok) {
        showToast(
          newStatus === "aprobado"
            ? "Reseña visible para todos"
            : "Reseña oculta al público",
          "success"
        );
        fetchProduct();
      } else {
        showToast("No se pudo actualizar el estado", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error de conexión", "error");
    } finally {
      setReviewToModerate(null); // Cerrar modal
    }
  };

  const handleSubmitReview = async () => {
    if (!token) {
      showToast("Debes iniciar sesión para opinar", "error");
      return;
    }
    if (userRating === 0) {
      showToast("Por favor califica con estrellas", "error");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch(`${API_BASE}/api/resenas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productoId: product.id,
          calificacion: userRating,
          comentario: comment,
        }),
      });

      if (res.ok) {
        showToast("¡Reseña publicada con éxito!", "success");
        setComment("");
        setUserRating(0);
        fetchProduct();
      } else {
        const d = await res.json();
        showToast(d.message || "Error al publicar", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Error de conexión", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
          <span className="text-gray-500 font-medium">Cargando...</span>
        </div>
      </div>
    );
  if (!product) return null;

  const reviews = product.resenas || [];

  // Calcular promedio visual
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc: number, r: any) => acc + r.calificacion, 0) /
          reviews.length
        ).toFixed(1)
      : "5.0";

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 text-foreground relative">
      {/* --- TOAST NOTIFICATION --- */}
      {toast && toast.show && (
        <div
          className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl border animate-in slide-in-from-bottom-5 fade-in duration-300 
          ${
            toast.type === "success"
              ? "bg-white border-emerald-100 text-emerald-800"
              : "bg-white border-red-100 text-red-800"
          }`}
        >
          <div
            className={`p-2 rounded-full ${
              toast.type === "success"
                ? "bg-emerald-100 text-emerald-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-sm">
              {toast.type === "success" ? "¡Éxito!" : "Error"}
            </h4>
            <p className="text-sm opacity-90">{toast.message}</p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="ml-4 hover:opacity-70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* --- MODAL DE CONFIRMACIÓN (MODERACIÓN) --- */}
      {reviewToModerate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-lg">Confirmar acción</h3>
            </div>

            <p className="text-gray-600">
              ¿Estás seguro de que deseas
              <span className="font-bold text-gray-900 mx-1">
                {reviewToModerate.status === "aprobado" ? "ocultar" : "mostrar"}
              </span>
              esta reseña al público?
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setReviewToModerate(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmModeration}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition shadow-sm
                            ${
                              reviewToModerate.status === "aprobado"
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-emerald-600 hover:bg-emerald-700"
                            }`}
              >
                {reviewToModerate.status === "aprobado"
                  ? "Sí, Ocultar"
                  : "Sí, Mostrar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-gray-500 hover:text-primary transition"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Volver al catálogo
        </button>

        {/* --- SECCIÓN SUPERIOR --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* GALERÍA */}
          <div className="space-y-4">
            <div className="aspect-[4/3] w-full bg-white rounded-3xl border border-gray-200 flex items-center justify-center p-6 shadow-sm overflow-hidden">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.titulo}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-gray-300">Sin imagen</span>
              )}
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {product.imagenes?.map((img: any) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-20 h-20 flex-shrink-0 rounded-xl border-2 bg-white p-2 transition ${
                    selectedImage === img.url
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={img.url}
                    className="w-full h-full object-contain"
                    alt="thumbnail"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* INFO */}
          <div className="space-y-6">
            <div>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                Disponible
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 font-serif">
                {product.titulo}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(Number(avgRating))
                          ? "fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  ({reviews.length} reseñas)
                </span>
              </div>
            </div>

            {/* CAJA DE PRECIO (C$) */}
            <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100">
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-gray-900">
                  C${Number(product.precio).toFixed(2)}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">Precio en Córdobas</p>
            </div>

            <div className="border border-blue-200 bg-blue-50 rounded-xl p-4 flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 text-sm">
                  Garantía por 12 meses
                </h3>
                <p className="text-xs text-blue-700">
                  Cobertura completa incluida directamente con el taller.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-emerald-500" />
                Stock:{" "}
                <span className="font-bold text-gray-900">{product.stock}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">
                  Cantidad:
                </span>
                <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 hover:bg-gray-100 text-gray-600"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 font-medium text-sm min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                    className="px-3 py-1 hover:bg-gray-100 text-gray-600"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                addToCart({
                  id: product.id,
                  name: product.titulo,
                  price: Number(product.precio),
                  image: selectedImage || "",
                  quantity: quantity,
                  maxQuantity: product.stock,
                });
                showToast("Producto agregado al carrito", "success");
              }}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-6 h-6" />
              Agregar al carrito
            </button>

            {product.publicadoPor && (
              <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between bg-white shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                    {product.publicadoPor.imagen ? (
                      <img
                        src={product.publicadoPor.imagen}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Store className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                      Vendedor Certificado
                    </p>
                    <p className="font-bold text-sm text-gray-900">
                      {product.publicadoPor.nombreUsuario}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- SECCIÓN INFERIOR --- */}
        <div className="border border-gray-200 bg-white rounded-3xl shadow-sm overflow-hidden min-h-[400px]">
          <div className="flex items-center gap-8 px-8 border-b border-gray-100 overflow-x-auto">
            {["Reseña", "Descripción", "Especificaciones"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-5 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-8 bg-gray-50/30">
            {activeTab === "Reseña" ? (
              <div className="max-w-3xl mx-auto space-y-10">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 flex justify-between items-center">
                    <span>Reseñas de clientes ({reviews.length})</span>
                    {isAdmin && (
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-md border border-amber-200 font-medium flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> Modo Admin
                      </span>
                    )}
                  </h3>

                  {reviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
                      <div className="p-4 bg-gray-50 rounded-full mb-3">
                        <Star className="w-8 h-8 text-gray-300" />
                      </div>
                      <p className="text-lg font-semibold text-gray-600">
                        PRODUCTO SIN RESEÑAS
                      </p>
                      <p className="text-sm text-gray-400">
                        Sé el primero en compartir tu experiencia.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review: any) => {
                        if (review.estado === "rechazado" && !isAdmin)
                          return null;

                        return (
                          <div
                            key={review.id}
                            className={`p-5 rounded-xl border shadow-sm transition 
                                    ${
                                      review.estado === "rechazado"
                                        ? "bg-red-50 border-red-200 opacity-80"
                                        : "bg-white border-gray-100"
                                    }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
                                  {review.usuario?.imagen ? (
                                    <img
                                      src={review.usuario.imagen}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <User className="w-5 h-5 text-primary" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold text-sm text-gray-900">
                                    {review.usuario?.nombreUsuario ||
                                      "Usuario Anónimo"}
                                  </p>
                                  <div className="flex text-yellow-400 text-xs mt-0.5">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3.5 h-3.5 ${
                                          i < review.calificacion
                                            ? "fill-current"
                                            : "text-gray-200"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {isAdmin && (
                                <button
                                  onClick={() =>
                                    openModerateModal(review.id, review.estado)
                                  }
                                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition border
                                                ${
                                                  review.estado === "aprobado"
                                                    ? "bg-white text-gray-600 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                                    : "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200"
                                                }`}
                                >
                                  {review.estado === "aprobado" ? (
                                    <>
                                      <EyeOff className="w-3 h-3" /> Ocultar
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-3 h-3" /> Mostrar
                                    </>
                                  )}
                                </button>
                              )}
                            </div>

                            <p className="text-gray-600 text-sm pl-13 mt-2 leading-relaxed">
                              {review.comentario}
                            </p>

                            {review.estado === "rechazado" && isAdmin && (
                              <p className="text-xs text-red-600 mt-3 font-medium flex items-center gap-1 ml-13">
                                <ShieldAlert className="w-3 h-3" /> Oculto para
                                el público
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <hr className="border-gray-200" />

                {!isAdmin && (
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Escribir una reseña
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tu calificación
                        </label>
                        <div className="flex gap-1 text-gray-300 cursor-pointer transition">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-7 h-7 transition ${
                                s <= userRating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "hover:text-yellow-200"
                              }`}
                              onClick={() => setUserRating(s)}
                            />
                          ))}
                        </div>
                      </div>
                      <textarea
                        rows={4}
                        className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                        placeholder="Cuéntanos qué te pareció el producto..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                          onClick={handleSubmitReview}
                          disabled={submittingReview}
                        >
                          {submittingReview && (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          )}
                          {submittingReview
                            ? "Publicando..."
                            : "Publicar Reseña"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500">
                <p className="text-lg font-medium">
                  Información de {activeTab}
                </p>
                <p className="text-sm mt-2 text-gray-400 max-w-2xl mx-auto">
                  {product.descripcion || "Sin descripción disponible."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
