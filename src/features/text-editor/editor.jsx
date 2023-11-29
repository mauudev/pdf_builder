import React, { useEffect } from 'react';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import DOMPurify from 'dompurify';
import { Editor } from 'react-draft-wysiwyg';
import { styles } from './editor.styles';
import PreviewModal from '../ui/modal/preview-modal';
import { capitalizeFirstLetter } from '../../utils/helpers';
import PDFBuilder from '../pdf-builder/pdf-builder';
import { useEditor } from './contexts/editor-context';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Logger from '../pdf-builder/logger';

const WYSIWYGEditor = () => {
  const { editorState, dispatch } = useEditor();
  const pdfBuilder = new PDFBuilder(editorState.editor.rawContent.blocks);

  useEffect(() => {
    Logger.debug(`Blocks: ${JSON.stringify(convertToRaw(editorState.editor.state.getCurrentContent()))}`);
  }, [editorState.editor.state]);

  const onEditorStateChange = (newEditorState) => {
    dispatch({
      type: 'SET_EDITOR_STATE',
      payload: {
        editorState: newEditorState,
        convertedContent: draftToHtml(convertToRaw(newEditorState.getCurrentContent())),
        rawContent: convertToRaw(newEditorState.getCurrentContent()),
      },
    });
  };

  const handleChangePageSize = (size) => {
    dispatch({ type: 'CHANGE_PAGE_SIZE', payload: size });
  };

  const handleChangeLineHeight = (spacing) => {
    dispatch({
      type: 'CHANGE_LINE_HEIGHT',
      payload: spacing,
    });
  };

  const handleChangeMargin = (margin, value) => {
    dispatch({
      type: 'CHANGE_MARGIN',
      payload: { margin, value },
    });
  };

  const createMarkup = (html) => ({
    __html: DOMPurify.sanitize(html),
  });

  const buildPdfPreview = () => {
    const { pageSize, fontSize, lineHeight, margin } = editorState.styles;
    const pdfStyles = {
      pageSize,
      fontSize,
      lineHeight: parsePointValue(lineHeight),
      margin,
    };
    return pdfBuilder.PDFPreview(pdfStyles, styles.modalPreview);
  };

  const parsePointValue = (value) => {
    const numericChars = [...value].filter((char) => !isNaN(char) || char === '.');
    return parseFloat(numericChars.join(''));
  };

  return (
    <div style={styles.editorLayout}>
      <div style={styles.wrapper}>
        <Editor
          editorState={editorState.editor.state}
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
            <select
              id="page-size"
              value={editorState.styles.pageSize}
              onChange={(e) => handleChangePageSize(e.target.value)}
            >
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
                value={parsePointValue(editorState.styles.margin[marginKey])}
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
              value={parsePointValue(editorState.styles.lineHeight)}
              onChange={(e) => handleChangeLineHeight(e.target.value)}
            />
          </div>
        </div>
      </div>
      {/* <TableModal isOpen={isTableModalOpen} onClose={() => setTableModalOpen(false)} onSave={handleSaveTable} /> */}
      <PreviewModal pdfPreview={buildPdfPreview()} />
      <div style={styles.livePreview}>
        <div style={editorState.styles.pageSize === 'LETTER' ? styles.cartaPreview : styles.oficioPreview}>
          <div
            style={{
              ...styles.content,
              '--font-size': `${editorState.styles.fontSize}`,
              '--line-spacing': `${editorState.styles.lineHeight}`,
              '--margin-left': `${editorState.styles.margin.marginLeft}`,
              '--margin-right': `${editorState.styles.margin.marginRight}`,
              '--margin-top': `${editorState.styles.margin.marginTop}`,
              '--margin-bottom': `${editorState.styles.margin.marginBottom}`,
            }}
            dangerouslySetInnerHTML={createMarkup(editorState.editor.convertedContent)}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default WYSIWYGEditor;
