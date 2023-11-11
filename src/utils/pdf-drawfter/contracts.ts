import React, { ReactNode, ReactElement } from "react";
import { Style } from "@react-pdf/types";

export type StyledText = {
  text: string;
  style: string;
};

export type RawJSON = {
  key: string;
  text: string;
  type: string;
  depth: number;
  inlineStyleRanges: Array<{
    offset: number;
    length: number;
    style: string;
  }>;
  entityRanges: Array<object>;
  data: object;
};

export type ComponentProps = {
  style?: Style | Style[];
  children?: ReactNode;
};

export interface IBlock {
  rawJson?: RawJSON;
  styleMap?: object;
  getStyledTexts(): Array<object>;
  getBlocks(): Array<ReactNode>;
  getTextLength(): number;
  getComponent(): React.ComponentType<ComponentProps>;
  getProps(): ComponentProps;
  buildBlocks(inlineStyles: Array<object>): Array<ReactNode>;
}

export interface IBuilder<ComponentProps> {
  component: React.ComponentType<ComponentProps>;
  props: ComponentProps;
  children?: ReactNode | ReactElement;
  rawJson?: object;
  textLength?: number;
  blocks?: Array<React.ComponentType<ComponentProps>>;
  buildBlocks(
    inlineStyles: Array<object>
  ): Array<React.ComponentType<ComponentProps>>;
}

export interface IUnstyledBlockBuilder extends IBuilder<ComponentProps> {
  buildUnstyledBlock(
    style: Style,
    children: ReactNode
  ): React.ComponentType<ComponentProps>;
}
