import React, { useState } from "react";
import Login from "./components/Login";

function App() {
  const [usuario, setUsuario] = useState(null);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {!usuario ? (
        <Login onLogin={setUsuario} />
      ) : (
        <>
          <h2>Bienvenido, {usuario}</h2>
        </>
      )}
    </div>
  );
}

export default App;
