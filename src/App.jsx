import React, { useState } from "react";
import Login from "./components/Login";
import Socios from "./components/Socios";
import Membresias from "./components/Membresias";
import Pagos from "./components/Pagos";
import Planes from "./components/Planes";
import Avisos from "./components/Avisos";
import Clases from "./components/Clases";
import Asistencia from "./components/Asistencia";
import Quejas from "./components/Quejas";
import Reportes from "./components/Reportes";
import Cuenta from "./components/Cuenta";
import { validarContrasena } from "./datos";

const TODOS = ["Administrador", "Recepción", "Entrenador", "Socio"];

// Cada sección indica qué roles pueden verla.
const SECCIONES = [
  { id: "socios", titulo: "Socios", roles: ["Administrador", "Recepción"], Componente: Socios },
  { id: "membresias", titulo: "Membresías", roles: ["Administrador", "Recepción", "Socio"], Componente: Membresias },
  { id: "pagos", titulo: "Pagos", roles: ["Administrador", "Recepción"], Componente: Pagos },
  { id: "planes", titulo: "Planes", roles: ["Administrador"], Componente: Planes },
  { id: "avisos", titulo: "Avisos", roles: TODOS, Componente: Avisos },
  { id: "clases", titulo: "Clases", roles: TODOS, Componente: Clases },
  { id: "asistencia", titulo: "Asistencia", roles: ["Administrador", "Entrenador", "Socio"], Componente: Asistencia },
  { id: "quejas", titulo: "Quejas", roles: ["Administrador", "Recepción", "Socio"], Componente: Quejas },
  { id: "reportes", titulo: "Reportes", roles: ["Administrador"], Componente: Reportes },
  { id: "cuenta", titulo: "Mi cuenta", roles: TODOS, Componente: Cuenta },
];

function App() {
  const [usuario, setUsuario] = useState(null);
  const [seccion, setSeccion] = useState("");

  if (!usuario) {
    return (
      <Login
        onLogin={(u) => {
          setUsuario(u);
          setSeccion("");
        }}
      />
    );
  }

  const visibles = SECCIONES.filter((s) => s.roles.includes(usuario.rol));
  const actual = visibles.find((s) => s.id === seccion) || visibles[0];
  const Seccion = actual.Componente;
  const temporal = validarContrasena(usuario.contrasena).length > 0;

  return (
    <div>
      <h2>Bienvenido, {usuario.usuario}</h2>
      <p>Rol: {usuario.rol}</p>
      {temporal && (
        <p className="aviso-info" role="status">
          Tu contraseña es temporal y no cumple las reglas de seguridad. Cámbiala en «Mi cuenta».
        </p>
      )}
      <nav className="tabs">
        {visibles.map((s) => (
          <button
            key={s.id}
            type="button"
            className={"tab" + (s.id === actual.id ? " activa" : "")}
            onClick={() => setSeccion(s.id)}
          >
            {s.titulo}
          </button>
        ))}
        <button type="button" className="tab salir" onClick={() => setUsuario(null)}>
          Cerrar sesión
        </button>
      </nav>
      <Seccion usuario={usuario} onActualizar={setUsuario} />
    </div>
  );
}

export default App;
