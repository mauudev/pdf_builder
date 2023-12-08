import { ReactNode, ReactElement } from 'react';
import { Style } from '@react-pdf/types';
import { BlockValidator } from './validators';

// #################################################
// # Types para los estilos
// #################################################
export type PageStyles = {
  pageSize: string | number;
  fontSize: string | number;
  lineHeight: string | number;
  margin: {
    marginTop: string | number;
    marginLeft: string | number;
    marginRight: string | number;
    marginBottom: string | number;
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
// # Types para los bloques
// #################################################
type EntityRanges = {
  offset: number;
  length: number;
  key: number;
};

type EntityStyles = {
  [key: string]: Style;
};

type TableEntity = {
  rows: number;
  columns: number;
  tableCells: string[][];
  styles: EntityStyles;
  innerHTML: string;
};

export type RawJSON = {
  key: string;
  text: string;
  type: string;
  depth: number;
  inlineStyleRanges: Array<InlineStyleRange>;
  entityRanges: Array<EntityRanges>;
  data: object;
};

export type EntityMapItem = {
  type: string;
  mutability: string;
  data: TableEntity; // | LinkEntity | ImageEntity | MentionEntity
};

export type EntityMap = Record<string, EntityMapItem>;
export type RawContent = {
  blocks: Array<RawJSON>;
  entityMap: EntityMap;
};

export interface IValidatable {
  validate(rawJson: RawJSON, entityMap?: EntityMap): void;
}

interface IRenderable {
  reset(): void;
  getComponent(data: RawJSON | EntityMapItem): ReactElement | undefined;
}

// #################################################
// # Blocks
// #################################################

export interface IBlock extends IRenderable {
  getBlocks(): Array<ReactNode>;
  buildBlocks(rawJson: RawJSON): void;
}

export interface IUnstyledBlock extends IBlock {}

export interface IHeaderBlock extends IBlock {}

export interface IUnorderedListBlock extends IBlock {}

export interface IOrderedListBlock extends IBlock {
  index: number;
  resetIndex(): void;
}

// #################################################
// # Entities
// #################################################
export interface IEntity extends IRenderable {
  getEntity(): Array<ReactNode>;
  buildEntity(entity: EntityMapItem): void;
}

export interface ITableEntity extends IEntity {}

// #################################################
// # Builders
// #################################################
export interface IBuilder extends IValidatable {
  getWorker(): IBlock | IEntity;
  buildComponent(rawJson: RawJSON, resetBlock?: boolean): ReactElement | undefined;
  buildComponent(rawJson: RawJSON, entityMap: EntityMap, resetBlock?: boolean): ReactElement | undefined;
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

export interface ITableBuilder extends IBuilder {
  buildTableEntity(rawJson: RawJSON, entityMap: EntityMap): ReactElement;
}
