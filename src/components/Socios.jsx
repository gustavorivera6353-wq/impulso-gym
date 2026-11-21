import React from "react";

// T-04: lista de socios con su rol (socio, entrenador o recepción).
// El formulario para agregar socios se crea en T-05.
function Socios() {
  const socios = [
    { id: 1, nombre: "Ana López", rol: "Socio" },
    { id: 2, nombre: "Carlos Ruiz", rol: "Entrenador" },
    { id: 3, nombre: "Mariana Díaz", rol: "Recepción" },
  ];

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
    </div>
  );
}

export default Socios;
