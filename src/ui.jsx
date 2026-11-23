import React from "react";

export function Errores({ lista }) {
  return lista.map((mensaje) => (
    <p key={mensaje} role="alert">
      {mensaje}
    </p>
  ));
}

export function Exito({ texto }) {
  return texto ? (
    <p className="exito" role="status">
      {texto}
    </p>
  ) : null;
}

export function Etiqueta({ clase, children }) {
  return <span className={"etiqueta " + clase}>{children}</span>;
}
