const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api";

interface LoginResponseDTO {
  token: string;
  user: {
    id: string;
    nombreUsuario: string;
    email: string;
    roles: string[];
    persona?: {
      id: string;
      nombreCompleto: string;
      telefono: number | null;
      fechaNacimiento: string | null;
    } | null;
    fechaRegistro?: string | null;
    ultimaSesion?: string | null;
    estadoSesion?: boolean;
    imagen?: string;
  };
}

export async function loginRequest(email: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = (await res.json().catch(() => null)) as
    | LoginResponseDTO
    | { message?: string }
    | null;

  if (!res.ok) {
    throw new Error((data as any)?.message || "Error al iniciar sesión");
  }

  return data as LoginResponseDTO;
}

export async function logoutRequest(token: string) {
  const res = await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || "Error al cerrar sesión");
  }

  return res.json().catch(() => null);
}