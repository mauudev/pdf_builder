import React, { useState, useEffect } from "react";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import DOMPurify from "dompurify";
import { Editor } from "react-draft-wysiwyg";
import { styles } from "./editor.styles";
import PreviewModal from "../../ui/modal/preview-modal";
import { capitalizeFirstLetter } from "../../../utils/helpers";
import PDFBuilder from "../../../utils/pdf-drawfter/pdf-builder";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const WYSIWYGEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [convertedContent, setConvertedContent] = useState(null);
  const [rawContent, setRawContent] = useState({});
  const [pageStyles, setPageStyles] = useState({
    pageSize: "LETTER",
    fontSize: 14.0,
    lineHeight: 5.0,
    margin: {
      marginTop: 20.0,
      marginLeft: 20.0,
      marginRight: 20.0,
      marginBottom: 20.0,
    },
  });

  const pdfBuilder = new PDFBuilder(rawContent.blocks, pageStyles);

  useEffect(() => {
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setConvertedContent(html);
    setRawContent(convertToRaw(editorState.getCurrentContent()));
    console.log(
      `Blocks: ${JSON.stringify(convertToRaw(editorState.getCurrentContent()))}`
    );
  }, [editorState]);

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  const handleChangePageSize = (size) => {
    setPageStyles((prevStyles) => ({
      ...prevStyles,
      pageSize: size,
    }));
  };

  const handleChangeLineHeight = (spacing) => {
    setPageStyles((prevStyles) => ({
      ...prevStyles,
      lineHeight: parseFloat(spacing),
    }));
  };

  const handleChangeMargin = (margin, value) => {
    setPageStyles((prevStyles) => ({
      ...prevStyles,
      margin: {
        ...prevStyles.margin,
        [margin]: parseFloat(value),
      },
    }));
  };

  const createMarkup = (html) => ({
    __html: DOMPurify.sanitize(html),
  });

  const buildPdfPreview = () => {
    return pdfBuilder.PDFPreview(pageStyles);
  };

  return (
    <div style={styles.editorLayout}>
      <div style={styles.wrapper}>
        <Editor
          editorState={editorState}
          wrapperClassName="wrapper-class"
          editorClassName="editor-class"
          toolbarClassName="toolbar-class"
          onEditorStateChange={onEditorStateChange}
          toolbar={{
            options: [
              "inline",
              "blockType",
              "fontSize",
              "list",
              "textAlign",
              "history",
              "remove",
              "colorPicker",
            ],
          }}
        />
        <div style={styles.gridContainer}>
          <div style={styles.gridItem}>
            <label htmlFor="page-size">Tamanio de pagina:</label>
            <select
              id="page-size"
              value={pageStyles.pageSize}
              onChange={(e) => handleChangePageSize(e.target.value)}
            >
              <option value="LETTER">Carta</option>
              <option value="A4">Oficio</option>
            </select>
          </div>
          {["marginTop", "marginLeft", "marginRight", "marginBottom"].map(
            (marginKey) => (
              <div key={`_${marginKey}`} style={styles.gridItem}>
                <label htmlFor={`page-margin_${marginKey}`}>
                  {capitalizeFirstLetter(marginKey)}:
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={pageStyles.margin[marginKey]}
                  onChange={(e) =>
                    handleChangeMargin(marginKey, e.target.value)
                  }
                />
              </div>
            )
          )}
          <div style={styles.gridItem}>
            <label htmlFor="line-spacing">Espaciado:</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={pageStyles.lineHeight}
              onChange={(e) => handleChangeLineHeight(e.target.value)}
            />
          </div>
        </div>
      </div>
      <PreviewModal pdfPreview={buildPdfPreview()} />
      <div style={styles.livePreview}>
        <div
          style={
            pageStyles.pageSize === "LETTER"
              ? styles.cartaPreview
              : styles.oficioPreview
          }
        >
          <div
            style={{
              ...styles.content,
              "--font-size": `${pageStyles.fontSize}px`,
              "--line-spacing": `${pageStyles.lineHeight}mm`,
              "--margin-left": `${pageStyles.margin.marginLeft}mm`,
              "--margin-right": `${pageStyles.margin.marginRight}mm`,
              "--margin-top": `${pageStyles.margin.marginTop}mm`,
              "--margin-bottom": `${pageStyles.margin.marginBottom}mm`,
            }}
            dangerouslySetInnerHTML={createMarkup(convertedContent)}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default WYSIWYGEditor;
