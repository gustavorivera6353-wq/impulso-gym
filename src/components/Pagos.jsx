import React, { useState } from "react";
import {
  useAlmacen, SOCIOS_INICIALES, PLANES_INICIALES, membresiasIniciales, pagosIniciales,
  hoy, sumarDias, diasEntre, formatoFecha, dinero,
} from "../datos";
import { Errores, Exito } from "../ui";

// HU-04: registrar y consultar los pagos de las membresías.
// Al registrar un pago se crea o se extiende la vigencia de la membresía (HU-03).
function Pagos() {
  const [socios] = useAlmacen("socios", SOCIOS_INICIALES);
  const [planes] = useAlmacen("planes", PLANES_INICIALES);
  const [membresias, setMembresias] = useAlmacen("membresias", membresiasIniciales);
  const [pagos, setPagos] = useAlmacen("pagos", pagosIniciales);
  const [socioId, setSocioId] = useState("");
  const [planId, setPlanId] = useState("");
  const [metodo, setMetodo] = useState("Efectivo");
  const [filtro, setFiltro] = useState("");
  const [errores, setErrores] = useState([]);
  const [exito, setExito] = useState("");

  const miembros = socios.filter((s) => s.rol === "Socio");
  const plan = planes.find((p) => String(p.id) === planId);

  const registrar = (e) => {
    e.preventDefault();
    const nuevos = [];
    if (socioId === "") {
      nuevos.push("Selecciona un socio.");
    }
    if (planId === "" || !plan) {
      nuevos.push("Selecciona un plan.");
    }
    setErrores(nuevos);
    setExito("");
    if (nuevos.length > 0) {
      return;
    }

    const sid = Number(socioId);
    const socio = miembros.find((s) => s.id === sid);
    const actual = membresias.find((m) => m.socioId === sid);
    const base = actual && diasEntre(hoy(), actual.fin) >= 0 ? actual.fin : hoy();
    const nueva = {
      socioId: sid,
      planId: plan.id,
      planNombre: plan.nombre,
      inicio: base,
      fin: sumarDias(base, plan.duracionDias),
    };

    setMembresias([...membresias.filter((m) => m.socioId !== sid), nueva]);
    setPagos([
      {
        id: Date.now(), socioId: sid, socioNombre: socio.nombre, planId: plan.id,
        planNombre: plan.nombre, monto: plan.precio, metodo, fecha: hoy(),
      },
      ...pagos,
    ]);
    setExito(
      "Pago de " + dinero(plan.precio) + " registrado. La membresía de " + socio.nombre +
        " vence el " + formatoFecha(nueva.fin) + "."
    );
    setSocioId("");
    setPlanId("");
  };

  const visibles = pagos.filter((p) => filtro === "" || String(p.socioId) === filtro);
  const total = visibles.reduce((suma, p) => suma + p.monto, 0);

  return (
    <div>
      <h2>Pagos de membresías</h2>
      <form onSubmit={registrar}>
        <label className="campo">
          <span>Socio</span>
          <select value={socioId} onChange={(e) => setSocioId(e.target.value)}>
            <option value="">Selecciona un socio</option>
            {miembros.map((s) => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </select>
        </label>
        <label className="campo">
          <span>Plan</span>
          <select value={planId} onChange={(e) => setPlanId(e.target.value)}>
            <option value="">Selecciona un plan</option>
            {planes.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre} — {dinero(p.precio)}</option>
            ))}
          </select>
        </label>
        <label className="campo">
          <span>Método de pago</span>
          <select value={metodo} onChange={(e) => setMetodo(e.target.value)}>
            <option>Efectivo</option>
            <option>Tarjeta</option>
            <option>Transferencia</option>
          </select>
        </label>
        <button type="submit">Registrar pago</button>
      </form>
      <Errores lista={errores} />
      <Exito texto={exito} />

      <h2>Historial de pagos</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <label className="campo">
          <span>Filtrar por socio</span>
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="">Todos</option>
            {miembros.map((s) => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </select>
        </label>
      </form>
      <div className="tabla-wrap">
        <table>
          <thead>
            <tr><th>Fecha</th><th>Socio</th><th>Plan</th><th>Método</th><th>Monto</th></tr>
          </thead>
          <tbody>
            {visibles.length === 0 && (
              <tr><td colSpan="5">No hay pagos registrados.</td></tr>
            )}
            {visibles.map((p) => (
              <tr key={p.id}>
                <td>{formatoFecha(p.fecha)}</td>
                <td>{p.socioNombre}</td>
                <td>{p.planNombre}</td>
                <td>{p.metodo}</td>
                <td>{dinero(p.monto)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>Total mostrado: <strong>{dinero(total)}</strong></p>
    </div>
  );
}

export default Pagos;
