import React from "react";
import WYSIWYGEditor from "./features/pdf-builder/text-editor/editor";
import "./App.css";
import UnstyledBlock from "./utils/pdf-drawfter/builders/unstyled";
import { styleMap } from "./utils/pdf-drawfter/style";
import { Document, Page, View } from "@react-pdf/renderer";

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

const builder = new UnstyledBlock(rawJson1, styleMap);
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
        <div className="editor-container">{<WYSIWYGEditor />}</div>
      </div>
    </div>
  );
}

export { App, PDFPage };
