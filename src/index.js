import React from "react";
import ReactDOM from "react-dom/client";
import { App, PDFPage } from "./App";
import ReactPDF from "@react-pdf/renderer";
import { PDFViewer } from "@react-pdf/renderer";

const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<App />);
root.render(
  <PDFViewer style={{ height: "100vh", width: "100vw" }}>
    <PDFPage />
  </PDFViewer>
);
