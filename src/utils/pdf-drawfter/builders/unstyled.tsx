import React, { ReactNode, ReactElement } from "react";

import { Text } from "@react-pdf/renderer";
import { ComponentProps, IBlock, RawJSON } from "../contracts";
import { getDynamicStyle } from "../utils";
import { v4 as uuidv4 } from "uuid";

const Paragraph: React.FC<ComponentProps> = ({ style, children }) => (
  <Text style={style}>{children}</Text>
);

class UnstyledBlock implements IBlock {
  private blocks: Array<ReactNode>;
  private textLength: number;

  constructor(
    public rawJson: RawJSON,
    public styleMap: object
  ) {
    this.rawJson = rawJson;
    this.styleMap = styleMap;
    this.textLength = rawJson.text.length;
    this.blocks = [];
  }

  getBlocks(): Array<ReactNode> {
    return this.blocks;
  }
  getTextLength(): number {
    return this.textLength;
  }
  getComponent(): ReactElement {
    this.buildBlocks();
    const mainBlock = (
      <Text key={uuidv4()}>
        {this.getBlocks().map((block, index) => (
          <React.Fragment key={index}>{block}</React.Fragment>
        ))}
      </Text>
    );
    return mainBlock;
  }

  getStyledTexts(): object {
    type Style = {
      [key: string]: string;
    };

    type StyleMap = {
      [text: string]: Array<Style>;
    };

    const styleMap: StyleMap = {};
    const orderedStyleRanges = this.rawJson.inlineStyleRanges.sort(
      (a, b) => a.offset - b.offset
    );

    for (const range of orderedStyleRanges) {
      const text = this.rawJson.text.substring(
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
    if (
      lastStyledRange.offset + lastStyledRange.length <
      this.getTextLength()
    ) {
      const restText = this.rawJson.text.substring(
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

  public buildBlocks(): void {
    const styledTexts = this.getStyledTexts();

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
