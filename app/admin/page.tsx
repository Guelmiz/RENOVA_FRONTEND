"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/user-contex";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, ShoppingBag, Tag, ShieldCheck, FlaskConical, 
  CheckCircle, XCircle, Clock, Plus, Trash2, Loader2, Search, Power, FileText, Download
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export default function AdminDashboard() {
  const { user, token } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Pedidos");

  
  useEffect(() => {
    if (user && !user.roles.some(r => r.toUpperCase().includes("ADMIN"))) {
      router.push("/");
    }
  }, [user, router]);

  if (!user) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* --- SIDEBAR DE NAVEGACIÓN --- */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sticky top-24">
              <div className="flex items-center gap-3 px-4 py-3 mb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Panel Admin</h2>
                  <p className="text-xs text-gray-500">Gestión Global</p>
                </div>
              </div>
              
              <nav className="space-y-1">
                <AdminTab label="Pedidos" icon={<ShoppingBag size={18}/>} active={activeTab} onClick={setActiveTab} />
                <AdminTab label="Solicitudes" icon={<FileText size={18}/>} active={activeTab} onClick={setActiveTab} />
                
                <div className="my-2 border-t border-gray-100"></div>
                <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase">Catálogos</p>
                
                <AdminTab label="Categorías" icon={<Tag size={18}/>} active={activeTab} onClick={setActiveTab} />
                <AdminTab label="Certificaciones" icon={<ShieldCheck size={18}/>} active={activeTab} onClick={setActiveTab} />
                <AdminTab label="Pruebas" icon={<FlaskConical size={18}/>} active={activeTab} onClick={setActiveTab} />
              </nav>
            </div>
          </aside>

          {/* --- CONTENIDO PRINCIPAL --- */}
          <section className="flex-1">
            {activeTab === "Pedidos" && <PedidosManager token={token} />}
            {activeTab === "Solicitudes" && <SolicitudesManager token={token} />}
            
            {/* Reutilizamos el componente CatalogManager para los 3 catálogos */}
            {activeTab === "Categorías" && (
                <CatalogManager token={token} type="categorias" title="Categorías de Productos" />
            )}
            {activeTab === "Certificaciones" && (
                <CatalogManager token={token} type="certificaciones" title="Certificaciones de Calidad" />
            )}
            {activeTab === "Pruebas" && (
                <CatalogManager token={token} type="pruebas" title="Pruebas Técnicas" />
            )}
          </section>

        </div>
      </div>
    </main>
  );
}


function AdminTab({ label, icon, active, onClick }: any) {
  return (
    <button
      onClick={() => onClick(label)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
        active === label 
          ? "bg-primary text-primary-foreground shadow-md" 
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}


function PedidosManager({ token }: { token: string | null }) {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/pedidos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPedidos(data.data || data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (token) fetchPedidos(); }, [token]);

  const updateStatus = async (id: string, nuevoEstado: string) => {
    if (!confirm(`¿Cambiar estado a "${nuevoEstado}"?`)) return;
    try {
        const res = await fetch(`${API_BASE}/api/admin/pedidos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ estado: nuevoEstado })
        });
        if(res.ok) fetchPedidos();
    } catch(e) { console.error(e); }
  };

  const filteredPedidos = pedidos.filter(p => 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-gray-900">Gestión de Pedidos</h2>
        
        <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
                type="text" 
                placeholder="Buscar por ID..." 
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">ID / Fecha</th>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPedidos.map((pedido) => (
              <tr key={pedido.id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4">
                  <p className="font-mono text-xs text-gray-500 font-bold">#{pedido.id.substring(0, 8)}</p>
                  <p className="text-gray-700 text-xs">{new Date(pedido.fechaPedido).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{pedido.usuario.persona?.nombreCompleto}</p>
                  <p className="text-xs text-gray-500">{pedido.usuario.email}</p>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">C$ {Number(pedido.total).toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize
                    ${pedido.estado === 'entregado' ? 'bg-emerald-100 text-emerald-700' : 
                      pedido.estado === 'cancelado' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {pedido.estado === 'entregado' && <CheckCircle className="w-3 h-3"/>}
                    {pedido.estado === 'pendiente' && <Clock className="w-3 h-3"/>}
                    {pedido.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {pedido.estado === 'pendiente' && (
                    <div className="flex justify-end gap-2">
                        <button onClick={() => updateStatus(pedido.id, 'entregado')} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs hover:bg-emerald-700 transition">
                            Entregar
                        </button>
                        <button onClick={() => updateStatus(pedido.id, 'cancelado')} className="px-3 py-1.5 bg-gray-200 text-gray-600 rounded-lg text-xs hover:bg-gray-300 transition">
                            Cancelar
                        </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPedidos.length === 0 && (
            <div className="p-10 text-center text-gray-400">
                {loading ? "Cargando..." : "No se encontraron pedidos."}
            </div>
        )}
      </div>
    </div>
  );
}


function SolicitudesManager({ token }: { token: string | null }) {
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSolicitudes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/solicitudes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSolicitudes(data.data || data);
      }
    } catch(e) { console.error(e); } 
    finally { setLoading(false); }
  };

  useEffect(() => { if (token) fetchSolicitudes(); }, [token]);

  const handleProcess = async (id: string, accion: "APROBADA" | "RECHAZADA") => {
    if (!confirm(`¿Estás seguro de ${accion} esta solicitud?`)) return;
    try {
        const res = await fetch(`${API_BASE}/api/admin/solicitudes/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ accion })
        });
        if (res.ok) {
            alert(`Solicitud ${accion} correctamente`);
            fetchSolicitudes(); 
        }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Solicitudes de Representantes</h2>
      <div className="grid gap-4">
        {solicitudes.length === 0 && <p className="text-gray-500 text-center p-8">No hay solicitudes pendientes.</p>}
        
        {solicitudes.map(sol => (
            <div key={sol.id} className="border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 gap-4">
                <div>
                    <p className="font-bold text-gray-900">{sol.usuario?.persona?.nombreCompleto || sol.enviadoPor}</p>
                    <p className="text-xs text-gray-500 mb-2">Email: {sol.usuario?.email}</p>
                    <p className="text-sm text-gray-700 mb-2"><span className="font-semibold">Motivo:</span> {sol.motivo}</p>
                    
                    <div className="flex gap-2 flex-wrap">
                        {sol.documentos?.map((doc: any) => {
                           
                            const downloadUrl = doc.ruta.replace('/upload/', '/upload/fl_attachment/');
                            
                            return (
                                <a 
                                    key={doc.id} 
                                    href={downloadUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-100 hover:shadow-sm transition font-medium"
                                >
                                    <Download className="w-3 h-3" /> 
                                    Descargar {doc.tipo}
                                </a>
                            );
                        })}
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => handleProcess(sol.id, "APROBADA")} className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition">Aprobar</button>
                    <button onClick={() => handleProcess(sol.id, "RECHAZADA")} className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition">Rechazar</button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}


function CatalogManager({ token, type, title }: { token: string | null, type: string, title: string }) {
    const [items, setItems] = useState<any[]>([]);
    const [newItemName, setNewItemName] = useState("");
    const [loadingAction, setLoadingAction] = useState(false);
    
    const getSingularEndpoint = () => {
        if (type === 'categorias') return 'categoria';
        if (type === 'pruebas') return 'prueba';
        if (type === 'certificaciones') return 'certificacion';
        return type; 
    };

    const fetchItems = async () => {
        const res = await fetch(`${API_BASE}/api/${type}`);
        if(res.ok) setItems(await res.json());
    };

    useEffect(() => { fetchItems(); }, [type]);

    // Crear
    const handleCreate = async () => {
        if(!newItemName.trim()) return;
        setLoadingAction(true);
    
        let body: any = { nombre: newItemName };
        const endpoint = getSingularEndpoint();

        try {
            const res = await fetch(`${API_BASE}/api/${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(body)
            });

            if(res.ok) {
                setNewItemName("");
                fetchItems();
            } else {
                alert("Error al crear. Verifica si ya existe.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingAction(false);
        }
    };

  
    const handleToggleStatus = async (item: any) => {
        const endpoint = getSingularEndpoint();
        const newState = item.activa === false ? true : false; 

        try {
            const res = await fetch(`${API_BASE}/api/${endpoint}/${item.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ activa: newState })
            });
            
            if(res.ok) fetchItems();
            else alert("Error al actualizar estado.");
        } catch (error) {
            console.error(error);
        }
    };

    // Eliminar (Borrado físico)
    const handleDelete = async (id: string) => {
        if(!confirm("Esta acción eliminará el registro permanentemente. ¿Continuar?")) return;
        const endpoint = getSingularEndpoint();
        try {
            const res = await fetch(`${API_BASE}/api/${endpoint}/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if(res.ok) fetchItems();
        } catch (error) { console.error(error); }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>
            
            <div className="flex gap-3 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <input 
                    type="text" 
                    placeholder="Nuevo nombre..." 
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                />
                <button 
                    onClick={handleCreate}
                    disabled={loadingAction}
                    className="bg-primary text-primary-foreground px-5 py-2 rounded-lg font-medium hover:opacity-90 flex items-center gap-2 disabled:opacity-70"
                >
                    {loadingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Agregar
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => {
                    const isInactive = item.activa === false;
                    return (
                        <div key={item.id} className={`flex items-center justify-between p-4 border rounded-xl hover:shadow-sm transition bg-white ${isInactive ? 'border-red-200 bg-red-50/30' : 'border-gray-100'}`}>
                            <div>
                                <p className={`font-semibold ${isInactive ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                    {item.nombre}
                                </p>
                                <p className={`text-[10px] font-bold uppercase mt-1 inline-block px-2 py-0.5 rounded ${isInactive ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    {isInactive ? "Inactivo" : "Activo"}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {/* Botón Power (Activar/Desactivar) */}
                                <button 
                                    onClick={() => handleToggleStatus(item)}
                                    className={`p-2 rounded-lg transition ${isInactive ? 'text-emerald-600 hover:bg-emerald-100' : 'text-amber-500 hover:bg-amber-100'}`}
                                    title={isInactive ? "Activar" : "Desactivar"}
                                >
                                    <Power className="w-4 h-4" />
                                </button>

                                {/* Botón Eliminar (Oculto solo para Certificaciones) */}
                                {type !== 'certificaciones' && (
                                    <button 
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                        title="Eliminar permanentemente"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}