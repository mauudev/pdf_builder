import React from "react";
import { Document, Page, PDFViewer } from "@react-pdf/renderer";
import { Style } from "@react-pdf/types";
import { IBuilder, RawJSON, PageStyles } from "./contracts";
import UnstyledBlockBuilder from "./builders/unstyled-builder";
import HeaderBlockBuilder from "./builders/headers-builder";
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
  private contentBlocks: Array<React.ReactElement>;
  private editorBlocks: Array<RawJSON>;
  private headerBuilder: IBuilder;
  private unstyledBuilder: IBuilder;

  constructor(editorBlocks: Array<RawJSON>) {
    this.editorBlocks = editorBlocks || [];
    this.contentBlocks = [];
    this.headerBuilder = new HeaderBlockBuilder();
    this.unstyledBuilder = new UnstyledBlockBuilder();
  }

  public setBuilder(builder: IBuilder): void {
    this.componentBuilder = builder;
  }

  public PDFPreview(
    styles: PageStyles,
    previewStyles: Style
  ): React.ReactElement | undefined {
    return (
      <PDFViewer style={previewStyles}>
        {this.buildPDFContent(styles)}
      </PDFViewer>
    );
  }

  public buildPDFContent(styles: PageStyles): React.ReactElement | undefined {
    this.buildPDFBlocks();
    const { pageSize, fontSize, lineHeight, margin } = styles;
    const pdfStyles = {
      fontSize,
      lineHeight,
      ...margin,
    };

    return (
      <Document>
        <Page size={pageSize as any} style={pdfStyles}>
          {this.contentBlocks.map((block) => block)}
        </Page>
      </Document>
    );
  }

  public buildPDFBlocks() {
    for (const rawJson of this.editorBlocks) {
      if (rawJson.type === "unstyled") {
        this.setBuilder(this.unstyledBuilder);
      }
      if (rawJson.type.startsWith("header")) {
        this.setBuilder(this.headerBuilder);
      }
      // console.error(
      //   `type ${rawJson.type} not supported, setting unstyled block by default.`
      // );
      this.contentBlocks.push(this.componentBuilder?.getBuiltBlock(rawJson)!);
    }
  }
}

export default PDFBuilder;
