import React, { ReactNode, ReactElement } from "react";
import { v4 as uuidv4 } from "uuid";
import { Text } from "@react-pdf/renderer";
import { IBlock, RawJSON } from "../contracts";
import { composeStyledTexts } from "../utils";
// import { unoListStyles } from "./unodered-list.styles";

/**
 * Clase Block para los componentes de tipo 'unordered-list-item'.
 * Recibe un objeto de estilos y genera los componentes Text,
 */
class UnorderedListBlock implements IBlock {
  private listBlocks: Array<ReactNode>;

  constructor() {
    this.listBlocks = [];
  }
  public reset(): void {
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

  public buildBlocks(rawJson: RawJSON): void {
    const { text, inlineStyleRanges } = rawJson;
    const styledTexts = composeStyledTexts(text, inlineStyleRanges);

    for (const styledText of styledTexts) {
      const block = (
        <Text key={uuidv4()} style={styledText.styles}>
          • &nbsp;<Text>{styledText.text}</Text>
        </Text>
      );
      this.listBlocks.push(block);
    }
  }
}

export default UnorderedListBlock;
