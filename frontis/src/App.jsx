import { useState } from "react";
import ReservasPage from "./Reservapage";
import AdminPanel from "./AdminPanel"; 
import InicioSesion from "./InicioSesion";
import { loginUsuario, getUsuarios, updateUsuarioRol, getAuditoriaNoSQL } from "./api";

function App() {
  const [sesion, setSesion] = useState(null);
  const [vistaActual, setVistaActual] = useState("reservas");
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [listaAuditorias, setListaAuditorias] = useState([]);

  async function manejarAutenticacion(credenciales) {
    try {
      const data = await loginUsuario(credenciales);
      setSesion(data); 
      setVistaActual("reservas");
    } catch (err) {
      alert("Usuario o contraseña incorrectos.");
    }
  }

  async function irAGestionUsuarios() {
    try {
      const data = await getUsuarios();
      setListaUsuarios(data || []);
      setVistaActual("usuarios");
    } catch (err) {
      alert("Error al cargar usuarios de Azure MySQL.");
    }
  }

  async function irAPanelAuditoria() {
    try {
      const data = await getAuditoriaNoSQL();
      setListaAuditorias(data || []);
      setVistaActual("auditoria");
    } catch (err) {
      alert("Error al conectar con Azure Cosmos DB.");
    }
  }

  async function ejecutarCambioRol(id, esStaffActual) {
    try {
      await updateUsuarioRol(id, { is_staff: !esStaffActual });
      const data = await getUsuarios();
      setListaUsuarios(data || []);
    } catch (err) {
      alert("Error al modificar permisos.");
    }
  }

  if (!sesion) {
    return <InicioSesion onLogin={manejarAutenticacion} />;
  }

  return (
    <div style={{ fontFamily: "sans-serif", backgroundColor: "#11141a", minHeight: "100vh", color: "white" }}>
      <header style={{ backgroundColor: "#1b212c", padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #2a3242" }}>
        <div>
          <span style={{ fontSize: "18px", fontWeight: "bold", color: "#0052cc" }}>Reservas Multicloud</span>
          <span style={{ marginLeft: "20px", fontSize: "14px", color: "#aaa" }}>
            Usuario: <strong>{sesion.username}</strong>
          </span>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            style={{ padding: "8px 16px", cursor: "pointer", background: vistaActual === "reservas" ? "#0052cc" : "#2a3242", color: "white", border: "none", borderRadius: "4px" }} 
            onClick={() => setVistaActual("reservas")}
          >
            Reservas
          </button>
          
          {sesion.is_staff && (
            <>
              <button 
                style={{ padding: "8px 16px", cursor: "pointer", background: vistaActual === "mesas" ? "#0052cc" : "#2a3242", color: "white", border: "none", borderRadius: "4px" }} 
                onClick={() => setVistaActual("mesas")}
              >
                Configurar Mesas
              </button>
              <button 
                style={{ padding: "8px 16px", cursor: "pointer", background: vistaActual === "usuarios" ? "#0052cc" : "#2a3242", color: "white", border: "none", borderRadius: "4px" }} 
                onClick={irAGestionUsuarios}
              >
                Gestionar Roles (MySQL)
              </button>
              <button 
                style={{ padding: "8px 16px", cursor: "pointer", background: vistaActual === "auditoria" ? "#0052cc" : "#2a3242", color: "white", border: "none", borderRadius: "4px" }} 
                onClick={irAPanelAuditoria}
              >
                Auditoría (Cosmos DB)
              </button>
            </>
          )}
          
          <button 
            style={{ padding: "8px 16px", backgroundColor: "#de350b", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }} 
            onClick={() => setSesion(null)}
          >
            Salir
          </button>
        </div>
      </header>

      <main style={{ padding: "30px" }}>
        {vistaActual === "reservas" && <ReservasPage />}
        
        {vistaActual === "mesas" && <AdminPanel />}

        {vistaActual === "usuarios" && (
          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px' }}>
            <h3>Gestión de Roles (Usuarios)</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #475569', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Usuario</th>
                  <th style={{ padding: '10px' }}>Email</th>
                  <th style={{ padding: '10px' }}>Es Staff (Admin)</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {listaUsuarios.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '10px' }}>{user.username}</td>
                    <td style={{ padding: '10px' }}>{user.email || 'Sin correo'}</td>
                    <td style={{ padding: '10px' }}>{user.is_staff ? '✅ Sí' : '❌ No'}</td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>
                      <button 
                        onClick={() => ejecutarCambioRol(user.id, user.is_staff)} 
                        style={{ padding: '5px 10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Alternar Rol
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {vistaActual === "auditoria" && (
          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px' }}>
            <h3>Logs de Auditoría (Azure Cosmos DB)</h3>
            <div style={{ maxHeight: '500px', overflowY: 'auto', marginTop: '10px' }}>
              {listaAuditorias.map((log, index) => {
                let fechaFormateada = "Sin fecha";
                if (log.timestamp) {
                  fechaFormateada = log.timestamp;
                } else if (log.fecha_registro) {
                  fechaFormateada = log.fecha_registro;
                } else if (log.fecha) {
                  fechaFormateada = log.fecha;
                } else if (log._ts) {
                  fechaFormateada = new Date(log._ts * 1000).toLocaleString();
                }

                return (
                  <div key={log.id || index} style={{ padding: '12px', marginBottom: '8px', background: '#0f172a', borderRadius: '6px', borderLeft: '4px solid #3b82f6' }}>
                    <p style={{ margin: '0 0 5px 0' }}><strong>Acción:</strong> {log.accion}</p>
                    <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#94a3b8' }}>
                      <strong>Rol:</strong> {log.usuario_rol || log.rol || 'CLIENTE/ADMIN'} | <strong>Fecha:</strong> {fechaFormateada}
                    </p>
                    <pre style={{ margin: '0', background: '#1e293b', padding: '8px', borderRadius: '4px', fontSize: '12px', color: '#38bdf8', overflowX: 'auto' }}>
                      {JSON.stringify(log.datos_afectados || log, null, 2)}
                    </pre>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;