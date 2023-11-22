import React, { ReactNode, ReactElement } from "react";
import { v4 as uuidv4 } from "uuid";
import { Text } from "@react-pdf/renderer";
import { IOrderedListBlock, RawJSON } from "../contracts";
import { composeStyledTexts } from "../utils";
// import { unoListStyles } from "./unodered-list.styles";

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
    if (type !== "ordered-list-item") {
      console.error(`List type not supported: ${type}`);
      return;
    }
    const styledTexts = composeStyledTexts(text, inlineStyleRanges);
    this.index += 1;
    for (const styledText of styledTexts) {
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
