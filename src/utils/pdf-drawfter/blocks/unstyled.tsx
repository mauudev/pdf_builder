import React, { ReactNode, ReactElement } from "react";

import { Text } from "@react-pdf/renderer";
import { IBlock, RawJSON, TextStyles } from "../contracts";
import { composeInlineStyles, getDynamicStyle } from "../utils";
import { v4 as uuidv4 } from "uuid";

class UnstyledBlock implements IBlock {
  private unstyledBlocks: Array<ReactNode>;

  constructor(public styleMap: object) {
    this.styleMap = styleMap;
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
    const styledTexts = composeInlineStyles(rawJson);

    for (const [text, styles] of Object.entries(styledTexts)) {
      const style = getDynamicStyle(this.styleMap, styles);

      const block = (
        <Text key={uuidv4()} style={style}>
          {text}
        </Text>
      );
      this.unstyledBlocks.push(block);
    }
  }
}

export default UnstyledBlock;
