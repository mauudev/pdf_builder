import React from 'react';
import { Document, Page, PDFViewer, View } from '@react-pdf/renderer';
import { Style } from '@react-pdf/types';
import UnstyledBlockBuilder from './builders/unstyled/unstyled-builder';
import HeaderBlockBuilder from './builders/headers/headers-builder';
import UnorderedListBuilder from './builders/unordered-list/unordered-list-builder';
import OrderedListBuilder from './builders/ordered-list/ordered-list-builder';
import TableEntityBuilder from './builders/tables/table-builder';
import * as contracts from './contracts';
import * as exceptions from './exceptions';
import Logger from './logger';

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
  public builder: contracts.IBuilder;
  private contentBlocks: Array<React.ReactElement>;
  private pdfContent: React.ReactElement | null;
  private headerBuilder: contracts.IHeaderBuilder;
  private unstyledBuilder: contracts.IUnstyledBuilder;
  private unorderedListBuilder: contracts.IUnorderedListBuilder;
  private orderedListBuilder: contracts.IOrderedListBuilder;
  private tableBuilder: contracts.ITableBuilder;

  constructor() {
    this.unstyledBuilder = new UnstyledBlockBuilder();
    this.headerBuilder = new HeaderBlockBuilder();
    this.unorderedListBuilder = new UnorderedListBuilder();
    this.orderedListBuilder = new OrderedListBuilder();
    this.tableBuilder = new TableEntityBuilder();
    this.builder = this.unstyledBuilder;
    this.pdfContent = null;
    this.contentBlocks = [];
  }

  public reset(): void {
    this.pdfContent = null;
    this.contentBlocks = [];
  }

  public getPdfContent(): React.ReactElement | null {
    return this.pdfContent;
  }

  public setBuilder(builder: contracts.IBuilder): void {
    this.builder = builder;
  }

  public buildPdfPreview(windowPrevStyles: Style): React.ReactElement | null {
    return this.pdfContent ? <PDFViewer style={windowPrevStyles}>{this.pdfContent}</PDFViewer> : null;
  }

  public buildPdfContent(editorRawContent: contracts.RawContent, pdfStyles: contracts.PageStyles): void {
    this.buildPdfBlocks(editorRawContent);
    const textStyles = {
      fontSize: pdfStyles.fontSize,
      lineHeight: pdfStyles.lineHeight,
      ...pdfStyles.margin,
    };
    this.pdfContent = (
      <Document>
        <Page size={pdfStyles.pageSize as any}>
          <View style={textStyles}>{this.contentBlocks.map((block) => block)}</View>
        </Page>
      </Document>
    );
  }

  public buildPdfBlocks(editorRawContent: contracts.RawContent): void {
    try {
      for (const rawJson of editorRawContent.blocks) {
        if (rawJson.type === 'unstyled') {
          this.setBuilder(this.unstyledBuilder);
        }
        if (rawJson.type.startsWith('header')) {
          this.setBuilder(this.headerBuilder);
        }
        if (rawJson.type === 'unordered-list-item') {
          this.setBuilder(this.unorderedListBuilder);
        }
        if (rawJson.type === 'ordered-list-item') {
          this.setBuilder(this.orderedListBuilder);
        }
        if (rawJson.type !== 'ordered-list-item') {
          this.orderedListBuilder?.resetIndex();
        }
        if (rawJson.type === 'atomic') {
          this.setBuilder(this.tableBuilder);
        }
        this.contentBlocks.push(this.builder?.buildComponent(rawJson, editorRawContent.entityMap, true)!);
      }
    } catch (error) {
      // TODO: find a better way to handle errors,
      // maybe by using a chain of responsibility pattern for all exceptions
      if (error instanceof exceptions.BlockException) {
        Logger.error(`${error.name}: ${error.message}`);
      }
      if (error instanceof exceptions.BuilderException) {
        Logger.error(`${error.name}: ${error.message}`);
      }
    }
  }
}

export default PDFBuilder;
