import React from 'react'
import { Document, Page, PDFViewer } from '@react-pdf/renderer'
import { Style } from '@react-pdf/types'
import UnstyledBlockBuilder from './builders/unstyled-builder'
import HeaderBlockBuilder from './builders/headers-builder'
import UnorderedListBuilder from './builders/unordered-list-builder'
import OrderedListBuilder from './builders/ordered-list-builder'
import * as contracts from './contracts'
import * as exceptions from './exceptions'
import Logger from './logger'

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
  public componentBuilder: contracts.IBuilder | undefined
  private contentBlocks: Array<React.ReactElement>
  private editorBlocks: Array<contracts.RawJSON>
  private headerBuilder: contracts.IHeaderBuilder
  private unstyledBuilder: contracts.IUnstyledBuilder
  private unorderedListBuilder: contracts.IUnorderedListBuilder
  private orderedListBuilder: contracts.IOrderedListBuilder

  constructor(editorBlocks: Array<contracts.RawJSON>) {
    this.headerBuilder = new HeaderBlockBuilder()
    this.unstyledBuilder = new UnstyledBlockBuilder()
    this.unorderedListBuilder = new UnorderedListBuilder()
    this.orderedListBuilder = new OrderedListBuilder()
    this.editorBlocks = editorBlocks || []
    this.contentBlocks = []
  }

  public setBuilder(builder: contracts.IBuilder): void {
    this.componentBuilder = builder
  }

  public PDFPreview(
    styles: contracts.PageStyles,
    previewStyles: Style
  ): React.ReactElement | undefined {
    return (
      <PDFViewer style={previewStyles}>
        {this.buildPDFContent(styles)}
      </PDFViewer>
    )
  }

  public buildPDFContent(
    styles: contracts.PageStyles
  ): React.ReactElement | undefined {
    try {
      this.buildPDFBlocks()
      const { pageSize, fontSize, lineHeight, margin } = styles
      const pdfStyles = {
        fontSize,
        lineHeight,
        ...margin,
      }

      return (
        <Document>
          <Page size={pageSize as any} style={pdfStyles}>
            {this.contentBlocks.map((block) => block)}
          </Page>
        </Document>
      )
    } catch (error) {
      // TODO: find a better way to handle errors,
      // maybe by using a chain of responsibility pattern for all exceptions
      if (error instanceof exceptions.BlockException) {
        Logger.error(`${error.name}: ${error.message}`)
      }
      if (error instanceof exceptions.BuilderException) {
        Logger.error(`${error.name}: ${error.message}`)
      }
    } finally {
      this.contentBlocks = []
    }
  }

  public buildPDFBlocks() {
    for (const rawJson of this.editorBlocks) {
      if (rawJson.type === 'unstyled') {
        this.setBuilder(this.unstyledBuilder)
      }
      if (rawJson.type.startsWith('header')) {
        this.setBuilder(this.headerBuilder)
      }
      if (rawJson.type === 'unordered-list-item') {
        this.setBuilder(this.unorderedListBuilder)
      }
      if (rawJson.type === 'ordered-list-item') {
        this.setBuilder(this.orderedListBuilder)
      }

      // TODO: find a better way to handle the index order
      if (rawJson.type !== 'ordered-list-item') {
        this.orderedListBuilder.resetIndex()
      }
      this.contentBlocks.push(
        this.componentBuilder?.getBuiltBlock(rawJson, true)!
      )
    }
  }
}

export default PDFBuilder
