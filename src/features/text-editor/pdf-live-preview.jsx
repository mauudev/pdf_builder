import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
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

  useEffect(() => {
    onDocumentUrlChange(render.value);
  }, [render.value]);

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

      <Message active={!render.loading && !value}>Please start typing whatever you want</Message>

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
