"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export interface CartItem {
  id: string; 
  name: string;
  price: number;
  quantity: number;
  maxQuantity: number; 
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  refreshCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const getToken = () => {
    if (typeof window === 'undefined') return null;
    let token = localStorage.getItem("token");
    if (!token) {
        const session = localStorage.getItem("renova_auth");
        if (session) try { token = JSON.parse(session).token; } catch {}
    }
    return token;
  };

  const refreshCart = async () => {
    const token = getToken();
    if (!token) { setItems([]); return; }

    try {
        const res = await fetch(`${API_BASE}/api/carrito`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            const mappedItems: CartItem[] = data.data?.items.map((item: any) => ({
                id: item.productoId, 
                name: item.producto.titulo,
                price: Number(item.precioUnitario),
                quantity: item.cantidad,
                maxQuantity: item.producto.stock,
                image: item.producto.imagenes?.[0]?.url || "" 
            })) || [];
            setItems(mappedItems);
        }
    } catch (error) {
        console.error("Error sincronizando carrito:", error);
    }
  };

  useEffect(() => { refreshCart(); }, []);


  const addToCart = async (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    const qtyToAdd = item.quantity || 1; 

    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      
      if (existing) {
        
        const newTotal = existing.quantity + qtyToAdd;
        
      
        if (newTotal > item.maxQuantity) {
            alert(`Solo hay ${item.maxQuantity} unidades disponibles de este producto.`);
            
            return prev.map((p) => (p.id === item.id ? { ...p, quantity: item.maxQuantity } : p));
        }

        return prev.map((p) => (p.id === item.id ? { ...p, quantity: newTotal } : p));
      }
      
  
      if (qtyToAdd > item.maxQuantity) {
          alert(`Solo puedes agregar ${item.maxQuantity} unidades.`);
          return [...prev, { ...item, quantity: item.maxQuantity }];
      }

      return [...prev, { ...item, quantity: qtyToAdd }];
    });

 
    const token = getToken();
    if (token) {
       
        try {
            await fetch(`${API_BASE}/api/carrito/items`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ productoId: item.id, cantidad: qtyToAdd })
            });
        } catch(e) { console.error(e); }
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    setItems((prev) => prev.map((item) => {
        if (item.id === id) {
        
            if (quantity > item.maxQuantity) {
                alert(`Stock máximo alcanzado (${item.maxQuantity})`);
                return { ...item, quantity: item.maxQuantity };
            }
            return { ...item, quantity: Math.max(0, quantity) };
        }
        return item;
    }).filter(item => item.quantity > 0));

  
    const token = getToken();
    if (token && quantity > 0) { 
    } else if (token && quantity <= 0) {
       
    }
  };

  const removeFromCart = async (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    const token = getToken();
    if (token) {
        fetch(`${API_BASE}/api/carrito/items/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        }).catch(console.error);
    }
  };

  const clearCart = () => setItems([]);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}