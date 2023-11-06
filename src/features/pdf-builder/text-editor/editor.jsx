import React, { useState, useEffect } from "react";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import DOMPurify from "dompurify";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./editor.css";

const WYSIWYGEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [pageSize, setPageSize] = useState("carta");
  const [fontSize, setFontSize] = useState(12);
  const [marginValues, setMarginValues] = useState({
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
  });
  const [convertedContent, setConvertedContent] = useState(null);

  useEffect(() => {
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setConvertedContent(html);
  }, [editorState]);

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  const handleChangePageSize = (size) => {
    setPageSize(size);
    setFontSize(size === "carta" ? 12 : 14);
  };

  const handleMarginChange = (marginKey, value) => {
    setMarginValues((prevValues) => ({
      ...prevValues,
      [marginKey]: parseInt(value),
    }));
  };

  const createMarkup = (html) => ({
    __html: DOMPurify.sanitize(html),
  });

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
    width: `calc(100% - ${marginValues.left + marginValues.right}px)`,
    marginLeft: `${marginValues.left}px`,
    marginRight: `${marginValues.right}px`,
    marginTop: `${marginValues.top}px`,
    marginBottom: `${marginValues.bottom}px`,
    textAlign: "left",
    overflowWrap: "break-word",
  };

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
          onChange={(e) => handleChangePageSize(e.target.value)}
        >
          <option value="carta">Carta</option>
          <option value="oficio">Oficio</option>
        </select>
      </div>
      <div id="margin-selector">
        {["top", "left", "right", "bottom"].map((marginKey) => (
          <div key={marginKey} className={`margin-${marginKey}`}>
            <label htmlFor={`page-margin_${marginKey}`}>
              {capitalizeFirstLetter(marginKey)}:
            </label>
            <input
              type="number"
              id={`page-margin_${marginKey}`}
              value={marginValues[marginKey]}
              onChange={(e) => handleMarginChange(marginKey, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="preview">
        <div style={pageStyles}>
          <div
            style={contentStyles}
            dangerouslySetInnerHTML={createMarkup(convertedContent)}
          ></div>
        </div>
      </div>
    </div>
  );
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default WYSIWYGEditor;
