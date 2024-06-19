import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Stack from '@mui/material/Stack';
import { Document, Page, pdfjs } from 'react-pdf';
import { LoadingSpinner } from '../ui/spinners/loading-spinner';
import { useAsync } from 'react-use';
import { v4 as uuidv4 } from 'uuid';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

const Wrapper = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1em;
  box-sizing: border-box;
  background-color: #00695f;
  border-bottom: 1px solid #000;
`;

const DocumentWrapper = styled.div`
  flex: 1;
  padding: 1em;
  display: flex;
  z-index: 500;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  .react-pdf__Document {
    background-color: #fff;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    padding: 20px;
    box-sizing: border-box;
    &.previous-document {
      canvas {
        opacity: 0.5;
      }
    }

    &.rendering-document {
      position: absolute;
      border: 1px solid #000;

      .react-pdf__Page {
        box-shadow: none;
      }
    }
  }
`;

const Message = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 1000;
  position: absolute;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  transition: all 1s;
  opacity: ${(props) => (props.active ? 1 : 0)};
  pointer-events: ${(props) => (props.active ? 'all' : 'none')};
  flex-direction: column;

  #icon {
    width: 200px;
    height: 200px;
    margin-top: 10px;
  }
`;

const PDFViewer = ({ value, onDocumentUrlChange, onRenderError }) => {
  const CURRENT_PAGE = 1;
  const [previousRenderValue, setPreviousRenderValue] = useState(null);

  const render = useAsync(async () => {
    if (!value) return null;

    const blob = await pdf(value).toBlob();
    const url = URL.createObjectURL(blob);
    return url;
  }, [value]);

  // eslint-disable-next-line
  useEffect(() => {
    onDocumentUrlChange(render.value);
  }, [render.value]);

  // eslint-disable-next-line
  useEffect(() => onRenderError(render.error), [render.error]);

  const onDocumentLoad = (d) => {};

  const isFirstRendering = !previousRenderValue;

  const isLatestValueRendered = previousRenderValue === render.value;
  const isBusy = render.loading || !isLatestValueRendered;

  const shouldShowTextLoader = isFirstRendering && isBusy;
  const shouldShowPreviousDocument = !isFirstRendering && isBusy;

  return (
    <Wrapper>
      <Message active={shouldShowTextLoader}>Rendering PDF...</Message>

      <Message active={!render.loading && !value}>
        <Typography variant="h6">Please start typing using the text editor</Typography>
        <img id="icon" src="type-away.png" width="100px" height="100px" alt="Icono" />
      </Message>
      <Toolbar>
        <Typography sx={{ textAlign: 'left', color: '#fff' }} variant="h5">
          Document Preview
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            href={render.value}
            target="_blank"
            color="success"
            variant="contained"
            endIcon={<CloudDownloadIcon />}
          >
            Download
          </Button>
        </Stack>
      </Toolbar>
      <DocumentWrapper>
        {shouldShowPreviousDocument && previousRenderValue ? (
          <Document
            key={uuidv4()}
            className="previous-document"
            file={previousRenderValue}
            loading={<LoadingSpinner message="Loading document preview .." />}
          >
            <Page key={CURRENT_PAGE} pageNumber={CURRENT_PAGE} />
          </Document>
        ) : null}
        <Document
          key={uuidv4()}
          className={shouldShowPreviousDocument ? 'rendering-document' : null}
          file={render.value}
          loading={<LoadingSpinner message="Loading document preview .." />}
          onLoadSuccess={onDocumentLoad}
        >
          <Page
            key={uuidv4()}
            pageNumber={CURRENT_PAGE}
            onRenderSuccess={() => setPreviousRenderValue(render.value)}
          />
        </Document>
      </DocumentWrapper>
    </Wrapper>
  );
};

export default PDFViewer;
