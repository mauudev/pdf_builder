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
  const [marginTop, setMarginTop] = useState(20);
  const [marginLeft, setMarginLeft] = useState(20);
  const [marginRight, setMarginRight] = useState(20);
  const [marginBottom, setMarginBottom] = useState(20);

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

  const changeMarginTop = (newMargin) => {
    setMarginTop(parseInt(newMargin));
  };
  const changeMarginLeft = (newMargin) => {
    setMarginLeft(parseInt(newMargin));
  };
  const changeMarginRight = (newMargin) => {
    setMarginRight(parseInt(newMargin));
  };
  const changeMarginBottom = (newMargin) => {
    setMarginBottom(parseInt(newMargin));
  };

  const pageStyles = {
    width: pageSize === "carta" ? "210mm" : "216mm",
    height: pageSize === "carta" ? "297mm" : "356mm",
    backgroundColor: "white",
    border: "1px solid #000",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  };

  const contentStyles = {
    fontSize: `${fontSize}px`,
    width: `calc(100% - ${marginLeft + marginRight}px)`,
    marginLeft: `${marginLeft}px`,
    marginRight: `${marginRight}px`,
    marginTop: `${marginTop}px`,
    marginBottom: `${marginBottom}px`,
    textAlign: "left",
    overflowWrap: "break-word",
    border: "5px solid #000",
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
        <div className="margin-top">
          <label htmlFor="page-margin_top">Arriba:</label>
          <input
            type="number"
            id="page-margin_top"
            value={marginTop}
            onChange={(e) => changeMarginTop(e.target.value)}
          />
        </div>
        <div className="margin-left">
          <label htmlFor="page-margin_left">Izquierda:</label>
          <input
            type="number"
            id="page-margin_left"
            value={marginLeft}
            onChange={(e) => changeMarginLeft(e.target.value)}
          />
        </div>
        <div className="margin-right">
          <label htmlFor="page-margin_right">Derecha:</label>
          <input
            type="number"
            id="page-margin_right"
            value={marginRight}
            onChange={(e) => changeMarginRight(e.target.value)}
          />
        </div>
        <div className="margin-bottom">
          <label htmlFor="page-margin_bottom">Abajo:</label>
          <input
            type="number"
            id="page-margin_bottom"
            value={marginBottom}
            onChange={(e) => changeMarginBottom(e.target.value)}
          />
        </div>
      </div>
      <div className="preview">
        <div style={pageStyles}>
          <div style={contentStyles}>
            {editorContent.blocks.map((block) => block.text).join("\n")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WYSIWYGEditor;
