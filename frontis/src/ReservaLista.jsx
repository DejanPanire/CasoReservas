function ReservasLista({ reservas }) {
  return (
    <div>
      <h3 style={{ color: "#aaa", marginBottom: "15px" }}>Listado de Reservas Activas</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #3a4252", textAlign: "left", color: "#aaa" }}>
            <th style={{ padding: "12px" }}>ID</th>
            <th style={{ padding: "12px" }}>Persona</th>
            <th style={{ padding: "12px" }}>Fecha / Hora</th>
            <th style={{ padding: "12px" }}>Mesa</th>
            <th style={{ padding: "12px" }}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {reservas.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ padding: "20px", textAlign: "center", color: "#666" }}>No hay reservas cargadas.</td>
            </tr>
          ) : (
            reservas.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid #2a3242" }}>
                <td style={{ padding: "12px" }}>{r.id}</td>
                <td style={{ padding: "12px", fontWeight: "bold" }}>{r.persona}</td>
                <td style={{ padding: "12px" }}>{r.fecha} a las {r.hora}</td>
                <td style={{ padding: "12px" }}>Mesa {r.mesa}</td>
                <td style={{ padding: "12px", color: "#00e676" }}>{r.estado}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReservasLista;