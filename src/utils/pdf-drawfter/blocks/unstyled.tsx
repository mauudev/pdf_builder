import React, { ReactNode, ReactElement } from "react";

import { Text } from "@react-pdf/renderer";
import { IBlock, RawJSON } from "../contracts";
import { getDynamicStyle } from "../utils";
import { v4 as uuidv4 } from "uuid";

class UnstyledBlock implements IBlock {
  private blocks: Array<ReactNode>;

  constructor(public styleMap: object) {
    this.styleMap = styleMap;
    this.blocks = [];
  }
  public reset(): void {
    this.blocks = [];
  }

  getBlocks(): Array<ReactNode> {
    return this.blocks;
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

  getStyledTexts(rawJson: RawJSON): object {
    type Style = {
      [key: string]: string;
    };

    type StyleMap = {
      [text: string]: Array<Style>;
    };

    const styleMap: StyleMap = {};
    const orderedStyleRanges = rawJson.inlineStyleRanges.sort(
      (a, b) => a.offset - b.offset
    );

    for (const range of orderedStyleRanges) {
      const text = rawJson.text.substring(
        range.offset,
        range.offset + range.length
      );
      const style = range.style;

      if (!styleMap[text]) {
        styleMap[text] = [{ style }];
      } else {
        styleMap[text].push({ style });
      }
    }

    const lastStyledRange = orderedStyleRanges[orderedStyleRanges.length - 1];
    const textLength = rawJson.text.length;
    if (lastStyledRange.offset + lastStyledRange.length < textLength) {
      const restText = rawJson.text.substring(
        lastStyledRange.offset + lastStyledRange.length
      );
      if (!styleMap[restText]) {
        styleMap[restText] = [
          { style: "color-rgb(0,0,0)" },
          { style: "fontsize-12" },
        ];
      }
    }

    return styleMap;
  }

  public buildBlocks(rawJson: RawJSON): void {
    const styledTexts = this.getStyledTexts(rawJson);

    for (const [text, styles] of Object.entries(styledTexts)) {
      const style = getDynamicStyle(this.styleMap, styles);

      const block = (
        <Text key={uuidv4()} style={style}>
          {text}
        </Text>
      );
      this.blocks.push(block);
    }
  }
}

export default UnstyledBlock;
