import { useEffect, useState } from "react";
import {getReservas,createReserva,updateReserva,deleteReserva} from "./api";
import ReservaForm from "./ReservaForm";

function ReservasPage() {
  const [reservas, setReservas] = useState([]);
  const [estadoPantalla, setEstadoPantalla] = useState({
    cargando: true,
    error: "",
  });
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [modo, setModo] = useState("listar");

  async function cargarDatos() {
    try {
      setEstadoPantalla((prev) => ({ ...prev, cargando: true }));
      const data = await getReservas();
      setReservas(data);
      setEstadoPantalla({ cargando: false, error: "" });
    } catch (e) {
      setEstadoPantalla({ cargando: false, error: "Error al cargar datos" });
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  async function crear(formData) {
    try {
      await createReserva(formData);
      await cargarDatos();
      setModo("listar");
    } catch (e) {
      alert(e.message);
    }
  }

  async function editar(formData) {
    if (!reservaSeleccionada) return;
    try {
      await updateReserva(reservaSeleccionada.id, formData);
      await cargarDatos();
      setReservaSeleccionada(null);
      setModo("listar");
    } catch (e) {
      alert(e.message);
    }
  }

  async function eliminar(id) {
    const ok = window.confirm("¿Seguro que deseas eliminar esta reserva?");
    if (!ok) return;
    try {
      await deleteReserva(id);
      await cargarDatos();
    } catch (e) {
      alert(e.message);
    }
  }

  if (estadoPantalla.cargando) {
    return (
      <div className="app-wrapper">
        <p className="text-loading">Cargando...</p>
      </div>
    );
  }

  if (estadoPantalla.error) {
    return (
      <div className="app-wrapper">
        <p className="text-error">{estadoPantalla.error}</p>
      </div>
    );
  }

  function renderBadgeEstado(estado) {
    const e = (estado || "").toUpperCase();
    if (e === "RESERVADO") return <span className="badge badge-reservado">RESERVADO</span>;
    if (e === "COMPLETADAS") return <span className="badge badge-completadas">COMPLETADAS</span>;
    if (e === "CANCELADA") return <span className="badge badge-cancelada">CANCELADA</span>;
    if (e === "SINASISTENCIA")
      return <span className="badge badge-sinasistencia">SIN ASISTENCIA</span>;
    if (e === "SINRESERVAR")
      return <span className="badge badge-sinreservar">SIN RESERVAR</span>;
    return <span className="badge badge-sinreservar">{estado}</span>;
  }

  return (
    <div className="app-wrapper">
      <div className="card">
        <h1 className="app-title">
          <span className="app-title-ring" />
          Reservas de mesa
        </h1>

        <div className="grid-two">
          {/* Panel formulario */}
          <div>
            <div className="section-header">
              <span className="section-title">
                {modo === "listar" && "Selecciona una acción"}
                {modo === "crear" && "Crear una nueva reserva"}
                {modo === "editar" && reservaSeleccionada
                  ? `Editando #${reservaSeleccionada.id}`
                  : ""}
              </span>

              {modo === "listar" && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setReservaSeleccionada(null);
                    setModo("crear");
                  }}
                >
                  Nueva reserva
                </button>
              )}
            </div>

            {modo === "crear" && (
              <ReservaForm
                onSubmit={crear}
                onCancel={() => setModo("listar")}
              />
            )}

            {modo === "editar" && reservaSeleccionada && (
              <ReservaForm
                reservaInicial={reservaSeleccionada}
                onSubmit={editar}
                onCancel={() => {
                  setReservaSeleccionada(null);
                  setModo("listar");
                }}
              />
            )}
          </div>

          {/* Tabla */}
          <div>
            <div className="section-header">
              <span className="section-title">Listado de reservas</span>
            </div>

            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Persona</th>
                    <th>Teléfono</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Personas</th>
                    <th>Estado</th>
                    <th>Mesa</th>
                    <th>Obs.</th>
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
                      <td>{renderBadgeEstado(r.Estado)}</td>
                      <td>{r.Nmesa}</td>
                      <td>{r.observacion}</td>
                      <td>
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <button
                            className="btn btn-outline"
                            onClick={() => {
                              setReservaSeleccionada(r);
                              setModo("editar");
                            }}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => eliminar(r.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {reservas.length === 0 && (
                    <tr>
                      <td colSpan="10" className="table-empty">
                        No hay reservas cargadas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReservasPage;