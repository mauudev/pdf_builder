import React, { ReactNode, ReactElement } from "react";

import { Text } from "@react-pdf/renderer";
import { IBlock, RawJSON } from "../contracts";
import { composeStyledTexts } from "../utils";
import { v4 as uuidv4 } from "uuid";

/**
 * Clase Block para los componentes de tipo Unstyled.
 * Recibe un objeto de estilos y genera un componente Text,
 */
class UnstyledBlock implements IBlock {
  private unstyledBlocks: Array<ReactNode>;

  constructor() {
    this.unstyledBlocks = [];
  }
  public reset(): void {
    this.unstyledBlocks = [];
  }

  getBlocks(): Array<ReactNode> {
    return this.unstyledBlocks;
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
          {styledText.text}
        </Text>
      );
      this.unstyledBlocks.push(block);
    }
  }
}

export default UnstyledBlock;
