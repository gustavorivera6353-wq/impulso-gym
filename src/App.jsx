import React, { useState } from "react";
import Login from "./components/Login";
import Socios from "./components/Socios";

function App() {
  const [usuario, setUsuario] = useState(null);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {!usuario ? (
        <Login onLogin={setUsuario} />
      ) : (
        <>
          <h2>Bienvenido, {usuario}</h2>
          <Socios />
        </>
      )}
    </div>
  );
}

export default App;
