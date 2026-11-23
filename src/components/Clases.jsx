import React, { useState } from "react";
import {
  useAlmacen, SOCIOS_INICIALES, membresiasIniciales, clasesIniciales, reservasIniciales,
  hoy, diasEntre, formatoFecha,
} from "../datos";
import { Errores, Exito, Etiqueta } from "../ui";

// HU-08: crear clases con horario y cupo (administrador).
// HU-09: reservar un lugar en una clase (socio con membresía vigente).
// HU-10: cancelar una reservación (socio).
function Clases({ usuario }) {
  const [clases, setClases] = useAlmacen("clases", clasesIniciales);
  const [reservas, setReservas] = useAlmacen("reservas", reservasIniciales);
  const [, setAsistencias] = useAlmacen("asistencias", []);
  const [socios] = useAlmacen("socios", SOCIOS_INICIALES);
  const [membresias] = useAlmacen("membresias", membresiasIniciales);

  const [nombre, setNombre] = useState("");
  const [entrenador, setEntrenador] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [cupo, setCupo] = useState("");
  const [errores, setErrores] = useState([]);
  const [exito, setExito] = useState("");
  const [aviso, setAviso] = useState("");

  const esAdmin = usuario.rol === "Administrador";
  const esSocio = usuario.rol === "Socio";
  const entrenadores = socios.filter((s) => s.rol === "Entrenador");
  const miMembresia = membresias.find((m) => m.socioId === usuario.socioId);
  const vigente = !!miMembresia && diasEntre(hoy(), miMembresia.fin) >= 0;

  const ordenadas = [...clases].sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
  const inscritos = (c) => reservas.filter((r) => r.claseId === c.id);
  const miReserva = (c) => reservas.find((r) => r.claseId === c.id && r.socioId === usuario.socioId);
  const nombreSocio = (id) => (socios.find((s) => s.id === id) || { nombre: "Socio" }).nombre;

  const crear = (e) => {
    e.preventDefault();
    const nuevos = [];
    const lugares = Number(cupo);

    if (nombre.trim() === "") {
      nuevos.push("El nombre de la clase es obligatorio.");
    }
    if (entrenador === "") {
      nuevos.push("Selecciona un entrenador.");
    }
    if (fecha === "") {
      nuevos.push("La fecha es obligatoria.");
    } else if (fecha < hoy()) {
      nuevos.push("La fecha no puede ser anterior a hoy.");
    }
    if (hora === "") {
      nuevos.push("La hora es obligatoria.");
    }
    if (!Number.isInteger(lugares) || lugares < 1 || lugares > 100) {
      nuevos.push("El cupo debe ser un número entero entre 1 y 100.");
    }

    setErrores(nuevos);
    setExito("");
    setAviso("");
    if (nuevos.length > 0) {
      return;
    }

    setClases([...clases, { id: Date.now(), nombre: nombre.trim(), entrenador, fecha, hora, cupo: lugares }]);
    setNombre("");
    setEntrenador("");
    setFecha("");
    setHora("");
    setCupo("");
    setExito("Clase creada.");
  };

  const eliminar = (c) => {
    if (window.confirm("¿Eliminar la clase " + c.nombre + " y sus reservaciones?")) {
      setClases(clases.filter((x) => x.id !== c.id));
      setReservas(reservas.filter((r) => r.claseId !== c.id));
      setAsistencias((anteriores) => anteriores.filter((a) => a.claseId !== c.id));
    }
  };

  const reservar = (c) => {
    setExito("");
    if (!vigente) {
      setAviso("Necesitas una membresía vigente para reservar una clase.");
      return;
    }
    if (inscritos(c).length >= c.cupo) {
      setAviso("La clase " + c.nombre + " ya no tiene lugares disponibles.");
      return;
    }
    setReservas([...reservas, { id: Date.now(), claseId: c.id, socioId: usuario.socioId }]);
    setAviso("");
    setExito("Reservaste un lugar en " + c.nombre + " del " + formatoFecha(c.fecha) + " a las " + c.hora + ".");
  };

  const cancelar = (c) => {
    setReservas(reservas.filter((r) => !(r.claseId === c.id && r.socioId === usuario.socioId)));
    setAviso("");
    setExito("Cancelaste tu reservación en " + c.nombre + ".");
  };

  return (
    <div>
      <h2>Clases</h2>
      {esSocio && !vigente && (
        <p className="aviso-info" role="status">
          Tu membresía no está vigente. Renuévala en recepción para poder reservar.
        </p>
      )}
      {aviso && <p role="alert">{aviso}</p>}
      <Exito texto={exito} />

      {ordenadas.length === 0 && <p>No hay clases programadas.</p>}
      <ul>
        {ordenadas.map((c) => {
          const ocupados = inscritos(c).length;
          const lleno = ocupados >= c.cupo;
          const pasada = c.fecha < hoy();
          const reserva = esSocio ? miReserva(c) : null;
          return (
            <li key={c.id} className="aviso">
              <strong>{c.nombre}</strong> — {formatoFecha(c.fecha)} a las {c.hora}
              <p>
                Entrenador: {c.entrenador} · Lugares: {ocupados}/{c.cupo}{" "}
                {lleno && <Etiqueta clase="rojo">Llena</Etiqueta>}
                {pasada && <Etiqueta clase="gris">Realizada</Etiqueta>}
                {reserva && <Etiqueta clase="verde">Reservada</Etiqueta>}
              </p>
              {!esSocio && ocupados > 0 && (
                <small>Inscritos: {inscritos(c).map((r) => nombreSocio(r.socioId)).join(", ")}</small>
              )}
              {esSocio && !pasada && (
                reserva ? (
                  <button type="button" className="chico boton-sec" onClick={() => cancelar(c)}>
                    Cancelar reservación
                  </button>
                ) : (
                  <button type="button" className="chico" onClick={() => reservar(c)} disabled={lleno}>
                    Reservar lugar
                  </button>
                )
              )}
              {esAdmin && (
                <button type="button" className="chico boton-peligro" onClick={() => eliminar(c)}>
                  Eliminar clase
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {esAdmin && (
        <>
          <h2>Crear clase</h2>
          <form onSubmit={crear}>
            <label className="campo">
              <span>Nombre de la clase</span>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </label>
            <label className="campo">
              <span>Entrenador</span>
              <select value={entrenador} onChange={(e) => setEntrenador(e.target.value)}>
                <option value="">Selecciona un entrenador</option>
                {entrenadores.map((s) => (
                  <option key={s.id} value={s.nombre}>{s.nombre}</option>
                ))}
              </select>
            </label>
            <label className="campo">
              <span>Fecha</span>
              <input type="date" min={hoy()} value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </label>
            <label className="campo">
              <span>Hora</span>
              <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
            </label>
            <label className="campo">
              <span>Cupo</span>
              <input type="number" min="1" max="100" value={cupo} onChange={(e) => setCupo(e.target.value)} />
            </label>
            <button type="submit">Crear clase</button>
          </form>
          <Errores lista={errores} />
        </>
      )}
    </div>
  );
}

export default Clases;
