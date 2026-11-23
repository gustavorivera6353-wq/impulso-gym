import React from "react";
import {
  useAlmacen, SOCIOS_INICIALES, membresiasIniciales, pagosIniciales, clasesIniciales,
  reservasIniciales, estadoMembresia, dinero, formatoFecha,
} from "../datos";

// HU-15: reportes administrativos de pagos y asistencia.
function Reportes() {
  const [socios] = useAlmacen("socios", SOCIOS_INICIALES);
  const [membresias] = useAlmacen("membresias", membresiasIniciales);
  const [pagos] = useAlmacen("pagos", pagosIniciales);
  const [clases] = useAlmacen("clases", clasesIniciales);
  const [reservas] = useAlmacen("reservas", reservasIniciales);
  const [asistencias] = useAlmacen("asistencias", []);

  const total = pagos.reduce((suma, p) => suma + p.monto, 0);

  const agrupar = (clave) => {
    const mapa = {};
    pagos.forEach((p) => {
      const k = clave(p);
      mapa[k] = mapa[k] || { cantidad: 0, monto: 0 };
      mapa[k].cantidad += 1;
      mapa[k].monto += p.monto;
    });
    return Object.entries(mapa).sort((a, b) => a[0].localeCompare(b[0]));
  };
  const porPlan = agrupar((p) => p.planNombre);
  const porMes = agrupar((p) => p.fecha.slice(0, 7));

  const miembros = socios.filter((s) => s.rol === "Socio");
  const estados = miembros.map((s) => estadoMembresia(membresias.find((m) => m.socioId === s.id)).texto);
  const cuantos = (texto) => estados.filter((e) => e === texto).length;

  const porClase = [...clases]
    .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))
    .map((c) => {
      const inscritos = reservas.filter((r) => r.claseId === c.id).length;
      const registros = asistencias.filter((a) => a.claseId === c.id);
      const asistieron = registros.filter((a) => a.asistio).length;
      return { clase: c, inscritos, registrada: registros.length > 0, asistieron };
    });

  const descargar = () => {
    const filas = [
      ["Fecha", "Socio", "Plan", "Método", "Monto"],
      ...pagos.map((p) => [p.fecha, p.socioNombre, p.planNombre, p.metodo, p.monto]),
    ];
    const csv = filas
      .map((fila) => fila.map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(","))
      .join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "pagos-impulso-gym.csv";
    enlace.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2>Reportes</h2>
      <div className="resumen">
        <div className="dato"><b>{dinero(total)}</b>Ingresos totales</div>
        <div className="dato"><b>{pagos.length}</b>Pagos registrados</div>
        <div className="dato"><b>{cuantos("Activa") + cuantos("Por vencer")}</b>Membresías vigentes</div>
        <div className="dato"><b>{cuantos("Vencida")}</b>Membresías vencidas</div>
      </div>

      <h2>Pagos por plan</h2>
      <div className="tabla-wrap">
        <table>
          <thead><tr><th>Plan</th><th>Pagos</th><th>Ingresos</th></tr></thead>
          <tbody>
            {porPlan.length === 0 && <tr><td colSpan="3">Sin datos.</td></tr>}
            {porPlan.map(([plan, d]) => (
              <tr key={plan}><td>{plan}</td><td>{d.cantidad}</td><td>{dinero(d.monto)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Pagos por mes</h2>
      <div className="tabla-wrap">
        <table>
          <thead><tr><th>Mes</th><th>Pagos</th><th>Ingresos</th></tr></thead>
          <tbody>
            {porMes.length === 0 && <tr><td colSpan="3">Sin datos.</td></tr>}
            {porMes.map(([mes, d]) => (
              <tr key={mes}><td>{mes}</td><td>{d.cantidad}</td><td>{dinero(d.monto)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Asistencia por clase</h2>
      <div className="tabla-wrap">
        <table>
          <thead>
            <tr><th>Clase</th><th>Fecha</th><th>Inscritos</th><th>Asistieron</th><th>%</th></tr>
          </thead>
          <tbody>
            {porClase.length === 0 && <tr><td colSpan="5">Sin clases.</td></tr>}
            {porClase.map(({ clase, inscritos, registrada, asistieron }) => (
              <tr key={clase.id}>
                <td>{clase.nombre}</td>
                <td>{formatoFecha(clase.fecha)} {clase.hora}</td>
                <td>{inscritos}</td>
                <td>{registrada ? asistieron : "Pendiente"}</td>
                <td>{registrada && inscritos > 0 ? Math.round((asistieron / inscritos) * 100) + " %" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button type="button" onClick={descargar}>Descargar pagos (CSV)</button>
    </div>
  );
}

export default Reportes;
