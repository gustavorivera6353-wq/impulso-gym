import React, { useState } from "react";
import { useAlmacen, SOCIOS_INICIALES, hoy, formatoFecha } from "../datos";
import { Errores, Exito, Etiqueta } from "../ui";

const ESTADOS = ["Recibida", "En revisión", "Resuelta"];
const COLOR = { Recibida: "gris", "En revisión": "amarillo", Resuelta: "verde" };

// HU-11: el socio registra quejas o sugerencias.
// HU-12: administración y recepción ven las quejas y actualizan su estado.
function Quejas({ usuario }) {
  const [quejas, setQuejas] = useAlmacen("quejas", []);
  const [socios] = useAlmacen("socios", SOCIOS_INICIALES);
  const [tipo, setTipo] = useState("Queja");
  const [texto, setTexto] = useState("");
  const [errores, setErrores] = useState([]);
  const [exito, setExito] = useState("");
  const esSocio = usuario.rol === "Socio";

  const enviar = (e) => {
    e.preventDefault();
    const nuevos = [];
    if (texto.trim().length < 10) {
      nuevos.push("Escribe al menos 10 caracteres para describir tu " + tipo.toLowerCase() + ".");
    }
    setErrores(nuevos);
    setExito("");
    if (nuevos.length > 0) {
      return;
    }
    setQuejas([
      { id: Date.now(), socioId: usuario.socioId, tipo, texto: texto.trim(), estado: "Recibida", fecha: hoy() },
      ...quejas,
    ]);
    setTexto("");
    setExito("Gracias, recibimos tu " + tipo.toLowerCase() + ".");
  };

  const cambiarEstado = (id, estado) => {
    setQuejas(quejas.map((q) => (q.id === id ? { ...q, estado } : q)));
  };

  const nombreSocio = (id) => (socios.find((s) => s.id === id) || { nombre: "Socio" }).nombre;
  const visibles = esSocio ? quejas.filter((q) => q.socioId === usuario.socioId) : quejas;

  return (
    <div>
      <h2>{esSocio ? "Quejas y sugerencias" : "Seguimiento de quejas"}</h2>
      {esSocio && (
        <>
          <form onSubmit={enviar}>
            <label className="campo">
              <span>Tipo</span>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option>Queja</option>
                <option>Sugerencia</option>
              </select>
            </label>
            <label className="campo">
              <span>Describe tu {tipo.toLowerCase()}</span>
              <input type="text" value={texto} onChange={(e) => setTexto(e.target.value)} />
            </label>
            <button type="submit">Enviar</button>
          </form>
          <Errores lista={errores} />
        </>
      )}
      <Exito texto={exito} />

      <h2>{esSocio ? "Mis envíos" : "Quejas y sugerencias recibidas"}</h2>
      {visibles.length === 0 && <p>No hay registros.</p>}
      <ul>
        {visibles.map((q) => (
          <li key={q.id} className="aviso">
            <strong>{q.tipo}</strong>
            {!esSocio && <> de {nombreSocio(q.socioId)}</>} — {formatoFecha(q.fecha)}
            <p>{q.texto}</p>
            {esSocio ? (
              <Etiqueta clase={COLOR[q.estado]}>{q.estado}</Etiqueta>
            ) : (
              <label>
                Estado:{" "}
                <select value={q.estado} onChange={(e) => cambiarEstado(q.id, e.target.value)}>
                  {ESTADOS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Quejas;
