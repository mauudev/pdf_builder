import React, { useEffect, useState } from 'react';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import Grid from '@mui/material/Grid';
import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { styles } from './editor.styles';
import { PDFPreviewOption, PreviewModal } from '../ui/editor-custom-options/pdf-doc-preview';
import { parsePointValue } from '../../utils/helpers';
import { entityMapper, customBlockRenderFunc, insertAtomicBlock } from '../../utils/editor.utils';
import PDFBuilder from '../pdf-builder/pdf-builder';
import { useEditor } from './contexts/editor-context';
import PDFViewer from './pdf-live-preview';
import { TableModal, AddTableOption } from '../ui/editor-custom-options/add-table';
import { PageOptionsModal, PageOptions } from '../ui/editor-custom-options/page-options';
import { BuildStateModal, BuildState } from '../ui/editor-custom-options/build-state';
import { CustomSearchModal, CustomSearch } from '../ui/editor-custom-options/custom-search';
import Logger from '../pdf-builder/logger';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

library.add(far, fas, fab);

const toolbarOptions = {
  options: [
    'inline',
    'list',
    'textAlign',
    'blockType',
    'fontSize',
    'colorPicker',
    'history',
    'remove',
    'fontFamily',
  ],
  inline: {
    options: ['bold', 'italic', 'underline', 'strikethrough'],
    bold: { className: 'rich-text-icon' },
    italic: { className: 'rich-text-icon' },
    underline: { className: 'rich-text-icon' },
    strikethrough: { className: 'rich-text-icon' },
  },
  list: {
    options: ['unordered', 'ordered'],
    unordered: { className: 'rich-text-icon' },
    ordered: { className: 'rich-text-icon' },
  },
  textAlign: {
    options: ['left', 'center', 'right', 'justify'],
    left: { className: 'rich-text-icon' },
    center: { className: 'rich-text-icon' },
    right: { className: 'rich-text-icon' },
    justify: { className: 'rich-text-icon' },
  },
  blockType: {
    options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BlockType'],
    Normal: { className: 'rich-text-icon' },
    H1: { className: 'rich-text-icon' },
    H2: { className: 'rich-text-icon' },
    H3: { className: 'rich-text-icon' },
    H4: { className: 'rich-text-icon' },
    H5: { className: 'rich-text-icon' },
    H6: { className: 'rich-text-icon' },
    BlockType: { className: 'rich-text-icon' },
  },
  fontSize: {
    options: ['8', '10', '12', '14', '16', '18', '20', '24', '30', '36', '48', '60', '72'],
    8: { className: 'rich-text-icon' },
    10: { className: 'rich-text-icon' },
    12: { className: 'rich-text-icon' },
    14: { className: 'rich-text-icon' },
    16: { className: 'rich-text-icon' },
    18: { className: 'rich-text-icon' },
    20: { className: 'rich-text-icon' },
    24: { className: 'rich-text-icon' },
    30: { className: 'rich-text-icon' },
    36: { className: 'rich-text-icon' },
    48: { className: 'rich-text-icon' },
    60: { className: 'rich-text-icon' },
    72: { className: 'rich-text-icon' },
  },
  colorPicker: { options: ['inline', 'block'] },
  history: { options: ['undo', 'redo'] },
  remove: { className: 'rich-text-icon' },
  fontFamily: { options: ['Arial', 'Georgia', 'Times New Roman', 'Helvetica'] },
};

const WYSIWYGEditor = () => {
  const { editorState, dispatch } = useEditor();
  const [documentURL, setDocumentURL] = useState('');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isPageOptionsOpen, setIsPageOptionsOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isBuildStateOpen, setIsBuildStateOpen] = useState(false);
  const [isCustomSearchOpen, setIsCustomSearchOpen] = useState(false);
  const pdfBuilder = new PDFBuilder();

  // eslint-disable-next-line
  useEffect(() => {
    // Logger.debug(`Blocks: ${JSON.stringify(editorState.editor.rawContent.blocks)}`);
    Logger.debug(`Raw: ${JSON.stringify(editorState.editor.rawContent)}`);
    // Logger.debug(`Converted: ${JSON.stringify(editorState.editor.convertedContent)}`);
    // Logger.debug(`PDF Content: ${JSON.stringify(editorState.editor.pdfContent)}`);
    // Logger.debug(`PDF doc URL: ${JSON.stringify(documentURL)}`);
    // Logger.debug(`State: ${JSON.stringify(editorState.editor.state)}`);
  }, [editorState.editor.state]);

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
    setPdfContent();
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
    setIsPreviewModalOpen(true);
  };

  const handlePreviewModalClose = () => {
    setIsPreviewModalOpen(false);
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

  const handleBuildStateOptionsOpen = () => {
    setIsBuildStateOpen(true);
  };

  const handleBuildStateOptionsClose = () => {
    setIsBuildStateOpen(false);
  };

  const handleCustomSearchOptionsOpen = () => {
    setIsCustomSearchOpen(true);
  };

  const handleCustomSearchOptionsClose = () => {
    setIsCustomSearchOpen(false);
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
    <Grid sx={styles.editorLayout} container rowSpacing={2} columnSpacing={{ xs: 2, sm: 3, md: 5 }}>
      <Grid sx={{ height: '95%' }} item xs={12} md={5}>
        <Editor
          editorState={editorState.editor.state}
          toolbarStyle={styles.editorToolbar}
          editorStyle={styles.editor}
          wrapperStyle={styles.editorWrapper}
          onEditorStateChange={onEditorStateChange}
          customBlockRenderFunc={customBlockRenderFunc}
          toolbar={toolbarOptions}
          toolbarCustomButtons={[
            <PageOptions handleOpen={handlePageOptionsOpen} />,
            <AddTableOption handleOpen={handleTableModalOpen} />,
            <PDFPreviewOption handleOpen={handlePreviewModalOpen} />,
            <BuildState handleOpen={handleBuildStateOptionsOpen} />,
            <CustomSearch handleOpen={handleCustomSearchOptionsOpen} />,
          ]}
        />
      </Grid>
      <Grid sx={{ height: '95%', alignItems: 'center' }} item xs={12} md={6}>
        <PDFViewer
          value={editorState.editor.pdfContent}
          onDocumentUrlChange={setDocumentURL}
          onRenderError={handleRenderError}
        />
      </Grid>
      <PageOptionsModal isOpen={isPageOptionsOpen} onClose={handlePageOptionsClose} />
      <TableModal isOpen={isTableModalOpen} onClose={handleTableModalClose} onSave={handleSaveTable} />
      <BuildStateModal isOpen={isBuildStateOpen} onClose={handleBuildStateOptionsClose} />
      <CustomSearchModal isOpen={isCustomSearchOpen} onClose={handleCustomSearchOptionsClose} />
      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={handlePreviewModalClose}
        pdfPreview={editorState.editor.pdfPreview}
      />
    </Grid>
  );
};

export default WYSIWYGEditor;
