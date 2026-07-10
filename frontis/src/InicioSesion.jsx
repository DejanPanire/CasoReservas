import { useState } from "react";
import { registrarUsuario } from "./api";

function InicioSesion({ onLogin }) {
  const [esRegistro, setEsRegistro] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function manejarEnvio(e) {
    e.preventDefault();
    if (!username || !password) {
      alert("Por favor, rellena todos los campos.");
      return;
    }

    if (esRegistro) {
      try {

        await registrarUsuario({ username, password, is_staff: false });
        alert("¡Usuario registrado con éxito! Ahora puedes iniciar sesión.");
        setEsRegistro(false); 
      } catch (err) {
        alert("Error al registrar el usuario. El nombre podría estar ocupado.");
      }
    } else {
      // Flujo normal de login
      onLogin({ username, password });
    }
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#11141a", color: "white", fontFamily: "sans-serif" }}>
      <form onSubmit={manejarEnvio} style={{ background: "#1b212c", padding: "40px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.3)", width: "100%", maxWidth: "360px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "24px", color: "#0052cc" }}>
          {esRegistro ? "Crear Cuenta" : "Iniciar Sesión"}
        </h2>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", color: "#aaa", fontSize: "14px" }}>Usuario</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #3a4252", backgroundColor: "#11141a", color: "white", boxSizing: "border-box" }} 
            placeholder="Introduce tu usuario"
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", marginBottom: "8px", color: "#aaa", fontSize: "14px" }}>Contraseña</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #3a4252", backgroundColor: "#11141a", color: "white", boxSizing: "border-box" }} 
            placeholder="Introduce tu contraseña"
          />
        </div>

        <button type="submit" style={{ width: "100%", padding: "12px", backgroundColor: "#0052cc", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer", fontSize: "16px" }}>
          {esRegistro ? "Registrarse" : "Ingresar"}
        </button>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#aaa" }}>
          {esRegistro ? "¿Ya tienes una cuenta?" : "¿No tienes usuario?"}{" "}
          <span 
            onClick={() => { setEsRegistro(!esRegistro); setUsername(""); setPassword(""); }} 
            style={{ color: "#0052cc", cursor: "pointer", fontWeight: "bold", textDecoration: "underline" }}
          >
            {esRegistro ? "Inicia sesión aquí" : "Regístrate aquí"}
          </span>
        </p>
      </form>
    </div>
  );
}

export default InicioSesion;