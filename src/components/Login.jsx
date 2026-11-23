import React, { useState } from "react";
import { useAlmacen, USUARIOS_INICIALES, SOCIOS_INICIALES, validarContrasena } from "../datos";
import { Errores, Exito } from "../ui";

// HU-01 (T-02 y T-03): inicio de sesión con campos obligatorios y mensaje de error.
// HU-16: al crear una cuenta, la contraseña se valida con reglas de seguridad.
function Login({ onLogin }) {
  const [usuarios, setUsuarios] = useAlmacen("usuarios", USUARIOS_INICIALES);
  const [socios, setSocios] = useAlmacen("socios", SOCIOS_INICIALES);
  const [modo, setModo] = useState("entrar");
  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [errores, setErrores] = useState([]);
  const [exito, setExito] = useState("");

  const cambiarModo = (nuevo) => {
    setModo(nuevo);
    setErrores([]);
    setExito("");
    setContrasena("");
    setConfirmar("");
  };

  const entrar = (e) => {
    e.preventDefault();
    const nuevos = [];

    if (usuario.trim() === "") {
      nuevos.push("El usuario es obligatorio.");
    }
    if (contrasena === "") {
      nuevos.push("La contraseña es obligatoria.");
    }
    const encontrado = usuarios.find(
      (u) => u.usuario === usuario.trim() && u.contrasena === contrasena
    );
    if (nuevos.length === 0 && !encontrado) {
      nuevos.push("Usuario o contraseña incorrectos.");
    }

    setErrores(nuevos);
    setExito("");
    if (nuevos.length === 0) {
      onLogin(encontrado);
    }
  };

  const registrar = (e) => {
    e.preventDefault();
    const nuevos = [];

    if (nombre.trim() === "") {
      nuevos.push("El nombre es obligatorio.");
    }
    if (usuario.trim() === "") {
      nuevos.push("El usuario es obligatorio.");
    } else if (usuarios.some((u) => u.usuario.toLowerCase() === usuario.trim().toLowerCase())) {
      nuevos.push("Ese usuario ya existe.");
    }
    nuevos.push(...validarContrasena(contrasena));
    if (confirmar !== contrasena) {
      nuevos.push("Las contraseñas no coinciden.");
    }

    setErrores(nuevos);
    setExito("");
    if (nuevos.length > 0) {
      return;
    }

    const socioId = Date.now();
    setSocios([...socios, { id: socioId, nombre: nombre.trim(), rol: "Socio" }]);
    setUsuarios([
      ...usuarios,
      { usuario: usuario.trim(), contrasena, rol: "Socio", nombre: nombre.trim(), socioId },
    ]);
    setModo("entrar");
    setNombre("");
    setContrasena("");
    setConfirmar("");
    setExito("Cuenta creada. Ya puedes iniciar sesión.");
  };

  const registro = modo === "registro";

  return (
    <div>
      <h2>Impulso Gym</h2>
      <form onSubmit={registro ? registrar : entrar}>
        {registro && (
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        )}
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />
        {registro && (
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
          />
        )}
        <button type="submit">{registro ? "Crear cuenta" : "Iniciar sesión"}</button>
      </form>
      <Errores lista={errores} />
      <Exito texto={exito} />
      <button type="button" className="enlace" onClick={() => cambiarModo(registro ? "entrar" : "registro")}>
        {registro ? "Ya tengo cuenta" : "Crear una cuenta de socio"}
      </button>
      <details>
        <summary>Cuentas de prueba</summary>
        <p>Administrador: admin / 1234</p>
        <p>Recepción: recepcion / Recepcion1</p>
        <p>Entrenador: carlos / Entrenador1</p>
        <p>Socio: ana / Socio1234</p>
      </details>
    </div>
  );
}

export default Login;
