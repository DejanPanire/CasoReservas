import { useEffect, useState } from "react";
import {getReservas,createReserva,updateReserva,deleteReserva } from "./api";
import ReservaForm from "./ReservaForm";

function ReservasPage() {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [editando, setEditando] = useState(null);
  const [modoCrear, setModoCrear] = useState(false);

  async function cargarReservas() {
    try {
      setCargando(true);
      const data = await getReservas();
      setReservas(data);
      setError("");
    } catch (err) {
      setError("Error al cargar reservas");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarReservas();
  }, []);

  async function handleCrear(formData) {
    try {
      await createReserva(formData);
      setModoCrear(false);
      await cargarReservas();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleActualizar(formData) {
    if (!editando) return;
    try {
      await updateReserva(editando.id, formData);
      setEditando(null);
      await cargarReservas();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleEliminar(id) {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar esta reserva?"
    );
    if (!confirmar) return;
    try {
      await deleteReserva(id);
      await cargarReservas();
    } catch (err) {
      alert(err.message);
    }
  }

  if (cargando) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Reservas</h1>

      {!modoCrear && !editando && (
        <button onClick={() => setModoCrear(true)}>Crear nueva reserva</button>
      )}

      {modoCrear && (
        <div>
          <h2>Nueva reserva</h2>
          <ReservaForm
            onSubmit={handleCrear}
            onCancel={() => setModoCrear(false)}
          />
        </div>
      )}

      {editando && (
        <div>
          <h2>Editar reserva</h2>
          <ReservaForm
            reservaInicial={editando}
            onSubmit={handleActualizar}
            onCancel={() => setEditando(null)}
          />
        </div>
      )}

      <h2>Listado</h2>
      <table border="1" cellPadding="4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Cantidad</th>
            <th>Estado</th>
            <th>Mesa</th>
            <th>Observación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.nombrePersona}</td>
              <td>{r.Telefono}</td>
              <td>{r.FechaReserva}</td>
              <td>{r.horaReserva}</td>
              <td>{r.CantidadPersonas}</td>
              <td>{r.Estado}</td>
              <td>{r.Nmesa}</td>
              <td>{r.observacion}</td>
              <td>
                <button onClick={() => setEditando(r)}>Editar</button>
                <button onClick={() => handleEliminar(r.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {reservas.length === 0 && (
            <tr>
              <td colSpan="10">No hay reservas.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReservasPage;
