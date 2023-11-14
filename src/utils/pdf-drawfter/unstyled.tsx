import React, { ReactNode, ReactElement } from "react";
import { View, Text } from "@react-pdf/renderer";
import {
  IUnstyledBlockBuilder,
  ComponentProps,
  IBlock,
  RawJSON,
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
    this.blocks = [];
  }

  getBlocks(): Array<ReactNode> {
    return this.blocks;
  }
  getTextLength(): number {
    return this.textLength;
  }
  getComponent(): React.FC<ComponentProps> {
    const Component = this.component;
    const mainBlock: React.FC<ComponentProps> = (props) => (
      <Component key={this.rawJson.key} {...props}>
        {this.getBlocks().map((block, index) => (
          <React.Fragment key={index}>{block}</React.Fragment>
        ))}
      </Component>
    );
    return mainBlock;
  }

  getProps(): ComponentProps {
    return this.props;
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

    return styleMap;
  }

  public buildBlocks(): void {
    let data = {
      intermediat: [{ style: "color-rgb(0,0,0)" }, { style: "ITALIC" }],
      "e styled t": [{ style: "BOLD" }, { style: "color-rgb(226,80,65)" }],
      ext: [{ style: "color-rgb(0,0,0)" }],
    };
    const styledTexts = this.getStyledTexts();

    for (const [text, styles] of Object.entries(styledTexts)) {
      const Component = this.component;
      const style = getDynamicStyle(this.styleMap, styles);

      const block = (
        <Component key={uuidv4()} style={style}>
          {text}
        </Component>
      );
      this.blocks.push(block);
    }
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
