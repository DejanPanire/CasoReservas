// src/api.js
const BASE_URL = "http://localhost:8000";

export async function getReservas() {
  const res = await fetch(`${BASE_URL}/ReservaApi`);
  if (!res.ok) {
    console.error("Status GET:", res.status);
    throw new Error("Error al obtener reservas");
  }
  return await res.json();
}

export async function createReserva(data) {
  const res = await fetch(`${BASE_URL}/ReservaApi`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Status POST:", res.status, errorData);
    throw new Error("Error al crear la reserva");
  }

  return await res.json();
}

export async function updateReserva(id, data) {
  const res = await fetch(`${BASE_URL}/ReservaApi/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Status PUT:", res.status, errorData);
    throw new Error("Error al actualizar la reserva");
  }

  return await res.json();
}

export async function deleteReserva(id) {
  const res = await fetch(`${BASE_URL}/ReservaApi/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    console.error("Status DELETE:", res.status);
    throw new Error("Error al eliminar la reserva");
  }
}
