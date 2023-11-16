import React from "react";
import WYSIWYGEditor from "./features/pdf-builder/text-editor/editor";
import { styleMap } from "./utils/pdf-drawfter/style";
import { Document, Page, View } from "@react-pdf/renderer";
import PDFBuilder from "./utils/pdf-drawfter/pdf-builder";

import "./App.css";

const rawJson1 = {
  key: "ehoft",
  text: "En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor. Una olla de algo más vaca que carnero, salpicón las más noches, duelos y quebrantos los sábados, lentejas los viernes, algún palomino de añadidura los domingos, consumían las tres partes de su hacienda. El resto della concluían sayo de velarte, calzas de velludo para las fiestas con sus pantuflos de lo mismo, los días de entre semana se honraba con su vellori de lo más fino. Tenía en su casa una ama que pasaba de los cuarenta, y una sobrina que no llegaba a los veinte, y un mozo de campo y plaza, que así ensillaba el rocín como tomaba la podadera. Frisaba la edad de nuestro hidalgo con los cincuenta años, era de complexión recia, seco de carnes, enjuto de rostro; gran madrugador y amigo de la caza. Quieren decir que tenía el sobrenombre de Quijada o Quesada (que en esto hay alguna diferencia en los autores que deste caso escriben), aunque por conjeturas verosímiles se deja entender que se llama Quijana; pero esto importa poco a nuestro cuento; basta que en la narración dél no se salga un punto de la verdad.",
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
      style: "color-rgb(55, 130, 121)",
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
      style: "fontsize-16",
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

const rawJson2 = {
  key: "1d0mv",
  text: "aasdasdqweqweqweqweqweqweqweqweqweqw",
  type: "unstyled",
  depth: 0,
  inlineStyleRanges: [
    { offset: 0, length: 2, style: "color-rgb(226,80,65)" },
    { offset: 8, length: 6, style: "BOLD" },
  ],
  entityRanges: [],
  data: {},
};

const editorBlocks = {
  blocks: [
    {
      key: "31tf7",
      text: "HEADER1",
      type: "header-one",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "5ji5f",
      text: "HEADER1 CENTERED",
      type: "header-one",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {
        "text-align": "center",
      },
    },
    {
      key: "omi8",
      text: "HEADER 2",
      type: "header-two",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "5i8b7",
      text: "HEADER 3",
      type: "header-three",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "1b7lm",
      text: "underlined text",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 0,
          length: 15,
          style: "UNDERLINE",
        },
      ],
      entityRanges: [],
      data: {},
    },
    {
      key: "e8343",
      text: "simple text",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "2v79",
      text: "bold text",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 0,
          length: 9,
          style: "BOLD",
        },
      ],
      entityRanges: [],
      data: {},
    },
    {
      key: "dm1nn",
      text: "italic text",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 0,
          length: 11,
          style: "ITALIC",
        },
      ],
      entityRanges: [],
      data: {},
    },
    {
      key: "5i1cr",
      text: "bold italic text",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 0,
          length: 16,
          style: "ITALIC",
        },
        {
          offset: 0,
          length: 16,
          style: "BOLD",
        },
      ],
      entityRanges: [],
      data: {},
    },
    {
      key: "e86qs",
      text: "colored text",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 0,
          length: 12,
          style: "color-rgb(97,189,109)",
        },
      ],
      entityRanges: [],
      data: {},
    },
    {
      key: "mprv",
      text: "centered text",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 0,
          length: 13,
          style: "color-rgb(0,0,0)",
        },
      ],
      entityRanges: [],
      data: {
        "text-align": "center",
      },
    },
    {
      key: "cv38n",
      text: "right aligned text",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 0,
          length: 18,
          style: "color-rgb(0,0,0)",
        },
      ],
      entityRanges: [],
      data: {
        "text-align": "right",
      },
    },
    {
      key: "dqk2v",
      text: "size font text ",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 0,
          length: 15,
          style: "color-rgb(0,0,0)",
        },
        {
          offset: 0,
          length: 14,
          style: "fontsize-24",
        },
      ],
      entityRanges: [],
      data: {
        "text-align": "left",
      },
    },
    {
      key: "4j8s8",
      text: "unordered item1",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 0,
          length: 15,
          style: "color-rgb(0,0,0)",
        },
      ],
      entityRanges: [],
      data: {},
    },
    {
      key: "7ih1g",
      text: "unordered item2",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 0,
          length: 15,
          style: "color-rgb(0,0,0)",
        },
      ],
      entityRanges: [],
      data: {},
    },
    {
      key: "ivpm",
      text: "unordered item3",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 0,
          length: 15,
          style: "color-rgb(0,0,0)",
        },
      ],
      entityRanges: [],
      data: {},
    },
    {
      key: "45nid",
      text: "",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "696b5",
      text: "ordered item1",
      type: "ordered-list-item",
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 0,
          length: 13,
          style: "color-rgb(0,0,0)",
        },
      ],
      entityRanges: [],
      data: {},
    },
    {
      key: "4pkv3",
      text: "ordered item2",
      type: "ordered-list-item",
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 0,
          length: 13,
          style: "color-rgb(0,0,0)",
        },
      ],
      entityRanges: [],
      data: {},
    },
    {
      key: "4ifkf",
      text: "ordered  item3",
      type: "ordered-list-item",
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 0,
          length: 14,
          style: "color-rgb(0,0,0)",
        },
      ],
      entityRanges: [],
      data: {},
    },
    {
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
          offset: 0,
          length: 11,
          style: "ITALIC",
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
      ],
      entityRanges: [],
      data: {},
    },
    {
      key: "u17a",
      text: "right bold text ",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 0,
          length: 16,
          style: "color-rgb(0,0,0)",
        },
        {
          offset: 0,
          length: 15,
          style: "BOLD",
        },
      ],
      entityRanges: [],
      data: {
        "text-align": "right",
      },
    },
    {
      key: "cbvk5",
      text: "dynamic styled text right",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 0,
          length: 8,
          style: "color-rgb(0,0,0)",
        },
        {
          offset: 14,
          length: 11,
          style: "color-rgb(0,0,0)",
        },
        {
          offset: 0,
          length: 25,
          style: "BOLD",
        },
        {
          offset: 0,
          length: 16,
          style: "ITALIC",
        },
        {
          offset: 18,
          length: 7,
          style: "ITALIC",
        },
        {
          offset: 0,
          length: 25,
          style: "fontsize-18",
        },
        {
          offset: 8,
          length: 6,
          style: "color-rgb(247,218,100)",
        },
      ],
      entityRanges: [],
      data: {
        "text-align": "right",
      },
    },
    {
      key: "9371p",
      text: "",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
  ],
  entityMap: {},
};

const editorBlocks2 = {
  blocks: [
    {
      key: "1d0mv",
      text: "aasdasdqweqweqweqweqweqweqweqweqweqw",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
  ],
};

const pdfBuilder = new PDFBuilder(editorBlocks.blocks, styleMap);

const PDFPage = () => {
  return pdfBuilder.buildPDFContent();
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
        <div className="editor-container">{<WYSIWYGEditor />}</div>
      </div>
    </div>
  );
}

export { App, PDFPage };
