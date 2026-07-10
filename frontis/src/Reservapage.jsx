import { useState, useEffect } from "react";
import ReservaForm from "./ReservaForm";  
import ReservaLista from "./ReservaLista";
import { getReservas, crearReserva } from "./api";

function ReservasPage() {
  const [reservas, setReservas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  async function cargarReservas() {
    try {
      const data = await getReservas();
      setReservas(data);
    } catch (err) {
      console.error("Error al cargar reservas:", err);
    }
  }

  useEffect(() => {
    cargarReservas();
  }, []);

  async function ejecutarGuardado(datosDelFormulario) {
    try {

      await crearReserva(datosDelFormulario);
      setMostrarFormulario(false);
      cargarReservas();
    } catch (err) {
      alert("Error al registrar la reserva en la base de datos.");
    }
  }

  return (
    <div style={{ background: "#1b212c", padding: "25px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>Reservas de Mesa</h2>
        <button 
          onClick={() => setMostrarFormulario(!mostrarFormulario)} 
          style={{ padding: "10px 20px", backgroundColor: "#0052cc", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
        >
          {mostrarFormulario ? "Cancelar" : "Nueva Reserva"}
        </button>
      </div>

      {mostrarFormulario && (
        <ReservaForm 
          onSubmit={ejecutarGuardado} 
          onCancel={() => setMostrarFormulario(false)} 
        />
      )}

      <h3 style={{ color: "#aaa", marginBottom: "15px", marginTop: "30px" }}>Listado de Reservas Activas</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #3a4252", textAlign: "left", color: "#aaa" }}>
              <th style={{ padding: "12px" }}>Persona</th>
              <th style={{ padding: "12px" }}>Teléfono</th>
              <th style={{ padding: "12px" }}>Fecha / Hora</th>
              <th style={{ padding: "12px" }}>Asistentes</th>
              <th style={{ padding: "12px" }}>Mesa</th>
              <th style={{ padding: "12px" }}>Estado</th>
              <th style={{ padding: "12px" }}>Obs.</th>
            </tr>
          </thead>
          <tbody>
            {reservas.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: "20px", textAlign: "center", color: "#666" }}>No hay reservas cargadas en el sistema.</td>
              </tr>
            ) : (
              reservas.map((r, index) => (
                <tr key={r.id || index} style={{ borderBottom: "1px solid #2a3242" }}>
                  <td style={{ padding: "12px", fontWeight: "bold" }}>{r.nombrePersona || r.persona}</td>
                  <td style={{ padding: "12px" }}>{r.Telefono || r.telefono}</td>
                  <td style={{ padding: "12px" }}>{r.FechaReserva || r.fecha} a las {r.horaReserva || r.hora}</td>
                  <td style={{ padding: "12px", textAlign: "center" }}>{r.CantidadPersonas || r.personas}</td>
                  <td style={{ padding: "12px" }}>Mesa {r.Nmesa || r.mesa}</td>
                  <td style={{ padding: "12px", color: "#00e676" }}>{r.Estado || r.estado}</td>
                  <td style={{ padding: "12px", color: "#aaa", fontSize: "13px" }}>{r.observacion || r.observaciones || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReservasPage;