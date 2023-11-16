import React, { ReactNode, ReactElement } from "react";
import { Style } from "@react-pdf/types";

export type StyleMap = {
  italic?: {
    fontSize: number;
    fontWeight: number;
    fontStyle: "italic";
  };
  bold?: {
    fontSize: number;
    fontWeight: number;
  };
  "color-rgb"?: (color: string) => {
    color: string;
  };
  fontsize?: (fontSize: number) => {
    fontSize: number;
  };
  "text-align"?: (textAlign: string) => {
    textAlign: string;
  };
};

export type Blocks = {
  blocks: Array<RawJSON>;
  entityMap: object;
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
  styleMap: object;
  reset(): void;
  getStyledTexts(rawJson: RawJSON): object;
  getBlocks(): Array<ReactNode>;
  getComponent(rawJson: RawJSON): ReactElement;
  buildBlocks(rawJson: RawJSON): void;
}

export interface IBuilder {
  styleMap: StyleMap;
  getBlockComponent(): IBlock | undefined;
  getBuiltBlock(rawJson: RawJSON): ReactElement | undefined;
}

export interface IUnstyledBuilder extends IBuilder {
  buildUnstyledBlock(rawJson: RawJSON): ReactElement | undefined;
}
