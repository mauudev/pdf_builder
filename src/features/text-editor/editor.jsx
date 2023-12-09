import React, { useEffect, useState } from 'react';
import { convertToRaw, ContentState, EditorState, AtomicBlockUtils, Modifier, genKey } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import DOMPurify from 'dompurify';
import { v4 as uuidv4 } from 'uuid';
import { Editor } from 'react-draft-wysiwyg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-free';
import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { styles } from './editor.styles';
import PreviewModal from '../ui/modal/preview-modal';
import { capitalizeFirstLetter, parsePointValue } from '../../utils/helpers';
import PDFBuilder from '../pdf-builder/pdf-builder';
import { useEditor } from './contexts/editor-context';
import TableModal from '../ui/modal/table-modal';
import Logger from '../pdf-builder/logger';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

library.add(far, fas, fab);

function entityMapper(entity) {
  if (entity.type === 'DIV') {
    return `<div>${entity.data.innerHTML}</div>`;
  }
  if (entity.type === 'TABLE') {
    return `<table>${entity.data.innerHTML}</table>`;
  }
  if (entity.type === 'TBODY') {
    return `<tbody>${entity.data.innerHTML}</tbody>`;
  }
  if (entity.type === 'TR') {
    return `<tr>${entity.data.innerHTML}</tr>`;
  }
  if (entity.type === 'TH') {
    return `<th>${entity.data.innerHTML}</th>`;
  }
  if (entity.type === 'TD') {
    return `<td>${entity.data.innerHTML}</td>`;
  }
  if (entity.type === 'STYLE') {
    return `<style>${entity.data.innerHTML}</style>`;
  }
  return '';
}

function entityMapperToComponent(entity) {
  if (entity.type === 'DIV') {
    return () => <div dangerouslySetInnerHTML={{ __html: entity.data.innerHTML }} />;
  }
  if (entity.type === 'TABLE') {
    return () => <table dangerouslySetInnerHTML={{ __html: entity.data.innerHTML }} />;
  }
  if (entity.type === 'TBODY') {
    return <tbody dangerouslySetInnerHTML={{ __html: entity.data.innerHTML }} />;
  }
  if (entity.type === 'TR') {
    return () => <tr dangerouslySetInnerHTML={{ __html: entity.data.innerHTML }} />;
  }
  if (entity.type === 'TH') {
    return () => <th dangerouslySetInnerHTML={{ __html: entity.data.innerHTML }} />;
  }
  if (entity.type === 'TD') {
    return () => <td dangerouslySetInnerHTML={{ __html: entity.data.innerHTML }} />;
  }
  if (entity.type === 'STYLE') {
    return () => <style>{entity.data.innerHTML}</style>;
  }
  return '';
}

function customBlockRenderFunc(block, config) {
  if (block.getType() === 'atomic') {
    const contentState = config.getEditorState().getCurrentContent();
    const entityKey = block.getEntityAt(0);
    const entity = contentState.getEntity(entityKey);
    return {
      component: entityMapperToComponent(entity),
      editable: false,
      props: {
        children: () => entity.innerHTML,
      },
    };
  }
}
const WYSIWYGEditor = () => {
  const { editorState, dispatch } = useEditor();
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  useEffect(() => {
    Logger.debug(`Blocks: ${JSON.stringify(editorState.editor.rawContent.blocks)}`);
    Logger.debug(`Raw: ${JSON.stringify(editorState.editor.rawContent)}`);
    Logger.debug(`Converted: ${JSON.stringify(editorState.editor.convertedContent)}`);
  }, [editorState.editor.state]);

  const onEditorStateChange = (newEditorState) => {
    dispatch({
      type: 'SET_EDITOR_STATE',
      payload: {
        editorState: newEditorState,
        convertedContent: draftToHtml(convertToRaw(newEditorState.getCurrentContent()), null, false, entityMapper),
        rawContent: convertToRaw(newEditorState.getCurrentContent()),
      },
    });
  };

  const setPDFContent = (content) => {
    dispatch({
      type: 'SET_PDF_CONTENT',
      payload: content,
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

  const createMarkup = (html) => {
    const formattedHtml = html;
    return { __html: formattedHtml };
  };

  const buildPdfPreview = () => {
    const { pageSize, fontSize, lineHeight, margin } = editorState.pageStyles;
    const pdfStyles = {
      pageSize,
      fontSize,
      lineHeight: parsePointValue(lineHeight),
      margin,
    };
    const pdfBuilder = new PDFBuilder();
    pdfBuilder.buildPDFBlocks(editorState.editor.rawContent);
    const pdfContent = pdfBuilder.PDFPreview(pdfStyles, styles.modalPreview);
    setPDFContent(pdfContent);
  };

  const handleTableModalClose = () => {
    setIsTableModalOpen(false);
  };

  const handleTableModalOpen = () => {
    setIsTableModalOpen(true);
  };

  const handlePreviewModalOpen = () => {
    buildPdfPreview();
    setIsPreviewModalOpen(true);
  };

  const handlePreviewModalClose = () => {
    setIsPreviewModalOpen(false);
  };

  const insertAtomicBlock = (targetEditorState, entityType, mutability, tableData) => {
    if (tableData && tableData.html && tableData.tableCells) {
      const entityKey = targetEditorState
      .getCurrentContent()
      .createEntity(entityType, mutability, {
        rows: tableData.rows,
        columns: tableData.columns,
        tableCells: tableData.tableCells,
        styles: tableData.styles,
        innerHTML: tableData.html,
      })
      .getLastCreatedEntityKey();
      const character = ' ';
      const movedSelection = EditorState.moveSelectionToEnd(targetEditorState);
      return AtomicBlockUtils.insertAtomicBlock(movedSelection, entityKey, character);
    }
  };

  const handleSaveTable = (tableData) => {
    const currentEditorState = editorState.editor.state;
    const newEditorState = insertAtomicBlock(currentEditorState, 'TABLE', 'IMMUTABLE', tableData);
    onEditorStateChange(newEditorState);
  };

  const AddTableOption = () => (
    <div className="rdw-option-wrapper" onClick={handleTableModalOpen}>
      <FontAwesomeIcon title="Add Table" icon="fa-solid fa-table" />
    </div>
  );

  const PDFPreviewOption = () => (
    <div className="rdw-option-wrapper" onClick={handlePreviewModalOpen}>
      <FontAwesomeIcon icon="fa-regular fa-file-pdf" />
    </div>
  );

  return (
    <div style={styles.editorLayout}>
      <div style={styles.wrapper}>
        <Editor
          editorState={editorState.editor.state}
          toolbarClassName="toolbar-class"
          wrapperClassName="wrapper-class"
          editorClassName="editor-class"
          onEditorStateChange={onEditorStateChange}
          customBlockRenderFunc={customBlockRenderFunc}
          toolbar={{
            options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'history', 'remove', 'colorPicker'],
          }}
          toolbarCustomButtons={[<AddTableOption />, <PDFPreviewOption />]}
        />
        <div style={styles.gridContainer}>
          <div style={styles.gridItem}>
            <label htmlFor="page-size">Tamanio de pagina:</label>
            <select
              id="page-size"
              value={editorState.pageStyles.pageSize}
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
                value={parsePointValue(editorState.pageStyles.margin[marginKey])}
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
              value={parsePointValue(editorState.pageStyles.lineHeight)}
              onChange={(e) => handleChangeLineHeight(e.target.value)}
            />
          </div>
        </div>
      </div>
      <TableModal isOpen={isTableModalOpen} onClose={handleTableModalClose} onSave={handleSaveTable} />
      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={handlePreviewModalClose}
        pdfPreview={editorState.editor.pdfContent}
      />
      <div style={styles.livePreview}>
        <div style={editorState.pageStyles.pageSize === 'LETTER' ? styles.cartaPreview : styles.oficioPreview}>
          <div
            style={{
              ...styles.content,
              '--font-size': `${editorState.pageStyles.fontSize}`,
              '--line-spacing': `${editorState.pageStyles.lineHeight}`,
              '--margin-left': `${editorState.pageStyles.margin.marginLeft}`,
              '--margin-right': `${editorState.pageStyles.margin.marginRight}`,
              '--margin-top': `${editorState.pageStyles.margin.marginTop}`,
              '--margin-bottom': `${editorState.pageStyles.margin.marginBottom}`,
            }}
            dangerouslySetInnerHTML={createMarkup(editorState.editor.convertedContent)}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default WYSIWYGEditor;
