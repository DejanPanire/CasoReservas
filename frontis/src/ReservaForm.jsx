
import { useEffect, useState } from "react";

const ESTADOS_RESERVA = [
  "RESERVADO",
  "SINRESERVAR",
  "COMPLETADAS",
  "CANCELADA",
  "SINASISTENCIA",
];

function crearEstadoInicial() {
  return {
    nombrePersona: "",
    Telefono: "",
    FechaReserva: "",
    horaReserva: "",
    CantidadPersonas: 1,
    Estado: "RESERVADO",
    Nmesa: "",
    observacion: "",
  };
}

function ReservaForm({ onSubmit, onCancel, reservaInicial }) {
  const [datos, setDatos] = useState(crearEstadoInicial);

  useEffect(() => {
    if (reservaInicial) {
      setDatos({
        nombrePersona: reservaInicial.nombrePersona ?? "",
        Telefono: reservaInicial.Telefono ?? "",
        FechaReserva: reservaInicial.FechaReserva ?? "",
        horaReserva: reservaInicial.horaReserva ?? "",
        CantidadPersonas: reservaInicial.CantidadPersonas ?? 1,
        Estado: reservaInicial.Estado ?? "RESERVADO",
        Nmesa: reservaInicial.Nmesa ?? "",
        observacion: reservaInicial.observacion ?? "",
      });
    } else {
      setDatos(crearEstadoInicial());
    }
  }, [reservaInicial]);

  function cambiarCampo(e) {
    const { name, value, type } = e.target;
    setDatos((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  }

  function enviar(e) {
    e.preventDefault();
    onSubmit(datos);
  }

  return (
    <form className="form" onSubmit={enviar}>
      <div className="form-group">
        <span className="form-label">Nombre de la persona</span>
        <input
          className="form-input"
          name="nombrePersona"
          value={datos.nombrePersona}
          onChange={cambiarCampo}
          placeholder="Ej: Juan Pérez"
          required
        />
      </div>

      <div className="form-group">
        <span className="form-label">Teléfono</span>
        <input
          className="form-input"
          name="Telefono"
          value={datos.Telefono}
          onChange={cambiarCampo}
          placeholder="Ej: +56 9 1234 5678"
          required
        />
      </div>

      <div className="form-group">
        <span className="form-label">Fecha de la reserva</span>
        <input
          className="form-input"
          type="date"
          name="FechaReserva"
          value={datos.FechaReserva}
          onChange={cambiarCampo}
          required
        />
      </div>

      <div className="form-group">
        <span className="form-label">Hora de la reserva</span>
        <input
          className="form-input"
          type="time"
          name="horaReserva"
          value={datos.horaReserva}
          onChange={cambiarCampo}
          required
        />
      </div>

      <div className="form-group">
        <span className="form-label">Cantidad de personas</span>
        <input
          className="form-input"
          type="number"
          name="CantidadPersonas"
          min={1}
          max={15}
          value={datos.CantidadPersonas}
          onChange={cambiarCampo}
          required
        />
      </div>

      <div className="form-group">
        <span className="form-label">Estado</span>
        <select
          className="form-select"
          name="Estado"
          value={datos.Estado}
          onChange={cambiarCampo}
          required
        >
          {ESTADOS_RESERVA.map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <span className="form-label">Mesa (ID)</span>
        <input
          className="form-input"
          type="number"
          name="Nmesa"
          value={datos.Nmesa}
          onChange={cambiarCampo}
          placeholder="Ej: 1"
          required
        />
      </div>

      <div className="form-group">
        <span className="form-label">Observación</span>
        <textarea
          className="form-textarea"
          name="observacion"
          value={datos.observacion}
          onChange={cambiarCampo}
          placeholder="Comentarios adicionales..."
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {reservaInicial ? "Guardar cambios" : "Crear reserva"}
        </button>

        {onCancel && (
          <button
            type="button"
            className="btn btn-outline"
            onClick={onCancel}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default ReservaForm;
