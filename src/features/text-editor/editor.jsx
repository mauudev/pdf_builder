import React, { useEffect, useState } from 'react';
import { convertToRaw, EditorState, AtomicBlockUtils } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { styles, eStyles } from './editor.styles';
import { PDFPreviewOption, PreviewModal } from '../ui/editor-custom-options/pdf-doc-preview';
import { parsePointValue } from '../../utils/helpers';
import PDFBuilder from '../pdf-builder/pdf-builder';
import { useEditor } from './contexts/editor-context';
import PDFViewer from './pdf-live-preview';
import { TableModal, AddTableOption } from '../ui/editor-custom-options/add-table';
import Logger from '../pdf-builder/logger';
import { PageOptionsModal, PageOptions } from '../ui/editor-custom-options/page-options';

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
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [documentURL, setDocumentURL] = useState('');
  const [isPageOptionsOpen, setIsPageOptionsOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const pdfBuilder = new PDFBuilder();

  useEffect(() => {
    Logger.debug(`Blocks: ${JSON.stringify(editorState.editor.rawContent.blocks)}`);
    Logger.debug(`Raw: ${JSON.stringify(editorState.editor.rawContent)}`);
    Logger.debug(`Converted: ${JSON.stringify(editorState.editor.convertedContent)}`);
    Logger.debug(`PDF Content: ${JSON.stringify(editorState.editor.pdfContent)}`);
  }, [editorState.editor.state, editorState.editor.pdfContent]);

  const onEditorStateChange = (newEditorState) => {
    dispatch({
      type: 'SET_EDITOR_STATE',
      payload: {
        editorState: newEditorState,
        convertedContent: draftToHtml(
          convertToRaw(newEditorState.getCurrentContent()),
          null,
          false,
          entityMapper
        ),
        rawContent: convertToRaw(newEditorState.getCurrentContent()),
      },
    });
  };

  const setPdfContent = () => {
    const { pdfContent, pdfPreview } = buildPdfContent();
    dispatch({
      type: 'SET_PDF_CONTENT',
      payload: { pdfContent, pdfPreview },
    });
  };

  const handleTableModalClose = () => {
    setIsTableModalOpen(false);
  };

  const handleTableModalOpen = () => {
    setIsTableModalOpen(true);
  };

  const handleSaveTable = (tableData) => {
    const currentEditorState = editorState.editor.state;
    const newEditorState = insertAtomicBlock(currentEditorState, 'TABLE', 'IMMUTABLE', tableData);
    onEditorStateChange(newEditorState);
  };

  const handlePreviewModalOpen = () => {
    setPdfContent();
    setIsPreviewModalOpen(true);
  };

  const handlePreviewModalClose = () => {
    setIsPreviewModalOpen(false);
  };

  const handleUrlChange = () => {
    setDocumentURL('something');
  };

  const handleRenderError = (error) => {
    if (error) {
      Logger.error(error);
    }
  };

  const handlePageOptionsClose = () => {
    setIsPageOptionsOpen(false);
  };

  const handlePageOptionsOpen = () => {
    setIsPageOptionsOpen(true);
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

  const createMarkup = (html) => {
    const formattedHtml = html;
    return { __html: formattedHtml };
  };

  const buildPdfContent = () => {
    const { pageSize, fontSize, lineHeight, margin } = editorState.pageStyles;
    const pdfStyles = {
      pageSize,
      fontSize,
      lineHeight: parsePointValue(lineHeight),
      margin,
    };
    pdfBuilder.buildPdfContent(editorState.editor.rawContent, pdfStyles);
    return {
      pdfContent: pdfBuilder.getPdfContent(),
      pdfPreview: pdfBuilder.buildPdfPreview(styles.modalPreview),
    };
  };
  
  return (
    <Grid sx={styles.editorLayout} container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid sx={{ height: '90%' }} item xs={12} md={6}>
        <Editor
          editorState={editorState.editor.state}
          toolbarStyle={styles.toolbar}
          editorStyle={styles.editor}
          wrapperStyle={styles.wrapper}
          onEditorStateChange={onEditorStateChange}
          customBlockRenderFunc={customBlockRenderFunc}
          toolbar={{
            options: [
              'inline',
              'blockType',
              'fontSize',
              'list',
              'textAlign',
              'history',
              'remove',
              'colorPicker',
            ],
          }}
          toolbarCustomButtons={[
            <PageOptions handleOpen={handlePageOptionsOpen} />,
            <AddTableOption handleOpen={handleTableModalOpen} />,
            <PDFPreviewOption handleOpen={handlePreviewModalOpen} />,
          ]}
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <PageOptionsModal isOpen={isPageOptionsOpen} onClose={handlePageOptionsClose} />
        <TableModal isOpen={isTableModalOpen} onClose={handleTableModalClose} onSave={handleSaveTable} />
        <PreviewModal
          isOpen={isPreviewModalOpen}
          onClose={handlePreviewModalClose}
          pdfPreview={editorState.editor.pdfPreview}
        />
      </Grid>
    </Grid>
  );
};

export default WYSIWYGEditor;
