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
  const [lineSpacing, setLineSpacing] = useState(5.0);
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

  const handleLineSpacingChange = (value) => {
    setLineSpacing(parseFloat(value));
  };

  const createMarkup = (html) => ({
    __html: DOMPurify.sanitize(html),
  });

  return (
    <div className="editor-layout">
      <div className="wrapper">
        <Editor
          editorState={editorState}
          wrapperClassName="wrapper-class"
          editorClassName="editor-class"
          toolbarClassName="toolbar-class"
          onEditorStateChange={onEditorStateChange}
        />
        <label htmlFor="page-size">Selecciona el tamaño de la página:</label>
        <select
          id="page-size"
          value={pageSize}
          onChange={(e) => handleChangePageSize(e.target.value)}
        >
          <option value="carta">Carta</option>
          <option value="oficio">Oficio</option>
        </select>

        {["top", "left", "right", "bottom"].map((marginKey) => (
          <div key={marginKey}>
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
        <label htmlFor="line-spacing">Espaciado entre lineas (mm):</label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="10"
          value={lineSpacing}
          onChange={(e) => handleLineSpacingChange(e.target.value)}
        />
      </div>
      <div className="preview-container">
        <div className={`preview ${pageSize}`}>
          <div
            className="content"
            style={{
              "--font-size": `${fontSize}px`,
              "--line-spacing": `${lineSpacing}mm`,
              "--margin-left": `${marginValues.left}mm`,
              "--margin-right": `${marginValues.right}mm`,
              "--margin-top": `${marginValues.top}mm`,
              "--margin-bottom": `${marginValues.bottom}mm`,
            }}
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
