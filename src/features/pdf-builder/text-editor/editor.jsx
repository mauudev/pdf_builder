import React, { useState, useEffect } from "react";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import DOMPurify from "dompurify";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { styles } from "./editor.styles";

const WYSIWYGEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [pageSize, setPageSize] = useState("carta");
  const [fontSize, setFontSize] = useState(12);
  const [lineSpacing, setLineSpacing] = useState(5.0);
  const [convertedContent, setConvertedContent] = useState(null);
  const [rawContent, setRawContent] = useState(null);
  const [marginValues, setMarginValues] = useState({
    top: 20.0,
    left: 20.0,
    right: 20.0,
    bottom: 20.0,
  });

  useEffect(() => {
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setConvertedContent(html);
    setRawContent(convertToRaw(editorState.getCurrentContent()));
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
      [marginKey]: parseFloat(value),
    }));
  };

  const handleLineSpacingChange = (value) => {
    setLineSpacing(parseFloat(value));
  };

  const createMarkup = (html) => ({
    __html: DOMPurify.sanitize(html),
  });

  return (
    <div style={styles.editorLayout}>
      <div style={styles.wrapper}>
        <Editor
          editorState={editorState}
          wrapperClassName="wrapper-class"
          editorClassName="editor-class"
          toolbarClassName="toolbar-class"
          onEditorStateChange={onEditorStateChange}
        />
        <div class="grid-container">
          <div class="grid-item">
            <label htmlFor="page-size">Tamanio de pagina:</label>
            <select
              id="page-size"
              value={pageSize}
              onChange={(e) => handleChangePageSize(e.target.value)}
            >
              <option value="carta">Carta</option>
              <option value="oficio">Oficio</option>
            </select>
          </div>
          {["top", "left", "right", "bottom"].map((marginKey) => (
            <div class="grid-item">
              <div key={marginKey}>
                <label htmlFor={`page-margin_${marginKey}`}>
                  {capitalizeFirstLetter(marginKey)}:
                </label>
                <input
                  type="number"
                  value={marginValues[marginKey]}
                  onChange={(e) =>
                    handleMarginChange(marginKey, e.target.value)
                  }
                />
              </div>
            </div>
          ))}
          <div class="grid-item">
            <label htmlFor="line-spacing">Espaciado:</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={lineSpacing}
              onChange={(e) => handleLineSpacingChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div style={styles.livePreview}>
        <div
          style={
            pageSize === "carta" ? styles.cartaPreview : styles.oficioPreview
          }
        >
          <div
            style={{
              ...styles.content,
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
