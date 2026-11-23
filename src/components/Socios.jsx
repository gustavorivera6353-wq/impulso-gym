import React, { useState } from "react";
import { useAlmacen, SOCIOS_INICIALES } from "../datos";

// HU-02 (T-04 y T-05): lista de socios con su rol y formulario para agregar socios.
// Los datos se guardan en el navegador para que no se pierdan al recargar.
function Socios() {
  const [socios, setSocios] = useAlmacen("socios", SOCIOS_INICIALES);
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("");
  const [errores, setErrores] = useState([]);

  const agregarSocio = (e) => {
    e.preventDefault();
    const nuevos = [];

    if (nombre.trim() === "") {
      nuevos.push("El nombre es obligatorio.");
    }
    if (rol === "") {
      nuevos.push("Selecciona un rol.");
    }

    setErrores(nuevos);
    if (nuevos.length > 0) {
      return;
    }

    setSocios([...socios, { id: Date.now(), nombre: nombre.trim(), rol }]);
    setNombre("");
    setRol("");
  };

  return (
    <div>
      <h2>Gestión de Socios</h2>
      <ul>
        {socios.map((s) => (
          <li key={s.id}>
            {s.nombre} — <strong>{s.rol}</strong>
          </li>
        ))}
      </ul>

      <form onSubmit={agregarSocio}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="">Selecciona un rol</option>
          <option value="Socio">Socio</option>
          <option value="Entrenador">Entrenador</option>
          <option value="Recepción">Recepción</option>
        </select>
        <button type="submit">Agregar socio</button>
      </form>
      {errores.map((mensaje) => (
        <p key={mensaje} role="alert">
          {mensaje}
        </p>
      ))}
    </div>
  );
}

export default Socios;
