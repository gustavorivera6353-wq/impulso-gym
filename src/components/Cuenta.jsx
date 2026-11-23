import React, { useState } from "react";
import { useAlmacen, USUARIOS_INICIALES, REGLAS_CONTRASENA, validarContrasena } from "../datos";
import { Errores, Exito } from "../ui";

// HU-16: cambiar la contraseña con validación de reglas de seguridad.
function Cuenta({ usuario, onActualizar }) {
  const [usuarios, setUsuarios] = useAlmacen("usuarios", USUARIOS_INICIALES);
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [errores, setErrores] = useState([]);
  const [exito, setExito] = useState("");

  const guardar = (e) => {
    e.preventDefault();
    const nuevos = [];
    if (actual !== usuario.contrasena) {
      nuevos.push("La contraseña actual es incorrecta.");
    }
    nuevos.push(...validarContrasena(nueva));
    if (nueva !== "" && nueva === actual) {
      nuevos.push("La nueva contraseña debe ser distinta de la actual.");
    }
    if (confirmar !== nueva) {
      nuevos.push("Las contraseñas no coinciden.");
    }

    setErrores(nuevos);
    setExito("");
    if (nuevos.length > 0) {
      return;
    }

    setUsuarios(usuarios.map((u) => (u.usuario === usuario.usuario ? { ...u, contrasena: nueva } : u)));
    onActualizar({ ...usuario, contrasena: nueva });
    setActual("");
    setNueva("");
    setConfirmar("");
    setExito("Contraseña actualizada.");
  };

  return (
    <div>
      <h2>Mi cuenta</h2>
      <div className="tarjeta">
        <p>Usuario: <strong>{usuario.usuario}</strong></p>
        <p>Nombre: {usuario.nombre}</p>
        <p>Rol: {usuario.rol}</p>
      </div>

      <h2>Cambiar contraseña</h2>
      <form onSubmit={guardar}>
        <input type="password" placeholder="Contraseña actual" value={actual} onChange={(e) => setActual(e.target.value)} />
        <input type="password" placeholder="Nueva contraseña" value={nueva} onChange={(e) => setNueva(e.target.value)} />
        <input type="password" placeholder="Confirmar nueva contraseña" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} />
        <button type="submit">Guardar contraseña</button>
      </form>
      <ul className="reglas">
        {REGLAS_CONTRASENA.map((r) => (
          <li key={r.texto} className={nueva !== "" && r.cumple(nueva) ? "ok" : ""}>
            {nueva !== "" && r.cumple(nueva) ? "✓ " : "• "}
            {r.texto}
          </li>
        ))}
      </ul>
      <Errores lista={errores} />
      <Exito texto={exito} />
    </div>
  );
}

export default Cuenta;
