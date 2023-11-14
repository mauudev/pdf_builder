import React from "react";
import WYSIWYGEditor from "./features/pdf-builder/text-editor/editor";
import "./App.css";
import UnstyledBlock from "./utils/pdf-drawfter/unstyled";
import { styleMap } from "./utils/pdf-drawfter/style";
import { Document, Page, View } from "@react-pdf/renderer";

const rawJson = {
  key: "ehoft",
  text: "intermediate styled text",
  type: "unstyled",
  depth: 0,
  inlineStyleRanges: [
    {
      offset: 0,
      length: 11,
      style: "color-rgb(0,0,0)",
    },
    {
      offset: 21,
      length: 3,
      style: "color-rgb(0,0,0)",
    },
    {
      offset: 11,
      length: 10,
      style: "BOLD",
    },
    {
      offset: 11,
      length: 10,
      style: "color-rgb(226,80,65)",
    },
    {
      offset: 11,
      length: 10,
      style: "fontsize-12",
    },
    {
      offset: 0,
      length: 11,
      style: "ITALIC",
    },
  ],
  entityRanges: [],
  data: {},
};

const builder = new UnstyledBlock(rawJson, styleMap);
builder.buildBlocks();

const PDFPage = () => {
  return (
    <Document>
      <Page
        style={{
          paddingTop: 35,
          paddingBottom: 65,
          paddingHorizontal: 35,
        }}
      >
        <View>{builder.getComponent()()}</View>
      </Page>
    </Document>
  );
};

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <img className="logo" src="cat.jpeg" alt="Logo" />
          <span>Rich Text Editor</span>
        </div>
      </header>
      <div className="app-container">
        <div className="sidebar"></div>
        <div className="editor-container">{/* <WYSIWYGEditor /> */}</div>
      </div>
    </div>
  );
}

export { App, PDFPage };
