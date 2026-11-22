import React, { useState } from "react";

// T-04 y T-05: lista de socios con su rol y formulario para agregar socios.
function Socios() {
  const [socios, setSocios] = useState([
    { id: 1, nombre: "Ana López", rol: "Socio" },
    { id: 2, nombre: "Carlos Ruiz", rol: "Entrenador" },
    { id: 3, nombre: "Mariana Díaz", rol: "Recepción" },
  ]);
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
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>Gestión de Socios</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {socios.map((s) => (
          <li key={s.id}>
            {s.nombre} — <strong>{s.rol}</strong>
          </li>
        ))}
      </ul>

      <form onSubmit={agregarSocio} style={{ marginTop: "20px" }}>
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
        <p key={mensaje} role="alert" style={{ color: "crimson" }}>
          {mensaje}
        </p>
      ))}
    </div>
  );
}

export default Socios;
