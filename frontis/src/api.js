const BASE_URL = "http://127.0.0.1:8000";

async function procesarRespuesta(res, mensajeError) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error(`${mensajeError}:`, errorData);
    throw new Error(mensajeError);
  }
  if (res.status === 204) return null; 
  return res.json();
}

function obtenerHeaders() {
  const token = localStorage.getItem("token_safehome");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }
  return headers;
}

export async function loginUsuario(credenciales) {
  const res = await fetch(`${BASE_URL}/LoginApi/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credenciales),
  });
  
  const data = await procesarRespuesta(res, "Error en el inicio de sesión");
  if (data && data.token) {
    localStorage.setItem("token_safehome", data.token);
  }
  return data;
}

export function registrarUsuario(datos) {
  return fetch(`${BASE_URL}/UsuariosApi/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  }).then((res) => procesarRespuesta(res, "Error al registrar el usuario"));
}

export function getUsuarios() {
  return fetch(`${BASE_URL}/UsuariosApi/`, {
    method: "GET",
    headers: obtenerHeaders(),
  }).then((res) => procesarRespuesta(res, "Error cargando usuarios"));
}

export function updateUsuarioRol(id, datos) {
  return fetch(`${BASE_URL}/UsuariosApi/${id}/`, {
    method: "PUT",
    headers: obtenerHeaders(),
    body: JSON.stringify(datos),
  }).then((res) => procesarRespuesta(res, "Error modificando permisos"));
}

export function getReservas() {
  return fetch(`${BASE_URL}/ReservaApi/`, {
    method: "GET",
    headers: obtenerHeaders(),
  }).then((res) => procesarRespuesta(res, "Error cargando la lista de reservas"));
}

export function crearReserva(datos) {
  return fetch(`${BASE_URL}/ReservaApi/`, {
    method: "POST",
    headers: obtenerHeaders(),
    body: JSON.stringify(datos),
  }).then((res) => procesarRespuesta(res, "Error al crear la reserva"));
}

export function getMesas() {
  return fetch(`${BASE_URL}/MesaApi/`, {
    method: "GET",
    headers: obtenerHeaders(),
  }).then((res) => procesarRespuesta(res, "Error cargando mesas"));
}

export function crearMesa(datos) {
  return fetch(`${BASE_URL}/MesaApi/`, {
    method: "POST",
    headers: obtenerHeaders(),
    body: JSON.stringify(datos),
  }).then((res) => procesarRespuesta(res, "Error creando mesa"));
}

export function actualizarMesa(id, datos) {
  return fetch(`${BASE_URL}/MesaApi/${id}/`, {
    method: "PUT",
    headers: obtenerHeaders(),
    body: JSON.stringify(datos),
  }).then((res) => procesarRespuesta(res, "Error actualizando mesa"));
}

export function eliminarMesa(id) {
  return fetch(`${BASE_URL}/MesaApi/${id}/`, {
    method: "DELETE",
    headers: obtenerHeaders(),
  }).then((res) => procesarRespuesta(res, "Error eliminando mesa"));
}

export function getAuditoriaNoSQL() {
  return fetch(`${BASE_URL}/AuditoriaApi/`, {
    method: "GET",
    headers: obtenerHeaders(),
  }).then((res) => procesarRespuesta(res, "Error cargando logs de Cosmos DB"));
}