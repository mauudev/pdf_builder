import React, { useState, useEffect, useReducer } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import DOMPurify from 'dompurify';
import { Editor } from 'react-draft-wysiwyg';
import { styles } from './editor.styles';
import PreviewModal from '../ui/modal/preview-modal';
import { capitalizeFirstLetter } from '../../utils/helpers';
import PDFBuilder from '../pdf-builder/pdf-builder';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Logger from '../pdf-builder/logger';

const initialState = {
  pageSize: 'LETTER',
  fontSize: 14.0,
  lineHeight: '1.5pt',
  margin: {
    marginTop: '20.0pt',
    marginLeft: '20.0pt',
    marginRight: '20.0pt',
    marginBottom: '20.0pt',
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE_PAGE_SIZE':
      return { ...state, pageSize: action.payload };
    case 'CHANGE_LINE_HEIGHT':
      return { ...state, lineHeight: `${parseFloat(action.payload)}pt` };
    case 'CHANGE_MARGIN':
      return {
        ...state,
        margin: {
          ...state.margin,
          [action.payload.margin]: `${parseFloat(action.payload.value)}pt`,
        },
      };
    default:
      return state;
  }
};
const WYSIWYGEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [convertedContent, setConvertedContent] = useState(null);
  const [rawContent, setRawContent] = useState({});
  const [pageStyles, dispatch] = useReducer(reducer, initialState);
  const pdfBuilder = new PDFBuilder(rawContent.blocks);

  useEffect(() => {
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setConvertedContent(html);
    setRawContent(convertToRaw(editorState.getCurrentContent()));
    console.log(`Blocks: ${JSON.stringify(convertToRaw(editorState.getCurrentContent()))}`);
  }, [editorState]);

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  const handleChangePageSize = (size) => {
    dispatch({ type: 'CHANGE_PAGE_SIZE', payload: size });
  };

  const handleChangeLineHeight = (spacing) => {
    dispatch({ type: 'CHANGE_LINE_HEIGHT', payload: spacing });
  };

  const handleChangeMargin = (margin, value) => {
    dispatch({ type: 'CHANGE_MARGIN', payload: { margin, value } });
  };

  const createMarkup = (html) => ({
    __html: DOMPurify.sanitize(html),
  });

  const buildPdfPreview = () => {
    const { pageSize, fontSize, lineHeight, margin } = pageStyles;
    const pdfStyles = {
      pageSize,
      fontSize,
      lineHeight,
      margin,
    };
    Logger.error(`Styles on editor: ${JSON.stringify(pdfStyles)}`);
    return pdfBuilder.PDFPreview(pdfStyles, styles.modalPreview);
  };

  const parsePointValue = (value) => {
    return parseFloat(value.replace('pt', ''));
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
            options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'history', 'remove', 'colorPicker'],
          }}
        />
        <div style={styles.gridContainer}>
          <div style={styles.gridItem}>
            <label htmlFor="page-size">Tamanio de pagina:</label>
            <select id="page-size" value={pageStyles.pageSize} onChange={(e) => handleChangePageSize(e.target.value)}>
              <option value="LETTER">Carta</option>
              <option value="A4">Oficio</option>
            </select>
          </div>
          {['marginTop', 'marginLeft', 'marginRight', 'marginBottom'].map((marginKey) => (
            <div key={`_${marginKey}`} style={styles.gridItem}>
              <label htmlFor={`page-margin_${marginKey}`}>{capitalizeFirstLetter(marginKey)}:</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={parsePointValue(pageStyles.margin[marginKey])}
                onChange={(e) => handleChangeMargin(marginKey, e.target.value)}
              />
            </div>
          ))}
          <div style={styles.gridItem}>
            <label htmlFor="line-spacing">Espaciado:</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={parsePointValue(pageStyles.lineHeight)}
              onChange={(e) => handleChangeLineHeight(e.target.value)}
            />
          </div>
        </div>
      </div>
      <PreviewModal pdfPreview={buildPdfPreview()} />
      <div style={styles.livePreview}>
        <div style={pageStyles.pageSize === 'LETTER' ? styles.cartaPreview : styles.oficioPreview}>
          <div
            style={{
              ...styles.content,
              '--font-size': `${pageStyles.fontSize}`,
              '--line-spacing': `${pageStyles.lineHeight}`,
              '--margin-left': `${pageStyles.margin.marginLeft}`,
              '--margin-right': `${pageStyles.margin.marginRight}`,
              '--margin-top': `${pageStyles.margin.marginTop}`,
              '--margin-bottom': `${pageStyles.margin.marginBottom}`,
            }}
            dangerouslySetInnerHTML={createMarkup(convertedContent)}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default WYSIWYGEditor;
