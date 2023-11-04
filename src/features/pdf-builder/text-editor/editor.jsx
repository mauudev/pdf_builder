import React, { Component } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
// import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import htmlToDraft from "html-to-draftjs";
import RichText from "../content/rich-text";
import { Text, Link, View, StyleSheet } from "@react-pdf/renderer";
import redraft from "redraft";

const addBreaklines = (children) => children.map((child) => [child, <br />]);
const WYSIWYGEditor = () => {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );
  const [rawContent, setRawContent] = React.useState(null);
  const [pageSize, setPageSize] = React.useState("carta");

  const onEditorStateChange = (editorState) => {
    setRawContent(convertToRaw(editorState.getCurrentContent()));
    setEditorState(editorState);
  };

  const changePageSize = (size) => {
    setPageSize(size);
  };

  const pageStyles = {
    width: pageSize === "carta" ? "210mm" : "216mm",
    height: pageSize === "carta" ? "297mm" : "356mm",
    backgroundColor: "white",
    margin: "20px",
    border: "1px solid #000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div className="editor-container">
      <div className="editor">
        <Editor
          // toolbar={options}
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
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
      <div style={pageStyles}>
        <p>Contenido de la página</p>
      </div>
    </div>
  );
};

export default WYSIWYGEditor;
