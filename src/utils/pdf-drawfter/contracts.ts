import { ReactNode, ReactElement } from "react";
import { Style } from "@react-pdf/types";
/**
 * Types para los estilos de los bloques
 */

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

export type InlineStyleRange = {
  offset: number;
  length: number;
  style: string;
};

export type InlineStyle = {
  [key: string]: string;
};

export type TextStyles = {
  [text: string]: InlineStyle[];
};

/**
 * Interfaces para los bloques y builders
 */
export interface IBlock {
  reset(): void;
  getBlocks(): Array<ReactNode>;
  getComponent(rawJson: RawJSON): ReactElement | undefined;
  buildBlocks(rawJson: RawJSON): void;
}

export interface IBuilder {
  getBlockComponent(): IBlock | undefined;
  getBuiltBlock(rawJson: RawJSON): ReactElement | undefined;
}
