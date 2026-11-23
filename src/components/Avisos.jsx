import React, { useState } from "react";
import { useAlmacen, avisosIniciales, hoy, formatoFecha } from "../datos";
import { Errores, Exito, Etiqueta } from "../ui";

// HU-06: publicar avisos y promociones (administración y recepción).
// HU-07: consultar los avisos publicados (todos los roles).
function Avisos({ usuario }) {
  const [avisos, setAvisos] = useAlmacen("avisos", avisosIniciales);
  const [tipo, setTipo] = useState("Aviso");
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [errores, setErrores] = useState([]);
  const [exito, setExito] = useState("");
  const puedePublicar = usuario.rol === "Administrador" || usuario.rol === "Recepción";

  const publicar = (e) => {
    e.preventDefault();
    const nuevos = [];
    if (titulo.trim() === "") {
      nuevos.push("El título es obligatorio.");
    }
    if (texto.trim().length < 5) {
      nuevos.push("El texto debe tener al menos 5 caracteres.");
    }
    setErrores(nuevos);
    setExito("");
    if (nuevos.length > 0) {
      return;
    }
    setAvisos([
      { id: Date.now(), tipo, titulo: titulo.trim(), texto: texto.trim(), fecha: hoy() },
      ...avisos,
    ]);
    setTitulo("");
    setTexto("");
    setExito("Aviso publicado.");
  };

  const eliminar = (id) => {
    if (window.confirm("¿Eliminar este aviso?")) {
      setAvisos(avisos.filter((a) => a.id !== id));
    }
  };

  return (
    <div>
      <h2>Avisos y promociones</h2>
      {avisos.length === 0 && <p>No hay avisos publicados.</p>}
      <ul>
        {avisos.map((a) => (
          <li key={a.id} className="aviso">
            <Etiqueta clase={a.tipo === "Promoción" ? "naranja" : "gris"}>{a.tipo}</Etiqueta>{" "}
            <strong>{a.titulo}</strong>
            <p>{a.texto}</p>
            <small>Publicado el {formatoFecha(a.fecha)}</small>
            {puedePublicar && (
              <>
                {" "}
                <button type="button" className="chico boton-peligro" onClick={() => eliminar(a.id)}>
                  Eliminar
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      {puedePublicar && (
        <>
          <form onSubmit={publicar}>
            <label className="campo">
              <span>Tipo</span>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option>Aviso</option>
                <option>Promoción</option>
              </select>
            </label>
            <label className="campo">
              <span>Título</span>
              <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            </label>
            <label className="campo">
              <span>Texto</span>
              <input type="text" value={texto} onChange={(e) => setTexto(e.target.value)} />
            </label>
            <button type="submit">Publicar</button>
          </form>
          <Errores lista={errores} />
          <Exito texto={exito} />
        </>
      )}
    </div>
  );
}

export default Avisos;
