import { ReactNode, ReactElement } from "react";

// #################################################
// # Types para los estilos de los bloques
// #################################################

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

export type PageStyles = {
  pageSize: string;
  fontSize: number;
  lineHeight: number;
  margin: {
    marginTop: number;
    marginLeft: number;
    marginRight: number;
    marginBottom: number;
  };
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

// #################################################
// # BLOCKS INTERFACES
// #################################################
export interface IBlock {
  reset(): void;
  getBlocks(): Array<ReactNode>;
  getComponent(rawJson: RawJSON): ReactElement | undefined;
  buildBlocks(rawJson: RawJSON): void;
}

export interface IUnstyledBlock extends IBlock {}
export interface IHeaderBlock extends IBlock {
  getHeaderTypes(): string[];
}
export interface IUnorderedListBlock extends IBlock {}
export interface IOrderedListBlock extends IBlock {
  index: number;
  resetIndex(): void;
}

// #################################################
// # BUILDERS INTERFACES
// #################################################
export interface IBuilder {
  getBlockComponent(): IBlock | undefined;
  getBuiltBlock(rawJson: RawJSON, resetBlock?: boolean): ReactElement;
}

export interface IUnstyledBuilder extends IBuilder {
  buildUnstyledBlock(rawJson: RawJSON): ReactElement;
}

export interface IHeaderBuilder extends IBuilder {
  buildHeaderBlock(rawJson: RawJSON): ReactElement;
}

export interface IUnorderedListBuilder extends IBuilder {
  buildUnorderedListBlock(rawJson: RawJSON): ReactElement;
}

export interface IOrderedListBuilder extends IBuilder {
  resetIndex(): void;
  buildOrderedListBlock(rawJson: RawJSON): ReactElement;
}
