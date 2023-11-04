import React, { useState } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./editor.css";

const WYSIWYGEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [pageSize, setPageSize] = useState("carta");
  const [fontSize, setFontSize] = useState(12);
  const [margin, setMargin] = useState(20);

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  const changePageSize = (size) => {
    setPageSize(size);
    if (size === "carta") {
      setFontSize(12);
    } else if (size === "oficio") {
      setFontSize(14);
    }
  };

  const changeMargin = (newMargin) => {
    setMargin(parseInt(newMargin)); // Convertir a número y establecerlo en el estado
  };

  const pageStyles = {
    width: pageSize === "carta" ? "210mm" : "216mm",
    height: pageSize === "carta" ? "297mm" : "356mm",
    backgroundColor: "white",
    padding: `${margin}px`, // Usar el valor de margen del estado
    border: "1px solid #000",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  };

  const editorContent = convertToRaw(editorState.getCurrentContent());

  return (
    <div className="editor-container">
      <div className="editor">
        <Editor
          editorState={editorState}
          wrapperClassName="wrapper-class"
          editorClassName="editor-class"
          toolbarClassName="toolbar-class"
          onEditorStateChange={onEditorStateChange}
        />
      </div>
      <div id="size-selector">
        <label htmlFor="page-size">Selecciona el tamaño de la página:</label>
        <select
          id="page-size"
          value={pageSize}
          onChange={(e) => changePageSize(e.target.value)}
        >
          <option value="carta">Carta</option>
          <option value="oficio">Oficio</option>
        </select>
      </div>
      <div id="margin-selector">
        <label htmlFor="page-margin">Configura el margen:</label>
        <input
          type="number"
          id="page-margin"
          value={margin}
          onChange={(e) => changeMargin(e.target.value)}
        />
      </div>
      <div style={pageStyles}>
        <div
          style={{
            fontSize: `${fontSize}px`,
            width: "100%",
            textAlign: "left",
            padding: "1rem",
          }}
        >
          {editorContent.blocks.map((block) => block.text).join("\n")}
        </div>
      </div>
    </div>
  );
};

export default WYSIWYGEditor;
