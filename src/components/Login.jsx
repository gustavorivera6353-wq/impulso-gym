import React, { useState } from "react";

// T-02: pantalla de inicio de sesión con usuario y contraseña obligatorios.
// La revisión de las credenciales se agrega en T-03.
function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errores, setErrores] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevos = [];

    if (usuario.trim() === "") {
      nuevos.push("El usuario es obligatorio.");
    }
    if (contrasena === "") {
      nuevos.push("La contraseña es obligatoria.");
    }

    setErrores(nuevos);
    if (nuevos.length === 0) {
      onLogin(usuario);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Impulso Gym</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
        </div>
        <button type="submit">Iniciar sesión</button>
      </form>
      {errores.map((mensaje) => (
        <p key={mensaje} role="alert" style={{ color: "crimson" }}>
          {mensaje}
        </p>
      ))}
    </div>
  );
}

export default Login;
