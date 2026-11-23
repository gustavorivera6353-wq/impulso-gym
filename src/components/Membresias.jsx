import React from "react";
import {
  useAlmacen, SOCIOS_INICIALES, membresiasIniciales, estadoMembresia, formatoFecha,
} from "../datos";
import { Etiqueta } from "../ui";

// HU-03: consulta de la membresía y su vigencia.
function Membresias({ usuario }) {
  const [socios] = useAlmacen("socios", SOCIOS_INICIALES);
  const [membresias] = useAlmacen("membresias", membresiasIniciales);

  if (usuario.rol === "Socio") {
    const m = membresias.find((x) => x.socioId === usuario.socioId);
    const e = estadoMembresia(m);
    return (
      <div>
        <h2>Mi membresía</h2>
        {!m ? (
          <p>Aún no tienes una membresía. Acude a recepción para contratar un plan.</p>
        ) : (
          <div className="tarjeta">
            <p>Plan: <strong>{m.planNombre}</strong></p>
            <p>Inicio: {formatoFecha(m.inicio)}</p>
            <p>Vigente hasta: {formatoFecha(m.fin)}</p>
            <p>Estado: <Etiqueta clase={e.clase}>{e.texto}</Etiqueta></p>
            <p>
              {e.dias >= 0
                ? "Te quedan " + e.dias + " día(s) de vigencia."
                : "Venció hace " + -e.dias + " día(s)."}
            </p>
          </div>
        )}
      </div>
    );
  }

  const lista = socios.filter((s) => s.rol === "Socio");
  const conEstado = lista.map((s) => {
    const m = membresias.find((x) => x.socioId === s.id);
    return { socio: s, m, e: estadoMembresia(m) };
  });
  const contar = (texto) => conEstado.filter((x) => x.e.texto === texto).length;

  return (
    <div>
      <h2>Membresías y vigencia</h2>
      <div className="resumen">
        <div className="dato"><b>{contar("Activa")}</b>Activas</div>
        <div className="dato"><b>{contar("Por vencer")}</b>Por vencer</div>
        <div className="dato"><b>{contar("Vencida")}</b>Vencidas</div>
        <div className="dato"><b>{contar("Sin membresía")}</b>Sin membresía</div>
      </div>
      <div className="tabla-wrap">
        <table>
          <thead>
            <tr>
              <th>Socio</th><th>Plan</th><th>Inicio</th><th>Vence</th><th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {conEstado.map(({ socio, m, e }) => (
              <tr key={socio.id}>
                <td>{socio.nombre}</td>
                <td>{m ? m.planNombre : "—"}</td>
                <td>{m ? formatoFecha(m.inicio) : "—"}</td>
                <td>{m ? formatoFecha(m.fin) : "—"}</td>
                <td><Etiqueta clase={e.clase}>{e.texto}</Etiqueta></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Membresias;
