import { useEffect, useState } from "react";

const ESTADOS = [
  "RESERVADO",
  "SINRESERVAR",
  "COMPLETADAS",
  "CANCELADA",
  "SINASISTENCIA",
];

function ReservaForm({ onSubmit, onCancel, reservaInicial }) {
  const [formData, setFormData] = useState({
    nombrePersona: "",
    Telefono: "",
    FechaReserva: "",
    horaReserva: "",
    CantidadPersonas: 1,
    Estado: "RESERVADO",
    Nmesa: "",
    observacion: "",
  });

  useEffect(() => {
    if (reservaInicial) {
      setFormData({
        nombrePersona: reservaInicial.nombrePersona ?? "",
        Telefono: reservaInicial.Telefono ?? "",
        FechaReserva: reservaInicial.FechaReserva ?? "",
        horaReserva: reservaInicial.horaReserva ?? "",
        CantidadPersonas: reservaInicial.CantidadPersonas ?? 1,
        Estado: reservaInicial.Estado ?? "RESERVADO",
        Nmesa: reservaInicial.Nmesa ?? "",
        observacion: reservaInicial.observacion ?? "",
      });
    }
  }, [reservaInicial]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "CantidadPersonas" || name === "Nmesa"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre de la persona</label>
        <input
          name="nombrePersona"
          value={formData.nombrePersona}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Teléfono</label>
        <input
          name="Telefono"
          value={formData.Telefono}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Fecha reserva</label>
        <input
          type="date"
          name="FechaReserva"
          value={formData.FechaReserva}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Hora reserva</label>
        <input
          type="time"
          name="horaReserva"
          value={formData.horaReserva}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Cantidad personas</label>
        <input
          type="number"
          name="CantidadPersonas"
          min={1}
          max={15}
          value={formData.CantidadPersonas}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Estado</label>
        <select
          name="Estado"
          value={formData.Estado}
          onChange={handleChange}
          required
        >
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Mesa (ID)</label>
        <input
          type="number"
          name="Nmesa"
          value={formData.Nmesa}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Observación</label>
        <textarea
          name="observacion"
          value={formData.observacion}
          onChange={handleChange}
        />
      </div>

      <button type="submit">
        {reservaInicial ? "Actualizar" : "Crear"}
      </button>
      {onCancel && (
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      )}
    </form>
  );
}

export default ReservaForm;
