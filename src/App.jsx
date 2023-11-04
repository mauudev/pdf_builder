import React from "react";
import WYSIWYGEditor from "./features/pdf-builder/text-editor/editor";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="app-header">Rich Text Editor</header>
      <div className="app-container">
        <div className="sidebar"></div>
        <div className="editor-container">
          <p style={{ fontSize: "18px", color: "red" }}>HOLA ESTA ES UNA PRUEBA PARA VER SOLAPAMIENTOS DE TEXTO</p>
          {/* <WYSIWYGEditor /> */}
        </div>
      </div>
    </div>
  );
}

export default App;
