import React, { useState } from "react";
import {
  useAlmacen, SOCIOS_INICIALES, clasesIniciales, reservasIniciales, formatoFecha,
} from "../datos";
import { Exito, Etiqueta } from "../ui";

// HU-13: el entrenador registra la asistencia a su clase.
// HU-14: el socio consulta su historial de asistencia.
function Asistencia({ usuario }) {
  const [clases] = useAlmacen("clases", clasesIniciales);
  const [reservas] = useAlmacen("reservas", reservasIniciales);
  const [socios] = useAlmacen("socios", SOCIOS_INICIALES);
  const [asistencias, setAsistencias] = useAlmacen("asistencias", []);
  const [claseId, setClaseId] = useState("");
  const [cambios, setCambios] = useState({});
  const [exito, setExito] = useState("");

  if (usuario.rol === "Socio") {
    const historial = reservas
      .filter((r) => r.socioId === usuario.socioId)
      .map((r) => {
        const clase = clases.find((c) => c.id === r.claseId);
        const registro = asistencias.find((a) => a.claseId === r.claseId && a.socioId === usuario.socioId);
        return { clase, registro };
      })
      .filter((x) => x.clase)
      .sort((a, b) => b.clase.fecha.localeCompare(a.clase.fecha));
    const registradas = historial.filter((x) => x.registro);
    const asistio = registradas.filter((x) => x.registro.asistio).length;

    return (
      <div>
        <h2>Mi historial de asistencia</h2>
        <p>
          Has asistido a <strong>{asistio}</strong> de <strong>{registradas.length}</strong> clase(s) con asistencia registrada.
        </p>
        <div className="tabla-wrap">
          <table>
            <thead>
              <tr><th>Clase</th><th>Fecha</th><th>Entrenador</th><th>Asistencia</th></tr>
            </thead>
            <tbody>
              {historial.length === 0 && (
                <tr><td colSpan="4">Aún no tienes clases reservadas.</td></tr>
              )}
              {historial.map(({ clase, registro }) => (
                <tr key={clase.id}>
                  <td>{clase.nombre}</td>
                  <td>{formatoFecha(clase.fecha)} {clase.hora}</td>
                  <td>{clase.entrenador}</td>
                  <td>
                    {!registro && <Etiqueta clase="gris">Pendiente</Etiqueta>}
                    {registro && registro.asistio && <Etiqueta clase="verde">Asistió</Etiqueta>}
                    {registro && !registro.asistio && <Etiqueta clase="rojo">No asistió</Etiqueta>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const propias = usuario.rol === "Entrenador"
    ? clases.filter((c) => c.entrenador === usuario.nombre)
    : clases;
  const ordenadas = [...propias].sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
  const clase = ordenadas.find((c) => String(c.id) === claseId);
  const lista = clase
    ? reservas
        .filter((r) => r.claseId === clase.id)
        .map((r) => socios.find((s) => s.id === r.socioId))
        .filter(Boolean)
    : [];

  const valor = (socioId) => {
    if (cambios[socioId] !== undefined) {
      return cambios[socioId];
    }
    const registro = asistencias.find((a) => a.claseId === clase.id && a.socioId === socioId);
    return registro ? registro.asistio : false;
  };

  const elegir = (id) => {
    setClaseId(id);
    setCambios({});
    setExito("");
  };

  const guardar = () => {
    const nuevos = lista.map((s) => ({ claseId: clase.id, socioId: s.id, asistio: valor(s.id) }));
    setAsistencias([...asistencias.filter((a) => a.claseId !== clase.id), ...nuevos]);
    setCambios({});
    setExito("Asistencia guardada para " + clase.nombre + ".");
  };

  return (
    <div>
      <h2>Registro de asistencia</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <label className="campo">
          <span>Clase</span>
          <select value={claseId} onChange={(e) => elegir(e.target.value)}>
            <option value="">Selecciona una clase</option>
            {ordenadas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre} — {formatoFecha(c.fecha)} {c.hora}
              </option>
            ))}
          </select>
        </label>
      </form>
      {ordenadas.length === 0 && <p>No tienes clases asignadas.</p>}
      {clase && (
        <>
          {lista.length === 0 ? (
            <p>Esta clase no tiene reservaciones.</p>
          ) : (
            <ul>
              {lista.map((s) => (
                <li key={s.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={valor(s.id)}
                      onChange={(e) => setCambios({ ...cambios, [s.id]: e.target.checked })}
                    />{" "}
                    {s.nombre} — asistió
                  </label>
                </li>
              ))}
            </ul>
          )}
          {lista.length > 0 && <button type="button" onClick={guardar}>Guardar asistencia</button>}
        </>
      )}
      <Exito texto={exito} />
    </div>
  );
}

export default Asistencia;
