
const BASE_URL = "http://localhost:8000";

function procesarRespuesta(res, mensajeError) {
  if (!res.ok) {
    return res
      .json()
      .catch(() => ({}))
      .then((data) => {
        console.error(mensajeError, res.status, data);
        throw new Error(mensajeError);
      });
  }
  return res.json();
}

export function getReservas() {
  return fetch(`${BASE_URL}/ReservaApi/`).then((res) =>
    procesarRespuesta(res, "Error cargando reservas")
  );
}

export function createReserva(datos) {
  return fetch(`${BASE_URL}/ReservaApi/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  }).then((res) => procesarRespuesta(res, "Error creando reserva"));
}

export function updateReserva(id, datos) {
  return fetch(`${BASE_URL}/ReservaApi/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  }).then((res) => procesarRespuesta(res, "Error actualizando reserva"));
}

export function deleteReserva(id) {
  return fetch(`${BASE_URL}/ReservaApi/${id}/`, {
    method: "DELETE",
  }).then((res) => {
    if (!res.ok) {
      console.error("Error al borrar", res.status);
      throw new Error("Error eliminando reserva");
    }
  });
}
