import React, { ReactNode, ReactElement } from "react";
import { v4 as uuidv4 } from "uuid";
import { Text } from "@react-pdf/renderer";
import { IOrderedListBlock, RawJSON } from "../contracts";
import { composeStyledTexts } from "../utils";
import { OrderedListBlockException } from "../exceptions";
import Logger from "../logger";

/**
 * Clase Block para los componentes de tipo 'unordered-list-item'.
 * Recibe un objeto de estilos y genera los componentes Text,
 */
class OrderedListBlock implements IOrderedListBlock {
  private listBlocks: Array<ReactNode>;
  public index: number;

  constructor() {
    this.listBlocks = [];
    this.index = 0;
  }

  resetIndex(): void {
    this.index = 0;
  }
  reset(): void {
    this.listBlocks = [];
  }

  getBlocks(): Array<ReactNode> {
    return this.listBlocks;
  }

  getComponent(rawJson: RawJSON): ReactElement {
    this.buildBlocks(rawJson);
    const mainBlock = (
      <Text key={uuidv4()}>
        {this.getBlocks().map((block, index) => (
          <React.Fragment key={index}>{block}</React.Fragment>
        ))}
      </Text>
    );
    return mainBlock;
  }

  buildBlocks(rawJson: RawJSON): void {
    const { type, text, inlineStyleRanges } = rawJson;

    if (!type || !text || !Array.isArray(inlineStyleRanges)) {
      throw new OrderedListBlockException("Invalid rawJson format");
    }
    if (type !== "ordered-list-item") {
      throw new OrderedListBlockException(`Invalid type: ${type}`);
    }
    const styledTexts = composeStyledTexts(text, inlineStyleRanges);
    Logger.log(
      `Building '${type}' blocks with styled texts: ${JSON.stringify(
        styledTexts
      )}`
    );

    this.index += 1;
    for (const styledText of styledTexts) {
      if (!styledText || !styledText.text || !styledText.styles) {
        throw new OrderedListBlockException("Invalid styledText format");
      }
      const block = (
        <Text key={uuidv4()} style={styledText.styles}>
          {this.index}. &nbsp;<Text>{styledText.text}</Text>
        </Text>
      );
      this.listBlocks.push(block);
    }
  }
}

export default OrderedListBlock;
