import React, { ReactNode, ReactElement } from "react";
import { View, Text } from "@react-pdf/renderer";
import {
  IUnstyledBlockBuilder,
  ComponentProps,
  IBlock,
  RawJSON,
  StyledText,
} from "./contracts";
import { getDynamicStyle } from "./utils";
import { v4 as uuidv4 } from "uuid";

const Paragraph: React.FC<ComponentProps> = ({ style, children }) => (
  <Text style={style}>{children}</Text>
);

class UnstyledBlock implements IBlock {
  private component: React.FC<ComponentProps>;
  private props: ComponentProps;
  private blocks: Array<ReactNode>;
  private textLength: number;

  constructor(
    public rawJson: RawJSON,
    public styleMap: object
  ) {
    this.component = Paragraph;
    this.rawJson = rawJson;
    this.styleMap = styleMap;
    this.textLength = rawJson.text.length;
    this.props = {};
  }

  getBlocks(): Array<ReactNode> {
    return this.blocks;
  }
  getTextLength(): number {
    return this.textLength;
  }
  getComponent(): React.FC<ComponentProps> {
    return this.component;
  }

  getProps(): ComponentProps {
    return this.props;
  }

  getStyledTexts(): Array<StyledText> {
    const orderedStyleRanges = this.rawJson.inlineStyleRanges.sort(
      (a, b) => a.offset - b.offset
    );
    const orderedStyledTexts = new Set<StyledText>();
    orderedStyleRanges.forEach((range) => {
      orderedStyledTexts.add({
        text: this.rawJson.text.substring(
          range.offset,
          range.offset + range.length
        ),
        style: range.style,
      });
    });
    return Array.from(orderedStyledTexts);
  }

  private pushUnstyledBlock(): void {
    const Component = this.component;
    const newBlock = <Component key={uuidv4()} {...this.props} />;
    this.blocks.push(newBlock);
  }

  public buildBlocks(inlineStyles: Array<object>): Array<ReactNode> {
    const styledTexts = this.getStyledTexts();
    styledTexts.forEach((styledText) => {
      const { style } = styledText;
      const styleToApply = getDynamicStyle(this.styleMap, style);
    });
    const blocks: Array<ReactNode> = inlineStyles.map((style) => {
      const Component = this.component;
      <Component key={uuidv4()} {...this.props} />;
    });

    return blocks;
  }
}

export default UnstyledBlock;

// class UnstyledBlockBuilder implements IUnstyledBlockBuilder {
//   private component: React.FC<ComponentProps>;
//   private props: ComponentProps;
//   private children: ReactNode;
//   private rawJson: object;
//   private textLength: number;

//   constructor(props: ComponentProps, children: ReactNode) {
//     this.props = props;
//     this.children = children;
//     this.component = Paragraph;
//   }

//   buildUnstyledBlock(): ReactNode {
//     const Component = this.component;
//     return <Component {...this.props}>{this.children}</Component>;
//   }
// }

// export default UnstyledBlockBuilder;
