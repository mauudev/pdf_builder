import React, { useState, useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import { pdfjs, Document as PDFDocument, Page as PDFPage } from "react-pdf";
import { LoadingSpinner } from "../ui";
import Document from "./document";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const PDF = ({ report }) => {
  const [loading, setLoading] = useState(true);
  const [documentURL, setDocumentURL] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState();

  useEffect(() => {
    const generateBlob = async () => {
      setLoading(true);
      const blob = await pdf(<Document report={report} />).toBlob();
      setLoading(false);
      setDocumentURL(window.URL.createObjectURL(blob));
    };

    if (report) {
      generateBlob();
    } else {
      setLoading(false);
      setDocumentURL(null);
    }
  }, [report]);

  const prevPage = () => {
    if (!loading) {
      setCurrentPage(Math.max(1, currentPage - 1));
    }
  };

  const nextPage = () => {
    if (!loading) {
      setCurrentPage(Math.min(numPages, currentPage + 1));
    }
  };

  if (loading) {
    return <LoadingSpinner message="Fetching Images" />;
  }

  const filename = `${report.title || "document"}.pdf`;

  return (
    <React.Fragment>
      {loading && <div>Rendering PDF…</div>}
      <div className="pdf-modal-options">
        <div className="pdf-modal-pagination">
          <button type="button" onClick={prevPage}>
            <i className="mdi mdi-chevron-left" />
          </button>
          <span>
            Page {currentPage} / {numPages}
          </span>
          <button type="button" onClick={nextPage}>
            <i className="mdi mdi-chevron-right" />
          </button>
        </div>
        <a
          href={documentURL}
          className="ccb-blue-small"
          style={{ margin: "auto 0 0" }}
          download={filename}
        >
          Download PDF
        </a>
      </div>
      <PDFDocument
        file={documentURL}
        onLoadSuccess={(result) => setNumPages(result.numPages)}
        loading={<LoadingSpinner message="Loading document .." />}
      >
        <PDFPage renderMode="svg" pageNumber={currentPage} />
      </PDFDocument>
    </React.Fragment>
  );
};

export default PDF;
