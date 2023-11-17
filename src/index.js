import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PDFViewer } from "@react-pdf/renderer";
import PDFBuilder from "./utils/pdf-drawfter/pdf-builder";
import { editorBlocks } from "./utils/pdf-drawfter/samples/rawJson";
import { styleMap } from "./utils/pdf-drawfter/global-styles";

const builder = new PDFBuilder(editorBlocks.blocks, styleMap);

const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<App />);
root.render(
  <PDFViewer style={{ height: "100vh", width: "100vw" }}>
    {builder.buildPDFContent()}
  </PDFViewer>
);
