import React, { useState, useEffect } from 'react';
import { getMesas, crearMesa, actualizarMesa, eliminarMesa } from './api';

export default function AdminPanel() {
  const [mesas, setMesas] = useState([]);
  const [numero, setNumero] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [idEditando, setIdEditando] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarMesas();
  }, []);

  const cargarMesas = async () => {
    try {
      const data = await getMesas();
      setMesas(data);
    } catch (err) {
      setError('No se pudieron cargar las mesas desde Azure.');
    }
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');
    const datosMesa = { numero: parseInt(numero), capacidad: parseInt(capacidad) };

    try {
      if (idEditando) {
        await actualizarMesa(idEditando, datosMesa);
      } else {
        await crearMesa(datosMesa);
      }
      setNumero('');
      setCapacidad('');
      setIdEditando(null);
      cargarMesas();
    } catch (err) {
      setError('Error al procesar la operación de la mesa.');
    }
  };

  const seleccionarMesaParaEditar = (mesa) => {
    setIdEditando(mesa.id);
    setNumero(mesa.numero);
    setCapacidad(mesa.capacidad);
  };

  const manejarEliminar = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta mesa?')) {
      try {
        await eliminarMesa(id);
        cargarMesas();
      } catch (err) {
        setError('No se puede eliminar una mesa que contiene reservas.');
      }
    }
  };

  const cancelarEdicion = () => {
    setIdEditando(null);
    setNumero('');
    setCapacidad('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
      <h2>Panel de Control: Inventario de Mesas</h2>
      
      {error && <div style={{ color: '#ff4d4d', marginBottom: '15px' }}>{error}</div>}

      <form onSubmit= {manejarEnvio} style={{ marginBottom: '30px', background: '#1e293b', padding: '20px', borderRadius: '8px' }}>
        <h3>{idEditando ? 'Modificar Mesa' : 'Registrar Nueva Mesa'}</h3>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Número de Mesa:</label>
          <input 
            type="number" 
            value={numero} 
            onChange={(e) => setNumero(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Capacidad Máxima (Personas):</label>
          <input 
            type="number" 
            value={capacidad} 
            onChange={(e) => setCapacidad(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 15px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
          {idEditando ? 'Actualizar Cambios' : 'Guardar Mesa'}
        </button>
        {idEditando && (
          <button type="button" onClick={cancelarEdicion} style={{ padding: '10px 15px', background: '#475569', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Cancelar
          </button>
        )}
      </form>

      <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px' }}>
        <h3>Mesas Configuradas</h3>
        {mesas.length === 0 ? (
          <p>No hay mesas configuradas en Azure MySQL.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #475569', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Mesa №</th>
                <th style={{ padding: '10px' }}>Capacidad Max</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mesas.map((mesa) => (
                <tr key={mesa.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '10px' }}>Mesa {mesa.numero}</td>
                  <td style={{ padding: '10px' }}>{mesa.capacidad} Asistentes</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>
                    <button onClick={() => seleccionarMesaParaEditar(mesa)} style={{ padding: '5px 10px', background: '#eab308', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>
                      Editar
                    </button>
                    <button onClick={() => manejarEliminar(mesa.id)} style={{ padding: '5px 10px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}