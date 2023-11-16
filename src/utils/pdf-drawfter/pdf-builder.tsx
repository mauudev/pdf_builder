import React from "react";
import { Document, Page, View } from "@react-pdf/renderer";
import { IBuilder, RawJSON } from "./contracts";
import UnstyledBlockBuilder from "./builders/unstyled-builder";

/**
 * Patron Builder para crear dinamicamente componentes del documento PDF.
 * Este actua como la fachada o saga principal de los builders, itera
 * sobre el array de bloques generado por el wysiwyg editor y construye
 * los componentes PDF correspondientes.
 * Tambien se ocupa de aplicar los estilos del documento principal,
 * como el tamanio de hoja, la fuente, margenes, interlineado, etc.
 * No se encarga de los estilos inline de los texts eso es responsabilidad de
 * cada block.
 */
class PDFBuilder {
  public componentBuilder: IBuilder | undefined;
  public styleMap: object;
  private contentBlocks: Array<React.ReactElement>;
  private editorBlocks: Array<RawJSON>;

  constructor(editorBlocks: Array<RawJSON>, styleMap: object) {
    this.styleMap = styleMap;
    this.editorBlocks = editorBlocks;
    this.contentBlocks = [];
  }

  public setBuilder(builder: IBuilder): void {
    this.componentBuilder = builder;
  }

  public buildPDFContent(): React.ReactElement | undefined {
    this.buildPDFBlocks();
    return (
      <Document>
        <Page
          style={{
            paddingTop: 35,
            paddingBottom: 65,
            paddingHorizontal: 35,
          }}
        >
          {this.contentBlocks.map((block) => block)}
        </Page>
      </Document>
    );
  }

  public buildPDFBlocks() {
    for (const rawJson of this.editorBlocks) {
      switch (rawJson.type) {
        case "unstyled":
          this.setBuilder(new UnstyledBlockBuilder(this.styleMap));
          break;
        default:
          console.error(
            `type ${rawJson.type} not supported, setting unstyled block by default.`
          );
        // this.setBuilder(new UnstyledBlockBuilder(this.styleMap));
      }
      this.contentBlocks.push(this.componentBuilder?.getBuiltBlock(rawJson)!);
    }
  }
}

export default PDFBuilder;
