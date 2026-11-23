import React, { useState } from "react";
import { useAlmacen, PLANES_INICIALES, dinero } from "../datos";
import { Errores, Exito } from "../ui";

// HU-05: crear, editar y eliminar planes de membresía.
function Planes() {
  const [planes, setPlanes] = useAlmacen("planes", PLANES_INICIALES);
  const [editando, setEditando] = useState(null);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [dias, setDias] = useState("");
  const [errores, setErrores] = useState([]);
  const [exito, setExito] = useState("");

  const limpiar = () => {
    setEditando(null);
    setNombre("");
    setPrecio("");
    setDias("");
  };

  const guardar = (e) => {
    e.preventDefault();
    const nuevos = [];
    const p = Number(precio);
    const d = Number(dias);

    if (nombre.trim() === "") {
      nuevos.push("El nombre del plan es obligatorio.");
    } else if (
      planes.some((x) => x.nombre.toLowerCase() === nombre.trim().toLowerCase() && x.id !== editando)
    ) {
      nuevos.push("Ya existe un plan con ese nombre.");
    }
    if (!(p > 0)) {
      nuevos.push("El precio debe ser mayor que cero.");
    }
    if (!Number.isInteger(d) || d <= 0) {
      nuevos.push("La duración debe ser un número entero de días mayor que cero.");
    }

    setErrores(nuevos);
    setExito("");
    if (nuevos.length > 0) {
      return;
    }

    if (editando === null) {
      setPlanes([...planes, { id: Date.now(), nombre: nombre.trim(), precio: p, duracionDias: d }]);
      setExito("Plan creado.");
    } else {
      setPlanes(
        planes.map((x) =>
          x.id === editando ? { ...x, nombre: nombre.trim(), precio: p, duracionDias: d } : x
        )
      );
      setExito("Plan actualizado.");
    }
    limpiar();
  };

  const editar = (plan) => {
    setEditando(plan.id);
    setNombre(plan.nombre);
    setPrecio(String(plan.precio));
    setDias(String(plan.duracionDias));
    setErrores([]);
    setExito("");
  };

  const eliminar = (plan) => {
    if (window.confirm("¿Eliminar el plan " + plan.nombre + "?")) {
      setPlanes(planes.filter((x) => x.id !== plan.id));
      if (editando === plan.id) {
        limpiar();
      }
      setExito("Plan eliminado.");
    }
  };

  return (
    <div>
      <h2>Planes de membresía</h2>
      <div className="tabla-wrap">
        <table>
          <thead>
            <tr><th>Plan</th><th>Precio</th><th>Duración</th><th></th></tr>
          </thead>
          <tbody>
            {planes.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{dinero(p.precio)}</td>
                <td>{p.duracionDias} días</td>
                <td>
                  <button type="button" className="chico boton-sec" onClick={() => editar(p)}>Editar</button>{" "}
                  <button type="button" className="chico boton-peligro" onClick={() => eliminar(p)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={guardar}>
        <label className="campo">
          <span>Nombre del plan</span>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </label>
        <label className="campo">
          <span>Precio (MXN)</span>
          <input type="number" min="0" value={precio} onChange={(e) => setPrecio(e.target.value)} />
        </label>
        <label className="campo">
          <span>Duración (días)</span>
          <input type="number" min="1" value={dias} onChange={(e) => setDias(e.target.value)} />
        </label>
        <button type="submit">{editando === null ? "Crear plan" : "Guardar cambios"}</button>
        {editando !== null && (
          <button type="button" className="boton-sec" onClick={limpiar}>Cancelar</button>
        )}
      </form>
      <Errores lista={errores} />
      <Exito texto={exito} />
    </div>
  );
}

export default Planes;
