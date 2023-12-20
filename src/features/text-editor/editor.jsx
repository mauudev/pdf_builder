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
import Logger from '../pdf-builder/logger';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

library.add(far, fas, fab);

const WYSIWYGEditor = () => {
  const { editorState, dispatch } = useEditor();
  const [documentURL, setDocumentURL] = useState('');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isPageOptionsOpen, setIsPageOptionsOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isBuildStateOpen, setIsBuildStateOpen] = useState(false);
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
            <BuildState handleOpen={handleBuildStateOptionsOpen} />,
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
      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={handlePreviewModalClose}
        pdfPreview={editorState.editor.pdfPreview}
      />
    </Grid>
  );
};

export default WYSIWYGEditor;
